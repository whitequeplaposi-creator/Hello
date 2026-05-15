/**
 * Automated Order Status Update Example
 * 
 * This script demonstrates how to automatically update order statuses
 * based on external events (e.g., webhook from shipping provider)
 * 
 * Usage scenarios:
 * 1. Webhook from payment processor → Set to "confirmed"
 * 2. Webhook from warehouse system → Set to "packing"
 * 3. Webhook from shipping carrier → Set to "transport"
 * 4. Webhook from delivery service → Set to "delivered"
 */

import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

type OrderStatus = 'confirmed' | 'packing' | 'transport' | 'delivered';

interface StatusUpdateEvent {
  orderId: string;
  status: OrderStatus;
  timestamp?: string;
  metadata?: Record<string, any>;
}

/**
 * Update order status with optional metadata
 */
async function updateOrderStatus(event: StatusUpdateEvent): Promise<boolean> {
  try {
    const { orderId, status, timestamp, metadata } = event;

    console.log(`📦 Processing status update for order: ${orderId}`);
    console.log(`   Status: ${status}`);
    if (metadata) {
      console.log(`   Metadata:`, metadata);
    }

    // Check if tracking exists
    const checkResponse = await client.execute({
      sql: 'SELECT * FROM order_tracking WHERE order_id = ?',
      args: [orderId]
    });

    if (checkResponse.rows.length === 0) {
      // Create new tracking record
      const trackingId = `tracking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await client.execute({
        sql: `
          INSERT INTO order_tracking 
          (id, order_id, ${status}, ${status}_date, created_at, updated_at)
          VALUES (?, ?, 1, ?, datetime('now'), datetime('now'))
        `,
        args: [
          trackingId,
          orderId,
          timestamp || new Date().toISOString()
        ]
      });

      console.log(`   ✅ Created new tracking record`);
    } else {
      // Build update query
      const updates: string[] = [];
      const args: any[] = [];

      // Set all previous statuses
      if (status === 'confirmed' || status === 'packing' || status === 'transport' || status === 'delivered') {
        updates.push('confirmed = 1');
        updates.push(`confirmed_date = COALESCE(confirmed_date, ?)`);
        args.push(timestamp || new Date().toISOString());
      }

      if (status === 'packing' || status === 'transport' || status === 'delivered') {
        updates.push('packing = 1');
        updates.push(`packing_date = COALESCE(packing_date, ?)`);
        args.push(timestamp || new Date().toISOString());
      }

      if (status === 'transport' || status === 'delivered') {
        updates.push('transport = 1');
        updates.push(`transport_date = COALESCE(transport_date, ?)`);
        args.push(timestamp || new Date().toISOString());
      }

      if (status === 'delivered') {
        updates.push('delivered = 1');
        updates.push(`delivered_date = COALESCE(delivered_date, ?)`);
        args.push(timestamp || new Date().toISOString());
      }

      updates.push(`updated_at = datetime('now')`);
      args.push(orderId);

      await client.execute({
        sql: `UPDATE order_tracking SET ${updates.join(', ')} WHERE order_id = ?`,
        args
      });

      console.log(`   ✅ Updated tracking status`);
    }

    // Optional: Store metadata in a separate table or log
    if (metadata) {
      // You could store this in an order_events table for audit trail
      console.log(`   📝 Metadata logged`);
    }

    return true;

  } catch (error) {
    console.error(`   ❌ Error updating status:`, error);
    return false;
  }
}

/**
 * Simulate webhook from payment processor
 */
async function handlePaymentConfirmed(orderId: string) {
  console.log('\n💳 Payment Confirmed Webhook Received');
  console.log('═══════════════════════════════════════════════════════════\n');

  await updateOrderStatus({
    orderId,
    status: 'confirmed',
    metadata: {
      source: 'payment_processor',
      paymentMethod: 'credit_card',
      amount: 1299.00
    }
  });
}

/**
 * Simulate webhook from warehouse system
 */
async function handleWarehousePackingStarted(orderId: string) {
  console.log('\n📦 Warehouse Packing Started');
  console.log('═══════════════════════════════════════════════════════════\n');

  await updateOrderStatus({
    orderId,
    status: 'packing',
    metadata: {
      source: 'warehouse_system',
      warehouse: 'Stockholm Central',
      picker: 'WH-001'
    }
  });
}

/**
 * Simulate webhook from shipping carrier
 */
async function handleShipmentDispatched(orderId: string, trackingNumber: string) {
  console.log('\n🚚 Shipment Dispatched');
  console.log('═══════════════════════════════════════════════════════════\n');

  await updateOrderStatus({
    orderId,
    status: 'transport',
    metadata: {
      source: 'shipping_carrier',
      carrier: 'PostNord',
      trackingNumber,
      estimatedDelivery: '2024-01-20'
    }
  });
}

/**
 * Simulate webhook from delivery service
 */
async function handleDeliveryCompleted(orderId: string) {
  console.log('\n🏠 Delivery Completed');
  console.log('═══════════════════════════════════════════════════════════\n');

  await updateOrderStatus({
    orderId,
    status: 'delivered',
    metadata: {
      source: 'delivery_service',
      deliveredTo: 'Customer',
      signature: 'John Doe',
      location: 'Front door'
    }
  });
}

/**
 * Simulate a complete order lifecycle
 */
async function simulateOrderLifecycle(orderId: string) {
  console.log('\n🔄 Simulating Complete Order Lifecycle');
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log(`Order ID: ${orderId}\n`);

  // Step 1: Payment confirmed
  await handlePaymentConfirmed(orderId);
  await sleep(2000);

  // Step 2: Warehouse starts packing
  await handleWarehousePackingStarted(orderId);
  await sleep(2000);

  // Step 3: Shipment dispatched
  await handleShipmentDispatched(orderId, `TRK${Date.now()}`);
  await sleep(2000);

  // Step 4: Delivery completed
  await handleDeliveryCompleted(orderId);

  console.log('\n✅ Order lifecycle simulation completed!\n');
  console.log(`View tracking page: http://localhost:3000/spara-order/${orderId}\n`);
}

/**
 * Helper function to simulate delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Example: Process multiple orders in parallel
 */
async function processBatchUpdates() {
  console.log('\n📊 Processing Batch Updates');
  console.log('═══════════════════════════════════════════════════════════\n');

  const updates: StatusUpdateEvent[] = [
    { orderId: 'order_001', status: 'confirmed' },
    { orderId: 'order_002', status: 'packing' },
    { orderId: 'order_003', status: 'transport' },
    { orderId: 'order_004', status: 'delivered' },
  ];

  const results = await Promise.all(
    updates.map(update => updateOrderStatus(update))
  );

  const successCount = results.filter(r => r).length;
  console.log(`\n✅ Successfully updated ${successCount}/${updates.length} orders\n`);
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  try {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
      console.log(`
📦 Automated Order Status Update Examples
════════════════════════════════════════════════════════════

Usage:
  npx tsx scripts/auto-update-example.ts [command] [order_id]

Commands:
  simulate <order_id>  - Simulate complete order lifecycle
  payment <order_id>   - Mark order as confirmed (payment received)
  packing <order_id>   - Mark order as packing
  transport <order_id> - Mark order as in transit
  delivered <order_id> - Mark order as delivered
  batch                - Process batch updates

Examples:
  npx tsx scripts/auto-update-example.ts simulate order_abc123
  npx tsx scripts/auto-update-example.ts payment order_abc123
  npx tsx scripts/auto-update-example.ts batch
      `);
      process.exit(0);
    }

    const [command, orderId] = args;

    switch (command) {
      case 'simulate':
        if (!orderId) {
          console.error('❌ Order ID required for simulate command');
          process.exit(1);
        }
        await simulateOrderLifecycle(orderId);
        break;

      case 'payment':
        if (!orderId) {
          console.error('❌ Order ID required for payment command');
          process.exit(1);
        }
        await handlePaymentConfirmed(orderId);
        break;

      case 'packing':
        if (!orderId) {
          console.error('❌ Order ID required for packing command');
          process.exit(1);
        }
        await handleWarehousePackingStarted(orderId);
        break;

      case 'transport':
        if (!orderId) {
          console.error('❌ Order ID required for transport command');
          process.exit(1);
        }
        await handleShipmentDispatched(orderId, `TRK${Date.now()}`);
        break;

      case 'delivered':
        if (!orderId) {
          console.error('❌ Order ID required for delivered command');
          process.exit(1);
        }
        await handleDeliveryCompleted(orderId);
        break;

      case 'batch':
        await processBatchUpdates();
        break;

      default:
        console.log('Use --help to see available commands');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    client.close();
  }
}

main();
