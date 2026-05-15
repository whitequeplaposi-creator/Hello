import client from '../lib/db';

async function checkSchema() {
  try {
    const result = await client.execute({
      sql: 'SELECT sql FROM sqlite_master WHERE type = ? AND name = ?',
      args: ['table', 'orders']
    });
    
    if (result.rows.length > 0) {
      console.log('Orders table schema:');
      console.log(result.rows[0].sql);
    } else {
      console.log('Orders table not found');
    }
  } catch (error) {
    console.error('Error:', error);
  }
  
  process.exit(0);
}

checkSchema();
