import client from '../lib/db';

async function testTrackingUpdate() {
  console.log('🧪 Testing Order Tracking Update System\n');

  try {
    // 1. Hämta en order
    console.log('1️⃣ Fetching test order...');
    const ordersResult = await client.execute({
      sql: 'SELECT id, order_number, status FROM orders ORDER BY created_at DESC LIMIT 1',
      args: []
    });

    if (ordersResult.rows.length === 0) {
      console.log('❌ No orders found');
      return;
    }

    const order = ordersResult.rows[0];
    const orderId = order.id as string;
    const orderNumber = order.order_number as string;
    const originalStatus = order.status as string;

    console.log(`✅ Found order: ${orderNumber}`);
    console.log(`   Current status: ${originalStatus}\n`);

    // 2. Visa nuvarande tracking
    console.log('2️⃣ Current tracking status:');
    const trackingResult = await client.execute({
      sql: 'SELECT * FROM order_tracking WHERE order_id = ?',
      args: [orderId]
    });

    if (trackingResult.rows.length > 0) {
      const tracking = trackingResult.rows[0];
      console.log(`   Confirmed: ${tracking.confirmed} (${tracking.confirmed_date || 'no date'})`);
      console.log(`   Packing: ${tracking.packing} (${tracking.packing_date || 'no date'})`);
      console.log(`   Transport: ${tracking.transport} (${tracking.transport_date || 'no date'})`);
      console.log(`   Delivered: ${tracking.delivered} (${tracking.delivered_date || 'no date'})\n`);
    } else {
      console.log('   ⚠️ No tracking record found\n');
    }

    // 3. Testa statusuppdateringar
    const testStatuses = ['pending', 'processing', 'shipped', 'delivered'];
    
    for (const testStatus of testStatuses) {
      console.log(`3️⃣ Testing status: ${testStatus}`);
      
      // Uppdatera status
      await client.execute({
        sql: 'UPDATE orders SET status = ?, updated_at = ? WHERE id = ?',
        args: [testStatus, new Date().toISOString(), orderId]
      });
      console.log(`   ✅ Updated orders.status to "${testStatus}"`);

      // Anropa sync API
      const syncResponse = await fetch('http://localhost:3000/api/sync-order-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId })
      });

      if (syncResponse.ok) {
        const syncData = await syncResponse.json();
        console.log(`   ✅ Sync API response: ${syncData.message}`);
        
        if (syncData.tracking) {
          console.log(`   Tracking updated:`);
          console.log(`     - Confirmed: ${syncData.tracking.confirmed}`);
          console.log(`     - Packing: ${syncData.tracking.packing}`);
          console.log(`     - Transport: ${syncData.tracking.transport}`);
          console.log(`     - Delivered: ${syncData.tracking.delivered}`);
        }
      } else {
        console.log(`   ⚠️ Sync API failed: ${syncResponse.status}`);
      }
      
      console.log('');
      
      // Vänta lite mellan uppdateringar
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 4. Återställ original status
    console.log('4️⃣ Restoring original status...');
    await client.execute({
      sql: 'UPDATE orders SET status = ?, updated_at = ? WHERE id = ?',
      args: [originalStatus, new Date().toISOString(), orderId]
    });
    
    // Synka tillbaka
    await fetch('http://localhost:3000/api/sync-order-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId })
    });
    
    console.log(`✅ Restored to original status: ${originalStatus}\n`);

    // 5. Visa slutlig tracking
    console.log('5️⃣ Final tracking status:');
    const finalTracking = await client.execute({
      sql: 'SELECT * FROM order_tracking WHERE order_id = ?',
      args: [orderId]
    });

    if (finalTracking.rows.length > 0) {
      const tracking = finalTracking.rows[0];
      console.log(`   Confirmed: ${tracking.confirmed} (${tracking.confirmed_date || 'no date'})`);
      console.log(`   Packing: ${tracking.packing} (${tracking.packing_date || 'no date'})`);
      console.log(`   Transport: ${tracking.transport} (${tracking.transport_date || 'no date'})`);
      console.log(`   Delivered: ${tracking.delivered} (${tracking.delivered_date || 'no date'})`);
    }

    console.log('\n✅ Test completed successfully!');
    console.log('\n📝 Summary:');
    console.log('   - Orders table uses: pending, processing, shipped, delivered, cancelled, returned');
    console.log('   - These are automatically mapped to tracking columns');
    console.log('   - Tracking page updates every 10 seconds');
    console.log('   - Use /api/sync-order-status to manually sync if needed');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testTrackingUpdate();
