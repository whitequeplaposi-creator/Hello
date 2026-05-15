-- ============================================================================
-- Updated Order Status Trigger - Supports New Status Names
-- ============================================================================
-- This migration updates the trigger to support the new status names:
-- - Confirmed (replaces 'pending', 'confirmed')
-- - Packing (replaces 'processing')
-- - Transport (replaces 'shipped', 'in_transit')
-- - Delivered (replaces 'delivered')
-- ============================================================================

-- Drop existing triggers
DROP TRIGGER IF EXISTS sync_order_status_to_tracking;
DROP TRIGGER IF EXISTS sync_new_order_to_tracking;

-- ============================================================================
-- Trigger 1: Sync order status updates to tracking table
-- ============================================================================
CREATE TRIGGER sync_order_status_to_tracking
AFTER UPDATE OF status ON orders
BEGIN
  -- Update order_tracking based on orders.status
  UPDATE order_tracking
  SET 
    -- Confirmed status (always set for any order)
    confirmed = 1,
    confirmed_date = COALESCE(confirmed_date, datetime('now')),
    
    -- Packing status
    packing = CASE 
      WHEN LOWER(NEW.status) IN ('packing', 'processing', 'transport', 'shipped', 'in_transit', 'delivered') THEN 1
      ELSE packing
    END,
    packing_date = CASE 
      WHEN LOWER(NEW.status) IN ('packing', 'processing') AND packing_date IS NULL THEN datetime('now')
      WHEN LOWER(NEW.status) IN ('transport', 'shipped', 'in_transit', 'delivered') AND packing_date IS NULL THEN datetime('now')
      ELSE packing_date
    END,
    
    -- Transport status
    transport = CASE 
      WHEN LOWER(NEW.status) IN ('transport', 'shipped', 'in_transit', 'delivered') THEN 1
      ELSE transport
    END,
    transport_date = CASE 
      WHEN LOWER(NEW.status) IN ('transport', 'shipped', 'in_transit') AND transport_date IS NULL THEN datetime('now')
      WHEN LOWER(NEW.status) = 'delivered' AND transport_date IS NULL THEN datetime('now')
      ELSE transport_date
    END,
    
    -- Delivered status
    delivered = CASE 
      WHEN LOWER(NEW.status) = 'delivered' THEN 1
      ELSE delivered
    END,
    delivered_date = CASE 
      WHEN LOWER(NEW.status) = 'delivered' AND delivered_date IS NULL THEN datetime('now')
      ELSE delivered_date
    END,
    
    updated_at = datetime('now')
  WHERE order_id = NEW.id;
  
  -- If order_tracking record doesn't exist, create it
  INSERT OR IGNORE INTO order_tracking (
    id, 
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
  )
  SELECT 
    'track_' || NEW.id || '_' || strftime('%s', 'now'),
    NEW.id,
    NEW.order_number,
    1,
    datetime('now'),
    CASE 
      WHEN LOWER(NEW.status) IN ('packing', 'processing', 'transport', 'shipped', 'in_transit', 'delivered') THEN 1
      ELSE 0
    END,
    CASE 
      WHEN LOWER(NEW.status) IN ('packing', 'processing', 'transport', 'shipped', 'in_transit', 'delivered') THEN datetime('now')
      ELSE NULL
    END,
    CASE 
      WHEN LOWER(NEW.status) IN ('transport', 'shipped', 'in_transit', 'delivered') THEN 1
      ELSE 0
    END,
    CASE 
      WHEN LOWER(NEW.status) IN ('transport', 'shipped', 'in_transit', 'delivered') THEN datetime('now')
      ELSE NULL
    END,
    CASE 
      WHEN LOWER(NEW.status) = 'delivered' THEN 1
      ELSE 0
    END,
    CASE 
      WHEN LOWER(NEW.status) = 'delivered' THEN datetime('now')
      ELSE NULL
    END,
    datetime('now'),
    datetime('now')
  WHERE NOT EXISTS (
    SELECT 1 FROM order_tracking WHERE order_id = NEW.id
  );
END;

-- ============================================================================
-- Trigger 2: Create tracking record for new orders
-- ============================================================================
CREATE TRIGGER sync_new_order_to_tracking
AFTER INSERT ON orders
BEGIN
  -- Create order_tracking record for new orders
  INSERT OR IGNORE INTO order_tracking (
    id, 
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
  )
  VALUES (
    'track_' || NEW.id || '_' || strftime('%s', 'now'),
    NEW.id,
    NEW.order_number,
    1,
    datetime('now'),
    CASE 
      WHEN LOWER(NEW.status) IN ('packing', 'processing', 'transport', 'shipped', 'in_transit', 'delivered') THEN 1
      ELSE 0
    END,
    CASE 
      WHEN LOWER(NEW.status) IN ('packing', 'processing', 'transport', 'shipped', 'in_transit', 'delivered') THEN datetime('now')
      ELSE NULL
    END,
    CASE 
      WHEN LOWER(NEW.status) IN ('transport', 'shipped', 'in_transit', 'delivered') THEN 1
      ELSE 0
    END,
    CASE 
      WHEN LOWER(NEW.status) IN ('transport', 'shipped', 'in_transit', 'delivered') THEN datetime('now')
      ELSE NULL
    END,
    CASE 
      WHEN LOWER(NEW.status) = 'delivered' THEN 1
      ELSE 0
    END,
    CASE 
      WHEN LOWER(NEW.status) = 'delivered' THEN datetime('now')
      ELSE NULL
    END,
    datetime('now'),
    datetime('now')
  );
END;

-- ============================================================================
-- USAGE EXAMPLES
-- ============================================================================

-- Example 1: Update order to Packing status
-- UPDATE orders SET status = 'Packing' WHERE order_number = 'ORD-17438574';

-- Example 2: Update order to Transport status
-- UPDATE orders SET status = 'Transport' WHERE order_number = 'ORD-17438574';

-- Example 3: Update order to Delivered status
-- UPDATE orders SET status = 'Delivered' WHERE order_number = 'ORD-17438574';

-- Example 4: View tracking after update
-- SELECT * FROM order_tracking WHERE order_id = (
--   SELECT id FROM orders WHERE order_number = 'ORD-17438574'
-- );

-- ============================================================================
-- SUPPORTED STATUS VALUES (case-insensitive)
-- ============================================================================
-- Confirmed: 'confirmed', 'pending' (default for new orders)
-- Packing: 'packing', 'processing'
-- Transport: 'transport', 'shipped', 'in_transit'
-- Delivered: 'delivered'
-- ============================================================================
