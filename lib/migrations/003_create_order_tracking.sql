-- Order Tracking tabell för att spåra ordersteg med datum (kolumnbaserad struktur)
CREATE TABLE IF NOT EXISTS order_tracking (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE,
  order_number TEXT,
  confirmed INTEGER DEFAULT 0,
  confirmed_date TEXT,
  packing INTEGER DEFAULT 0,
  packing_date TEXT,
  transport INTEGER DEFAULT 0,
  transport_date TEXT,
  delivered INTEGER DEFAULT 0,
  delivered_date TEXT,
  products TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Index för snabbare sökning
CREATE INDEX IF NOT EXISTS idx_order_tracking_order_id ON order_tracking(order_id);
CREATE INDEX IF NOT EXISTS idx_order_tracking_order_number ON order_tracking(order_number);
