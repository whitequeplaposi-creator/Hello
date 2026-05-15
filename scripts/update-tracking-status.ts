import client from '../lib/db';

// Usage: npx tsx scripts/update-tracking-status.ts <order_id> <status>
// Status can be: confirmed, packing, transport, delivered

async function updateTrackingStatus() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: npx tsx scripts/update-tracking-status.ts <order_id> <status>');
    console.log('');
    console.log('Status options:');
    console.log('  confirmed  - Order confirmed');
    console.log('  packing    - Order is being packed');
    console.log('  transport  - Order is in transport');
    console.log('  delivered  - Order has been delivered');
    console.log('');
    console.log('Example:');
    console.log('  npx tsx scripts/update-tracking-status.ts order_1778620011196_8giqupsm2 transport');
    process.exit(1);
  }
  
  const orderId = args[0];
  const status = args[1].toLowerCase();
  
  const validStatuses = ['confirmed', 'packing', 'transport', 'delivered'];
  if (!validStatuses.includes(status)) {
    console.error(`❌ Invalid status: ${status}`);
    console.error(`Valid statuses: ${validStatuses.join(', ')}`);
    process.exit(1);
  }
  
  try {
    console.log(`\n=== Updating Order Tracking ===`);
    console.log(`Order ID: ${orderId}`);
    console.log(`New Status: ${status}\n`);
    
    // Check if order exists
    const orderCheck = await client.execute({
      sql: 'SELECT id, order_number, status FROM orders WHERE id = ?',
      args: [orderId]
    });
    
    if (orderCheck.rows.length === 0) {
      console.error(`❌ Order not found: ${orderId}`);
      process.exit(1);
    }
    
    const order = orderCheck.rows[0];
    console.log(`Order Number: ${order.order_number}`);
    console.log(`Current Order Status: ${order.status}\n`);
    
    // Check if tracking exists
    const trackingCheck = await client.execute({
      sql: 'SELECT id FROM order_tracking WHERE order_id = ?',
      args: [orderId]
    });
    
    if (trackingCheck.rows.length === 0) {
      console.log('⚠️  No tracking found, creating one...');
      const trackingId = `track_${orderId}_${Date.now()}`;
      const now = new Date().toISOString();
      
      await client.execute({
        sql: `
          INSERT INTO order_tracking 
          (id, order_id, order_number, confirmed, confirmed_date, packing, packing_date, 
           transport, transport_date, delivered, delivered_date, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          trackingId,
          orderId,
          order.order_number,
          0, null, 0, null, 0, null, 0, null,
          now, now
        ]
      });
      console.log('✅ Tracking created\n');
    }
    
    // Update tracking based on status
    const now = new Date().toISOString();
    let confirmed = 0, confirmedDate = null;
    let packing = 0, packingDate = null;
    let transport = 0, transportDate = null;
    let delivered = 0, deliveredDate = null;
    
    // Get current tracking data
    const currentTracking = await client.execute({
      sql: 'SELECT * FROM order_tracking WHERE order_id = ?',
      args: [orderId]
    });
    
    const current = currentTracking.rows[0];
    
    // Set statuses progressively
    if (status === 'confirmed') {
      confirmed = 1;
      confirmedDate = current.confirmed_date || now;
    } else if (status === 'packing') {
      confirmed = 1;
      confirmedDate = current.confirmed_date || now;
      packing = 1;
      packingDate = current.packing_date || now;
    } else if (status === 'transport') {
      confirmed = 1;
      confirmedDate = current.confirmed_date || now;
      packing = 1;
      packingDate = current.packing_date || now;
      transport = 1;
      transportDate = current.transport_date || now;
    } else if (status === 'delivered') {
      confirmed = 1;
      confirmedDate = current.confirmed_date || now;
      packing = 1;
      packingDate = current.packing_date || now;
      transport = 1;
      transportDate = current.transport_date || now;
      delivered = 1;
      deliveredDate = current.delivered_date || now;
    }
    
    // Update tracking
    await client.execute({
      sql: `
        UPDATE order_tracking 
        SET confirmed = ?, confirmed_date = ?,
            packing = ?, packing_date = ?,
            transport = ?, transport_date = ?,
            delivered = ?, delivered_date = ?,
            updated_at = ?
        WHERE order_id = ?
      `,
      args: [
        confirmed, confirmedDate,
        packing, packingDate,
        transport, transportDate,
        delivered, deliveredDate,
        now,
        orderId
      ]
    });
    
    // Update order status
    await client.execute({
      sql: 'UPDATE orders SET status = ?, updated_at = ? WHERE id = ?',
      args: [status, now, orderId]
    });
    
    console.log('✅ Tracking updated successfully!\n');
    
    // Show updated tracking
    const updatedTracking = await client.execute({
      sql: 'SELECT * FROM order_tracking WHERE order_id = ?',
      args: [orderId]
    });
    
    const updated = updatedTracking.rows[0];
    console.log('Updated Tracking Status:');
    console.log(`  ${confirmed ? '✓' : '○'} Confirmed: ${confirmed ? 'YES' : 'NO'}${confirmedDate ? ` (${new Date(confirmedDate).toLocaleString()})` : ''}`);
    console.log(`  ${packing ? '✓' : '○'} Packing: ${packing ? 'YES' : 'NO'}${packingDate ? ` (${new Date(packingDate).toLocaleString()})` : ''}`);
    console.log(`  ${transport ? '✓' : '○'} Transport: ${transport ? 'YES' : 'NO'}${transportDate ? ` (${new Date(transportDate).toLocaleString()})` : ''}`);
    console.log(`  ${delivered ? '✓' : '○'} Delivered: ${delivered ? 'YES' : 'NO'}${deliveredDate ? ` (${new Date(deliveredDate).toLocaleString()})` : ''}`);
    console.log('');
    console.log(`🔗 View tracking: http://localhost:3000/spara-order/${orderId}`);
    console.log('');
    
  } catch (error) {
    console.error('❌ Error updating tracking:', error);
    process.exit(1);
  }
}

updateTrackingStatus();
