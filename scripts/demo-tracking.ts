import client from '../lib/db';

/**
 * Demo-script som visar hur tracking-systemet fungerar
 */

async function demoTracking() {
  console.log('🎬 Order Tracking System - Demo\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  try {
    // Hämta en order
    const ordersResult = await client.execute({
      sql: 'SELECT id, order_number, status FROM orders ORDER BY created_at DESC LIMIT 1',
      args: []
    });

    if (ordersResult.rows.length === 0) {
      console.log('❌ No orders found');
      return;
    }

    const order = ordersResult.rows[0];
    const orderId = order.id as string;
    const orderNumber = order.order_number as string;
    const currentStatus = order.status as string;

    console.log('📦 Order Information');
    console.log('───────────────────────────────────────────────────────────');
    console.log(`Order Number: ${orderNumber}`);
    console.log(`Order ID: ${orderId}`);
    console.log(`Current Status: ${currentStatus}`);
    console.log(`Tracking URL: http://localhost:3000/spara-order/${orderId}\n`);

    // Visa nuvarande tracking
    const trackingResult = await client.execute({
      sql: 'SELECT * FROM order_tracking WHERE order_id = ?',
      args: [orderId]
    });

    if (trackingResult.rows.length > 0) {
      const tracking = trackingResult.rows[0];
      console.log('📊 Current Tracking Status');
      console.log('───────────────────────────────────────────────────────────');
      console.log(`✅ Confirmed: ${tracking.confirmed === 1 ? 'YES' : 'NO'} ${tracking.confirmed_date ? `(${tracking.confirmed_date})` : ''}`);
      console.log(`📦 Packing: ${tracking.packing === 1 ? 'YES' : 'NO'} ${tracking.packing_date ? `(${tracking.packing_date})` : ''}`);
      console.log(`🚚 Transport: ${tracking.transport === 1 ? 'YES' : 'NO'} ${tracking.transport_date ? `(${tracking.transport_date})` : ''}`);
      console.log(`🏠 Delivered: ${tracking.delivered === 1 ? 'YES' : 'NO'} ${tracking.delivered_date ? `(${tracking.delivered_date})` : ''}`);
    } else {
      console.log('⚠️ No tracking record found');
    }

    console.log('\n═══════════════════════════════════════════════════════════\n');
    console.log('💡 How to Update Order Status\n');
    
    console.log('Method 1: SQL + Sync API');
    console.log('───────────────────────────────────────────────────────────');
    console.log('Step 1: Update status in database');
    console.log(`  UPDATE orders SET status = 'shipped' WHERE order_number = '${orderNumber}';\n`);
    console.log('Step 2: Sync to tracking');
    console.log(`  curl -X POST http://localhost:3000/api/sync-order-status \\`);
    console.log(`    -H "Content-Type: application/json" \\`);
    console.log(`    -d '{"order_number": "${orderNumber}"}'`);

    console.log('\nMethod 2: API (Automatic sync)');
    console.log('───────────────────────────────────────────────────────────');
    console.log(`  curl -X PATCH http://localhost:3000/api/orders/${orderId} \\`);
    console.log(`    -H "Content-Type: application/json" \\`);
    console.log(`    -d '{"status": "shipped"}'`);

    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('📋 Available Status Values\n');
    console.log('  pending    → ✅ Confirmed');
    console.log('  processing → ✅ Confirmed + 📦 Packing');
    console.log('  shipped    → ✅ Confirmed + 📦 Packing + 🚚 Transport');
    console.log('  delivered  → ✅ Confirmed + 📦 Packing + 🚚 Transport + 🏠 Delivered');
    console.log('  cancelled  → All steps reset');
    console.log('  returned   → ✅ Confirmed + 📦 Packing + 🚚 Transport\n');

    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('🔧 Useful Commands\n');
    console.log('Sync all orders:');
    console.log('  npx tsx scripts/sync-order-to-tracking.ts\n');
    console.log('Test tracking system:');
    console.log('  npx tsx scripts/test-tracking-update.ts\n');
    console.log('Check tracking data:');
    console.log('  npx tsx scripts/check-tracking.ts\n');

    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('📚 Documentation\n');
    console.log('Full guide: docs/ORDER_STATUS_TRACKING.md');
    console.log('Quick start: TRACKING_QUICK_START.md');
    console.log('Summary: TRACKING_FIX_SUMMARY.md\n');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

demoTracking();
