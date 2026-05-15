-- ============================================================================
-- SQL-SKRIPT FÖR ATT UPPDATERA ORDERSTATUS OCH TRACKING
-- ============================================================================
-- 
-- VIKTIGT: Efter att du kört dessa SQL-kommandon måste du synkronisera
-- tracking-tabellen genom att köra:
--   npx tsx scripts/sync-order-to-tracking.ts
--
-- Eller anropa API:et:
--   curl -X POST http://localhost:3000/api/sync-order-status \
--     -H "Content-Type: application/json" \
--     -d '{"order_number": "ORD-17438574"}'
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. VISA ALLA ORDERS OCH DERAS STATUS
-- ----------------------------------------------------------------------------
SELECT 
  order_number,
  status,
  created_at,
  updated_at
FROM orders
ORDER BY created_at DESC;

-- ----------------------------------------------------------------------------
-- 2. UPPDATERA ORDER TILL "PACKING" (Packning påbörjad)
-- ----------------------------------------------------------------------------
-- Byt ut 'ORD-17438574' med ditt order_number
UPDATE orders 
SET 
  status = 'packing',
  updated_at = datetime('now')
WHERE order_number = 'ORD-17438574';

-- Verifiera uppdateringen
SELECT order_number, status, updated_at 
FROM orders 
WHERE order_number = 'ORD-17438574';

-- ----------------------------------------------------------------------------
-- 3. UPPDATERA ORDER TILL "TRANSPORT" (I transport)
-- ----------------------------------------------------------------------------
-- Byt ut 'ORD-17438574' med ditt order_number
UPDATE orders 
SET 
  status = 'transport',
  updated_at = datetime('now')
WHERE order_number = 'ORD-17438574';

-- Verifiera uppdateringen
SELECT order_number, status, updated_at 
FROM orders 
WHERE order_number = 'ORD-17438574';

-- ----------------------------------------------------------------------------
-- 4. UPPDATERA ORDER TILL "DELIVERED" (Levererad)
-- ----------------------------------------------------------------------------
-- Byt ut 'ORD-17438574' med ditt order_number
UPDATE orders 
SET 
  status = 'delivered',
  updated_at = datetime('now')
WHERE order_number = 'ORD-17438574';

-- Verifiera uppdateringen
SELECT order_number, status, updated_at 
FROM orders 
WHERE order_number = 'ORD-17438574';

-- ----------------------------------------------------------------------------
-- 5. VISA TRACKING-STATUS FÖR EN ORDER
-- ----------------------------------------------------------------------------
SELECT 
  order_number,
  confirmed,
  confirmed_date,
  packing,
  packing_date,
  transport,
  transport_date,
  delivered,
  delivered_date,
  updated_at
FROM order_tracking
WHERE order_number = 'ORD-17438574';

-- ----------------------------------------------------------------------------
-- 6. MANUELL SYNKRONISERING (Om du inte vill använda scriptet)
-- ----------------------------------------------------------------------------
-- VIKTIGT: Detta är mer komplext. Använd hellre scriptet!
-- 
-- För status 'packing':
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

-- För status 'transport':
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

-- För status 'delivered':
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
-- 7. KONTROLLERA RESULTAT
-- ----------------------------------------------------------------------------
-- Visa order och tracking tillsammans
SELECT 
  o.order_number,
  o.status AS order_status,
  t.confirmed,
  t.packing,
  t.transport,
  t.delivered,
  o.updated_at AS order_updated,
  t.updated_at AS tracking_updated
FROM orders o
LEFT JOIN order_tracking t ON o.id = t.order_id
WHERE o.order_number = 'ORD-17438574';
