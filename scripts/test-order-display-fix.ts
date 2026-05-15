/**
 * Test to verify that the order display fix works correctly
 */

import client from '../lib/db';

async function testOrderDisplayFix() {
  console.log('🧪 Testing Order Display Fix\n');

  try {
    const testEmail = 'paradoxapiko@gmail.com';
    
    // 1. Simulate fetching customer by email (like login does)
    console.log('1️⃣ Simulating login - fetching customer by email...');
    const customerResult = await client.execute({
      sql: 'SELECT * FROM customers WHERE email = ?',
      args: [testEmail]
    });
    
    if (customerResult.rows.length === 0) {
      console.log('❌ Customer not found');
      return;
    }
    
    const customer = customerResult.rows[0];
    const customerId = customer.id?.toString();
    console.log(`✅ Customer found: ${customerId}`);
    console.log(`   Email: ${customer.email}`);
    console.log(`   Name: ${customer.name}`);
    console.log('');
    
    // 2. Fetch orders for this customer (like "Mina beställningar" does)
    console.log('2️⃣ Fetching orders for customer...');
    const ordersResult = await client.execute({
      sql: 'SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC',
      args: [customerId]
    });
    
    console.log(`✅ Found ${ordersResult.rows.length} orders`);
    console.log('');
    
    if (ordersResult.rows.length === 0) {
      console.log('⚠️ No orders found for this customer');
      console.log('   This could mean:');
      console.log('   - Customer has not placed any orders yet');
      console.log('   - Orders are linked to a different customer ID');
      console.log('');
    } else {
      console.log('📦 Orders:');
      ordersResult.rows.forEach((order: any, index: number) => {
        console.log(`   ${index + 1}. ${order.order_number}`);
        console.log(`      Status: ${order.status} / Payment: ${order.payment_status}`);
        console.log(`      Amount: ${order.total_amount} ${order.currency}`);
        console.log(`      Created: ${order.created_at}`);
        console.log('');
      });
    }
    
    // 3. Check if there are orders with different customer IDs for this email
    console.log('3️⃣ Checking for orders with mismatched customer IDs...');
    const allOrdersResult = await client.execute({
      sql: `
        SELECT o.*, c.email 
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.id
        WHERE c.email = ? AND o.customer_id != ?
      `,
      args: [testEmail, customerId]
    });
    
    if (allOrdersResult.rows.length === 0) {
      console.log('✅ No mismatched orders found');
    } else {
      console.log(`⚠️ Found ${allOrdersResult.rows.length} orders with different customer IDs:`);
      allOrdersResult.rows.forEach((order: any) => {
        console.log(`   - ${order.order_number} (Customer ID: ${order.customer_id})`);
      });
      console.log('');
      console.log('   These orders will NOT be visible to the user!');
      console.log('   Consider migrating these orders to the correct customer ID.');
    }
    console.log('');
    
    // 4. Summary
    console.log('📊 Summary:');
    console.log(`   Customer ID: ${customerId}`);
    console.log(`   Email: ${testEmail}`);
    console.log(`   Visible Orders: ${ordersResult.rows.length}`);
    console.log(`   Hidden Orders: ${allOrdersResult.rows.length}`);
    console.log('');
    
    if (ordersResult.rows.length > 0) {
      console.log('✅ Fix is working! Orders are visible to the user.');
    } else if (allOrdersResult.rows.length > 0) {
      console.log('⚠️ Orders exist but are linked to wrong customer ID.');
      console.log('   User needs to re-login to sync their customer ID.');
    } else {
      console.log('ℹ️ No orders found for this customer.');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testOrderDisplayFix();
