import client from '../lib/db';

/**
 * Detta script synkroniserar orders.status till order_tracking-tabellen
 * 
 * Statusmappning:
 * - pending → confirmed=1, packing=0, transport=0, delivered=0
 * - processing → confirmed=1, packing=1, transport=0, delivered=0
 * - shipped → confirmed=1, packing=1, transport=1, delivered=0
 * - delivered → confirmed=1, packing=1, transport=1, delivered=1
 */

interface StatusMapping {
  confirmed: number;
  packing: number;
  transport: number;
  delivered: number;
}

const STATUS_MAPPINGS: Record<string, StatusMapping> = {
  'pending': { confirmed: 1, packing: 0, transport: 0, delivered: 0 },
  'processing': { confirmed: 1, packing: 1, transport: 0, delivered: 0 },
  'shipped': { confirmed: 1, packing: 1, transport: 1, delivered: 0 },
  'delivered': { confirmed: 1, packing: 1, transport: 1, delivered: 1 },
  'cancelled': { confirmed: 0, packing: 0, transport: 0, delivered: 0 },
  'returned': { confirmed: 1, packing: 1, transport: 1, delivered: 0 }
};

async function syncOrderToTracking(orderId: string, orderNumber: string, status: string) {
  const mapping = STATUS_MAPPINGS[status] || STATUS_MAPPINGS['pending'];
  const now = new Date().toISOString();

  // Kontrollera om tracking finns
  const existingTracking = await client.execute({
    sql: 'SELECT id FROM order_tracking WHERE order_id = ?',
    args: [orderId]
  });

  if (existingTracking.rows.length > 0) {
    // Hämta befintliga datum
    const existingData = await client.execute({
      sql: 'SELECT confirmed_date, packing_date, transport_date, delivered_date FROM order_tracking WHERE order_id = ?',
      args: [orderId]
    });
    
    const existingDates = existingData.rows[0];
    
    // Uppdatera befintlig tracking
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
    console.log(`✅ Updated tracking for order ${orderNumber}`);
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
    console.log(`✅ Created tracking for order ${orderNumber}`);
  }
}

async function syncAllOrders() {
  console.log('🔄 Syncing all orders to tracking...\n');

  try {
    // Hämta alla orders
    const ordersResult = await client.execute({
      sql: 'SELECT id, order_number, status FROM orders',
      args: []
    });

    console.log(`Found ${ordersResult.rows.length} orders\n`);

    for (const order of ordersResult.rows) {
      const orderId = order.id as string;
      const orderNumber = order.order_number as string;
      const status = order.status as string;

      console.log(`Processing: ${orderNumber} (${status})`);
      await syncOrderToTracking(orderId, orderNumber, status);
    }

    console.log('\n✅ All orders synced successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Kör synkronisering
syncAllOrders();
