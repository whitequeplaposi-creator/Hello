import client from '../lib/db';

async function diagnoseTracking() {
  console.log('🔍 Diagnosing Tracking System\n');

  try {
    // 1. Kontrollera orders
    console.log('1️⃣ Checking orders table...');
    const ordersResult = await client.execute({
      sql: 'SELECT id, order_number, status, updated_at FROM orders ORDER BY created_at DESC LIMIT 3',
      args: []
    });

    console.log(`Found ${ordersResult.rows.length} orders:`);
    ordersResult.rows.forEach((order: any) => {
      console.log(`  - ${order.order_number}: status="${order.status}", updated=${order.updated_at}`);
    });
    console.log('');

    // 2. Kontrollera order_tracking
    console.log('2️⃣ Checking order_tracking table...');
    const trackingResult = await client.execute({
      sql: 'SELECT order_number, confirmed, packing, transport, delivered, updated_at FROM order_tracking ORDER BY updated_at DESC LIMIT 3',
      args: []
    });

    console.log(`Found ${trackingResult.rows.length} tracking records:`);
    trackingResult.rows.forEach((tracking: any) => {
      console.log(`  - ${tracking.order_number}: C=${tracking.confirmed}, P=${tracking.packing}, T=${tracking.transport}, D=${tracking.delivered}, updated=${tracking.updated_at}`);
    });
    console.log('');

    // 3. Testa att uppdatera en order
    if (ordersResult.rows.length > 0) {
      const testOrder = ordersResult.rows[0];
      const orderId = testOrder.id as string;
      const orderNumber = testOrder.order_number as string;
      const currentStatus = testOrder.status as string;

      console.log(`3️⃣ Testing update for order: ${orderNumber}`);
      console.log(`   Current status: ${currentStatus}\n`);

      // Försök uppdatera till shipped
      console.log('   Attempting to update to "shipped"...');
      try {
        await client.execute({
          sql: 'UPDATE orders SET status = ?, updated_at = ? WHERE id = ?',
          args: ['shipped', new Date().toISOString(), orderId]
        });
        console.log('   ✅ SQL update successful\n');

        // Kontrollera om det uppdaterades
        const verifyResult = await client.execute({
          sql: 'SELECT status FROM orders WHERE id = ?',
          args: [orderId]
        });
        console.log(`   Verified status: ${verifyResult.rows[0].status}\n`);

        // Försök synka
        console.log('   Attempting to sync to tracking...');
        try {
          const response = await fetch('http://localhost:3000/api/sync-order-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_number: orderNumber })
          });

          if (response.ok) {
            const data = await response.json();
            console.log('   ✅ Sync API successful');
            console.log(`   Message: ${data.message}`);
            if (data.tracking) {
              console.log(`   Tracking: C=${data.tracking.confirmed}, P=${data.tracking.packing}, T=${data.tracking.transport}, D=${data.tracking.delivered}`);
            }
          } else {
            const errorText = await response.text();
            console.log(`   ❌ Sync API failed: ${response.status}`);
            console.log(`   Error: ${errorText}`);
          }
        } catch (fetchError: any) {
          console.log(`   ❌ Fetch error: ${fetchError.message}`);
          console.log('   Is the dev server running? (npm run dev)');
        }

        // Återställ
        console.log('\n   Restoring original status...');
        await client.execute({
          sql: 'UPDATE orders SET status = ?, updated_at = ? WHERE id = ?',
          args: [currentStatus, new Date().toISOString(), orderId]
        });
        console.log('   ✅ Restored\n');

      } catch (updateError: any) {
        console.log(`   ❌ SQL update failed: ${updateError.message}\n`);
      }
    }

    // 4. Kontrollera API endpoints
    console.log('4️⃣ Checking API endpoints...');
    try {
      const healthCheck = await fetch('http://localhost:3000/api/orders');
      if (healthCheck.ok) {
        console.log('   ✅ API server is running');
      } else {
        console.log(`   ⚠️ API returned status: ${healthCheck.status}`);
      }
    } catch (apiError) {
      console.log('   ❌ Cannot connect to API server');
      console.log('   Make sure to run: npm run dev');
    }

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('\n📋 Summary:');
    console.log('   - Orders table: ' + (ordersResult.rows.length > 0 ? '✅' : '❌'));
    console.log('   - Tracking table: ' + (trackingResult.rows.length > 0 ? '✅' : '❌'));
    console.log('   - Can update orders: Check above');
    console.log('   - API server: Check above');
    console.log('\n💡 If API server is not running, start it with: npm run dev');

  } catch (error: any) {
    console.error('\n❌ Diagnostic error:', error.message);
    console.error('\nFull error:', error);
  }
}

diagnoseTracking();
