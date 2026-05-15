/**
 * Demo av realtids tracking-uppdatering
 * 
 * Detta skript:
 * 1. Skapar en testorder
 * 2. Uppdaterar status steg för steg med fördröjning
 * 3. Visar hur tracking-sidan uppdateras automatiskt
 * 
 * Användning:
 * npx tsx scripts/demo-realtime-tracking.ts
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createTestOrder() {
  console.log('📦 Skapar testorder...');
  
  const response = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer_id: 'demo_customer_' + Date.now(),
      customer_email: 'demo@example.com',
      customer_name: 'Demo User',
      items: [
        {
          product_id: 'demo_product',
          product_name: 'Demo Product',
          quantity: 1,
          unit_price: 299,
          total_price: 299
        }
      ],
      total_amount: 299,
      currency: 'SEK',
      payment_method: 'card',
      payment_status: 'paid',
      shipping_address: {
        street: 'Demo Street 1',
        city: 'Stockholm',
        postal_code: '12345',
        country: 'Sweden'
      }
    })
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error('Kunde inte skapa testorder: ' + data.error);
  }

  return data.order.id;
}

async function updateStatus(orderId: string, status: string) {
  const response = await fetch(`${BASE_URL}/api/order-tracking/${orderId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error('Kunde inte uppdatera status: ' + data.error);
  }

  return data.tracking;
}

async function getTracking(orderId: string) {
  const response = await fetch(`${BASE_URL}/api/order-tracking/${orderId}`, {
    cache: 'no-store',
    headers: { 'Cache-Control': 'no-cache' }
  });

  const data = await response.json();
  return data.tracking;
}

function displayStatus(tracking: any, step: number) {
  const statuses = [
    { name: 'Bekräftad', key: 'confirmed', dateKey: 'confirmed_date' },
    { name: 'Packas', key: 'packing', dateKey: 'packing_date' },
    { name: 'Transport', key: 'transport', dateKey: 'transport_date' },
    { name: 'Levererad', key: 'delivered', dateKey: 'delivered_date' }
  ];

  console.log('\n📊 Aktuell Status:');
  console.log('─────────────────────────────────────');
  
  statuses.forEach((status, index) => {
    const isActive = tracking[status.key] === 1;
    const icon = isActive ? '✅' : '⭕';
    const date = tracking[status.dateKey] 
      ? new Date(tracking[status.dateKey]).toLocaleTimeString('sv-SE')
      : '';
    
    console.log(`${icon} ${index + 1}. ${status.name} ${date ? `(${date})` : ''}`);
  });
  
  console.log('─────────────────────────────────────');
  
  const progress = (step / 4) * 100;
  const progressBar = '█'.repeat(Math.floor(progress / 5)) + '░'.repeat(20 - Math.floor(progress / 5));
  console.log(`Progress: [${progressBar}] ${progress.toFixed(0)}%`);
}

async function demo() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('     DEMO: REALTIDS TRACKING-UPPDATERING              ');
  console.log('═══════════════════════════════════════════════════════\n');

  try {
    // Steg 1: Skapa order
    const orderId = await createTestOrder();
    console.log(`✅ Testorder skapad: ${orderId}\n`);
    
    const trackingUrl = `${BASE_URL}/spara-order/${orderId}`;
    console.log('🔗 Öppna denna länk i din webbläsare för att se realtidsuppdateringen:');
    console.log(`   ${trackingUrl}\n`);
    
    console.log('💡 Tracking-sidan uppdateras automatiskt var 5:e sekund');
    console.log('   Du kommer att se statusändringarna i realtid!\n');
    
    console.log('⏳ Väntar 10 sekunder så du hinner öppna länken...');
    await sleep(10000);

    // Steg 2: Confirmed (redan satt vid skapande)
    console.log('\n📍 Steg 1/4: Order Bekräftad');
    let tracking = await getTracking(orderId);
    displayStatus(tracking, 1);
    console.log('\n⏳ Väntar 8 sekunder...');
    await sleep(8000);

    // Steg 3: Packing
    console.log('\n📍 Steg 2/4: Uppdaterar till "Packas"...');
    tracking = await updateStatus(orderId, 'packing');
    displayStatus(tracking, 2);
    console.log('\n💡 Kolla tracking-sidan - den borde uppdateras inom 5 sekunder!');
    console.log('⏳ Väntar 8 sekunder...');
    await sleep(8000);

    // Steg 4: Transport
    console.log('\n📍 Steg 3/4: Uppdaterar till "Transport"...');
    tracking = await updateStatus(orderId, 'transport');
    displayStatus(tracking, 3);
    console.log('\n💡 Kolla tracking-sidan - den borde uppdateras inom 5 sekunder!');
    console.log('⏳ Väntar 8 sekunder...');
    await sleep(8000);

    // Steg 5: Delivered
    console.log('\n📍 Steg 4/4: Uppdaterar till "Levererad"...');
    tracking = await updateStatus(orderId, 'delivered');
    displayStatus(tracking, 4);
    console.log('\n💡 Kolla tracking-sidan - den borde uppdateras inom 5 sekunder!');
    console.log('⏳ Väntar 5 sekunder...');
    await sleep(5000);

    // Slutstatus
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('                    DEMO SLUTFÖRD                      ');
    console.log('═══════════════════════════════════════════════════════\n');
    
    console.log('✅ Alla statusändringar genomförda!');
    console.log('✅ Tracking-sidan uppdaterades automatiskt var 5:e sekund');
    console.log('✅ Ingen manuell siduppdatering behövdes\n');
    
    console.log('📊 Slutlig Status:');
    tracking = await getTracking(orderId);
    displayStatus(tracking, 4);
    
    console.log('\n🔗 Tracking-sida:');
    console.log(`   ${trackingUrl}\n`);
    
    console.log('💡 Funktioner som demonstrerades:');
    console.log('   ✓ Automatisk uppdatering var 5:e sekund');
    console.log('   ✓ Realtids statusändringar från databas');
    console.log('   ✓ Visuell feedback med "Status uppdaterad" badge');
    console.log('   ✓ Live-indikator som visar aktiv uppdatering');
    console.log('   ✓ Steg-för-steg progression utan att hoppa över steg');
    console.log('   ✓ Tidsstämplar för varje steg\n');

  } catch (error) {
    console.error('\n❌ Fel under demo:', error);
    process.exit(1);
  }
}

// Huvudfunktion
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log('📦 Demo: Realtids Tracking-uppdatering\n');
    console.log('Beskrivning:');
    console.log('  Detta skript demonstrerar hur tracking-sidan uppdateras');
    console.log('  automatiskt i realtid när orderstatus ändras i databasen.\n');
    console.log('Användning:');
    console.log('  npx tsx scripts/demo-realtime-tracking.ts\n');
    console.log('Vad händer:');
    console.log('  1. En testorder skapas');
    console.log('  2. Du får en länk till tracking-sidan');
    console.log('  3. Status uppdateras steg för steg med 8 sekunders mellanrum');
    console.log('  4. Tracking-sidan uppdateras automatiskt var 5:e sekund');
    console.log('  5. Du ser statusändringarna i realtid utan att ladda om sidan\n');
    console.log('Tips:');
    console.log('  - Öppna tracking-länken i din webbläsare innan demon startar');
    console.log('  - Håll webbläsarfönstret synligt för att se uppdateringarna');
    console.log('  - Observera "Status uppdaterad" badge och live-indikatorn\n');
    process.exit(0);
  }

  await demo();
}

main().catch(console.error);
