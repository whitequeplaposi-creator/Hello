import client from '../lib/db';

async function testTrackingPage() {
  try {
    console.log('=== Testing Order Tracking Page ===\n');
    
    // Get all orders with tracking
    const ordersResult = await client.execute({
      sql: `
        SELECT o.id, o.order_number, o.status, ot.confirmed, ot.packing, ot.transport, ot.delivered
        FROM orders o
        INNER JOIN order_tracking ot ON o.id = ot.order_id
        ORDER BY o.created_at DESC
      `
    });
    
    console.log(`Found ${ordersResult.rows.length} orders with tracking:\n`);
    
    for (const order of ordersResult.rows) {
      const orderId = order.id as string;
      const orderNumber = order.order_number as string;
      const status = order.status as string;
      
      console.log(`Order: ${orderNumber} (${orderId})`);
      console.log(`  Status: ${status}`);
      console.log(`  Tracking URL: http://localhost:3000/spara-order/${orderId}`);
      console.log(`  Tracking Status:`);
      console.log(`    ✓ Confirmed: ${order.confirmed ? 'YES' : 'NO'}`);
      console.log(`    ${order.packing ? '✓' : '○'} Packing: ${order.packing ? 'YES' : 'NO'}`);
      console.log(`    ${order.transport ? '✓' : '○'} Transport: ${order.transport ? 'YES' : 'NO'}`);
      console.log(`    ${order.delivered ? '✓' : '○'} Delivered: ${order.delivered ? 'YES' : 'NO'}`);
      console.log('---\n');
    }
    
    // Test API endpoint simulation
    console.log('=== Simulating API Call ===\n');
    if (ordersResult.rows.length > 0) {
      const testOrderId = ordersResult.rows[0].id as string;
      console.log(`Testing GET /api/order-tracking/${testOrderId}\n`);
      
      const trackingResult = await client.execute({
        sql: 'SELECT * FROM order_tracking WHERE order_id = ?',
        args: [testOrderId]
      });
      
      if (trackingResult.rows.length > 0) {
        console.log('✅ API Response would be:');
        console.log(JSON.stringify({
          success: true,
          tracking: trackingResult.rows[0]
        }, null, 2));
      } else {
        console.log('❌ No tracking found - this would show "Order Not Found" error');
      }
    }
    
  } catch (error) {
    console.error('Error testing tracking page:', error);
  }
}

testTrackingPage();
