-- Kunddata tabell
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'suspended')),
  total_orders INTEGER DEFAULT 0,
  total_spent REAL DEFAULT 0.0,
  last_order_date DATETIME,
  notes TEXT
);

-- Kundadresser tabell
CREATE TABLE IF NOT EXISTS customer_addresses (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  address_type TEXT NOT NULL CHECK(address_type IN ('billing', 'shipping')),
  name TEXT NOT NULL,
  street TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT DEFAULT 'Sverige',
  phone TEXT,
  is_default INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Betalmetoder tabell
CREATE TABLE IF NOT EXISTS customer_payment_methods (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  payment_type TEXT NOT NULL CHECK(payment_type IN ('card', 'invoice', 'other')),
  card_brand TEXT,
  card_last_four TEXT,
  card_expiry TEXT,
  is_default INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Beställningar tabell
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK(status IN ('confirmed', 'packing', 'transport', 'delivered')),
  total_amount REAL NOT NULL,
  currency TEXT DEFAULT 'SEK',
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK(payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  shipping_address_id TEXT,
  billing_address_id TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (shipping_address_id) REFERENCES customer_addresses(id),
  FOREIGN KEY (billing_address_id) REFERENCES customer_addresses(id)
);

-- Orderrader tabell
CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  total_price REAL NOT NULL,
  size TEXT,
  color TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Leveranser/Logistik tabell
CREATE TABLE IF NOT EXISTS shipments (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  tracking_number TEXT UNIQUE,
  carrier TEXT NOT NULL CHECK(carrier IN ('PostNord', 'DHL', 'DB Schenker', 'Bring', 'Other')),
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK(status IN ('confirmed', 'packing', 'transport', 'delivered')),
  shipped_date DATETIME,
  estimated_delivery_date DATETIME,
  actual_delivery_date DATETIME,
  shipping_address TEXT NOT NULL,
  weight_kg REAL,
  dimensions TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Leveranshändelser tabell (tracking history)
CREATE TABLE IF NOT EXISTS shipment_events (
  id TEXT PRIMARY KEY,
  shipment_id TEXT NOT NULL,
  status TEXT NOT NULL,
  location TEXT,
  description TEXT NOT NULL,
  event_date DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE
);

-- Recensioner tabell
CREATE TABLE IF NOT EXISTS recensioner (
  id TEXT PRIMARY KEY,
  produkt_id TEXT NOT NULL,
  kund_id TEXT,
  anvandare_namn TEXT NOT NULL,
  betyg INTEGER NOT NULL CHECK(betyg BETWEEN 1 AND 5),
  titel TEXT,
  kommentar TEXT NOT NULL,
  verifierad_kop INTEGER DEFAULT 0,
  status TEXT DEFAULT 'publicerad' CHECK(status IN ('publicerad', 'granskas', 'dold')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (kund_id) REFERENCES customers(id) ON DELETE SET NULL
);

-- Index för bättre prestanda
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer_id ON customer_addresses(customer_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_customer_id ON customer_payment_methods(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_recensioner_produkt_id ON recensioner(produkt_id);
CREATE INDEX IF NOT EXISTS idx_recensioner_kund_id ON recensioner(kund_id);
CREATE INDEX IF NOT EXISTS idx_recensioner_anvandare_namn ON recensioner(anvandare_namn);
CREATE INDEX IF NOT EXISTS idx_recensioner_betyg ON recensioner(betyg);
CREATE INDEX IF NOT EXISTS idx_recensioner_status ON recensioner(status);
CREATE INDEX IF NOT EXISTS idx_shipments_order_id ON shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking ON shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipment_events_shipment_id ON shipment_events(shipment_id);

-- Recensioner tabell
CREATE TABLE IF NOT EXISTS recensioner (
  id TEXT PRIMARY KEY,
  produkt_id TEXT NOT NULL,
  kund_id TEXT,
  anvandare_namn TEXT NOT NULL,
  betyg INTEGER NOT NULL CHECK(betyg BETWEEN 1 AND 5),
  titel TEXT,
  kommentar TEXT NOT NULL,
  verifierad_kop INTEGER DEFAULT 0,
  status TEXT DEFAULT 'publicerad' CHECK(status IN ('publicerad', 'granskas', 'dold')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (kund_id) REFERENCES customers(id) ON DELETE SET NULL
);

-- Index för recensioner
CREATE INDEX IF NOT EXISTS idx_recensioner_produkt_id ON recensioner(produkt_id);
CREATE INDEX IF NOT EXISTS idx_recensioner_kund_id ON recensioner(kund_id);
CREATE INDEX IF NOT EXISTS idx_recensioner_anvandare_namn ON recensioner(anvandare_namn);
CREATE INDEX IF NOT EXISTS idx_recensioner_betyg ON recensioner(betyg);
CREATE INDEX IF NOT EXISTS idx_recensioner_status ON recensioner(status);
