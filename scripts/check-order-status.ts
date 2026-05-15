import client from '@/lib/db';

async function checkOrderStatus() {
  try {
    // Get recent orders
    const ordersResponse = await client.execute({
      sql: `
        SELECT id, order_number, status, created_at 
        FROM orders 
        ORDER BY created_at DESC 
        LIMIT 5
      `
    });

    console.log('Recent Orders:');
    console.log(JSON.stringify(ordersResponse.rows, null, 2));

    // Get tracking data for these orders
    for (const order of ordersResponse.rows) {
      const trackingResponse = await client.execute({
        sql: `
          SELECT * FROM order_tracking WHERE order_id = ?
        `,
        args: [order.id]
      });

      if (trackingResponse.rows.length > 0) {
        console.log(`\nTracking for order ${order.order_number} (${order.id}):`);
        console.log(JSON.stringify(trackingResponse.rows[0], null, 2));
      }
    }
  } catch (error) {
    console.error('Error checking order status:', error);
  }
}

checkOrderStatus();
