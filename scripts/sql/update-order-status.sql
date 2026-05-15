-- SQL Script för att uppdatera orderstatus
-- Kör detta direkt i din SQL-terminal

-- Exempel: Uppdatera order till 'packing' status
UPDATE orders 
SET status = 'packing', updated_at = CURRENT_TIMESTAMP 
WHERE order_number = 'ORD-17438574';

-- Verifiera ändringen
SELECT order_number, status, updated_at 
FROM orders 
WHERE order_number = 'ORD-17438574';

-- ============================================
-- TILLGÄNGLIGA STATUSAR:
-- ============================================
-- 'confirmed'   - Bekräftad
-- 'packing'     - Packas
-- 'transport'   - Transport
-- 'delivered'   - Levererad

-- ============================================
-- EXEMPEL PÅ UPPDATERINGAR:
-- ============================================

-- Uppdatera till 'confirmed' (bekräftad)
-- UPDATE orders 
-- SET status = 'confirmed', updated_at = CURRENT_TIMESTAMP 
-- WHERE order_number = 'ORD-17438574';

-- Uppdatera till 'packing' (packas)
-- UPDATE orders 
-- SET status = 'packing', updated_at = CURRENT_TIMESTAMP 
-- WHERE order_number = 'ORD-17438574';

-- Uppdatera till 'transport' (transport)
-- UPDATE orders 
-- SET status = 'transport', updated_at = CURRENT_TIMESTAMP 
-- WHERE order_number = 'ORD-17438574';

-- Uppdatera till 'delivered' (levererad)
-- UPDATE orders 
-- SET status = 'delivered', updated_at = CURRENT_TIMESTAMP 
-- WHERE order_number = 'ORD-17438574';

-- Uppdatera flera ordrar samtidigt
-- UPDATE orders 
-- SET status = 'packing', updated_at = CURRENT_TIMESTAMP 
-- WHERE order_number IN ('ORD-17438574', 'ORD-12345678', 'ORD-87654321');

-- Visa alla ordrar med specifik status
-- SELECT order_number, status, created_at, updated_at 
-- FROM orders 
-- WHERE status = 'packing'
-- ORDER BY updated_at DESC;

-- Visa alla ordrar för en specifik kund
-- SELECT o.order_number, o.status, o.total_amount, c.email
-- FROM orders o
-- JOIN customers c ON o.customer_id = c.id
-- WHERE c.email = 'kund@example.com'
-- ORDER BY o.created_at DESC;
