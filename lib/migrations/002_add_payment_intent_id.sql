-- Lägg till payment_intent_id kolumn i orders tabellen
ALTER TABLE orders ADD COLUMN payment_intent_id TEXT;

-- Index för snabbare sökning och unikhet
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_payment_intent_unique ON orders(payment_intent_id) WHERE payment_intent_id IS NOT NULL;
