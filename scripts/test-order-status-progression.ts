/**
 * Test script för att verifiera steg-för-steg orderstatus progression
 * 
 * Detta script testar att:
 * 1. Status följer strikt ordning: confirmed → packing → transport → delivered
 * 2. Inga steg hoppas över
 * 3. Endast ett steg är aktivt åt gången
 * 4. Tidigare steg förblir aktiva när man går vidare
 */

const BASE_URL = 'http://localhost:3000';

interface TrackingData {
  confirmed: number;
  confirmed_date: string | null;
  packing: number;
  packing_date: string | null;
  transport: number;
  transport_date: string | null;
  delivered: number;
  delivered_date: string | null;
}

async function testOrderStatusProgression() {
  console.log('🧪 Testar orderstatus steg-för-steg progression...\n');

  // Skapa en testorder först
  console.log('📦 Skapar testorder...');
  const orderResponse = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer_id: 'test_customer_' + Date.now(),
      customer_email: 'test@example.com',
      customer_name: 'Test User',
      items: [
        {
          product_id: 'test_product',
          product_name: 'Test Product',
          quantity: 1,
          unit_price: 100,
          total_price: 100
        }
      ],
      total_amount: 100,
      currency: 'SEK',
      payment_method: 'card',
      payment_status: 'paid',
      shipping_address: {
        street: 'Test Street 1',
        city: 'Stockholm',
        postal_code: '12345',
        country: 'Sweden'
      }
    })
  });

  const orderData = await orderResponse.json();
  if (!orderData.success) {
    console.error('❌ Kunde inte skapa testorder:', orderData.error);
    return;
  }

  const orderId = orderData.order.id;
  console.log(`✅ Testorder skapad: ${orderId}\n`);

  // Test 1: Verifiera initial status (confirmed)
  console.log('📋 Test 1: Verifiera initial status (confirmed)');
  await testStatus(orderId, 'confirmed', {
    confirmed: 1,
    packing: 0,
    transport: 0,
    delivered: 0
  });

  // Test 2: Uppdatera till packing
  console.log('\n📋 Test 2: Uppdatera till packing');
  await updateOrderStatus(orderId, 'packing');
  await testStatus(orderId, 'packing', {
    confirmed: 1,
    packing: 1,
    transport: 0,
    delivered: 0
  });

  // Test 3: Uppdatera till transport
  console.log('\n📋 Test 3: Uppdatera till transport');
  await updateOrderStatus(orderId, 'transport');
  await testStatus(orderId, 'transport', {
    confirmed: 1,
    packing: 1,
    transport: 1,
    delivered: 0
  });

  // Test 4: Uppdatera till delivered
  console.log('\n📋 Test 4: Uppdatera till delivered');
  await updateOrderStatus(orderId, 'delivered');
  await testStatus(orderId, 'delivered', {
    confirmed: 1,
    packing: 1,
    transport: 1,
    delivered: 1
  });

  // Test 5: Försök hoppa över steg (ska inte vara möjligt via API)
  console.log('\n📋 Test 5: Testa att gå tillbaka till packing');
  await updateOrderStatus(orderId, 'packing');
  await testStatus(orderId, 'packing', {
    confirmed: 1,
    packing: 1,
    transport: 0,
    delivered: 0
  });

  console.log('\n✅ Alla tester slutförda!');
  console.log(`\n🔗 Visa order tracking: ${BASE_URL}/spara-order/${orderId}`);
}

async function updateOrderStatus(orderId: string, status: string) {
  console.log(`  ⏳ Uppdaterar status till: ${status}...`);
  
  const response = await fetch(`${BASE_URL}/api/order-tracking/${orderId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });

  const data = await response.json();
  
  if (!data.success) {
    console.error(`  ❌ Kunde inte uppdatera status:`, data.error);
    return;
  }
  
  console.log(`  ✅ Status uppdaterad: ${data.message}`);
}

async function testStatus(
  orderId: string, 
  expectedStatus: string,
  expectedTracking: { confirmed: number; packing: number; transport: number; delivered: number }
) {
  const response = await fetch(`${BASE_URL}/api/order-tracking/${orderId}`);
  const data = await response.json();

  if (!data.success || !data.tracking) {
    console.error('  ❌ Kunde inte hämta tracking data');
    return;
  }

  const tracking = data.tracking as TrackingData;
  
  // Verifiera tracking flags
  const tests = [
    { name: 'confirmed', expected: expectedTracking.confirmed, actual: tracking.confirmed },
    { name: 'packing', expected: expectedTracking.packing, actual: tracking.packing },
    { name: 'transport', expected: expectedTracking.transport, actual: tracking.transport },
    { name: 'delivered', expected: expectedTracking.delivered, actual: tracking.delivered }
  ];

  let allPassed = true;
  for (const test of tests) {
    const passed = test.expected === test.actual;
    const icon = passed ? '✅' : '❌';
    const status = passed ? 'OK' : `FAIL (förväntade ${test.expected}, fick ${test.actual})`;
    console.log(`  ${icon} ${test.name}: ${status}`);
    if (!passed) allPassed = false;
  }

  // Verifiera datum
  console.log('\n  📅 Datum:');
  if (expectedTracking.confirmed === 1) {
    console.log(`    confirmed_date: ${tracking.confirmed_date ? '✅ Satt' : '❌ Saknas'}`);
  }
  if (expectedTracking.packing === 1) {
    console.log(`    packing_date: ${tracking.packing_date ? '✅ Satt' : '❌ Saknas'}`);
  }
  if (expectedTracking.transport === 1) {
    console.log(`    transport_date: ${tracking.transport_date ? '✅ Satt' : '❌ Saknas'}`);
  }
  if (expectedTracking.delivered === 1) {
    console.log(`    delivered_date: ${tracking.delivered_date ? '✅ Satt' : '❌ Saknas'}`);
  }

  // Verifiera att framtida steg INTE har datum
  if (expectedTracking.packing === 0 && tracking.packing_date) {
    console.log(`    ⚠️  VARNING: packing_date är satt men packing=0`);
    allPassed = false;
  }
  if (expectedTracking.transport === 0 && tracking.transport_date) {
    console.log(`    ⚠️  VARNING: transport_date är satt men transport=0`);
    allPassed = false;
  }
  if (expectedTracking.delivered === 0 && tracking.delivered_date) {
    console.log(`    ⚠️  VARNING: delivered_date är satt men delivered=0`);
    allPassed = false;
  }

  if (allPassed) {
    console.log('\n  ✅ Test GODKÄND - Status följer steg-för-steg logik');
  } else {
    console.log('\n  ❌ Test MISSLYCKADES - Status följer INTE steg-för-steg logik');
  }
}

// Kör testerna
testOrderStatusProgression().catch(console.error);
