-- ============================================================================
-- ENKLA SQL-KOMMANDON FÖR ORDER TRACKING
-- ============================================================================
-- Kopiera och klistra in dessa i din SQL-terminal
-- Byt ut 'ORD-17438574' med ditt order_number
-- ============================================================================

-- ----------------------------------------------------------------------------
-- VISA ALLA ORDERS
-- ----------------------------------------------------------------------------
SELECT order_number, status, created_at FROM orders ORDER BY created_at DESC;


-- ----------------------------------------------------------------------------
-- UPPDATERA TILL "PACKING" (Packning påbörjad)
-- ----------------------------------------------------------------------------
-- Steg 1: Uppdatera orders
UPDATE orders 
SET status = 'packing', updated_at = datetime('now')
WHERE order_number = 'ORD-17438574';

-- Steg 2: Uppdatera tracking
UPDATE order_tracking 
SET 
  confirmed = 1,
  confirmed_date = COALESCE(confirmed_date, datetime('now')),
  packing = 1,
  packing_date = COALESCE(packing_date, datetime('now')),
  transport = 0,
  delivered = 0,
  updated_at = datetime('now')
WHERE order_number = 'ORD-17438574';


-- ----------------------------------------------------------------------------
-- UPPDATERA TILL "TRANSPORT" (I transport)
-- ----------------------------------------------------------------------------
-- Steg 1: Uppdatera orders
UPDATE orders 
SET status = 'transport', updated_at = datetime('now')
WHERE order_number = 'ORD-17438574';

-- Steg 2: Uppdatera tracking
UPDATE order_tracking 
SET 
  confirmed = 1,
  confirmed_date = COALESCE(confirmed_date, datetime('now')),
  packing = 1,
  packing_date = COALESCE(packing_date, datetime('now')),
  transport = 1,
  transport_date = COALESCE(transport_date, datetime('now')),
  delivered = 0,
  updated_at = datetime('now')
WHERE order_number = 'ORD-17438574';


-- ----------------------------------------------------------------------------
-- UPPDATERA TILL "DELIVERED" (Levererad)
-- ----------------------------------------------------------------------------
-- Steg 1: Uppdatera orders
UPDATE orders 
SET status = 'delivered', updated_at = datetime('now')
WHERE order_number = 'ORD-17438574';

-- Steg 2: Uppdatera tracking
UPDATE order_tracking 
SET 
  confirmed = 1,
  confirmed_date = COALESCE(confirmed_date, datetime('now')),
  packing = 1,
  packing_date = COALESCE(packing_date, datetime('now')),
  transport = 1,
  transport_date = COALESCE(transport_date, datetime('now')),
  delivered = 1,
  delivered_date = COALESCE(delivered_date, datetime('now')),
  updated_at = datetime('now')
WHERE order_number = 'ORD-17438574';


-- ----------------------------------------------------------------------------
-- KONTROLLERA RESULTAT
-- ----------------------------------------------------------------------------
SELECT 
  o.order_number,
  o.status,
  t.confirmed,
  t.packing,
  t.transport,
  t.delivered,
  t.updated_at
FROM orders o
LEFT JOIN order_tracking t ON o.id = t.order_id
WHERE o.order_number = 'ORD-17438574';
