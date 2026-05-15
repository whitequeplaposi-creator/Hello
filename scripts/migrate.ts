import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const client = createClient({
  url: 'libsql://dostar-dostar.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzgxNDQyMjYsImlkIjoiMDE5Y2QzN2QtYzYwMS03YWVjLTljMjctMzY0MmE2ZjA0YjIyIiwicmlkIjoiNzg3ZmQwMjYtZDk5OS00ZTM3LThiZjctODBlYmU2NGViYzRjIn0.LE3OXGwCSgOuX_2tgOguKI1rWjz6K_Pa_7M1oDkkHVgg7jQrXS-RtN19OcNaTFROJZmXHBbaOaxfAReOmjWuCg'
});

async function runMigration() {
  try {
    console.log('🚀 Startar migrering av kundtabeller...');
    
    // Läs SQL-filen
    const sqlPath = join(process.cwd(), 'lib', 'migrations', '001_create_customer_tables.sql');
    const sql = readFileSync(sqlPath, 'utf-8');
    
    // Ta bort kommentarer och dela upp på semikolon
    const cleanedSql = sql
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n');
    
    const statements = cleanedSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    // Separera CREATE TABLE och CREATE INDEX satser
    const createTableStatements = statements.filter(s => s.toUpperCase().startsWith('CREATE TABLE'));
    const createIndexStatements = statements.filter(s => s.toUpperCase().startsWith('CREATE INDEX'));
    
    console.log(`📝 Kör ${createTableStatements.length} CREATE TABLE satser...`);
    
    // Kör CREATE TABLE först
    for (let i = 0; i < createTableStatements.length; i++) {
      const statement = createTableStatements[i];
      const tableName = statement.match(/CREATE TABLE IF NOT EXISTS (\w+)/i)?.[1] || 'unknown';
      console.log(`   ${i + 1}/${createTableStatements.length}: Skapar tabell ${tableName}...`);
      
      try {
        await client.execute(statement);
        console.log(`   ✅ ${tableName} skapad`);
      } catch (error: any) {
        if (error.message && error.message.includes('already exists')) {
          console.log(`   ⚠️  ${tableName} finns redan`);
        } else {
          console.error(`   ❌ Fel vid skapande av ${tableName}:`, error.message);
          throw error;
        }
      }
    }
    
    console.log(`\n📝 Kör ${createIndexStatements.length} CREATE INDEX satser...`);
    
    // Kör CREATE INDEX efter
    for (let i = 0; i < createIndexStatements.length; i++) {
      const statement = createIndexStatements[i];
      const indexName = statement.match(/CREATE INDEX IF NOT EXISTS (\w+)/i)?.[1] || 'unknown';
      console.log(`   ${i + 1}/${createIndexStatements.length}: Skapar index ${indexName}...`);
      
      try {
        await client.execute(statement);
        console.log(`   ✅ ${indexName} skapad`);
      } catch (error: any) {
        if (error.message && error.message.includes('already exists')) {
          console.log(`   ⚠️  ${indexName} finns redan`);
        } else {
          console.error(`   ❌ Fel vid skapande av ${indexName}:`, error.message);
          throw error;
        }
      }
    }
    
    console.log('\n✅ Migrering slutförd!');
    console.log('\n📊 Skapade tabeller:');
    console.log('   - customers (kunddata)');
    console.log('   - customer_addresses (adresser)');
    console.log('   - customer_payment_methods (betalmetoder)');
    console.log('   - orders (beställningar)');
    console.log('   - order_items (orderrader)');
    console.log('   - shipments (leveranser)');
    console.log('   - shipment_events (spårningshistorik)');
    
  } catch (error) {
    console.error('❌ Fel vid migrering:', error);
    process.exit(1);
  }
}

runMigration();
