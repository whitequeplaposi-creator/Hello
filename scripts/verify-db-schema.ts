import client from '../lib/db';

async function verifySchema() {
  console.log('🔍 Verifying database schema...\n');

  try {
    // Check orders table schema
    const tableInfo = await client.execute(`SELECT sql FROM sqlite_master WHERE type='table' AND name='orders'`);
    console.log('📋 Current orders table schema:');
    console.log(tableInfo.rows[0]?.sql);

    // Try to insert a test order with 'pending' status
    console.log('\n🧪 Testing order creation with pending status...');
    
    const testOrderId = `test_order_${Date.now()}`;
    const testOrderNumber = `TEST-${Date.now().toString().slice(-8)}`;
    
    try {
      await client.execute({
        sql: `
          INSERT INTO orders (
            id, customer_id, order_number, status, total_amount, currency,
            payment_method, payment_status, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, 'SEK', ?, ?, ?, ?)
        `,
        args: [
          testOrderId,
          'test_customer_id',
          testOrderNumber,
          'pending',
          100,
          'card',
          'pending',
          new Date().toISOString(),
          new Date().toISOString()
        ]
      });
      console.log('✅ Successfully inserted order with pending status');
      
      // Clean up
      await client.execute(`DELETE FROM orders WHERE id = ?`, [testOrderId]);
      console.log('✅ Cleaned up test order');
      
    } catch (error: any) {
      console.error('❌ Failed to insert order with pending status:', error.message);
    }

    // Check existing orders
    const ordersResult = await client.execute(`SELECT id, order_number, status FROM orders LIMIT 5`);
    console.log('\n📦 Existing orders:');
    ordersResult.rows.forEach(row => {
      console.log(`  - ${row.order_number}: ${row.status}`);
    });

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }

  process.exit(0);
}

verifySchema();
