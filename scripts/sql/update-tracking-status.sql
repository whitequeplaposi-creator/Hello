-- ============================================================================
-- Order Tracking Status Update SQL Scripts
-- ============================================================================
-- These scripts can be used to manually update order tracking status
-- in the database using SQL commands.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. UPDATE ORDER TO CONFIRMED STATUS
-- ----------------------------------------------------------------------------
-- Sets the order status to "confirmed" with current timestamp
UPDATE order_tracking 
SET 
  confirmed = 1,
  confirmed_date = datetime('now'),
  updated_at = datetime('now')
WHERE order_id = 'YOUR_ORDER_ID_HERE';

-- ----------------------------------------------------------------------------
-- 2. UPDATE ORDER TO PACKING STATUS
-- ----------------------------------------------------------------------------
-- Sets the order to "packing" and ensures "confirmed" is also set
UPDATE order_tracking 
SET 
  confirmed = 1,
  confirmed_date = COALESCE(confirmed_date, datetime('now')),
  packing = 1,
  packing_date = datetime('now'),
  updated_at = datetime('now')
WHERE order_id = 'YOUR_ORDER_ID_HERE';

-- ----------------------------------------------------------------------------
-- 3. UPDATE ORDER TO TRANSPORT STATUS
-- ----------------------------------------------------------------------------
-- Sets the order to "transport" and ensures previous statuses are set
UPDATE order_tracking 
SET 
  confirmed = 1,
  confirmed_date = COALESCE(confirmed_date, datetime('now')),
  packing = 1,
  packing_date = COALESCE(packing_date, datetime('now')),
  transport = 1,
  transport_date = datetime('now'),
  updated_at = datetime('now')
WHERE order_id = 'YOUR_ORDER_ID_HERE';

-- ----------------------------------------------------------------------------
-- 4. UPDATE ORDER TO DELIVERED STATUS
-- ----------------------------------------------------------------------------
-- Sets the order to "delivered" and ensures all previous statuses are set
UPDATE order_tracking 
SET 
  confirmed = 1,
  confirmed_date = COALESCE(confirmed_date, datetime('now')),
  packing = 1,
  packing_date = COALESCE(packing_date, datetime('now')),
  transport = 1,
  transport_date = COALESCE(transport_date, datetime('now')),
  delivered = 1,
  delivered_date = datetime('now'),
  updated_at = datetime('now')
WHERE order_id = 'YOUR_ORDER_ID_HERE';

-- ----------------------------------------------------------------------------
-- 5. CREATE NEW TRACKING RECORD
-- ----------------------------------------------------------------------------
-- Creates a new tracking record for an order
INSERT INTO order_tracking (
  id,
  order_id,
  order_number,
  confirmed,
  confirmed_date,
  created_at,
  updated_at
) VALUES (
  'tracking_' || strftime('%s', 'now') || '_' || substr(hex(randomblob(4)), 1, 8),
  'YOUR_ORDER_ID_HERE',
  'ORDER_NUMBER_HERE',
  1,
  datetime('now'),
  datetime('now'),
  datetime('now')
);

-- ----------------------------------------------------------------------------
-- 6. VIEW TRACKING STATUS FOR AN ORDER
-- ----------------------------------------------------------------------------
-- Query to view the current tracking status
SELECT 
  order_id,
  order_number,
  confirmed,
  confirmed_date,
  packing,
  packing_date,
  transport,
  transport_date,
  delivered,
  delivered_date,
  created_at,
  updated_at
FROM order_tracking
WHERE order_id = 'YOUR_ORDER_ID_HERE';

-- ----------------------------------------------------------------------------
-- 7. VIEW ALL TRACKING RECORDS
-- ----------------------------------------------------------------------------
-- Query to view all tracking records with their current status
SELECT 
  order_id,
  order_number,
  CASE 
    WHEN delivered = 1 THEN 'Delivered'
    WHEN transport = 1 THEN 'In Transit'
    WHEN packing = 1 THEN 'Packing'
    WHEN confirmed = 1 THEN 'Confirmed'
    ELSE 'Pending'
  END as current_status,
  confirmed_date,
  packing_date,
  transport_date,
  delivered_date,
  updated_at
FROM order_tracking
ORDER BY updated_at DESC;

-- ----------------------------------------------------------------------------
-- 8. BULK UPDATE - SET MULTIPLE ORDERS TO CONFIRMED
-- ----------------------------------------------------------------------------
-- Updates multiple orders to confirmed status
UPDATE order_tracking 
SET 
  confirmed = 1,
  confirmed_date = COALESCE(confirmed_date, datetime('now')),
  updated_at = datetime('now')
WHERE order_id IN ('ORDER_ID_1', 'ORDER_ID_2', 'ORDER_ID_3');

-- ----------------------------------------------------------------------------
-- 9. RESET TRACKING STATUS (FOR TESTING)
-- ----------------------------------------------------------------------------
-- Resets all tracking statuses for an order (use with caution!)
UPDATE order_tracking 
SET 
  confirmed = 0,
  confirmed_date = NULL,
  packing = 0,
  packing_date = NULL,
  transport = 0,
  transport_date = NULL,
  delivered = 0,
  delivered_date = NULL,
  updated_at = datetime('now')
WHERE order_id = 'YOUR_ORDER_ID_HERE';

-- ----------------------------------------------------------------------------
-- 10. DELETE TRACKING RECORD (FOR TESTING)
-- ----------------------------------------------------------------------------
-- Deletes a tracking record (use with caution!)
DELETE FROM order_tracking 
WHERE order_id = 'YOUR_ORDER_ID_HERE';

-- ============================================================================
-- USAGE EXAMPLES
-- ============================================================================

-- Example 1: Update order to "packing" status
-- UPDATE order_tracking 
-- SET 
--   confirmed = 1,
--   confirmed_date = COALESCE(confirmed_date, datetime('now')),
--   packing = 1,
--   packing_date = datetime('now'),
--   updated_at = datetime('now')
-- WHERE order_id = 'order_abc123';

-- Example 2: View tracking for specific order
-- SELECT * FROM order_tracking WHERE order_id = 'order_abc123';

-- Example 3: View all orders currently in transit
-- SELECT order_id, order_number, transport_date 
-- FROM order_tracking 
-- WHERE transport = 1 AND delivered = 0
-- ORDER BY transport_date DESC;

-- ============================================================================
-- NOTES
-- ============================================================================
-- 1. Always replace 'YOUR_ORDER_ID_HERE' with the actual order ID
-- 2. COALESCE ensures existing dates are preserved
-- 3. datetime('now') uses UTC time
-- 4. Setting a status automatically should set all previous statuses
-- 5. Use transactions for bulk updates to ensure data consistency
-- ============================================================================
