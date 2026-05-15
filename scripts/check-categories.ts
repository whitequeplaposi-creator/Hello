import client from '../lib/db';

async function checkCategories() {
  try {
    console.log('Checking Eprolo table structure...\n');
    
    // Check table schema
    const schemaResult = await client.execute(
      "SELECT sql FROM sqlite_master WHERE type='table' AND name='Eprolo'"
    );
    
    if (schemaResult.rows.length > 0) {
      console.log('Table schema:');
      console.log(schemaResult.rows[0].sql);
      console.log('\n');
    }
    
    // Get first row to see column names
    const sampleResult = await client.execute('SELECT * FROM Eprolo LIMIT 1');
    
    if (sampleResult.rows.length > 0) {
      console.log('Column names in first row:');
      console.log(Object.keys(sampleResult.rows[0]));
      console.log('\n');
      
      console.log('First row data:');
      console.log(sampleResult.rows[0]);
      console.log('\n');
    }
    
    // Try different category column names
    console.log('Testing different category column names:\n');
    
    const variations = ['Category', 'category', 'CATEGORY'];
    
    for (const colName of variations) {
      try {
        const result = await client.execute(
          `SELECT DISTINCT ${colName} FROM Eprolo WHERE ${colName} IS NOT NULL AND ${colName} != "" LIMIT 5`
        );
        console.log(`✓ Column "${colName}" exists with ${result.rows.length} distinct values:`);
        result.rows.forEach(row => {
          console.log(`  - ${row[colName]}`);
        });
        console.log('');
      } catch (error: any) {
        console.log(`✗ Column "${colName}" not found or error: ${error.message}\n`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

checkCategories();
