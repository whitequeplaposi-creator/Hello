import client from '../lib/db';

async function checkOrders() {
  console.log('\n🔍 Kontrollerar beställningar i databasen...\n');

  try {
    // Hämta alla kunder
    const customersResult = await client.execute('SELECT * FROM customers ORDER BY created_at DESC LIMIT 5');
    console.log('👥 Senaste kunderna:');
    if (customersResult.rows.length === 0) {
      console.log('   Inga kunder hittades');
    } else {
      customersResult.rows.forEach((customer: any) => {
        console.log(`   - ${customer.name} (${customer.email}) - ID: ${customer.id}`);
      });
    }

    // Hämta alla beställningar
    const ordersResult = await client.execute('SELECT * FROM orders ORDER BY created_at DESC LIMIT 10');
    console.log('\n📦 Senaste beställningarna:');
    if (ordersResult.rows.length === 0) {
      console.log('   ❌ Inga beställningar hittades i databasen');
      console.log('\n💡 Detta betyder att:');
      console.log('   1. Betalningen går inte igenom korrekt');
      console.log('   2. Order API:et får ett fel');
      console.log('   3. Ordern skapas men sparas inte i databasen');
    } else {
      ordersResult.rows.forEach((order: any) => {
        console.log(`   - Order ${order.order_number}: ${order.total_amount} ${order.currency} - Status: ${order.status}`);
        console.log(`     Kund ID: ${order.customer_id}`);
        console.log(`     Skapad: ${order.created_at}`);
      });
    }

    // Hämta alla order items
    const itemsResult = await client.execute('SELECT * FROM order_items ORDER BY created_at DESC LIMIT 10');
    console.log('\n📋 Senaste produkterna i beställningar:');
    if (itemsResult.rows.length === 0) {
      console.log('   Inga produkter hittades');
    } else {
      itemsResult.rows.forEach((item: any) => {
        console.log(`   - ${item.product_name} x${item.quantity} (${item.unit_price} kr) - Order: ${item.order_id}`);
      });
    }

    // Hämta alla leveranser
    const shipmentsResult = await client.execute('SELECT * FROM shipments ORDER BY created_at DESC LIMIT 5');
    console.log('\n🚚 Senaste leveranserna:');
    if (shipmentsResult.rows.length === 0) {
      console.log('   Inga leveranser hittades');
    } else {
      shipmentsResult.rows.forEach((shipment: any) => {
        console.log(`   - ${shipment.tracking_number} (${shipment.carrier}) - Status: ${shipment.status}`);
        console.log(`     Order ID: ${shipment.order_id}`);
      });
    }

    console.log('\n✅ Databaskontrollen slutförd');

  } catch (error) {
    console.error('❌ Fel vid databasförfrågan:', error);
  }
}

checkOrders();
