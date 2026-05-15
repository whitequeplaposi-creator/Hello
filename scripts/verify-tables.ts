import { createClient } from '@libsql/client';

const client = createClient({
  url: 'libsql://dostar-dostar.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzgxNDQyMjYsImlkIjoiMDE5Y2QzN2QtYzYwMS03YWVjLTljMjctMzY0MmE2ZjA0YjIyIiwicmlkIjoiNzg3ZmQwMjYtZDk5OS00ZTM3LThiZjctODBlYmU2NGViYzRjIn0.LE3OXGwCSgOuX_2tgOguKI1rWjz6K_Pa_7M1oDkkHVgg7jQrXS-RtN19OcNaTFROJZmXHBbaOaxfAReOmjWuCg'
});

async function verifyTables() {
  try {
    console.log('🔍 Verifierar tabeller i databasen...\n');
    
    const result = await client.execute(`
      SELECT name, type 
      FROM sqlite_master 
      WHERE type IN ('table', 'index') 
      AND name NOT LIKE 'sqlite_%'
      ORDER BY type DESC, name
    `);
    
    const tables = result.rows.filter(r => r.type === 'table');
    const indexes = result.rows.filter(r => r.type === 'index');
    
    console.log('📊 TABELLER:');
    tables.forEach(row => {
      console.log(`   ✅ ${row.name}`);
    });
    
    console.log(`\n📇 INDEX (${indexes.length} st):`);
    indexes.forEach(row => {
      console.log(`   ✅ ${row.name}`);
    });
    
    console.log(`\n✅ Totalt: ${tables.length} tabeller och ${indexes.length} index`);
    
  } catch (error) {
    console.error('❌ Fel vid verifiering:', error);
  }
}

verifyTables();
