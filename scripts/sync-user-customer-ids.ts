/**
 * Script to help sync user IDs between localStorage and database
 * This helps diagnose ID mismatches
 */

import client from '../lib/db';

async function syncUserCustomerIds() {
  console.log('🔄 User-Customer ID Sync Helper\n');

  try {
    // Get all customers with their orders
    console.log('📋 Customer Summary:');
    const customersResult = await client.execute(`
      SELECT 
        c.id,
        c.email,
        c.name,
        c.total_orders,
        COUNT(o.id) as actual_order_count
      FROM customers c
      LEFT JOIN orders o ON c.id = o.customer_id
      GROUP BY c.id, c.email, c.name, c.total_orders
      ORDER BY actual_order_count DESC, c.created_at DESC
    `);
    
    console.log(`Found ${customersResult.rows.length} customers:\n`);
    
    customersResult.rows.forEach((customer: any) => {
      const mismatch = customer.total_orders !== customer.actual_order_count;
      console.log(`${mismatch ? '⚠️' : '✅'} ${customer.email}`);
      console.log(`   Customer ID: ${customer.id}`);
      console.log(`   Name: ${customer.name}`);
      console.log(`   Recorded Orders: ${customer.total_orders}`);
      console.log(`   Actual Orders: ${customer.actual_order_count}`);
      
      if (mismatch) {
        console.log(`   ⚠️ MISMATCH: Database shows ${customer.total_orders} but found ${customer.actual_order_count} orders`);
      }
      console.log('');
    });

    // Instructions for users
    console.log('\n📝 Instructions for Users:\n');
    console.log('If you are logged in but cannot see your orders:');
    console.log('');
    console.log('1. Open browser console (F12)');
    console.log('2. Run: localStorage.getItem("user")');
    console.log('3. Check if the "id" matches your customer ID above');
    console.log('');
    console.log('To fix a mismatch:');
    console.log('');
    console.log('Option A - Update localStorage (temporary):');
    console.log('  localStorage.setItem("user", JSON.stringify({');
    console.log('    id: "YOUR_CORRECT_CUSTOMER_ID",');
    console.log('    email: "your@email.com",');
    console.log('    name: "Your Name"');
    console.log('  }))');
    console.log('  Then refresh the page');
    console.log('');
    console.log('Option B - Re-login:');
    console.log('  1. Logout');
    console.log('  2. Login again');
    console.log('  3. The system will now use the correct customer ID');
    console.log('');

    // Check for specific email if provided
    const testEmail = process.argv[2];
    if (testEmail) {
      console.log(`\n🔍 Detailed check for: ${testEmail}\n`);
      
      const customerResult = await client.execute({
        sql: 'SELECT * FROM customers WHERE email = ?',
        args: [testEmail]
      });
      
      if (customerResult.rows.length === 0) {
        console.log('❌ No customer found with this email');
      } else {
        const customer = customerResult.rows[0];
        console.log('Customer Details:');
        console.log(`  ID: ${customer.id}`);
        console.log(`  Email: ${customer.email}`);
        console.log(`  Name: ${customer.name}`);
        console.log(`  Phone: ${customer.phone || 'N/A'}`);
        console.log(`  Total Orders: ${customer.total_orders}`);
        console.log(`  Total Spent: ${customer.total_spent} SEK`);
        console.log('');
        
        const ordersResult = await client.execute({
          sql: 'SELECT order_number, status, payment_status, total_amount, created_at FROM orders WHERE customer_id = ? ORDER BY created_at DESC',
          args: [customer.id]
        });
        
        console.log(`Orders (${ordersResult.rows.length}):`);
        if (ordersResult.rows.length === 0) {
          console.log('  No orders found');
        } else {
          ordersResult.rows.forEach((order: any) => {
            console.log(`  - ${order.order_number}`);
            console.log(`    Status: ${order.status} / Payment: ${order.payment_status}`);
            console.log(`    Amount: ${order.total_amount} SEK`);
            console.log(`    Date: ${order.created_at}`);
          });
        }
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

syncUserCustomerIds();
