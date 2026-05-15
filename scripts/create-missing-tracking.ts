import client from '../lib/db';

async function createMissingTracking() {
  try {
    console.log('=== Creating Missing Tracking Records ===\n');
    
    // Find orders without tracking
    const ordersResult = await client.execute({
      sql: `
        SELECT o.id, o.order_number, o.status, o.created_at 
        FROM orders o 
        LEFT JOIN order_tracking ot ON o.id = ot.order_id 
        WHERE ot.id IS NULL
      `
    });
    
    console.log(`Found ${ordersResult.rows.length} orders without tracking\n`);
    
    if (ordersResult.rows.length === 0) {
      console.log('✅ All orders have tracking records!');
      return;
    }
    
    // Create tracking for each order
    for (const order of ordersResult.rows) {
      const orderId = order.id as string;
      const orderNumber = order.order_number as string;
      const status = order.status as string;
      const createdAt = order.created_at as string;
      
      console.log(`Creating tracking for order: ${orderId}`);
      console.log(`  Order Number: ${orderNumber}`);
      console.log(`  Status: ${status}`);
      
      const trackingId = `track_${orderId}_${Date.now()}`;
      const now = new Date().toISOString();
      
      // Determine which statuses should be set based on order status
      let confirmed = 0, confirmedDate = null;
      let packing = 0, packingDate = null;
      let transport = 0, transportDate = null;
      let delivered = 0, deliveredDate = null;
      
      // Set statuses based on order status
      if (status === 'confirmed' || status === 'pending') {
        confirmed = 1;
        confirmedDate = createdAt;
      } else if (status === 'packing' || status === 'processing') {
        confirmed = 1;
        confirmedDate = createdAt;
        packing = 1;
        packingDate = createdAt;
      } else if (status === 'transport' || status === 'shipped') {
        confirmed = 1;
        confirmedDate = createdAt;
        packing = 1;
        packingDate = createdAt;
        transport = 1;
        transportDate = createdAt;
      } else if (status === 'delivered') {
        confirmed = 1;
        confirmedDate = createdAt;
        packing = 1;
        packingDate = createdAt;
        transport = 1;
        transportDate = createdAt;
        delivered = 1;
        deliveredDate = createdAt;
      }
      
      // Insert tracking record
      await client.execute({
        sql: `
          INSERT INTO order_tracking 
          (id, order_id, order_number, confirmed, confirmed_date, packing, packing_date, 
           transport, transport_date, delivered, delivered_date, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          trackingId,
          orderId,
          orderNumber,
          confirmed,
          confirmedDate,
          packing,
          packingDate,
          transport,
          transportDate,
          delivered,
          deliveredDate,
          createdAt,
          now
        ]
      });
      
      console.log(`  ✅ Tracking created: ${trackingId}`);
      console.log(`     Confirmed: ${confirmed ? 'YES' : 'NO'}`);
      console.log(`     Packing: ${packing ? 'YES' : 'NO'}`);
      console.log(`     Transport: ${transport ? 'YES' : 'NO'}`);
      console.log(`     Delivered: ${delivered ? 'YES' : 'NO'}`);
      console.log('---\n');
    }
    
    console.log('✅ All missing tracking records created!');
    
    // Verify
    const verifyResult = await client.execute({
      sql: 'SELECT COUNT(*) as count FROM order_tracking'
    });
    
    console.log(`\nTotal tracking records: ${verifyResult.rows[0].count}`);
    
  } catch (error) {
    console.error('Error creating tracking:', error);
  }
}

createMissingTracking();
