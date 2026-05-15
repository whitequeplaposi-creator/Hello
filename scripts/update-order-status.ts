/**
 * Script för att uppdatera order status direkt i databasen
 * 
 * Användning:
 * npx tsx scripts/update-order-status.ts ORD-12345 transport
 * npx tsx scripts/update-order-status.ts ORD-12345 delivered
 */

import client from '../lib/db';

// Tillåtna statusvärden
const VALID_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];

async function updateOrderStatus(orderNumber: string, newStatus: string) {
  console.log('🔄 Uppdaterar order status...\n');

  try {
    // Validera status
    if (!VALID_STATUSES.includes(newStatus)) {
      console.error(`❌ Ogiltig status: ${newStatus}`);
      console.log(`   Tillåtna värden: ${VALID_STATUSES.join(', ')}`);
      return;
    }

    // Kontrollera om order finns
    const orderCheck = await client.execute({
      sql: 'SELECT id, order_number, status FROM orders WHERE order_number = ?',
      args: [orderNumber]
    });

    if (orderCheck.rows.length === 0) {
      console.error(`❌ Order hittades inte: ${orderNumber}`);
      return;
    }

    const order = orderCheck.rows[0];
    const oldStatus = order.status;

    console.log(`📦 Order: ${orderNumber}`);
    console.log(`   Nuvarande status: ${oldStatus}`);
    console.log(`   Ny status: ${newStatus}\n`);

    // Uppdatera order status
    await client.execute({
      sql: 'UPDATE orders SET status = ?, updated_at = ? WHERE order_number = ?',
      args: [newStatus, new Date().toISOString(), orderNumber]
    });

    console.log('✅ Order status uppdaterad i databasen\n');

    // Synkronisera till order_tracking
    console.log('🔄 Synkroniserar till order_tracking...');

    // Hämta order ID
    const orderId = order.id as string;

    // Statusmappning
    const STATUS_MAPPINGS: Record<string, any> = {
      'pending': { confirmed: 1, packing: 0, transport: 0, delivered: 0 },
      'processing': { confirmed: 1, packing: 1, transport: 0, delivered: 0 },
      'shipped': { confirmed: 1, packing: 1, transport: 1, delivered: 0 },
      'delivered': { confirmed: 1, packing: 1, transport: 1, delivered: 1 },
      'cancelled': { confirmed: 0, packing: 0, transport: 0, delivered: 0 },
      'returned': { confirmed: 1, packing: 1, transport: 1, delivered: 0 }
    };

    const mapping = STATUS_MAPPINGS[newStatus] || STATUS_MAPPINGS['pending'];
    const now = new Date().toISOString();

    // Kontrollera om tracking finns
    const trackingCheck = await client.execute({
      sql: 'SELECT id, confirmed_date, packing_date, transport_date, delivered_date FROM order_tracking WHERE order_id = ?',
      args: [orderId]
    });

    if (trackingCheck.rows.length > 0) {
      // Uppdatera befintlig tracking
      const existingDates = trackingCheck.rows[0];

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
          mapping.confirmed === 1 && !existingDates.confirmed_date ? now : existingDates.confirmed_date,
          mapping.packing,
          mapping.packing === 1 && !existingDates.packing_date ? now : existingDates.packing_date,
          mapping.transport,
          mapping.transport === 1 && !existingDates.transport_date ? now : existingDates.transport_date,
          mapping.delivered,
          mapping.delivered === 1 && !existingDates.delivered_date ? now : existingDates.delivered_date,
          now,
          orderId
        ]
      });

      console.log('✅ Tracking uppdaterad\n');
    } else {
      // Skapa ny tracking
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

      console.log('✅ Tracking skapad\n');
    }

    // Visa uppdaterad tracking
    const updatedTracking = await client.execute({
      sql: 'SELECT * FROM order_tracking WHERE order_id = ?',
      args: [orderId]
    });

    if (updatedTracking.rows.length > 0) {
      const tracking = updatedTracking.rows[0];
      console.log('📊 Tracking Status:');
      console.log(`   ✅ Confirmed: ${tracking.confirmed === 1 ? 'Ja' : 'Nej'} ${tracking.confirmed_date ? `(${tracking.confirmed_date})` : ''}`);
      console.log(`   📦 Packing: ${tracking.packing === 1 ? 'Ja' : 'Nej'} ${tracking.packing_date ? `(${tracking.packing_date})` : ''}`);
      console.log(`   🚚 Transport: ${tracking.transport === 1 ? 'Ja' : 'Nej'} ${tracking.transport_date ? `(${tracking.transport_date})` : ''}`);
      console.log(`   📬 Delivered: ${tracking.delivered === 1 ? 'Ja' : 'Nej'} ${tracking.delivered_date ? `(${tracking.delivered_date})` : ''}`);
    }

    console.log('\n✅ Klar!');

  } catch (error) {
    console.error('❌ Fel:', error);
  }
}

// Hämta argument från kommandoraden
const orderNumber = process.argv[2];
const newStatus = process.argv[3];

if (!orderNumber || !newStatus) {
  console.log('📝 Användning:');
  console.log('   npx tsx scripts/update-order-status.ts <ORDER_NUMBER> <STATUS>\n');
  console.log('📋 Exempel:');
  console.log('   npx tsx scripts/update-order-status.ts ORD-17438574 transport');
  console.log('   npx tsx scripts/update-order-status.ts ORD-17438574 delivered\n');
  console.log('✅ Tillåtna statusvärden:');
  console.log(`   ${VALID_STATUSES.join(', ')}\n`);
  process.exit(1);
}

updateOrderStatus(orderNumber, newStatus);
