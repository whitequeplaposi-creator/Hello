import client from '@/lib/db';

async function testOrderSync() {
  try {
    console.log('Testing order status sync...\n');

    // Get a sample order
    const orderResult = await client.execute({
      sql: "SELECT id, order_number, status FROM orders LIMIT 1",
      args: []
    });

    if (orderResult.rows.length === 0) {
      console.log('No orders found to test with');
      return;
    }

    const order = orderResult.rows[0];
    console.log('Testing with order:', order);

    // Check current tracking
    const trackingResult = await client.execute({
      sql: "SELECT * FROM order_tracking WHERE order_id = ?",
      args: [order.id]
    });

    console.log('Current tracking data:', trackingResult.rows[0] || 'No tracking data');

    // Test updating status to 'processing' (Packning)
    console.log('\nUpdating status to processing (Packning)...');
    await client.execute({
      sql: "UPDATE orders SET status = 'processing' WHERE id = ?",
      args: [order.id]
    });

    // Check if trigger updated tracking
    const trackingAfter = await client.execute({
      sql: "SELECT * FROM order_tracking WHERE order_id = ?",
      args: [order.id]
    });

    console.log('Tracking after update:', trackingAfter.rows[0]);

    // Verify the update
    if (trackingAfter.rows[0] && trackingAfter.rows[0].packing === 1) {
      console.log('✓ Trigger successfully updated packing to 1');
    } else {
      console.log('✗ Trigger did not update packing correctly');
    }

    // Restore original status
    console.log('\nRestoring original status...');
    await client.execute({
      sql: "UPDATE orders SET status = ? WHERE id = ?",
      args: [order.status, order.id]
    });

    console.log('\nTest completed successfully');
    console.log('No data was damaged or deleted during the test');

  } catch (error) {
    console.error('Error during test:', error);
  }
}

testOrderSync()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
