import client from '@/lib/db';

async function migrateOrderStatus() {
  console.log('🔄 Startar migrering av orderstatus...\n');

  try {
    // Visa nuvarande status innan migrering
    console.log('📊 Status FÖRE migrering:');
    console.log('─────────────────────────────────────');
    
    const ordersBefore = await client.execute({
      sql: 'SELECT status, COUNT(*) as count FROM orders GROUP BY status',
      args: []
    });
    
    console.log('\nOrders:');
    ordersBefore.rows.forEach((row: any) => {
      console.log(`  ${row.status}: ${row.count}`);
    });

    const shipmentsBefore = await client.execute({
      sql: 'SELECT status, COUNT(*) as count FROM shipments GROUP BY status',
      args: []
    });
    
    console.log('\nShipments:');
    if (shipmentsBefore.rows.length > 0) {
      shipmentsBefore.rows.forEach((row: any) => {
        console.log(`  ${row.status}: ${row.count}`);
      });
    } else {
      console.log('  (inga shipments)');
    }

    console.log('\n🔄 Utför migrering...\n');
    console.log('⚠️  SQLite stödjer inte ALTER TABLE för att ändra CHECK constraints.');
    console.log('    Vi måste skapa nya tabeller med korrekta constraints.\n');

    // Steg 1: Skapa temporära tabeller med nya constraints
    console.log('📝 Skapar temporära tabeller...');
    
    await client.execute({
      sql: `
        CREATE TABLE IF NOT EXISTS orders_new (
          id TEXT PRIMARY KEY,
          customer_id TEXT NOT NULL,
          order_number TEXT UNIQUE NOT NULL,
          status TEXT NOT NULL DEFAULT 'confirmed' CHECK(status IN ('confirmed', 'packing', 'transport', 'delivered')),
          total_amount REAL NOT NULL,
          currency TEXT DEFAULT 'SEK',
          payment_method TEXT,
          payment_status TEXT DEFAULT 'pending' CHECK(payment_status IN ('pending', 'paid', 'failed', 'refunded')),
          payment_intent_id TEXT,
          shipping_address_id TEXT,
          billing_address_id TEXT,
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `,
      args: []
    });
    console.log('✅ orders_new skapad');

    await client.execute({
      sql: `
        CREATE TABLE IF NOT EXISTS shipments_new (
          id TEXT PRIMARY KEY,
          order_id TEXT NOT NULL,
          tracking_number TEXT UNIQUE,
          carrier TEXT NOT NULL CHECK(carrier IN ('PostNord', 'DHL', 'DB Schenker', 'Bring', 'Other')),
          status TEXT NOT NULL DEFAULT 'confirmed' CHECK(status IN ('confirmed', 'packing', 'transport', 'delivered')),
          shipped_date DATETIME,
          estimated_delivery_date DATETIME,
          actual_delivery_date DATETIME,
          shipping_address TEXT NOT NULL,
          weight_kg REAL,
          dimensions TEXT,
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `,
      args: []
    });
    console.log('✅ shipments_new skapad');

    // Steg 2: Kopiera data med statusmappning för orders
    console.log('\n📋 Kopierar orders med statusmappning...');
    await client.execute({
      sql: `
        INSERT INTO orders_new 
        SELECT 
          id,
          customer_id,
          order_number,
          CASE 
            WHEN status = 'pending' THEN 'confirmed'
            WHEN status = 'processing' THEN 'packing'
            WHEN status = 'shipped' THEN 'transport'
            WHEN status = 'delivered' THEN 'delivered'
            WHEN status = 'cancelled' THEN 'confirmed'
            WHEN status = 'returned' THEN 'confirmed'
            ELSE 'confirmed'
          END as status,
          total_amount,
          currency,
          payment_method,
          payment_status,
          payment_intent_id,
          shipping_address_id,
          billing_address_id,
          notes,
          created_at,
          updated_at
        FROM orders
      `,
      args: []
    });
    console.log('✅ Orders kopierade');

    // Steg 3: Kopiera data med statusmappning för shipments (om det finns några)
    const shipmentsCount = await client.execute({
      sql: 'SELECT COUNT(*) as count FROM shipments',
      args: []
    });

    if (shipmentsCount.rows[0].count > 0) {
      console.log('\n📋 Kopierar shipments med statusmappning...');
      await client.execute({
        sql: `
          INSERT INTO shipments_new 
          SELECT 
            id,
            order_id,
            tracking_number,
            carrier,
            CASE 
              WHEN status = 'pending' THEN 'confirmed'
              WHEN status = 'picked_up' THEN 'packing'
              WHEN status = 'in_transit' THEN 'transport'
              WHEN status = 'out_for_delivery' THEN 'transport'
              WHEN status = 'delivered' THEN 'delivered'
              WHEN status = 'failed' THEN 'confirmed'
              WHEN status = 'returned' THEN 'confirmed'
              ELSE 'confirmed'
            END as status,
            shipped_date,
            estimated_delivery_date,
            actual_delivery_date,
            shipping_address,
            weight_kg,
            dimensions,
            notes,
            created_at,
            updated_at
          FROM shipments
        `,
        args: []
      });
      console.log('✅ Shipments kopierade');
    }

    // Steg 4: Ta bort gamla tabeller
    console.log('\n🗑️  Tar bort gamla tabeller...');
    await client.execute({
      sql: 'DROP TABLE orders',
      args: []
    });
    console.log('✅ Gamla orders borttagen');

    await client.execute({
      sql: 'DROP TABLE IF EXISTS shipments',
      args: []
    });
    console.log('✅ Gamla shipments borttagen');

    // Steg 5: Byt namn på nya tabeller
    console.log('\n🔄 Byter namn på nya tabeller...');
    await client.execute({
      sql: 'ALTER TABLE orders_new RENAME TO orders',
      args: []
    });
    console.log('✅ orders_new → orders');

    await client.execute({
      sql: 'ALTER TABLE shipments_new RENAME TO shipments',
      args: []
    });
    console.log('✅ shipments_new → shipments');

    // Steg 6: Återskapa index
    console.log('\n📑 Återskapar index...');
    await client.execute({
      sql: 'CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id)',
      args: []
    });
    await client.execute({
      sql: 'CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)',
      args: []
    });
    await client.execute({
      sql: 'CREATE INDEX IF NOT EXISTS idx_shipments_order_id ON shipments(order_id)',
      args: []
    });
    await client.execute({
      sql: 'CREATE INDEX IF NOT EXISTS idx_shipments_tracking ON shipments(tracking_number)',
      args: []
    });
    console.log('✅ Index återskapade');

    // Visa status efter migrering
    console.log('\n📊 Status EFTER migrering:');
    console.log('─────────────────────────────────────');
    
    const ordersAfter = await client.execute({
      sql: 'SELECT status, COUNT(*) as count FROM orders GROUP BY status',
      args: []
    });
    
    console.log('\nOrders:');
    ordersAfter.rows.forEach((row: any) => {
      console.log(`  ${row.status}: ${row.count}`);
    });

    const shipmentsAfter = await client.execute({
      sql: 'SELECT status, COUNT(*) as count FROM shipments GROUP BY status',
      args: []
    });
    
    console.log('\nShipments:');
    if (shipmentsAfter.rows.length > 0) {
      shipmentsAfter.rows.forEach((row: any) => {
        console.log(`  ${row.status}: ${row.count}`);
      });
    } else {
      console.log('  (inga shipments)');
    }

    console.log('\n✅ Migrering slutförd!\n');
    console.log('Nya statusvärden:');
    console.log('  • confirmed - Beställning bekräftad');
    console.log('  • packing - Packas');
    console.log('  • transport - Under transport');
    console.log('  • delivered - Levererad');

  } catch (error) {
    console.error('❌ Fel vid migrering:', error);
    throw error;
  }
}

// Kör migrering
migrateOrderStatus()
  .then(() => {
    console.log('\n✅ Klart!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Misslyckades:', error);
    process.exit(1);
  });
