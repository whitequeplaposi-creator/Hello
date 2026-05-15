import client from '../lib/db';

async function testOrderStatusSync() {
  console.log('🔍 Testing Order Status Synchronization\n');

  try {
    // 1. Hämta en order från databasen
    console.log('1️⃣ Fetching orders from database...');
    const ordersResult = await client.execute({
      sql: 'SELECT id, order_number, status FROM orders ORDER BY created_at DESC LIMIT 5',
      args: []
    });

    if (ordersResult.rows.length === 0) {
      console.log('❌ No orders found in database');
      return;
    }

    console.log(`✅ Found ${ordersResult.rows.length} orders\n`);

    for (const order of ordersResult.rows) {
      console.log(`\n📦 Order: ${order.order_number}`);
      console.log(`   ID: ${order.id}`);
      console.log(`   Status in orders table: ${order.status}`);

      // 2. Kontrollera order_tracking
      const trackingResult = await client.execute({
        sql: 'SELECT * FROM order_tracking WHERE order_id = ?',
        args: [order.id]
      });

      if (trackingResult.rows.length === 0) {
        console.log('   ⚠️ No tracking record found');
      } else {
        const tracking = trackingResult.rows[0];
        console.log('   Tracking status:');
        console.log(`     - Confirmed: ${tracking.confirmed} (${tracking.confirmed_date || 'no date'})`);
        console.log(`     - Packing: ${tracking.packing} (${tracking.packing_date || 'no date'})`);
        console.log(`     - Transport: ${tracking.transport} (${tracking.transport_date || 'no date'})`);
        console.log(`     - Delivered: ${tracking.delivered} (${tracking.delivered_date || 'no date'})`);
      }
    }

    // 3. Testa statusmappning
    console.log('\n\n2️⃣ Testing Status Mapping\n');
    console.log('Expected mappings:');
    console.log('  confirmed → confirmed=1, packing=0, transport=0, delivered=0');
    console.log('  packing → confirmed=1, packing=1, transport=0, delivered=0');
    console.log('  transport → confirmed=1, packing=1, transport=1, delivered=0');
    console.log('  delivered → confirmed=1, packing=1, transport=1, delivered=1');

    // 4. Visa aktuella statusvärden i orders-tabellen
    console.log('\n\n3️⃣ Current Status Values in Orders Table\n');
    const statusResult = await client.execute({
      sql: 'SELECT DISTINCT status FROM orders',
      args: []
    });

    console.log('Available status values:');
    statusResult.rows.forEach((row: any) => {
      console.log(`  - ${row.status}`);
    });

    // 5. Testa att uppdatera en order
    if (ordersResult.rows.length > 0) {
      const testOrder = ordersResult.rows[0];
      console.log(`\n\n4️⃣ Testing Status Update for Order: ${testOrder.order_number}\n`);
      
      // Testa att sätta status till 'packing'
      console.log('Setting status to "packing"...');
      await client.execute({
        sql: 'UPDATE orders SET status = ? WHERE id = ?',
        args: ['packing', testOrder.id]
      });

      // Kontrollera om tracking uppdaterades
      const updatedTracking = await client.execute({
        sql: 'SELECT * FROM order_tracking WHERE order_id = ?',
        args: [testOrder.id]
      });

      if (updatedTracking.rows.length > 0) {
        const tracking = updatedTracking.rows[0];
        console.log('Tracking after update:');
        console.log(`  - Packing: ${tracking.packing} (should be 1 if auto-sync works)`);
      } else {
        console.log('⚠️ No tracking record - auto-sync not working');
      }

      // Återställ status
      await client.execute({
        sql: 'UPDATE orders SET status = ? WHERE id = ?',
        args: [testOrder.status, testOrder.id]
      });
      console.log('✅ Status restored');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testOrderStatusSync();
