/**
 * Skript för att skapa recensioner-tabellen i databasen.
 * Kör med: npx ts-node scripts/create-recensioner-table.ts
 */
import client from '../lib/db';

async function createRecensionerTable() {
  console.log('🔧 Skapar recensioner-tabellen...');

  try {
    // Skapa tabellen
    await client.execute(`
      CREATE TABLE IF NOT EXISTS recensioner (
        id TEXT PRIMARY KEY,
        produkt_id TEXT NOT NULL,
        kund_id TEXT,
        anvandare_namn TEXT NOT NULL,
        betyg INTEGER NOT NULL CHECK(betyg BETWEEN 1 AND 5),
        titel TEXT,
        kommentar TEXT NOT NULL,
        verifierad_kop INTEGER DEFAULT 0,
        status TEXT DEFAULT 'publicerad' CHECK(status IN ('publicerad', 'granskas', 'dold')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (kund_id) REFERENCES customers(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Tabell skapad (eller existerade redan)');

    // Skapa index
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_recensioner_produkt_id ON recensioner(produkt_id)`);
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_recensioner_kund_id ON recensioner(kund_id)`);
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_recensioner_anvandare_namn ON recensioner(anvandare_namn)`);
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_recensioner_betyg ON recensioner(betyg)`);
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_recensioner_status ON recensioner(status)`);
    console.log('✅ Index skapade');

    // Verifiera tabellen
    const result = await client.execute(`SELECT name FROM sqlite_master WHERE type='table' AND name='recensioner'`);
    if (result.rows.length > 0) {
      console.log('✅ Verifierat: recensioner-tabellen finns i databasen');
    }

    // Visa tabellstruktur
    const columns = await client.execute(`PRAGMA table_info(recensioner)`);
    console.log('\n📋 Tabellstruktur:');
    columns.rows.forEach(col => {
      console.log(`  - ${col.name} (${col.type})${col.notnull ? ' NOT NULL' : ''}${col.dflt_value ? ` DEFAULT ${col.dflt_value}` : ''}`);
    });

    console.log('\n✅ Klart! Recensioner-tabellen är redo.');
    console.log('\n💡 Du kan nu radera recensioner via SQL:');
    console.log("   DELETE FROM recensioner WHERE anvandare_namn = 'Lokana';");

  } catch (error) {
    console.error('❌ Fel:', error);
    process.exit(1);
  }

  process.exit(0);
}

createRecensionerTable();
