import client from '../lib/db';

async function analyzeProductNames() {
  try {
    console.log('Analyzing product names for patterns...\n');
    
    const result = await client.execute('SELECT namn FROM Eprolo LIMIT 20');
    
    console.log('Sample product names:');
    result.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.namn}`);
    });
    
    console.log('\n');
    console.log('Total products in database:');
    const countResult = await client.execute('SELECT COUNT(*) as count FROM Eprolo');
    console.log(countResult.rows[0].count);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

analyzeProductNames();
