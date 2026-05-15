import client from '../lib/db';

async function fixOrderStatusConstraint() {
  console.log('🔨 Fixing orders table status constraint...\n');

  try {
    // Check current schema
    const schemaResult = await client.execute(`PRAGMA table_info(orders)`);
    console.log('Current orders table columns:', schemaResult.rows.map(r => r.name));

    // Get the current CREATE TABLE statement
    const tableInfo = await client.execute(`SELECT sql FROM sqlite_master WHERE type='table' AND name='orders'`);
    console.log('\nCurrent table schema:', tableInfo.rows[0]?.sql);

    // Create a new table with correct constraints
    console.log('\n📝 Creating new orders table with correct constraints...');
    
    await client.execute(`
      CREATE TABLE IF NOT EXISTS orders_new (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        order_number TEXT UNIQUE NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')),
        total_amount REAL NOT NULL,
        currency TEXT DEFAULT 'SEK',
        payment_method TEXT,
        payment_status TEXT DEFAULT 'pending' CHECK(payment_status IN ('pending', 'paid', 'failed', 'refunded')),
        payment_intent_id TEXT,
        shipping_address_id TEXT,
        billing_address_id TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
        FOREIGN KEY (shipping_address_id) REFERENCES customer_addresses(id),
        FOREIGN KEY (billing_address_id) REFERENCES customer_addresses(id)
      )
    `);

    // Copy data from old table to new table
    console.log('📦 Copying data from old table to new table...');
    const copyResult = await client.execute(`
      INSERT INTO orders_new (id, customer_id, order_number, status, total_amount, currency, payment_method, payment_status, payment_intent_id, shipping_address_id, billing_address_id, notes, created_at, updated_at)
      SELECT 
        id, 
        customer_id, 
        order_number, 
        CASE 
          WHEN status = 'confirmed' THEN 'processing'
          WHEN status = 'packing' THEN 'processing'
          WHEN status = 'transport' THEN 'shipped'
          WHEN status = 'delivered' THEN 'delivered'
          ELSE 'pending'
        END as status,
        total_amount, 
        currency, 
        payment_method, 
        payment_status, 
        payment_intent_id, 
        shipping_address_id, 
        billing_address_id, 
        notes, 
        created_at, 
        updated_at
      FROM orders
    `);
    console.log(`✅ Copied ${copyResult.rowsAffected} rows`);

    // Drop old table
    console.log('🗑️ Dropping old orders table...');
    await client.execute(`DROP TABLE orders`);

    // Rename new table to orders
    console.log('📝 Renaming orders_new to orders...');
    await client.execute(`ALTER TABLE orders_new RENAME TO orders`);

    // Recreate indexes
    console.log('📝 Recreating indexes...');
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id)`);
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`);

    console.log('\n✅ Orders table constraint fixed successfully!');
    
    // Verify the fix
    const verifyResult = await client.execute(`PRAGMA table_info(orders)`);
    console.log('\n✅ Updated orders table columns:', verifyResult.rows.map(r => r.name));

  } catch (error: any) {
    console.error('❌ Error fixing constraint:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }

  process.exit(0);
}

fixOrderStatusConstraint();
