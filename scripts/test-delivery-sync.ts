import client from '../lib/db';

/**
 * Testskript för att verifiera leveransstatus-synkronisering
 */

async function testDeliverySync() {
  console.log('🧪 Testar leveransstatus-synkronisering...\n');

  try {
    // 1. Hämta en testorder
    console.log('1️⃣ Hämtar testorder...');
    const ordersResult = await client.execute({
      sql: 'SELECT * FROM orders LIMIT 1'
    });

    if (ordersResult.rows.length === 0) {
      console.log('❌ Inga orders hittades i databasen');
      return;
    }

    const order = ordersResult.rows[0];
    const orderId = order.id?.toString();
    console.log(`✅ Hittade order: ${orderId}`);
    console.log(`   Order nummer: ${order.order_number}`);
    console.log(`   Nuvarande status: ${order.status}\n`);

    // 2. Kontrollera order_tracking
    console.log('2️⃣ Kontrollerar order_tracking...');
    const trackingResult = await client.execute({
      sql: 'SELECT * FROM order_tracking WHERE order_id = ?',
      args: [orderId]
    });

    if (trackingResult.rows.length === 0) {
      console.log('⚠️  Ingen tracking-post hittades, skapar en...');
      const trackingId = `track_${orderId}_${Date.now()}`;
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
          1,
          new Date().toISOString(),
          0,
          null,
          0,
          null,
          0,
          null,
          new Date().toISOString(),
          new Date().toISOString()
        ]
      });
      console.log('✅ Tracking-post skapad\n');
    } else {
      const tracking = trackingResult.rows[0];
      console.log('✅ Tracking-post hittades:');
      console.log(`   Confirmed: ${tracking.confirmed} (${tracking.confirmed_date || 'ingen tid'})`);
      console.log(`   Packing: ${tracking.packing} (${tracking.packing_date || 'ingen tid'})`);
      console.log(`   Transport: ${tracking.transport} (${tracking.transport_date || 'ingen tid'})`);
      console.log(`   Delivered: ${tracking.delivered} (${tracking.delivered_date || 'ingen tid'})\n`);
    }

    // 3. Kontrollera shipment
    console.log('3️⃣ Kontrollerar shipment...');
    const shipmentResult = await client.execute({
      sql: 'SELECT * FROM shipments WHERE order_id = ?',
      args: [orderId]
    });

    if (shipmentResult.rows.length === 0) {
      console.log('⚠️  Ingen shipment hittades, skapar en...');
      const shipmentId = `ship_${Date.now()}`;
      await client.execute({
        sql: `
          INSERT INTO shipments 
          (id, order_id, tracking_number, carrier, status, shipping_address, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          shipmentId,
          orderId,
          `TRACK${Date.now()}`,
          'PostNord',
          'pending',
          'Test Address 123',
          new Date().toISOString(),
          new Date().toISOString()
        ]
      });
      console.log('✅ Shipment skapad\n');
    } else {
      const shipment = shipmentResult.rows[0];
      console.log('✅ Shipment hittades:');
      console.log(`   ID: ${shipment.id}`);
      console.log(`   Tracking: ${shipment.tracking_number}`);
      console.log(`   Carrier: ${shipment.carrier}`);
      console.log(`   Status: ${shipment.status}\n`);
    }

    // 4. Testa statusuppdatering
    console.log('4️⃣ Testar statusuppdatering till "transport"...');
    const now = new Date().toISOString();
    
    // Uppdatera order_tracking
    await client.execute({
      sql: `
        UPDATE order_tracking 
        SET confirmed = 1, 
            confirmed_date = COALESCE(confirmed_date, ?),
            packing = 1,
            packing_date = COALESCE(packing_date, ?),
            transport = 1,
            transport_date = COALESCE(transport_date, ?),
            updated_at = ?
        WHERE order_id = ?
      `,
      args: [now, now, now, now, orderId]
    });
    console.log('✅ order_tracking uppdaterad\n');

    // 5. Verifiera synkronisering
    console.log('5️⃣ Verifierar synkronisering...');
    
    // Hämta uppdaterad tracking
    const updatedTrackingResult = await client.execute({
      sql: 'SELECT * FROM order_tracking WHERE order_id = ?',
      args: [orderId]
    });
    const updatedTracking = updatedTrackingResult.rows[0];
    
    console.log('📊 Uppdaterad tracking:');
    console.log(`   Confirmed: ${updatedTracking.confirmed}`);
    console.log(`   Packing: ${updatedTracking.packing}`);
    console.log(`   Transport: ${updatedTracking.transport}`);
    console.log(`   Delivered: ${updatedTracking.delivered}\n`);

    // Beräkna förväntad shipment status
    let expectedStatus = 'pending';
    if (updatedTracking.delivered === 1) {
      expectedStatus = 'delivered';
    } else if (updatedTracking.transport === 1) {
      expectedStatus = 'in_transit';
    } else if (updatedTracking.packing === 1) {
      expectedStatus = 'processing';
    } else if (updatedTracking.confirmed === 1) {
      expectedStatus = 'pending';
    }

    console.log(`📦 Förväntad shipment status: ${expectedStatus}`);

    // Hämta shipment igen
    const finalShipmentResult = await client.execute({
      sql: 'SELECT * FROM shipments WHERE order_id = ?',
      args: [orderId]
    });
    const finalShipment = finalShipmentResult.rows[0];
    
    console.log(`📦 Nuvarande shipment status: ${finalShipment.status}\n`);

    // 6. Sammanfattning
    console.log('📋 SAMMANFATTNING:');
    console.log('─────────────────────────────────────────');
    if (finalShipment.status === expectedStatus) {
      console.log('✅ Synkronisering fungerar korrekt!');
      console.log(`   Shipment status (${finalShipment.status}) matchar tracking (transport = ${updatedTracking.transport})`);
    } else {
      console.log('⚠️  Synkronisering behöver köras manuellt');
      console.log(`   Shipment status: ${finalShipment.status}`);
      console.log(`   Förväntad status: ${expectedStatus}`);
      console.log('\n💡 Lösning: Besök /mina-sidor/logistik eller anropa API:et');
      console.log('   API kommer automatiskt synkronisera statusen');
    }

    console.log('\n🔄 Nästa steg:');
    console.log('1. Besök /mina-sidor/logistik för att se uppdaterad status');
    console.log('2. Klicka på "Uppdatera"-knappen för att tvinga synkronisering');
    console.log('3. Verifiera att statusen visas som "Under transport" med blå färg');

  } catch (error) {
    console.error('❌ Fel vid testning:', error);
  }
}

// Kör test
testDeliverySync()
  .then(() => {
    console.log('\n✅ Test slutfört');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test misslyckades:', error);
    process.exit(1);
  });
