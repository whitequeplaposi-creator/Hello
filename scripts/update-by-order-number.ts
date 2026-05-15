/**
 * Update Order Status by Order Number
 * 
 * This script updates order status using the order number (e.g., ORD-17438574)
 * The trigger automatically syncs with order_tracking table
 * 
 * Usage:
 * npx tsx scripts/update-by-order-number.ts <order_number> <status>
 * 
 * Examples:
 * npx tsx scripts/update-by-order-number.ts ORD-17438574 Packing
 * npx tsx scripts/update-by-order-number.ts ORD-17438574 Transport
 * npx tsx scripts/update-by-order-number.ts ORD-17438574 Delivered
 */

import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

type OrderStatus = 'Confirmed' | 'Packing' | 'Transport' | 'Delivered';

const validStatuses: OrderStatus[] = ['Confirmed', 'Packing', 'Transport', 'Delivered'];

async function updateOrderByNumber(orderNumber: string, status: OrderStatus) {
  try {
    console.log(`\n📦 Updating Order Status`);
    console.log('═══════════════════════════════════════════════════════════\n');

    // Validate status
    if (!validStatuses.includes(status)) {
      console.error(`❌ Invalid status: ${status}`);
      console.log(`Valid statuses: ${validStatuses.join(', ')}`);
      process.exit(1);
    }

    // Find order by order number
    console.log(`Looking up order: ${orderNumber}...`);
    const orderResult = await client.execute({
      sql: 'SELECT id, order_number, status, customer_email FROM orders WHERE order_number = ?',
      args: [orderNumber]
    });

    if (orderResult.rows.length === 0) {
      console.error(`❌ Order not found: ${orderNumber}`);
      console.log(`\nTip: Make sure the order number is correct (e.g., ORD-17438574)\n`);
      process.exit(1);
    }

    const order = orderResult.rows[0];
    const orderId = order.id as string;
    const currentStatus = order.status as string;

    console.log(`✅ Order found!`);
    console.log(`   Order ID: ${orderId}`);
    console.log(`   Customer: ${order.customer_email}`);
    console.log(`   Current Status: ${currentStatus}\n`);

    // Update order status
    console.log(`Updating status to: ${status}...`);
    await client.execute({
      sql: 'UPDATE orders SET status = ?, updated_at = datetime(\'now\') WHERE id = ?',
      args: [status, orderId]
    });

    console.log(`✅ Order status updated!\n`);

    // Wait a moment for trigger to execute
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check tracking status
    console.log('Checking tracking status...');
    const trackingResult = await client.execute({
      sql: 'SELECT * FROM order_tracking WHERE order_id = ?',
      args: [orderId]
    });

    if (trackingResult.rows.length > 0) {
      const tracking = trackingResult.rows[0];
      
      console.log('✅ Tracking updated automatically!\n');
      console.log('📊 Current Tracking Status:');
      console.log('───────────────────────────────────────────────────────────');
      console.log(`Order Number: ${tracking.order_number}`);
      console.log('');
      console.log(`✓ Confirmed:  ${tracking.confirmed ? '✅' : '⬜'} ${tracking.confirmed_date || ''}`);
      console.log(`✓ Packing:    ${tracking.packing ? '✅' : '⬜'} ${tracking.packing_date || ''}`);
      console.log(`✓ Transport:  ${tracking.transport ? '✅' : '⬜'} ${tracking.transport_date || ''}`);
      console.log(`✓ Delivered:  ${tracking.delivered ? '✅' : '⬜'} ${tracking.delivered_date || ''}`);
      console.log('───────────────────────────────────────────────────────────\n');

      // Show tracking URL
      console.log('🌐 View tracking page:');
      console.log(`   http://localhost:3000/spara-order/${orderId}\n`);
      console.log('💡 The page will auto-refresh within 30 seconds to show the update!\n');

    } else {
      console.log('⚠️  No tracking record found. Creating one...\n');
      
      // Manually create tracking if trigger didn't work
      await client.execute({
        sql: `
          INSERT INTO order_tracking (
            id, order_id, order_number, 
            confirmed, confirmed_date,
            packing, packing_date,
            transport, transport_date,
            delivered, delivered_date,
            created_at, updated_at
          ) VALUES (?, ?, ?, 1, datetime('now'), 0, NULL, 0, NULL, 0, NULL, datetime('now'), datetime('now'))
        `,
        args: [`track_${orderId}_${Date.now()}`, orderId, orderNumber]
      });

      console.log('✅ Tracking record created!\n');
    }

    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ Update completed successfully!\n');

  } catch (error) {
    console.error('❌ Error updating order:', error);
    throw error;
  } finally {
    client.close();
  }
}

// Main execution
const args = process.argv.slice(2);

if (args.length < 2 || args.includes('--help') || args.includes('-h')) {
  console.log(`
📦 Update Order Status by Order Number
════════════════════════════════════════════════════════════

Usage:
  npx tsx scripts/update-by-order-number.ts <order_number> <status>

Status Options:
  Confirmed  - Order has been confirmed
  Packing    - Order is being packed
  Transport  - Order is in transit
  Delivered  - Order has been delivered

Examples:
  npx tsx scripts/update-by-order-number.ts ORD-17438574 Packing
  npx tsx scripts/update-by-order-number.ts ORD-17438574 Transport
  npx tsx scripts/update-by-order-number.ts ORD-17438574 Delivered

Notes:
  - The trigger automatically updates order_tracking table
  - Tracking page auto-refreshes every 30 seconds
  - Use the exact order number from your system
  - Status names are case-sensitive (use capitalized versions)

SQL Alternative:
  UPDATE orders SET status = 'Transport' WHERE order_number = 'ORD-17438574';
  `);
  process.exit(0);
}

const [orderNumber, status] = args;
updateOrderByNumber(orderNumber, status as OrderStatus);
