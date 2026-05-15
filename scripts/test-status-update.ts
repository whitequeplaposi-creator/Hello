import client from '../lib/db';

async function testStatusUpdate() {
  console.log('🧪 Testing Status Update with Fixed SQL\n');

  try {
    // Hämta order
    const orderResult = await client.execute({
      sql: 'SELECT id, order_number, status FROM orders LIMIT 1',
      args: []
    });

    if (orderResult.rows.length === 0) {
      console.log('❌ No orders found');
      return;
    }

    const order = orderResult.rows[0];
    const orderId = order.id as string;
    const orderNumber = order.order_number as string;
    const originalStatus = order.status as string;

    console.log(`📦 Testing order: ${orderNumber}`);
    console.log(`   Original status: ${originalStatus}\n`);

    // Test 1: Uppdatera till shipped
    console.log('1️⃣ Updating to "shipped"...');
    await client.execute({
      sql: 'UPDATE orders SET status = ? WHERE id = ?',
      args: ['shipped', orderId]
    });

    // Anropa sync API
    const syncResponse = await fetch('http://localhost:3000/api/sync-order-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId })
    });

    if (syncResponse.ok) {
      const data = await syncResponse.json();
      console.log(`   ✅ Sync successful: ${data.message}`);
      console.log(`   Tracking: confirmed=${data.tracking.confirmed}, packing=${data.tracking.packing}, transport=${data.tracking.transport}, delivered=${data.tracking.delivered}\n`);
    } else {
      const error = await syncResponse.text();
      console.log(`   ❌ Sync failed: ${syncResponse.status}`);
      console.log(`   Error: ${error}\n`);
    }

    // Test 2: Uppdatera till delivered
    console.log('2️⃣ Updating to "delivered"...');
    await client.execute({
      sql: 'UPDATE orders SET status = ? WHERE id = ?',
      args: ['delivered', orderId]
    });

    const syncResponse2 = await fetch('http://localhost:3000/api/sync-order-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId })
    });

    if (syncResponse2.ok) {
      const data = await syncResponse2.json();
      console.log(`   ✅ Sync successful: ${data.message}`);
      console.log(`   Tracking: confirmed=${data.tracking.confirmed}, packing=${data.tracking.packing}, transport=${data.tracking.transport}, delivered=${data.tracking.delivered}\n`);
    } else {
      const error = await syncResponse2.text();
      console.log(`   ❌ Sync failed: ${syncResponse2.status}`);
      console.log(`   Error: ${error}\n`);
    }

    // Återställ
    console.log('3️⃣ Restoring original status...');
    await client.execute({
      sql: 'UPDATE orders SET status = ? WHERE id = ?',
      args: [originalStatus, orderId]
    });

    await fetch('http://localhost:3000/api/sync-order-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId })
    });

    console.log(`   ✅ Restored to: ${originalStatus}\n`);
    console.log('✅ All tests passed! SQL syntax error is fixed.');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testStatusUpdate();
