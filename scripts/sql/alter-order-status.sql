-- Steg 1: Ta bort den gamla CHECK constraint och lägg till ny med de 4 statusarna
-- OBS: SQLite stöder inte ALTER COLUMN direkt, så vi måste återskapa tabellen

-- Skapa en temporär tabell med nya constraints
CREATE TABLE orders_new (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK(status IN ('confirmed', 'packing', 'transport', 'delivered')),
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
);

-- Kopiera data från gamla tabellen (mappa gamla statusar till nya)
INSERT INTO orders_new (id, customer_id, order_number, status, total_amount, currency, payment_method, payment_status, payment_intent_id, shipping_address_id, billing_address_id, notes, created_at, updated_at)
SELECT 
  id, 
  customer_id, 
  order_number, 
  CASE 
    WHEN status IN ('pending', 'processing') THEN 'confirmed'
    WHEN status = 'shipped' THEN 'transport'
    WHEN status = 'delivered' THEN 'delivered'
    ELSE 'confirmed'
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
FROM orders;

-- Ta bort gamla tabellen
DROP TABLE orders;

-- Byt namn på nya tabellen
ALTER TABLE orders_new RENAME TO orders;

-- Återskapa index
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
