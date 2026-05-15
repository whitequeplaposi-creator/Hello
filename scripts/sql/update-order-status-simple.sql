-- ============================================================================
-- Simple Order Status Update Commands
-- ============================================================================
-- Use these commands to update order status directly.
-- The trigger will automatically update the tracking table.
-- ============================================================================

-- ============================================================================
-- QUICK COMMANDS - Just replace the order number
-- ============================================================================

-- Update to Packing status
UPDATE orders SET status = 'Packing' WHERE order_number = 'ORD-17438574';

-- Update to Transport status
UPDATE orders SET status = 'Transport' WHERE order_number = 'ORD-17438574';

-- Update to Delivered status
UPDATE orders SET status = 'Delivered' WHERE order_number = 'ORD-17438574';

-- ============================================================================
-- VIEW RESULTS
-- ============================================================================

-- View order status
SELECT id, order_number, status, updated_at 
FROM orders 
WHERE order_number = 'ORD-17438574';

-- View tracking status
SELECT 
  order_id,
  order_number,
  confirmed, confirmed_date,
  packing, packing_date,
  transport, transport_date,
  delivered, delivered_date,
  updated_at
FROM order_tracking 
WHERE order_id = (SELECT id FROM orders WHERE order_number = 'ORD-17438574');

-- ============================================================================
-- BATCH UPDATES
-- ============================================================================

-- Update multiple orders to Transport
UPDATE orders 
SET status = 'Transport' 
WHERE order_number IN ('ORD-001', 'ORD-002', 'ORD-003');

-- Update all Packing orders to Transport
UPDATE orders 
SET status = 'Transport' 
WHERE status = 'Packing';

-- ============================================================================
-- FIND ORDERS BY STATUS
-- ============================================================================

-- Find all orders in Packing
SELECT order_number, customer_email, created_at 
FROM orders 
WHERE status = 'Packing'
ORDER BY created_at DESC;

-- Find all orders in Transport
SELECT order_number, customer_email, created_at 
FROM orders 
WHERE status = 'Transport'
ORDER BY created_at DESC;

-- Find all delivered orders
SELECT order_number, customer_email, created_at 
FROM orders 
WHERE status = 'Delivered'
ORDER BY created_at DESC;

-- ============================================================================
-- TRACKING STATUS OVERVIEW
-- ============================================================================

-- View all orders with their tracking status
SELECT 
  o.order_number,
  o.status as order_status,
  CASE 
    WHEN t.delivered = 1 THEN 'Delivered'
    WHEN t.transport = 1 THEN 'Transport'
    WHEN t.packing = 1 THEN 'Packing'
    WHEN t.confirmed = 1 THEN 'Confirmed'
    ELSE 'Pending'
  END as tracking_status,
  t.updated_at as tracking_updated
FROM orders o
LEFT JOIN order_tracking t ON o.id = t.order_id
ORDER BY o.created_at DESC
LIMIT 20;

-- ============================================================================
-- SUPPORTED STATUS VALUES (case-insensitive)
-- ============================================================================
-- The trigger supports these status values:
--
-- Confirmed: 'Confirmed', 'confirmed', 'pending'
-- Packing: 'Packing', 'packing', 'processing'
-- Transport: 'Transport', 'transport', 'shipped', 'in_transit'
-- Delivered: 'Delivered', 'delivered'
--
-- Recommended: Use capitalized versions (Packing, Transport, Delivered)
-- ============================================================================

-- ============================================================================
-- EXAMPLES WITH REAL ORDER NUMBERS
-- ============================================================================

-- Example 1: Ship an order
-- UPDATE orders SET status = 'Transport' WHERE order_number = 'ORD-17438574';

-- Example 2: Mark as delivered
-- UPDATE orders SET status = 'Delivered' WHERE order_number = 'ORD-17438574';

-- Example 3: Check tracking
-- SELECT * FROM order_tracking 
-- WHERE order_id = (SELECT id FROM orders WHERE order_number = 'ORD-17438574');

-- ============================================================================
-- NOTES
-- ============================================================================
-- 1. The trigger automatically updates order_tracking when you update orders.status
-- 2. Dates are preserved - only new statuses get new timestamps
-- 3. The tracking page auto-refreshes every 30 seconds
-- 4. Use order_number for easier identification
-- 5. Status values are case-insensitive
-- ============================================================================
