/**
 * Script för att uppdatera order tracking status direkt i databasen
 * 
 * Användning:
 * npx tsx scripts/update-tracking.ts <order_id> <status> [date]
 * 
 * Status kan vara: confirmed, packing, transport, delivered
 * 
 * Exempel:
 * npx tsx scripts/update-tracking.ts order_123 confirmed
 * npx tsx scripts/update-tracking.ts order_123 packing "2024-01-15 10:30:00"
 * npx tsx scripts/update-tracking.ts order_123 transport
 * npx tsx scripts/update-tracking.ts order_123 delivered
 */

import client from '../lib/db';

const validStatuses = ['confirmed', 'packing', 'transport', 'delivered'];

async function updateTracking(orderId: string, status: string, customDate?: string) {
  try {
    // Validera status
    if (!validStatuses.includes(status)) {
      console.error(`❌ Ogiltig status: ${status}`);
      console.log(`Giltiga statusar: ${validStatuses.join(', ')}`);
      process.exit(1);
    }

    // Använd angivet datum eller nuvarande tid
    const date = customDate || new Date().toISOString();

    console.log(`\n🔄 Uppdaterar tracking för order: ${orderId}`);
    console.log(`📊 Status: ${status}`);
    console.log(`📅 Datum: ${date}\n`);

    // Kontrollera om tracking finns
    const checkResponse = await client.execute({
      sql: 'SELECT * FROM order_tracking WHERE order_id = ?',
      args: [orderId]
    });

    if (checkResponse.rows.length === 0) {
      console.log('⚠️  Ingen tracking hittades, skapar ny...');
      
      // Skapa ny tracking
      const trackingId = `track_${orderId}_${Date.now()}`;
      await client.execute({
        sql: `
          INSERT INTO order_tracking 
          (id, order_id, ${status}, ${status}_date, created_at, updated_at)
          VALUES (?, ?, 1, ?, ?, ?)
        `,
        args: [trackingId, orderId, date, date, date]
      });
      
      console.log('✅ Ny tracking skapad!');
    } else {
      // Uppdatera befintlig tracking
      // Sätt alla tidigare statusar till 1 också
      const updates: string[] = [];
      const args: any[] = [];
      
      const statusOrder = ['confirmed', 'packing', 'transport', 'delivered'];
      const currentIndex = statusOrder.indexOf(status);
      
      // Sätt alla statusar upp till och med den nuvarande
      for (let i = 0; i <= currentIndex; i++) {
        const s = statusOrder[i];
        updates.push(`${s} = ?`);
        args.push(1);
        
        // Sätt datum om det inte redan finns
        updates.push(`${s}_date = COALESCE(${s}_date, ?)`);
        args.push(i === currentIndex ? date : new Date().toISOString());
      }
      
      updates.push('updated_at = ?');
      args.push(new Date().toISOString());
      args.push(orderId);
      
      await client.execute({
        sql: `UPDATE order_tracking SET ${updates.join(', ')} WHERE order_id = ?`,
        args
      });
      
      console.log('✅ Tracking uppdaterad!');
    }

    // Visa uppdaterad tracking
    const result = await client.execute({
      sql: 'SELECT * FROM order_tracking WHERE order_id = ?',
      args: [orderId]
    });

    if (result.rows.length > 0) {
      const tracking = result.rows[0];
      console.log('\n📦 Aktuell tracking-status:');
      console.log('─────────────────────────────────────');
      console.log(`✓ Bekräftad:     ${tracking.confirmed ? '✅' : '⬜'} ${tracking.confirmed_date || ''}`);
      console.log(`✓ Packas:        ${tracking.packing ? '✅' : '⬜'} ${tracking.packing_date || ''}`);
      console.log(`✓ Transport:     ${tracking.transport ? '✅' : '⬜'} ${tracking.transport_date || ''}`);
      console.log(`✓ Levererad:     ${tracking.delivered ? '✅' : '⬜'} ${tracking.delivered_date || ''}`);
      console.log('─────────────────────────────────────\n');
    }

    // Uppdatera också order status
    let orderStatus = 'pending';
    if (status === 'delivered') orderStatus = 'delivered';
    else if (status === 'transport') orderStatus = 'shipped';
    else if (status === 'packing') orderStatus = 'processing';
    
    await client.execute({
      sql: 'UPDATE orders SET status = ?, updated_at = ? WHERE id = ?',
      args: [orderStatus, new Date().toISOString(), orderId]
    });
    
    console.log(`✅ Order status uppdaterad till: ${orderStatus}\n`);

  } catch (error) {
    console.error('❌ Fel vid uppdatering:', error);
    process.exit(1);
  }
}

// Huvudfunktion
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log(`
📦 Order Tracking Uppdaterare
════════════════════════════════════════════════════════════

Användning:
  npx tsx scripts/update-tracking.ts <order_id> <status> [date]

Statusar:
  confirmed  - Order bekräftad
  packing    - Packas
  transport  - Under transport
  delivered  - Levererad

Exempel:
  npx tsx scripts/update-tracking.ts order_123 confirmed
  npx tsx scripts/update-tracking.ts order_123 packing "2024-01-15 10:30:00"
  npx tsx scripts/update-tracking.ts order_123 transport
  npx tsx scripts/update-tracking.ts order_123 delivered

Tips:
  - Statusar sätts automatiskt i ordning (confirmed → packing → transport → delivered)
  - Om inget datum anges används nuvarande tid
  - Order status uppdateras automatiskt baserat på tracking
    `);
    process.exit(1);
  }

  const [orderId, status, customDate] = args;
  await updateTracking(orderId, status, customDate);
}

main();
