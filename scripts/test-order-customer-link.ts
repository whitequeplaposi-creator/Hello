/**
 * Test script to verify that orders are correctly linked to customers
 * and that logged-in users can see their orders
 */

import client from '../lib/db';

async function testOrderCustomerLink() {
  console.log('🧪 Testing Order-Customer Link\n');

  try {
    // 1. Check all customers
    console.log('📋 All Customers:');
    const customersResult = await client.execute('SELECT id, email, name, total_orders FROM customers ORDER BY created_at DESC LIMIT 10');
    
    if (customersResult.rows.length === 0) {
      console.log('  ❌ No customers found');
    } else {
      customersResult.rows.forEach((customer: any) => {
        console.log(`  - ID: ${customer.id}`);
        console.log(`    Email: ${customer.email}`);
        console.log(`    Name: ${customer.name}`);
        console.log(`    Total Orders: ${customer.total_orders}`);
        console.log('');
      });
    }

    // 2. Check all orders
    console.log('\n📦 All Orders:');
    const ordersResult = await client.execute(`
      SELECT o.id, o.order_number, o.customer_id, o.status, o.payment_status, o.total_amount, o.created_at,
             c.email as customer_email, c.name as customer_name
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      ORDER BY o.created_at DESC
      LIMIT 10
    `);
    
    if (ordersResult.rows.length === 0) {
      console.log('  ❌ No orders found');
    } else {
      ordersResult.rows.forEach((order: any) => {
        console.log(`  - Order: ${order.order_number}`);
        console.log(`    Order ID: ${order.id}`);
        console.log(`    Customer ID: ${order.customer_id}`);
        console.log(`    Customer Email: ${order.customer_email || 'NOT FOUND'}`);
        console.log(`    Customer Name: ${order.customer_name || 'NOT FOUND'}`);
        console.log(`    Status: ${order.status} / Payment: ${order.payment_status}`);
        console.log(`    Total: ${order.total_amount} SEK`);
        console.log(`    Created: ${order.created_at}`);
        console.log('');
      });
    }

    // 3. Check for orphaned orders (orders without matching customer)
    console.log('\n🔍 Checking for Orphaned Orders:');
    const orphanedResult = await client.execute(`
      SELECT o.id, o.order_number, o.customer_id
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE c.id IS NULL
    `);
    
    if (orphanedResult.rows.length === 0) {
      console.log('  ✅ No orphaned orders found');
    } else {
      console.log(`  ⚠️ Found ${orphanedResult.rows.length} orphaned orders:`);
      orphanedResult.rows.forEach((order: any) => {
        console.log(`    - Order ${order.order_number} (ID: ${order.id}) references non-existent customer: ${order.customer_id}`);
      });
    }

    // 4. Test specific customer lookup
    console.log('\n🔍 Testing Customer Order Lookup:');
    if (customersResult.rows.length > 0) {
      const testCustomer = customersResult.rows[0];
      console.log(`  Testing with customer: ${testCustomer.email} (ID: ${testCustomer.id})`);
      
      const customerOrdersResult = await client.execute({
        sql: 'SELECT id, order_number, status, payment_status, total_amount, created_at FROM orders WHERE customer_id = ? ORDER BY created_at DESC',
        args: [testCustomer.id]
      });
      
      if (customerOrdersResult.rows.length === 0) {
        console.log('  ⚠️ No orders found for this customer');
      } else {
        console.log(`  ✅ Found ${customerOrdersResult.rows.length} orders:`);
        customerOrdersResult.rows.forEach((order: any) => {
          console.log(`    - ${order.order_number}: ${order.status} / ${order.payment_status} (${order.total_amount} SEK)`);
        });
      }
    }

    // 5. Check for duplicate customers by email
    console.log('\n🔍 Checking for Duplicate Customers:');
    const duplicatesResult = await client.execute(`
      SELECT email, COUNT(*) as count, GROUP_CONCAT(id) as customer_ids
      FROM customers
      GROUP BY email
      HAVING count > 1
    `);
    
    if (duplicatesResult.rows.length === 0) {
      console.log('  ✅ No duplicate customers found');
    } else {
      console.log(`  ⚠️ Found ${duplicatesResult.rows.length} duplicate emails:`);
      duplicatesResult.rows.forEach((dup: any) => {
        console.log(`    - ${dup.email}: ${dup.count} customers (IDs: ${dup.customer_ids})`);
      });
    }

    console.log('\n✅ Test completed');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testOrderCustomerLink();
