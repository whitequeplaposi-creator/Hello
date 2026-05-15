import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/db';

/**
 * Synkroniserar orders.status till order_tracking-tabellen
 * 
 * VIKTIGT: orders-tabellen använder dessa statusvärden:
 * - confirmed, packing, transport, delivered
 * 
 * STRIKT STEG-FÖR-STEG LOGIK:
 * Varje status sätter endast sitt eget steg och alla tidigare steg.
 * Framtida steg måste vara 0 för att förhindra att flera statusar visas samtidigt.
 * 
 * Mappning:
 * - confirmed → confirmed=1, packing=0, transport=0, delivered=0
 * - packing → confirmed=1, packing=1, transport=0, delivered=0
 * - transport → confirmed=1, packing=1, transport=1, delivered=0
 * - delivered → confirmed=1, packing=1, transport=1, delivered=1
 */

interface StatusMapping {
  confirmed: number;
  packing: number;
  transport: number;
  delivered: number;
}

const STATUS_MAPPINGS: Record<string, StatusMapping> = {
  'confirmed': { confirmed: 1, packing: 0, transport: 0, delivered: 0 },
  'packing': { confirmed: 1, packing: 1, transport: 0, delivered: 0 },
  'transport': { confirmed: 1, packing: 1, transport: 1, delivered: 0 },
  'delivered': { confirmed: 1, packing: 1, transport: 1, delivered: 1 }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_number, order_id } = body;

    if (!order_number && !order_id) {
      return NextResponse.json(
        { error: 'Order number eller order ID saknas' },
        { status: 400 }
      );
    }

    // Hämta order baserat på order_number eller order_id
    const orderResponse = await client.execute({
      sql: order_id 
        ? 'SELECT id, order_number, status FROM orders WHERE id = ?'
        : 'SELECT id, order_number, status FROM orders WHERE order_number = ?',
      args: [order_id || order_number]
    });

    if (orderResponse.rows.length === 0) {
      return NextResponse.json(
        { error: 'Order hittades inte' },
        { status: 404 }
      );
    }

    const order = orderResponse.rows[0];
    const orderId = order.id as string;
    const orderNumber = order.order_number as string;
    const orderStatus = String(order.status);

    // Hämta mappning för status - använd STRIKT mappning
    const mapping = STATUS_MAPPINGS[orderStatus] || STATUS_MAPPINGS['confirmed'];

    // Kontrollera om order_tracking post finns
    const existingTracking = await client.execute({
      sql: 'SELECT id, confirmed_date, packing_date, transport_date, delivered_date FROM order_tracking WHERE order_id = ?',
      args: [orderId]
    });

    const now = new Date().toISOString();

    if (existingTracking.rows.length > 0) {
      // Hämta befintliga datum
      const existingDates = existingTracking.rows[0];
      
      // Beräkna nya datum baserat på mappning - behåll befintliga datum om status redan är satt
      const newDates = {
        confirmed_date: mapping.confirmed === 1 
          ? (existingDates.confirmed_date || now) 
          : existingDates.confirmed_date,
        packing_date: mapping.packing === 1 
          ? (existingDates.packing_date || now) 
          : null, // Nollställ om status går tillbaka
        transport_date: mapping.transport === 1 
          ? (existingDates.transport_date || now) 
          : null, // Nollställ om status går tillbaka
        delivered_date: mapping.delivered === 1 
          ? (existingDates.delivered_date || now) 
          : null // Nollställ om status går tillbaka
      };
      
      // Uppdatera befintlig post med STRIKT mappning
      await client.execute({
        sql: `
          UPDATE order_tracking 
          SET 
            confirmed = ?,
            confirmed_date = ?,
            packing = ?,
            packing_date = ?,
            transport = ?,
            transport_date = ?,
            delivered = ?,
            delivered_date = ?,
            updated_at = ?
          WHERE order_id = ?
        `,
        args: [
          mapping.confirmed,
          newDates.confirmed_date,
          mapping.packing,
          newDates.packing_date,
          mapping.transport,
          newDates.transport_date,
          mapping.delivered,
          newDates.delivered_date,
          now,
          orderId
        ]
      });
    } else {
      // Skapa ny post
      const trackingId = `track_${orderId}_${Date.now()}`;
      await client.execute({
        sql: `
          INSERT INTO order_tracking 
          (id, order_id, order_number, confirmed, confirmed_date, packing, packing_date, transport, transport_date, delivered, delivered_date, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          trackingId,
          orderId,
          orderNumber,
          mapping.confirmed,
          mapping.confirmed === 1 ? now : null,
          mapping.packing,
          mapping.packing === 1 ? now : null,
          mapping.transport,
          mapping.transport === 1 ? now : null,
          mapping.delivered,
          mapping.delivered === 1 ? now : null,
          now,
          now
        ]
      });
    }

    // Hämta uppdaterad tracking
    const trackingResponse = await client.execute({
      sql: 'SELECT * FROM order_tracking WHERE order_id = ?',
      args: [orderId]
    });

    return NextResponse.json({
      success: true,
      message: `Orderstatus synkroniserad: ${orderStatus}`,
      order_status: orderStatus,
      tracking: trackingResponse.rows[0] || null
    });
  } catch (error) {
    console.error('Error syncing order status:', error);
    return NextResponse.json(
      { error: 'Internt serverfel' },
      { status: 500 }
    );
  }
}
