-- Snabb uppdatering av orderstatus
-- Kör detta direkt i din SQL-terminal

UPDATE orders 
SET status = 'packing', updated_at = CURRENT_TIMESTAMP 
WHERE order_number = 'ORD-17438574';

-- Verifiera att uppdateringen fungerade
SELECT order_number, status, updated_at 
FROM orders 
WHERE order_number = 'ORD-17438574';
