import client from '../lib/db';

async function checkTracking() {
  try {
    console.log('Checking orders and tracking data...\n');
    
    // Hämta alla orders
    const ordersResponse = await client.execute({
      sql: 'SELECT id, order_number, status, created_at FROM orders ORDER BY created_at DESC LIMIT 5'
    });
    
    console.log(`Found ${ordersResponse.rows.length} recent orders:\n`);
    
    for (const order of ordersResponse.rows) {
      console.log(`Order ID: ${order.id}`);
      console.log(`Order Number: ${order.order_number}`);
      console.log(`Status: ${order.status}`);
      console.log(`Created: ${order.created_at}`);
      
      // Kolla om tracking finns
      const trackingResponse = await client.execute({
        sql: 'SELECT * FROM order_tracking WHERE order_id = ?',
        args: [order.id]
      });
      
      if (trackingResponse.rows.length > 0) {
        const tracking = trackingResponse.rows[0];
        console.log('Tracking exists:');
        console.log(`  - Confirmed: ${tracking.confirmed} (${tracking.confirmed_date})`);
        console.log(`  - Packing: ${tracking.packing} (${tracking.packing_date})`);
        console.log(`  - Transport: ${tracking.transport} (${tracking.transport_date})`);
        console.log(`  - Delivered: ${tracking.delivered} (${tracking.delivered_date})`);
      } else {
        console.log('⚠️  No tracking data found!');
      }
      console.log('---\n');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkTracking();
