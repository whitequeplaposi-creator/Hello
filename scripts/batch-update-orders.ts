/**
 * Batch Update Order Tracking Status
 * 
 * This script allows you to update multiple orders at once
 * 
 * Usage:
 * npx tsx scripts/batch-update-orders.ts
 */

import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

type OrderStatus = 'confirmed' | 'packing' | 'transport' | 'delivered';

interface OrderUpdate {
  orderId: string;
  status: OrderStatus;
}

async function batchUpdateOrders(updates: OrderUpdate[]) {
  console.log(`\n📦 Batch Order Status Update`);
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log(`Processing ${updates.length} order(s)...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const update of updates) {
    try {
      console.log(`Processing: ${update.orderId} → ${update.status}`);

      // Check if tracking exists
      const checkResponse = await client.execute({
        sql: 'SELECT * FROM order_tracking WHERE order_id = ?',
        args: [update.orderId]
      });

      if (checkResponse.rows.length === 0) {
        // Create new tracking record
        await client.execute({
          sql: `
            INSERT INTO order_tracking 
            (id, order_id, ${update.status}, ${update.status}_date, created_at, updated_at)
            VALUES (?, ?, 1, datetime('now'), datetime('now'), datetime('now'))
          `,
          args: [`tracking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, update.orderId]
        });
      } else {
        // Build update query based on status
        const updates: string[] = [];
        
        if (update.status === 'confirmed' || update.status === 'packing' || update.status === 'transport' || update.status === 'delivered') {
          updates.push('confirmed = 1');
          updates.push(`confirmed_date = COALESCE(confirmed_date, datetime('now'))`);
        }

        if (update.status === 'packing' || update.status === 'transport' || update.status === 'delivered') {
          updates.push('packing = 1');
          updates.push(`packing_date = COALESCE(packing_date, datetime('now'))`);
        }

        if (update.status === 'transport' || update.status === 'delivered') {
          updates.push('transport = 1');
          updates.push(`transport_date = COALESCE(transport_date, datetime('now'))`);
        }

        if (update.status === 'delivered') {
          updates.push('delivered = 1');
          updates.push(`delivered_date = COALESCE(delivered_date, datetime('now'))`);
        }

        updates.push(`updated_at = datetime('now')`);

        await client.execute({
          sql: `UPDATE order_tracking SET ${updates.join(', ')} WHERE order_id = ?`,
          args: [update.orderId]
        });
      }

      console.log(`  ✅ Success\n`);
      successCount++;

    } catch (error) {
      console.error(`  ❌ Error: ${error}\n`);
      errorCount++;
    }
  }

  console.log('═══════════════════════════════════════════════════════════');
  console.log(`\n📊 Summary:`);
  console.log(`  ✅ Successful: ${successCount}`);
  console.log(`  ❌ Failed: ${errorCount}`);
  console.log(`  📦 Total: ${updates.length}\n`);
}

async function viewAllOrders() {
  console.log(`\n📦 Current Order Tracking Status`);
  console.log('═══════════════════════════════════════════════════════════\n');

  const result = await client.execute({
    sql: `
      SELECT 
        order_id,
        order_number,
        CASE 
          WHEN delivered = 1 THEN 'Delivered'
          WHEN transport = 1 THEN 'In Transit'
          WHEN packing = 1 THEN 'Packing'
          WHEN confirmed = 1 THEN 'Confirmed'
          ELSE 'Pending'
        END as status,
        updated_at
      FROM order_tracking
      ORDER BY updated_at DESC
      LIMIT 20
    `,
    args: []
  });

  if (result.rows.length === 0) {
    console.log('No tracking records found.\n');
    return;
  }

  console.log('Order ID                          | Status      | Last Updated');
  console.log('───────────────────────────────────────────────────────────────────');

  for (const row of result.rows) {
    const orderId = String(row.order_id).padEnd(33);
    const status = String(row.status).padEnd(11);
    const updated = row.updated_at;
    console.log(`${orderId} | ${status} | ${updated}`);
  }

  console.log('\n');
}

// ============================================================================
// EXAMPLE USAGE - Modify this section with your orders
// ============================================================================

async function main() {
  try {
    // Example 1: Update multiple orders to different statuses
    const orderUpdates: OrderUpdate[] = [
      // Uncomment and modify these examples:
      // { orderId: 'order_abc123', status: 'confirmed' },
      // { orderId: 'order_def456', status: 'packing' },
      // { orderId: 'order_ghi789', status: 'transport' },
      // { orderId: 'order_jkl012', status: 'delivered' },
    ];

    if (orderUpdates.length > 0) {
      await batchUpdateOrders(orderUpdates);
    } else {
      console.log('\n⚠️  No orders to update.');
      console.log('Edit the orderUpdates array in this script to add orders.\n');
    }

    // View current status of all orders
    await viewAllOrders();

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    client.close();
  }
}

// Run the script
main();
