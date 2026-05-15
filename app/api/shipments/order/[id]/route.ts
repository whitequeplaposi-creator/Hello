import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/db';

/**
 * Hämta leveransinformation för en specifik order
 * Synkroniserar automatiskt med order_tracking-tabellen
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    
    if (!orderId || typeof orderId !== 'string') {
      return NextResponse.json(
        { error: 'Ogiltig order-ID' },
        { status: 400 }
      );
    }

    // Hämta order tracking information
    const trackingResult = await client.execute({
      sql: 'SELECT * FROM order_tracking WHERE order_id = ?',
      args: [orderId]
    });

    // Hämta shipment information
    const shipmentResult = await client.execute({
      sql: 'SELECT * FROM shipments WHERE order_id = ?',
      args: [orderId]
    });

    // Om shipment finns, uppdatera den baserat på tracking
    if (shipmentResult.rows.length > 0 && trackingResult.rows.length > 0) {
      const tracking = trackingResult.rows[0];
      const shipment = shipmentResult.rows[0];
      
      // Bestäm shipment status baserat på tracking
      let shipmentStatus = 'pending';
      if (tracking.delivered === 1) {
        shipmentStatus = 'delivered';
      } else if (tracking.transport === 1) {
        shipmentStatus = 'in_transit';
      } else if (tracking.packing === 1) {
        shipmentStatus = 'processing';
      } else if (tracking.confirmed === 1) {
        shipmentStatus = 'pending';
      }

      // Uppdatera shipment status om den har ändrats
      if (shipment.status !== shipmentStatus) {
        await client.execute({
          sql: `
            UPDATE shipments 
            SET status = ?,
                actual_delivery_date = ?,
                updated_at = ?
            WHERE id = ?
          `,
          args: [
            shipmentStatus,
            tracking.delivered === 1 ? tracking.delivered_date : null,
            new Date().toISOString(),
            shipment.id
          ]
        });
      }

      // Hämta uppdaterad shipment
      const updatedShipmentResult = await client.execute({
        sql: 'SELECT * FROM shipments WHERE order_id = ?',
        args: [orderId]
      });

      return NextResponse.json({
        success: true,
        shipment: updatedShipmentResult.rows[0],
        tracking: tracking
      });
    }

    return NextResponse.json({
      success: true,
      shipment: shipmentResult.rows[0] || null,
      tracking: trackingResult.rows[0] || null
    });

  } catch (error) {
    console.error('Error fetching shipment for order:', error);
    return NextResponse.json(
      { error: 'Internt serverfel' },
      { status: 500 }
    );
  }
}
