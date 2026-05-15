import client from './db';
import { Shipment, ShipmentEvent, ShipmentWithEvents } from './types/customer';

// Hämta alla leveranser för en kund
export async function getCustomerShipments(customerId: string): Promise<ShipmentWithEvents[]> {
  try {
    const result = await client.execute({
      sql: `
        SELECT s.*, o.order_number, o.total_amount, o.id as order_id_full,
               ot.confirmed, ot.packing, ot.transport, ot.delivered,
               ot.confirmed_date, ot.packing_date, ot.transport_date, ot.delivered_date
        FROM shipments s
        JOIN orders o ON s.order_id = o.id
        LEFT JOIN order_tracking ot ON o.id = ot.order_id
        WHERE o.customer_id = ?
        ORDER BY s.created_at DESC
      `,
      args: [customerId]
    });

    const shipments: ShipmentWithEvents[] = [];
    
    for (const row of result.rows) {
      const shipmentId = row.id?.toString() || '';
      const orderId = row.order_id?.toString() || '';
      
      // Synkronisera shipment status med order_tracking
      let shipmentStatus = row.status?.toString() as any || 'pending';
      const tracking = {
        confirmed: row.confirmed || 0,
        packing: row.packing || 0,
        transport: row.transport || 0,
        delivered: row.delivered || 0
      };

      // Uppdatera status baserat på tracking
      if (tracking.delivered === 1) {
        shipmentStatus = 'delivered';
      } else if (tracking.transport === 1) {
        shipmentStatus = 'in_transit';
      } else if (tracking.packing === 1) {
        shipmentStatus = 'processing';
      } else if (tracking.confirmed === 1) {
        shipmentStatus = 'pending';
      }

      // Uppdatera shipment i databasen om status har ändrats
      if (shipmentStatus !== row.status?.toString()) {
        await client.execute({
          sql: `
            UPDATE shipments 
            SET status = ?,
                actual_delivery_date = ?,
                updated_at = ?
            WHERE id = ?
          `,
          args: [
            shipmentStatus,
            tracking.delivered === 1 ? row.delivered_date?.toString() : null,
            new Date().toISOString(),
            shipmentId
          ]
        });
      }
      
      // Hämta händelser för varje leverans
      const eventsResult = await client.execute({
        sql: 'SELECT * FROM shipment_events WHERE shipment_id = ? ORDER BY event_date DESC',
        args: [shipmentId]
      });

      const events: ShipmentEvent[] = eventsResult.rows.map(eventRow => ({
        id: eventRow.id?.toString() || '',
        shipment_id: eventRow.shipment_id?.toString() || '',
        status: eventRow.status?.toString() || '',
        location: eventRow.location?.toString(),
        description: eventRow.description?.toString() || '',
        event_date: eventRow.event_date?.toString() || '',
        created_at: eventRow.created_at?.toString() || ''
      }));

      shipments.push({
        id: shipmentId,
        order_id: orderId,
        tracking_number: row.tracking_number?.toString(),
        carrier: row.carrier?.toString() as any || 'Other',
        status: shipmentStatus,
        shipped_date: row.shipped_date?.toString(),
        estimated_delivery_date: row.estimated_delivery_date?.toString(),
        actual_delivery_date: tracking.delivered === 1 ? row.delivered_date?.toString() : row.actual_delivery_date?.toString(),
        shipping_address: row.shipping_address?.toString() || '',
        weight_kg: row.weight_kg ? parseFloat(row.weight_kg.toString()) : undefined,
        dimensions: row.dimensions?.toString(),
        notes: row.notes?.toString(),
        created_at: row.created_at?.toString() || '',
        updated_at: row.updated_at?.toString() || '',
        events,
        order: {
          id: orderId,
          customer_id: customerId,
          order_number: row.order_number?.toString() || '',
          status: 'transport',
          total_amount: parseFloat(row.total_amount?.toString() || '0'),
          currency: 'USD',
          payment_status: 'paid',
          created_at: '',
          updated_at: ''
        }
      });
    }

    return shipments;
  } catch (error) {
    console.error('Error fetching customer shipments:', error);
    return [];
  }
}

// Hämta en specifik leverans med alla detaljer
export async function getShipmentDetails(shipmentId: string): Promise<ShipmentWithEvents | null> {
  try {
    const result = await client.execute({
      sql: 'SELECT * FROM shipments WHERE id = ?',
      args: [shipmentId]
    });

    if (result.rows.length === 0) return null;

    const row = result.rows[0];

    // Hämta händelser
    const eventsResult = await client.execute({
      sql: 'SELECT * FROM shipment_events WHERE shipment_id = ? ORDER BY event_date DESC',
      args: [shipmentId]
    });

    const events: ShipmentEvent[] = eventsResult.rows.map(eventRow => ({
      id: eventRow.id?.toString() || '',
      shipment_id: eventRow.shipment_id?.toString() || '',
      status: eventRow.status?.toString() || '',
      location: eventRow.location?.toString(),
      description: eventRow.description?.toString() || '',
      event_date: eventRow.event_date?.toString() || '',
      created_at: eventRow.created_at?.toString() || ''
    }));

    return {
      id: row.id?.toString() || '',
      order_id: row.order_id?.toString() || '',
      tracking_number: row.tracking_number?.toString(),
      carrier: row.carrier?.toString() as any || 'Other',
      status: row.status?.toString() as any || 'pending',
      shipped_date: row.shipped_date?.toString(),
      estimated_delivery_date: row.estimated_delivery_date?.toString(),
      actual_delivery_date: row.actual_delivery_date?.toString(),
      shipping_address: row.shipping_address?.toString() || '',
      weight_kg: row.weight_kg ? parseFloat(row.weight_kg.toString()) : undefined,
      dimensions: row.dimensions?.toString(),
      notes: row.notes?.toString(),
      created_at: row.created_at?.toString() || '',
      updated_at: row.updated_at?.toString() || '',
      events
    };
  } catch (error) {
    console.error('Error fetching shipment details:', error);
    return null;
  }
}

// Lägg till en ny händelse för en leverans
export async function addShipmentEvent(
  shipmentId: string,
  status: string,
  description: string,
  location?: string
): Promise<boolean> {
  try {
    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    await client.execute({
      sql: `
        INSERT INTO shipment_events (id, shipment_id, status, location, description, event_date)
        VALUES (?, ?, ?, ?, ?, datetime('now'))
      `,
      args: [eventId, shipmentId, status, location || null, description]
    });

    return true;
  } catch (error) {
    console.error('Error adding shipment event:', error);
    return false;
  }
}

// Uppdatera leveransstatus
export async function updateShipmentStatus(
  shipmentId: string,
  status: Shipment['status'],
  actualDeliveryDate?: string
): Promise<boolean> {
  try {
    await client.execute({
      sql: `
        UPDATE shipments 
        SET status = ?, 
            actual_delivery_date = ?,
            updated_at = datetime('now')
        WHERE id = ?
      `,
      args: [status, actualDeliveryDate || null, shipmentId]
    });

    return true;
  } catch (error) {
    console.error('Error updating shipment status:', error);
    return false;
  }
}
