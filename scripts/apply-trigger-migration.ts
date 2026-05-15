import client from '@/lib/db';

async function applyMigration() {
  try {
    console.log('Applying trigger migration...');
    
    // Drop existing triggers if they exist
    try {
      await client.execute({ sql: 'DROP TRIGGER IF EXISTS sync_order_status_to_tracking', args: [] });
      await client.execute({ sql: 'DROP TRIGGER IF EXISTS sync_new_order_to_tracking', args: [] });
      console.log('Dropped existing triggers');
    } catch (e) {
      console.log('No existing triggers to drop');
    }

    // Create trigger for UPDATE on orders
    const updateTriggerSQL = `
      CREATE TRIGGER sync_order_status_to_tracking
      AFTER UPDATE OF status ON orders
      BEGIN
        UPDATE order_tracking
        SET 
          packing = CASE 
            WHEN NEW.status = 'processing' OR NEW.status = 'shipped' OR NEW.status = 'in_transit' OR NEW.status = 'out_for_delivery' OR NEW.status = 'delivered' THEN 1
            ELSE 0
          END,
          packing_date = CASE 
            WHEN (NEW.status = 'processing' OR NEW.status = 'shipped' OR NEW.status = 'in_transit' OR NEW.status = 'out_for_delivery' OR NEW.status = 'delivered') 
                 AND (OLD.status != 'processing' AND OLD.status != 'shipped' AND OLD.status != 'in_transit' AND OLD.status != 'out_for_delivery' AND OLD.status != 'delivered') 
            THEN datetime('now')
            ELSE packing_date
          END,
          transport = CASE 
            WHEN NEW.status = 'shipped' OR NEW.status = 'in_transit' OR NEW.status = 'out_for_delivery' OR NEW.status = 'delivered' THEN 1
            ELSE 0
          END,
          transport_date = CASE 
            WHEN (NEW.status = 'shipped' OR NEW.status = 'in_transit' OR NEW.status = 'out_for_delivery' OR NEW.status = 'delivered')
                 AND (OLD.status != 'shipped' AND OLD.status != 'in_transit' AND OLD.status != 'out_for_delivery' AND OLD.status != 'delivered')
            THEN datetime('now')
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
        
        INSERT OR IGNORE INTO order_tracking (
          id, order_id, order_number, confirmed, confirmed_date,
          packing, packing_date, transport, transport_date, delivered, delivered_date, updated_at
        )
        SELECT 
          'track_' || NEW.id || '_' || strftime('%s', 'now'),
          NEW.id,
          NEW.order_number,
          1,
          datetime('now'),
          CASE WHEN NEW.status = 'processing' OR NEW.status = 'shipped' OR NEW.status = 'in_transit' OR NEW.status = 'out_for_delivery' OR NEW.status = 'delivered' THEN 1 ELSE 0 END,
          CASE WHEN NEW.status = 'processing' OR NEW.status = 'shipped' OR NEW.status = 'in_transit' OR NEW.status = 'out_for_delivery' OR NEW.status = 'delivered' THEN datetime('now') ELSE NULL END,
          CASE WHEN NEW.status = 'shipped' OR NEW.status = 'in_transit' OR NEW.status = 'out_for_delivery' OR NEW.status = 'delivered' THEN 1 ELSE 0 END,
          CASE WHEN NEW.status = 'shipped' OR NEW.status = 'in_transit' OR NEW.status = 'out_for_delivery' OR NEW.status = 'delivered' THEN datetime('now') ELSE NULL END,
          CASE WHEN NEW.status = 'delivered' THEN 1 ELSE 0 END,
          CASE WHEN NEW.status = 'delivered' THEN datetime('now') ELSE NULL END,
          datetime('now')
        WHERE NOT EXISTS (SELECT 1 FROM order_tracking WHERE order_id = NEW.id);
      END;
    `;

    console.log('Creating UPDATE trigger...');
    await client.execute({ sql: updateTriggerSQL, args: [] });
    console.log('UPDATE trigger created successfully');

    // Create trigger for INSERT on orders
    const insertTriggerSQL = `
      CREATE TRIGGER sync_new_order_to_tracking
      AFTER INSERT ON orders
      BEGIN
        INSERT INTO order_tracking (
          id, order_id, order_number, confirmed, confirmed_date,
          packing, packing_date, transport, transport_date, delivered, delivered_date, updated_at
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
    `;

    console.log('Creating INSERT trigger...');
    await client.execute({ sql: insertTriggerSQL, args: [] });
    console.log('INSERT trigger created successfully');
    
    console.log('Trigger migration applied successfully!');
  } catch (error) {
    console.error('Error applying migration:', error);
    throw error;
  }
}

applyMigration()
  .then(() => {
    console.log('Migration completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
