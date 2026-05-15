/**
 * Script för att visa order tracking status från databasen
 * 
 * Användning:
 * npx tsx scripts/view-tracking.ts [order_id]
 * 
 * Om inget order_id anges visas alla tracking-poster
 */

import client from '../lib/db';

async function viewTracking(orderId?: string) {
  try {
    let query = 'SELECT * FROM order_tracking';
    let args: any[] = [];
    
    if (orderId) {
      query += ' WHERE order_id = ?';
      args = [orderId];
      console.log(`\n🔍 Hämtar tracking för order: ${orderId}\n`);
    } else {
      query += ' ORDER BY created_at DESC LIMIT 20';
      console.log('\n📦 Visar senaste 20 tracking-poster\n');
    }

    const response = await client.execute({
      sql: query,
      args
    });

    if (response.rows.length === 0) {
      console.log('⚠️  Inga tracking-poster hittades\n');
      return;
    }

    console.log(`Hittade ${response.rows.length} tracking-post(er)\n`);
    console.log('═══════════════════════════════════════════════════════════════════════════════\n');

    for (const tracking of response.rows) {
      const getStatusIcon = (status: number) => status ? '✅' : '⬜';
      const formatDate = (date: string | null) => {
        if (!date) return '';
        try {
          return new Date(date).toLocaleString('sv-SE');
        } catch {
          return date;
        }
      };

      console.log(`📦 Order ID: ${tracking.order_id}`);
      if (tracking.order_number) {
        console.log(`   Order #: ${tracking.order_number}`);
      }
      console.log('   ───────────────────────────────────────────────────────────────────────');
      console.log(`   ${getStatusIcon(tracking.confirmed)} Bekräftad:   ${tracking.confirmed ? formatDate(tracking.confirmed_date) : 'Ej bekräftad'}`);
      console.log(`   ${getStatusIcon(tracking.packing)} Packas:      ${tracking.packing ? formatDate(tracking.packing_date) : 'Ej påbörjad'}`);
      console.log(`   ${getStatusIcon(tracking.transport)} Transport:   ${tracking.transport ? formatDate(tracking.transport_date) : 'Ej skickad'}`);
      console.log(`   ${getStatusIcon(tracking.delivered)} Levererad:   ${tracking.delivered ? formatDate(tracking.delivered_date) : 'Ej levererad'}`);
      console.log('   ───────────────────────────────────────────────────────────────────────');
      
      // Beräkna aktuell status
      let currentStatus = 'Väntar på bekräftelse';
      if (tracking.delivered) currentStatus = '🎉 Levererad';
      else if (tracking.transport) currentStatus = '🚚 Under transport';
      else if (tracking.packing) currentStatus = '📦 Packas';
      else if (tracking.confirmed) currentStatus = '✓ Bekräftad';
      
      console.log(`   Status: ${currentStatus}`);
      
      if (tracking.products) {
        console.log(`   Produkter: ${tracking.products}`);
      }
      
      console.log(`   Skapad: ${formatDate(tracking.created_at)}`);
      console.log(`   Uppdaterad: ${formatDate(tracking.updated_at)}`);
      console.log('\n═══════════════════════════════════════════════════════════════════════════════\n');
    }

    // Visa statistik om vi visar alla
    if (!orderId) {
      const stats = {
        total: response.rows.length,
        confirmed: response.rows.filter(t => t.confirmed).length,
        packing: response.rows.filter(t => t.packing).length,
        transport: response.rows.filter(t => t.transport).length,
        delivered: response.rows.filter(t => t.delivered).length,
      };

      console.log('📊 Statistik:');
      console.log(`   Totalt: ${stats.total} ordrar`);
      console.log(`   Bekräftade: ${stats.confirmed}`);
      console.log(`   Packas: ${stats.packing}`);
      console.log(`   Under transport: ${stats.transport}`);
      console.log(`   Levererade: ${stats.delivered}`);
      console.log('');
    }

  } catch (error) {
    console.error('❌ Fel vid hämtning:', error);
    process.exit(1);
  }
}

// Huvudfunktion
async function main() {
  const args = process.argv.slice(2);
  const orderId = args[0];

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
📦 Order Tracking Viewer
════════════════════════════════════════════════════════════

Användning:
  npx tsx scripts/view-tracking.ts [order_id]

Exempel:
  npx tsx scripts/view-tracking.ts                    # Visa alla tracking-poster
  npx tsx scripts/view-tracking.ts order_123          # Visa specifik order

Tracking-statusar:
  ✅ = Slutförd
  ⬜ = Ej slutförd

Statusordning:
  1. Bekräftad (confirmed)
  2. Packas (packing)
  3. Transport (transport)
  4. Levererad (delivered)
    `);
    process.exit(0);
  }

  await viewTracking(orderId);
}

main();
