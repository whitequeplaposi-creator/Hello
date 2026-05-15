import client from '@/lib/db';

async function checkTriggers() {
  try {
    console.log('Checking database triggers...');
    
    const result = await client.execute({
      sql: "SELECT name FROM sqlite_master WHERE type='trigger'",
      args: []
    });
    
    console.log('Existing triggers:', result.rows);
    
    if (result.rows.length === 0) {
      console.log('No triggers found. Need to apply migration.');
    } else {
      console.log('Triggers are active.');
    }
    
    // Check a sample order to see structure
    const orderResult = await client.execute({
      sql: "SELECT id, order_number, status FROM orders LIMIT 1",
      args: []
    });
    
    if (orderResult.rows.length > 0) {
      console.log('Sample order structure:', orderResult.rows[0]);
    }
    
  } catch (error) {
    console.error('Error checking triggers:', error);
  }
}

checkTriggers()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
