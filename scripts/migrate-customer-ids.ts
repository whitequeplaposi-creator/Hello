/**
 * Migration script to fix customer ID mismatches
 * This script helps consolidate orders under the correct customer ID
 */

import client from '../lib/db';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

async function migrateCustomerIds() {
  console.log('🔄 Customer ID Migration Tool\n');
  console.log('This tool helps fix customer ID mismatches by consolidating orders.\n');

  try {
    // 1. Find customers with the same email
    console.log('1️⃣ Checking for duplicate customers by email...\n');
    
    const duplicatesResult = await client.execute(`
      SELECT email, COUNT(*) as count, GROUP_CONCAT(id) as customer_ids
      FROM customers
      GROUP BY email
      HAVING count > 1
    `);
    
    if (duplicatesResult.rows.length === 0) {
      console.log('✅ No duplicate customers found by email.');
      console.log('   All customers have unique emails.\n');
    } else {
      console.log(`⚠️ Found ${duplicatesResult.rows.length} emails with multiple customer IDs:\n`);
      
      for (const dup of duplicatesResult.rows) {
        const email = dup.email as string;
        const customerIds = (dup.customer_ids as string).split(',');
        
        console.log(`📧 Email: ${email}`);
        console.log(`   Customer IDs: ${customerIds.join(', ')}`);
        
        // Get details for each customer ID
        for (const customerId of customerIds) {
          const customerResult = await client.execute({
            sql: 'SELECT * FROM customers WHERE id = ?',
            args: [customerId]
          });
          
          if (customerResult.rows.length > 0) {
            const customer = customerResult.rows[0];
            
            // Count orders for this customer
            const ordersResult = await client.execute({
              sql: 'SELECT COUNT(*) as order_count FROM orders WHERE customer_id = ?',
              args: [customerId]
            });
            
            const orderCount = ordersResult.rows[0]?.order_count || 0;
            
            console.log(`   - ID: ${customerId}`);
            console.log(`     Name: ${customer.name}`);
            console.log(`     Orders: ${orderCount}`);
            console.log(`     Created: ${customer.created_at}`);
          }
        }
        
        console.log('');
        
        // Ask if user wants to merge
        const answer = await question(`   Do you want to merge these customers? (yes/no): `);
        
        if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
          // Choose which ID to keep (the one with most orders or oldest)
          let keepId = customerIds[0];
          let maxOrders = 0;
          
          for (const customerId of customerIds) {
            const ordersResult = await client.execute({
              sql: 'SELECT COUNT(*) as order_count FROM orders WHERE customer_id = ?',
              args: [customerId]
            });
            const orderCount = ordersResult.rows[0]?.order_count || 0;
            
            if (orderCount > maxOrders) {
              maxOrders = orderCount;
              keepId = customerId;
            }
          }
          
          console.log(`   ✅ Keeping customer ID: ${keepId} (has ${maxOrders} orders)`);
          
          // Migrate orders from other IDs to the kept ID
          for (const customerId of customerIds) {
            if (customerId !== keepId) {
              console.log(`   🔄 Migrating orders from ${customerId} to ${keepId}...`);
              
              await client.execute({
                sql: 'UPDATE orders SET customer_id = ? WHERE customer_id = ?',
                args: [keepId, customerId]
              });
              
              // Delete the duplicate customer
              await client.execute({
                sql: 'DELETE FROM customers WHERE id = ?',
                args: [customerId]
              });
              
              console.log(`   ✅ Migrated and deleted ${customerId}`);
            }
          }
          
          // Update customer statistics
          const totalOrdersResult = await client.execute({
            sql: 'SELECT COUNT(*) as count, SUM(total_amount) as total FROM orders WHERE customer_id = ?',
            args: [keepId]
          });
          
          const totalOrders = totalOrdersResult.rows[0]?.count || 0;
          const totalSpent = totalOrdersResult.rows[0]?.total || 0;
          
          await client.execute({
            sql: 'UPDATE customers SET total_orders = ?, total_spent = ? WHERE id = ?',
            args: [totalOrders, totalSpent, keepId]
          });
          
          console.log(`   ✅ Updated customer statistics: ${totalOrders} orders, ${totalSpent} SEK spent\n`);
        } else {
          console.log(`   ⏭️ Skipped\n`);
        }
      }
    }
    
    // 2. Check for orphaned orders
    console.log('\n2️⃣ Checking for orphaned orders...\n');
    
    const orphanedResult = await client.execute(`
      SELECT o.id, o.order_number, o.customer_id
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE c.id IS NULL
    `);
    
    if (orphanedResult.rows.length === 0) {
      console.log('✅ No orphaned orders found.\n');
    } else {
      console.log(`⚠️ Found ${orphanedResult.rows.length} orphaned orders:\n`);
      
      for (const order of orphanedResult.rows) {
        console.log(`   - Order: ${order.order_number}`);
        console.log(`     References non-existent customer: ${order.customer_id}`);
      }
      
      console.log('\n   These orders need manual intervention.');
      console.log('   Consider creating the missing customers or reassigning orders.\n');
    }
    
    console.log('✅ Migration completed!\n');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    rl.close();
  }
}

migrateCustomerIds();
