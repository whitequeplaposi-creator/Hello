import { createClient } from '@libsql/client';

const client = createClient({
  url: 'libsql://dostar-dostar.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzgxNDQyMjYsImlkIjoiMDE5Y2QzN2QtYzYwMS03YWVjLTljMjctMzY0MmE2ZjA0YjIyIiwicmlkIjoiNzg3ZmQwMjYtZDk5OS00ZTM3LThiZjctODBlYmU2NGViYzRjIn0.LE3OXGwCSgOuX_2tgOguKI1rWjz6K_Pa_7M1oDkkHVgg7jQrXS-RtN19OcNaTFROJZmXHBbaOaxfAReOmjWuCg'
});

async function testCategories() {
  try {
    console.log('🔍 Hämtar kategorier från databasen...\n');
    
    // Hämta unika kategorier
    const result = await client.execute(
      'SELECT DISTINCT Category FROM Eprolo WHERE Category IS NOT NULL AND Category != "" ORDER BY Category'
    );
    
    const categories = result.rows.map(row => row.Category?.toString() || '').filter(c => c.length > 0);
    
    console.log(`✅ Hittade ${categories.length} unika kategorier:\n`);
    categories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat}`);
    });
    
    // Räkna produkter per kategori
    console.log('\n📊 Produkter per kategori:\n');
    for (const category of categories) {
      const countResult = await client.execute({
        sql: 'SELECT COUNT(*) as count FROM Eprolo WHERE Category = ?',
        args: [category]
      });
      const count = countResult.rows[0]?.count || 0;
      console.log(`${category}: ${count} produkter`);
    }
    
    // Visa exempel på produktnamn från varje kategori
    console.log('\n🏷️  Exempel på produkter från varje kategori:\n');
    for (const category of categories.slice(0, 5)) { // Visa bara första 5 för att hålla det kort
      const productsResult = await client.execute({
        sql: 'SELECT namn FROM Eprolo WHERE Category = ? LIMIT 3',
        args: [category]
      });
      console.log(`\n${category}:`);
      productsResult.rows.forEach(row => {
        console.log(`  - ${row.namn}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Fel vid hämtning av kategorier:', error);
  }
}

testCategories();
