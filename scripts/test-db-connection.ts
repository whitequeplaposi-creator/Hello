import { createClient } from '@libsql/client';

const client = createClient({
  url: 'libsql://dostar-dostar.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzgxNDQyMjYsImlkIjoiMDE5Y2QzN2QtYzYwMS03YWVjLTljMjctMzY0MmE2ZjA0YjIyIiwicmlkIjoiNzg3ZmQwMjYtZDk5OS00ZTM3LThiZjctODBlYmU2NGViYzRjIn0.LE3OXGwCSgOuX_2tgOguKI1rWjz6K_Pa_7M1oDkkHVgg7jQrXS-RtN19OcNaTFROJZmXHBbaOaxfAReOmjWuCg'
});

async function testConnection() {
  console.log('🔌 Testar databasanslutning...\n');

  try {
    // Test 1: Hämta produkter
    console.log('1️⃣ Hämtar produkter från Eprolo...');
    const productsResult = await client.execute('SELECT COUNT(*) as count FROM Eprolo');
    console.log(`   ✅ ${productsResult.rows[0].count} produkter hittade\n`);

    // Test 2: Hämta kunder
    console.log('2️⃣ Hämtar kunder...');
    const customersResult = await client.execute('SELECT COUNT(*) as count FROM customers');
    console.log(`   ✅ ${customersResult.rows[0].count} kunder hittade\n`);

    // Test 3: Hämta ordrar
    console.log('3️⃣ Hämtar ordrar...');
    const ordersResult = await client.execute('SELECT COUNT(*) as count FROM orders');
    console.log(`   ✅ ${ordersResult.rows[0].count} ordrar hittade\n`);

    // Test 4: Hämta leveranser
    console.log('4️⃣ Hämtar leveranser...');
    const shipmentsResult = await client.execute('SELECT COUNT(*) as count FROM shipments');
    console.log(`   ✅ ${shipmentsResult.rows[0].count} leveranser hittade\n`);

    console.log('✅ Alla databastester lyckades!');

  } catch (error) {
    console.error('❌ Databasfel:', error);
    process.exit(1);
  }
}

testConnection();
