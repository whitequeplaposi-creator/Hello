-- ============================================================
-- Migration 002: Användarbeteende & Personalisering
-- Tabeller för att spåra interaktioner och bygga rekommendationer
-- ============================================================

-- Produktvisningar och klick per inloggad användare
CREATE TABLE IF NOT EXISTS user_product_events (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK(event_type IN ('view', 'click', 'add_to_cart', 'remove_from_cart', 'purchase', 'wishlist', 'share')),
  product_category TEXT,
  product_price REAL,
  session_id TEXT,
  duration_seconds INTEGER DEFAULT 0,  -- Tid spenderad på produktsidan
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Aggregerad profil per användare (uppdateras vid varje interaktion)
CREATE TABLE IF NOT EXISTS user_preference_profiles (
  customer_id TEXT PRIMARY KEY,
  -- Kategoripreferenser (JSON: {"Women": 15, "Shoes": 8, ...})
  category_weights TEXT DEFAULT '{}',
  -- Prisintervall-preferenser
  avg_price_interest REAL DEFAULT 0,
  min_price_interest REAL DEFAULT 0,
  max_price_interest REAL DEFAULT 0,
  -- Färgpreferenser (JSON: {"Black": 10, "White": 5, ...})
  color_weights TEXT DEFAULT '{}',
  -- Storlekspreferenser (JSON: {"M": 8, "L": 3, ...})
  size_weights TEXT DEFAULT '{}',
  -- Totala interaktioner
  total_views INTEGER DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,
  total_purchases INTEGER DEFAULT 0,
  total_wishlist INTEGER DEFAULT 0,
  -- Senaste aktivitet
  last_active_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Produktpopularitet (aggregerad från alla användare)
CREATE TABLE IF NOT EXISTS product_popularity (
  product_id TEXT PRIMARY KEY,
  total_views INTEGER DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,
  total_add_to_cart INTEGER DEFAULT 0,
  total_purchases INTEGER DEFAULT 0,
  total_wishlist INTEGER DEFAULT 0,
  -- Viktat popularitetspoäng (beräknas automatiskt)
  popularity_score REAL DEFAULT 0,
  -- Trendpoäng (baserat på senaste 7 dagarna)
  trend_score REAL DEFAULT 0,
  last_purchased_at DATETIME,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Rekommendationslogg (för att mäta träffsäkerhet)
CREATE TABLE IF NOT EXISTS recommendation_feedback (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  recommendation_type TEXT NOT NULL CHECK(recommendation_type IN ('personalized', 'trending', 'similar', 'cart_based', 'frequently_bought')),
  was_clicked INTEGER DEFAULT 0,
  was_purchased INTEGER DEFAULT 0,
  shown_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  clicked_at DATETIME,
  purchased_at DATETIME,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Index för prestanda
CREATE INDEX IF NOT EXISTS idx_user_events_customer ON user_product_events(customer_id);
CREATE INDEX IF NOT EXISTS idx_user_events_product ON user_product_events(product_id);
CREATE INDEX IF NOT EXISTS idx_user_events_type ON user_product_events(event_type);
CREATE INDEX IF NOT EXISTS idx_user_events_created ON user_product_events(created_at);
CREATE INDEX IF NOT EXISTS idx_user_events_customer_type ON user_product_events(customer_id, event_type);
CREATE INDEX IF NOT EXISTS idx_product_popularity_score ON product_popularity(popularity_score DESC);
CREATE INDEX IF NOT EXISTS idx_product_popularity_trend ON product_popularity(trend_score DESC);
CREATE INDEX IF NOT EXISTS idx_recommendation_feedback_customer ON recommendation_feedback(customer_id);
