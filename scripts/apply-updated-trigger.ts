/**
 * Apply Updated Order Status Trigger
 * 
 * This script applies the updated trigger that supports new status names:
 * - Confirmed
 * - Packing
 * - Transport
 * - Delivered
 * 
 * Usage:
 * npx tsx scripts/apply-updated-trigger.ts
 */

import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function applyUpdatedTrigger() {
  try {
    console.log('\n📦 Applying Updated Order Status Trigger');
    console.log('═══════════════════════════════════════════════════════════\n');

    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'lib', 'migrations', '005_update_order_status_trigger.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    // Split by semicolons and filter out comments and empty lines
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip comment blocks
      if (statement.includes('============') || statement.startsWith('/*')) {
        continue;
      }

      try {
        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        await client.execute({ sql: statement, args: [] });
        console.log(`✅ Success\n`);
      } catch (error: any) {
        // Ignore "already exists" errors
        if (error.message && error.message.includes('already exists')) {
          console.log(`⚠️  Already exists, skipping\n`);
        } else {
          console.error(`❌ Error:`, error.message);
          console.log(`Statement: ${statement.substring(0, 100)}...\n`);
        }
      }
    }

    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ Trigger update completed!\n');

    // Test the trigger
    console.log('🧪 Testing trigger functionality...\n');
    await testTrigger();

  } catch (error) {
    console.error('❌ Error applying trigger:', error);
    throw error;
  } finally {
    client.close();
  }
}

async function testTrigger() {
  try {
    // Create a test order
    const testOrderId = `test_order_${Date.now()}`;
    const testOrderNumber = `TEST-${Math.floor(Math.random() * 1000000)}`;

    console.log(`Creating test order: ${testOrderNumber}`);
    
    await client.execute({
      sql: `
        INSERT INTO orders (id, order_number, customer_email, total_amount, status, created_at)
        VALUES (?, ?, 'test@example.com', 100.00, 'Confirmed', datetime('now'))
      `,
      args: [testOrderId, testOrderNumber]
    });

    console.log('✅ Test order created\n');

    // Check if tracking was created
    const trackingCheck = await client.execute({
      sql: 'SELECT * FROM order_tracking WHERE order_id = ?',
      args: [testOrderId]
    });

    if (trackingCheck.rows.length > 0) {
      console.log('✅ Tracking record created automatically\n');
      
      const tracking = trackingCheck.rows[0];
      console.log('Initial tracking status:');
      console.log(`  Confirmed: ${tracking.confirmed ? '✅' : '❌'}`);
      console.log(`  Packing: ${tracking.packing ? '✅' : '❌'}`);
      console.log(`  Transport: ${tracking.transport ? '✅' : '❌'}`);
      console.log(`  Delivered: ${tracking.delivered ? '✅' : '❌'}\n`);
    } else {
      console.log('⚠️  Tracking record not created automatically\n');
    }

    // Update order status to Transport
    console.log('Updating order status to "Transport"...');
    await client.execute({
      sql: 'UPDATE orders SET status = ? WHERE id = ?',
      args: ['Transport', testOrderId]
    });

    // Check tracking again
    const trackingAfter = await client.execute({
      sql: 'SELECT * FROM order_tracking WHERE order_id = ?',
      args: [testOrderId]
    });

    if (trackingAfter.rows.length > 0) {
      const tracking = trackingAfter.rows[0];
      console.log('✅ Tracking updated automatically\n');
      console.log('Updated tracking status:');
      console.log(`  Confirmed: ${tracking.confirmed ? '✅' : '❌'}`);
      console.log(`  Packing: ${tracking.packing ? '✅' : '❌'}`);
      console.log(`  Transport: ${tracking.transport ? '✅' : '❌'}`);
      console.log(`  Delivered: ${tracking.delivered ? '✅' : '❌'}\n`);

      if (tracking.transport === 1) {
        console.log('🎉 Trigger is working correctly!\n');
      } else {
        console.log('⚠️  Trigger may not be working as expected\n');
      }
    }

    // Clean up test order
    console.log('Cleaning up test data...');
    await client.execute({
      sql: 'DELETE FROM order_tracking WHERE order_id = ?',
      args: [testOrderId]
    });
    await client.execute({
      sql: 'DELETE FROM orders WHERE id = ?',
      args: [testOrderId]
    });
    console.log('✅ Test data cleaned up\n');

  } catch (error) {
    console.error('❌ Error testing trigger:', error);
  }
}

// Main execution
async function main() {
  try {
    await applyUpdatedTrigger();
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n✅ All done! You can now use the following commands:\n');
    console.log('-- Update order to Packing:');
    console.log("UPDATE orders SET status = 'Packing' WHERE order_number = 'ORD-17438574';\n");
    console.log('-- Update order to Transport:');
    console.log("UPDATE orders SET status = 'Transport' WHERE order_number = 'ORD-17438574';\n");
    console.log('-- Update order to Delivered:');
    console.log("UPDATE orders SET status = 'Delivered' WHERE order_number = 'ORD-17438574';\n");
    console.log('The tracking page will automatically update within 30 seconds!\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
