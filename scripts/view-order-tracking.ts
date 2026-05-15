/**
 * Visa orderstatus och tracking-information
 * 
 * Användning:
 * npx tsx scripts/view-order-tracking.ts [ORDER_ID]
 * 
 * Exempel:
 * npx tsx scripts/view-order-tracking.ts order_123
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function viewOrderTracking(orderId: string) {
  console.log('📦 Hämtar tracking-information...\n');

  try {
    const response = await fetch(`${BASE_URL}/api/order-tracking/${orderId}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      }
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error('❌ Kunde inte hämta tracking:', data.error || 'Order hittades inte');
      process.exit(1);
    }

    const tracking = data.tracking;

    // Beräkna aktuell status
    let currentStatus = 'confirmed';
    let currentStep = 1;
    if (tracking.delivered) {
      currentStatus = 'delivered';
      currentStep = 4;
    } else if (tracking.transport) {
      currentStatus = 'transport';
      currentStep = 3;
    } else if (tracking.packing) {
      currentStatus = 'packing';
      currentStep = 2;
    }

    const statusNames: Record<string, string> = {
      confirmed: 'Bekräftad',
      packing: 'Packas',
      transport: 'Under Transport',
      delivered: 'Levererad'
    };

    console.log('═══════════════════════════════════════════════════════');
    console.log('                  ORDER TRACKING                       ');
    console.log('═══════════════════════════════════════════════════════\n');

    console.log('📋 Order Information:');
    console.log(`   Order ID:       ${tracking.order_id}`);
    console.log(`   Order Number:   ${tracking.order_number || 'N/A'}`);
    console.log(`   Skapad:         ${new Date(tracking.created_at).toLocaleString('sv-SE')}`);
    console.log(`   Uppdaterad:     ${new Date(tracking.updated_at).toLocaleString('sv-SE')}`);
    console.log('');

    console.log(`🎯 Aktuell Status: ${statusNames[currentStatus]} (Steg ${currentStep}/4)`);
    console.log('');

    console.log('📊 Status Timeline:');
    console.log('───────────────────────────────────────────────────────');

    // Steg 1: Confirmed
    const confirmedIcon = tracking.confirmed ? '✅' : '⭕';
    const confirmedDate = tracking.confirmed_date 
      ? new Date(tracking.confirmed_date).toLocaleString('sv-SE')
      : 'Väntar...';
    console.log(`${confirmedIcon} 1. Bekräftad`);
    console.log(`   ${tracking.confirmed ? confirmedDate : 'Inte bekräftad än'}`);
    console.log('');

    // Steg 2: Packing
    const packingIcon = tracking.packing ? '✅' : tracking.confirmed ? '⏳' : '⭕';
    const packingDate = tracking.packing_date 
      ? new Date(tracking.packing_date).toLocaleString('sv-SE')
      : 'Väntar...';
    console.log(`${packingIcon} 2. Packas`);
    console.log(`   ${tracking.packing ? packingDate : tracking.confirmed ? 'Väntar på packning' : 'Inte tillgänglig än'}`);
    console.log('');

    // Steg 3: Transport
    const transportIcon = tracking.transport ? '✅' : tracking.packing ? '⏳' : '⭕';
    const transportDate = tracking.transport_date 
      ? new Date(tracking.transport_date).toLocaleString('sv-SE')
      : 'Väntar...';
    console.log(`${transportIcon} 3. Under Transport`);
    console.log(`   ${tracking.transport ? transportDate : tracking.packing ? 'Väntar på transport' : 'Inte tillgänglig än'}`);
    console.log('');

    // Steg 4: Delivered
    const deliveredIcon = tracking.delivered ? '✅' : tracking.transport ? '⏳' : '⭕';
    const deliveredDate = tracking.delivered_date 
      ? new Date(tracking.delivered_date).toLocaleString('sv-SE')
      : 'Väntar...';
    console.log(`${deliveredIcon} 4. Levererad`);
    console.log(`   ${tracking.delivered ? deliveredDate : tracking.transport ? 'Väntar på leverans' : 'Inte tillgänglig än'}`);
    console.log('');

    console.log('───────────────────────────────────────────────────────');
    console.log('');

    // Progress bar
    const progress = (currentStep / 4) * 100;
    const progressBar = '█'.repeat(Math.floor(progress / 5)) + '░'.repeat(20 - Math.floor(progress / 5));
    console.log(`📈 Progress: [${progressBar}] ${progress.toFixed(0)}%`);
    console.log('');

    console.log('🔗 Länkar:');
    console.log(`   Tracking-sida: ${BASE_URL}/spara-order/${orderId}`);
    console.log(`   Beställningar: ${BASE_URL}/mina-sidor/bestallningar`);
    console.log('');

    console.log('💡 Tips:');
    console.log('   - Tracking-sidan uppdateras automatiskt var 5:e sekund');
    console.log('   - Använd update-order-status.ts för att ändra status');
    console.log('   - Status följer steg-för-steg ordning');
    console.log('');

    if (tracking.products) {
      console.log('📦 Produkter:');
      console.log(`   ${tracking.products}`);
      console.log('');
    }

    console.log('═══════════════════════════════════════════════════════');

  } catch (error) {
    console.error('❌ Fel vid hämtning:', error);
    process.exit(1);
  }
}

// Huvudfunktion
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log('📦 Visa Order Tracking\n');
    console.log('Användning:');
    console.log('  npx tsx scripts/view-order-tracking.ts [ORDER_ID]\n');
    console.log('Exempel:');
    console.log('  npx tsx scripts/view-order-tracking.ts order_abc123\n');
    console.log('Beskrivning:');
    console.log('  Visar detaljerad tracking-information för en order');
    console.log('  inklusive alla steg och tidsstämplar.\n');
    process.exit(0);
  }

  const orderId = args[0];
  await viewOrderTracking(orderId);
}

main().catch(console.error);
