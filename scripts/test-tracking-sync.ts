import client from '@/lib/db';

async function testTrackingSync() {
  try {
    const orderId = 'order_1778620011196_8giqupsm2'; // ORD-20011204

    // Get current order status
    const orderResponse = await client.execute({
      sql: 'SELECT id, order_number, status FROM orders WHERE id = ?',
      args: [orderId]
    });

    if (orderResponse.rows.length === 0) {
      console.log('Order not found');
      return;
    }

    const order = orderResponse.rows[0];
    console.log('Current order status:', order);

    // Get current tracking
    const trackingResponse = await client.execute({
      sql: 'SELECT * FROM order_tracking WHERE order_id = ?',
      args: [orderId]
    });

    if (trackingResponse.rows.length === 0) {
      console.log('Tracking not found');
      return;
    }

    const tracking = trackingResponse.rows[0];
    console.log('Current tracking:', tracking);

    // Manually sync based on order status
    const now = new Date().toISOString();
    let trackingData = {
      confirmed: tracking.confirmed || 0,
      confirmed_date: tracking.confirmed_date,
      packing: tracking.packing || 0,
      packing_date: tracking.packing_date,
      transport: tracking.transport || 0,
      transport_date: tracking.transport_date,
      delivered: tracking.delivered || 0,
      delivered_date: tracking.delivered_date
    };

    const orderStatus = order.status;
    let needsUpdate = false;

    if (orderStatus === 'transport') {
      if (!trackingData.confirmed || trackingData.confirmed !== 1) {
        trackingData.confirmed = 1;
        if (!trackingData.confirmed_date) trackingData.confirmed_date = now;
        needsUpdate = true;
      }
      if (!trackingData.packing || trackingData.packing !== 1) {
        trackingData.packing = 1;
        if (!trackingData.packing_date) trackingData.packing_date = now;
        needsUpdate = true;
      }
      if (!trackingData.transport || trackingData.transport !== 1) {
        trackingData.transport = 1;
        if (!trackingData.transport_date) trackingData.transport_date = now;
        needsUpdate = true;
      }
      // Reset future steps
      if (trackingData.delivered === 1) {
        trackingData.delivered = 0;
        trackingData.delivered_date = null;
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      console.log('Updating tracking...');
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
          trackingData.confirmed,
          trackingData.confirmed_date,
          trackingData.packing,
          trackingData.packing_date,
          trackingData.transport,
          trackingData.transport_date,
          trackingData.delivered,
          trackingData.delivered_date,
          now,
          orderId
        ]
      });

      console.log('Tracking updated successfully');

      // Verify the update
      const updatedResponse = await client.execute({
        sql: 'SELECT * FROM order_tracking WHERE order_id = ?',
        args: [orderId]
      });

      console.log('Updated tracking:', updatedResponse.rows[0]);
    } else {
      console.log('No update needed');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testTrackingSync();
