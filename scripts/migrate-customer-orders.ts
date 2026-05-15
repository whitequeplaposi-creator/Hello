import client from '../lib/db';

async function migrate() {
  console.log('Starting customer and orders migration...');

  try {
    // Create customers table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        phone TEXT,
        totalOrders INTEGER DEFAULT 0,
        totalSpent REAL DEFAULT 0,
        lastOrderDate TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);
    console.log('✓ Customers table created');

    // Create customer_addresses table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS customer_addresses (
        id TEXT PRIMARY KEY,
        customerId TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('shipping', 'billing')),
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        zip TEXT NOT NULL,
        country TEXT NOT NULL,
        isDefault BOOLEAN DEFAULT FALSE,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Customer addresses table created');

    // Create customer_payment_methods table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS customer_payment_methods (
        id TEXT PRIMARY KEY,
        customerId TEXT NOT NULL,
        type TEXT NOT NULL,
        last4 TEXT,
        brand TEXT,
        expiryMonth INTEGER,
        expiryYear INTEGER,
        isDefault BOOLEAN DEFAULT FALSE,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Customer payment methods table created');

    // Create orders table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        customerId TEXT NOT NULL,
        customerEmail TEXT NOT NULL,
        customerFirstName TEXT NOT NULL,
        customerLastName TEXT NOT NULL,
        customerPhone TEXT,
        customerAddress TEXT NOT NULL,
        customerCity TEXT NOT NULL,
        customerZip TEXT NOT NULL,
        customerCountry TEXT NOT NULL,
        totalAmount REAL NOT NULL,
        paymentMethod TEXT NOT NULL,
        paymentStatus TEXT NOT NULL DEFAULT 'pending' CHECK (paymentStatus IN ('pending', 'paid', 'failed', 'refunded')),
        orderStatus TEXT NOT NULL DEFAULT 'pending' CHECK (orderStatus IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')),
        notes TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Orders table created');

    // Create order_items table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        id TEXT PRIMARY KEY,
        orderId TEXT NOT NULL,
        productId TEXT NOT NULL,
        productName TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unitPrice REAL NOT NULL,
        size TEXT,
        color TEXT,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Order items table created');

    console.log('Migration completed successfully! 🎉');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrate();
}

export default migrate;
