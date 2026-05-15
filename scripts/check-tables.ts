import client from '../lib/db';

async function checkTables() {
  try {
    console.log('=== Checking Database Tables ===\n');
    
    // Check all tables
    const tablesResult = await client.execute({
      sql: "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
    });
    
    console.log('All tables in database:');
    tablesResult.rows.forEach((row: any) => {
      console.log(`  - ${row.name}`);
    });
    
    // Check if order_tracking table exists
    const trackingTableResult = await client.execute({
      sql: "SELECT name FROM sqlite_master WHERE type='table' AND name='order_tracking'"
    });
    
    console.log(`\norder_tracking table exists: ${trackingTableResult.rows.length > 0 ? 'YES' : 'NO'}`);
    
    if (trackingTableResult.rows.length > 0) {
      // Get table schema
      const schemaResult = await client.execute({
        sql: "PRAGMA table_info(order_tracking)"
      });
      
      console.log('\norder_tracking table schema:');
      schemaResult.rows.forEach((row: any) => {
        console.log(`  ${row.name} (${row.type})`);
      });
    }
    
  } catch (error) {
    console.error('Error checking tables:', error);
  }
}

checkTables();
