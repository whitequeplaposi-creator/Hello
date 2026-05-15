-- Trigger för att automatiskt synkronisera orders.status med order_tracking
-- När orders.status uppdateras, uppdateras motsvarande kolumner i order_tracking

-- Skapa en helper-funktion för att mappa status till tracking-värden (om databasen stöder det)
-- För SQLite/LibSQL använder vi direkt trigger-logik

-- Trigger för UPDATE på orders
CREATE TRIGGER IF NOT EXISTS sync_order_status_to_tracking
AFTER UPDATE OF status ON orders
BEGIN
  -- Uppdatera order_tracking baserat på orders.status
  UPDATE order_tracking
  SET 
    packing = CASE 
      WHEN NEW.status = 'processing' OR NEW.status = 'shipped' OR NEW.status = 'in_transit' OR NEW.status = 'out_for_delivery' OR NEW.status = 'delivered' THEN 1
      ELSE 0
    END,
    packing_date = CASE 
      WHEN NEW.status = 'processing' AND (OLD.status != 'processing' AND OLD.status != 'shipped' AND OLD.status != 'in_transit' AND OLD.status != 'out_for_delivery' AND OLD.status != 'delivered') THEN datetime('now')
      WHEN NEW.status = 'shipped' AND OLD.status != 'shipped' AND OLD.status != 'in_transit' AND OLD.status != 'out_for_delivery' AND OLD.status != 'delivered' THEN datetime('now')
      ELSE packing_date
    END,
    transport = CASE 
      WHEN NEW.status = 'shipped' OR NEW.status = 'in_transit' OR NEW.status = 'out_for_delivery' OR NEW.status = 'delivered' THEN 1
      ELSE 0
    END,
    transport_date = CASE 
      WHEN NEW.status = 'shipped' AND OLD.status != 'shipped' AND OLD.status != 'in_transit' AND OLD.status != 'out_for_delivery' AND OLD.status != 'delivered' THEN datetime('now')
      WHEN NEW.status = 'in_transit' AND OLD.status != 'in_transit' AND OLD.status != 'out_for_delivery' AND OLD.status != 'delivered' THEN datetime('now')
      ELSE transport_date
    END,
    delivered = CASE 
      WHEN NEW.status = 'delivered' THEN 1
      ELSE 0
    END,
    delivered_date = CASE 
      WHEN NEW.status = 'delivered' AND OLD.status != 'delivered' THEN datetime('now')
      ELSE delivered_date
    END,
    updated_at = datetime('now')
  WHERE order_id = NEW.id;
  
  -- Om order_tracking post inte finns, skapa en
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
    updated_at
  )
  SELECT 
    'track_' || NEW.id || '_' || strftime('%s', 'now'),
    NEW.id,
    NEW.order_number,
    1,
    datetime('now'),
    CASE 
      WHEN NEW.status = 'processing' OR NEW.status = 'shipped' OR NEW.status = 'in_transit' OR NEW.status = 'out_for_delivery' OR NEW.status = 'delivered' THEN 1
      ELSE 0
    END,
    CASE 
      WHEN NEW.status = 'processing' OR NEW.status = 'shipped' OR NEW.status = 'in_transit' OR NEW.status = 'out_for_delivery' OR NEW.status = 'delivered' THEN datetime('now')
      ELSE NULL
    END,
    CASE 
      WHEN NEW.status = 'shipped' OR NEW.status = 'in_transit' OR NEW.status = 'out_for_delivery' OR NEW.status = 'delivered' THEN 1
      ELSE 0
    END,
    CASE 
      WHEN NEW.status = 'shipped' OR NEW.status = 'in_transit' OR NEW.status = 'out_for_delivery' OR NEW.status = 'delivered' THEN datetime('now')
      ELSE NULL
    END,
    CASE 
      WHEN NEW.status = 'delivered' THEN 1
      ELSE 0
    END,
    CASE 
      WHEN NEW.status = 'delivered' THEN datetime('now')
      ELSE NULL
    END,
    datetime('now')
  WHERE NOT EXISTS (
    SELECT 1 FROM order_tracking WHERE order_id = NEW.id
  );
END;

-- Trigger för INSERT på orders
CREATE TRIGGER IF NOT EXISTS sync_new_order_to_tracking
AFTER INSERT ON orders
BEGIN
  -- Skapa order_tracking post för nya ordrar
  INSERT INTO order_tracking (
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
    updated_at
  )
  VALUES (
    'track_' || NEW.id || '_' || strftime('%s', 'now'),
    NEW.id,
    NEW.order_number,
    1,
    datetime('now'),
    0,
    NULL,
    0,
    NULL,
    0,
    NULL,
    datetime('now')
  );
END;
