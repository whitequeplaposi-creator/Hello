import { createClient } from '@libsql/client';

const client = createClient({
  url: 'libsql://dostar-dostar.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzgxNDQyMjYsImlkIjoiMDE5Y2QzN2QtYzYwMS03YWVjLTljMjctMzY0MmE2ZjA0YjIyIiwicmlkIjoiNzg3ZmQwMjYtZDk5OS00ZTM3LThiZjctODBlYmU2NGViYzRjIn0.LE3OXGwCSgOuX_2tgOguKI1rWjz6K_Pa_7M1oDkkHVgg7jQrXS-RtN19OcNaTFROJZmXHBbaOaxfAReOmjWuCg'
});

async function migrateReviews() {
  console.log('🚀 Skapar recensioner-tabell...');

  try {
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
    console.log('✅ Tabell recensioner skapad');

    await client.execute(`CREATE INDEX IF NOT EXISTS idx_recensioner_produkt_id ON recensioner(produkt_id)`);
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_recensioner_kund_id ON recensioner(kund_id)`);
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_recensioner_anvandare_namn ON recensioner(anvandare_namn)`);
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_recensioner_betyg ON recensioner(betyg)`);
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_recensioner_status ON recensioner(status)`);
    console.log('✅ Index skapade');

    // Verifiera att tabellen finns
    const result = await client.execute(`SELECT name FROM sqlite_master WHERE type='table' AND name='recensioner'`);
    if (result.rows.length > 0) {
      console.log('\n✅ Migrering slutförd! Tabellen recensioner finns i databasen.');
      console.log('\n📋 Kolumner:');
      const cols = await client.execute(`PRAGMA table_info(recensioner)`);
      cols.rows.forEach(row => {
        console.log(`   - ${row.name} (${row.type})`);
      });
      console.log('\n💡 SQL-kommandon för att hantera recensioner:');
      console.log("   Radera alla recensioner av en användare:");
      console.log("   DELETE FROM recensioner WHERE anvandare_namn = 'Lokana';");
      console.log("\n   Radera en specifik recension:");
      console.log("   DELETE FROM recensioner WHERE id = 'rev_123abc';");
      console.log("\n   Visa alla recensioner:");
      console.log("   SELECT * FROM recensioner ORDER BY created_at DESC;");
      console.log("\n   Dölj en recension:");
      console.log("   UPDATE recensioner SET status = 'dold' WHERE anvandare_namn = 'Lokana';");
    }
  } catch (error: any) {
    console.error('❌ Fel vid migrering:', error.message || error);
    process.exit(1);
  }
}

migrateReviews();
