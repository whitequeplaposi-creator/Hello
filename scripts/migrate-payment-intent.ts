import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const client = createClient({
  url: 'libsql://dostar-dostar.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzgxNDQyMjYsImlkIjoiMDE5Y2QzN2QtYzYwMS03YWVjLTljMjctMzY0MmE2ZjA0YjIyIiwicmlkIjoiNzg3ZmQwMjYtZDk5OS00ZTM3LThiZjctODBlYmU2NGViYzRjIn0.LE3OXGwCSgOuX_2tgOguKI1rWjz6K_Pa_7M1oDkkHVgg7jQrXS-RtN19OcNaTFROJZmXHBbaOaxfAReOmjWuCg'
});

async function runMigration() {
  try {
    console.log('🚀 Startar migrering: Lägg till payment_intent_id...');
    
    // Läs SQL-filen
    const sqlPath = join(process.cwd(), 'lib', 'migrations', '002_add_payment_intent_id.sql');
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
    
    console.log(`📝 Kör ${statements.length} SQL-satser...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`   ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`);
      
      try {
        await client.execute(statement);
        console.log(`   ✅ Klar`);
      } catch (error: any) {
        if (error.message && (error.message.includes('already exists') || error.message.includes('duplicate column'))) {
          console.log(`   ⚠️  Kolumn/index finns redan`);
        } else {
          console.error(`   ❌ Fel:`, error.message);
          throw error;
        }
      }
    }
    
    console.log('\n✅ Migrering slutförd!');
    console.log('   - payment_intent_id kolumn tillagd i orders');
    console.log('   - Index för payment_intent_id skapat');
    
  } catch (error) {
    console.error('❌ Fel vid migrering:', error);
    process.exit(1);
  }
}

runMigration();
