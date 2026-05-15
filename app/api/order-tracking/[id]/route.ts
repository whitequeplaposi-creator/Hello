import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    
    // Verifiera att orderId är giltig
    if (!orderId || typeof orderId !== 'string') {
      return NextResponse.json(
        { error: 'Ogiltig order-ID' },
        { status: 400 }
      );
    }
    
    // Hämta order-status från orders tabellen för att synka
    const orderResponse = await client.execute({
      sql: `
        SELECT status FROM orders WHERE id = ?
      `,
      args: [orderId]
    });

    const orderStatus = orderResponse.rows.length > 0 ? orderResponse.rows[0].status : null;
    
    // Hämta befintlig tracking
    const response = await client.execute({
      sql: `
        SELECT * FROM order_tracking WHERE order_id = ?
      `,
      args: [orderId]
    });

    const now = new Date().toISOString();
    
    if (response.rows.length === 0) {
      // Om ingen tracking finns men order finns, skapa den baserat på order-status
      if (orderStatus) {
        const trackingId = `track_${orderId}_${Date.now()}`;
        let trackingData: any = {
          confirmed: 0,
          confirmed_date: null,
          packing: 0,
          packing_date: null,
          transport: 0,
          transport_date: null,
          delivered: 0,
          delivered_date: null
        };

        // Sätt tracking baserat på order-status
        if (orderStatus === 'pending' || orderStatus === 'processing' || orderStatus === 'confirmed') {
          trackingData.confirmed = 1;
          trackingData.confirmed_date = now;
        } else if (orderStatus === 'shipped' || orderStatus === 'packing') {
          trackingData.confirmed = 1;
          trackingData.confirmed_date = now;
          trackingData.packing = 1;
          trackingData.packing_date = now;
        } else if (orderStatus === 'transport') {
          trackingData.confirmed = 1;
          trackingData.confirmed_date = now;
          trackingData.packing = 1;
          trackingData.packing_date = now;
          trackingData.transport = 1;
          trackingData.transport_date = now;
        } else if (orderStatus === 'delivered') {
          trackingData.confirmed = 1;
          trackingData.confirmed_date = now;
          trackingData.packing = 1;
          trackingData.packing_date = now;
          trackingData.transport = 1;
          trackingData.transport_date = now;
          trackingData.delivered = 1;
          trackingData.delivered_date = now;
        }

        await client.execute({
          sql: `
            INSERT INTO order_tracking 
            (id, order_id, confirmed, confirmed_date, packing, packing_date, transport, transport_date, delivered, delivered_date, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          args: [
            trackingId,
            orderId,
            trackingData.confirmed,
            trackingData.confirmed_date,
            trackingData.packing,
            trackingData.packing_date,
            trackingData.transport,
            trackingData.transport_date,
            trackingData.delivered,
            trackingData.delivered_date,
            now,
            now
          ]
        });

        // Hämta den nya tracking-posten
        const newResponse = await client.execute({
          sql: `SELECT * FROM order_tracking WHERE order_id = ?`,
          args: [orderId]
        });

        return NextResponse.json({
          success: true,
          tracking: newResponse.rows[0]
        }, {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
      }

      return NextResponse.json({
        success: false,
        tracking: null
      });
    }

    // Om tracking finns, synka med order-status om den har ändrats
    const existingTracking = response.rows[0];
    let needsUpdate = false;
    let trackingData = {
      confirmed: existingTracking.confirmed || 0,
      confirmed_date: existingTracking.confirmed_date,
      packing: existingTracking.packing || 0,
      packing_date: existingTracking.packing_date,
      transport: existingTracking.transport || 0,
      transport_date: existingTracking.transport_date,
      delivered: existingTracking.delivered || 0,
      delivered_date: existingTracking.delivered_date
    };

    if (orderStatus) {
      // Synka tracking baserat på order-status - STRIKT STEG-FÖR-STEG
      if (orderStatus === 'pending' || orderStatus === 'processing' || orderStatus === 'confirmed') {
        if (!trackingData.confirmed || trackingData.confirmed !== 1) {
          trackingData.confirmed = 1;
          if (!trackingData.confirmed_date) trackingData.confirmed_date = now;
          needsUpdate = true;
        }
        // Återställ framtida steg
        if (trackingData.packing === 1) {
          trackingData.packing = 0;
          trackingData.packing_date = null;
          needsUpdate = true;
        }
        if (trackingData.transport === 1) {
          trackingData.transport = 0;
          trackingData.transport_date = null;
          needsUpdate = true;
        }
        if (trackingData.delivered === 1) {
          trackingData.delivered = 0;
          trackingData.delivered_date = null;
          needsUpdate = true;
        }
      } else if (orderStatus === 'shipped' || orderStatus === 'packing') {
        if (!trackingData.confirmed || trackingData.confirmed !== 1) {
          trackingData.confirmed = 1;
          if (!trackingData.confirmed_date) trackingData.confirmed_date = now;
          needsUpdate = true;
        }
        if (!trackingData.packing || trackingData.packing !== 1) {
          trackingData.packing = 1;
          if (!trackingData.packing_date) trackingData.packing_date = now;
          needsUpdate = true;
        }
        // Återställ framtida steg
        if (trackingData.transport === 1) {
          trackingData.transport = 0;
          trackingData.transport_date = null;
          needsUpdate = true;
        }
        if (trackingData.delivered === 1) {
          trackingData.delivered = 0;
          trackingData.delivered_date = null;
          needsUpdate = true;
        }
      } else if (orderStatus === 'transport') {
        if (!trackingData.confirmed || trackingData.confirmed !== 1) {
          trackingData.confirmed = 1;
          if (!trackingData.confirmed_date) trackingData.confirmed_date = now;
          needsUpdate = true;
        }
        if (!trackingData.packing || trackingData.packing !== 1) {
          trackingData.packing = 1;
          if (!trackingData.packing_date) trackingData.packing_date = now;
          needsUpdate = true;
        }
        if (!trackingData.transport || trackingData.transport !== 1) {
          trackingData.transport = 1;
          if (!trackingData.transport_date) trackingData.transport_date = now;
          needsUpdate = true;
        }
        // Återställ framtida steg
        if (trackingData.delivered === 1) {
          trackingData.delivered = 0;
          trackingData.delivered_date = null;
          needsUpdate = true;
        }
      } else if (orderStatus === 'delivered') {
        if (!trackingData.confirmed || trackingData.confirmed !== 1) {
          trackingData.confirmed = 1;
          if (!trackingData.confirmed_date) trackingData.confirmed_date = now;
          needsUpdate = true;
        }
        if (!trackingData.packing || trackingData.packing !== 1) {
          trackingData.packing = 1;
          if (!trackingData.packing_date) trackingData.packing_date = now;
          needsUpdate = true;
        }
        if (!trackingData.transport || trackingData.transport !== 1) {
          trackingData.transport = 1;
          if (!trackingData.transport_date) trackingData.transport_date = now;
          needsUpdate = true;
        }
        if (!trackingData.delivered || trackingData.delivered !== 1) {
          trackingData.delivered = 1;
          if (!trackingData.delivered_date) trackingData.delivered_date = now;
          needsUpdate = true;
        }
      }
    }

    // Uppdatera tracking om nödvändigt
    if (needsUpdate) {
      await client.execute({
        sql: `
          UPDATE order_tracking 
          SET confirmed = ?, confirmed_date = ?,
              packing = ?, packing_date = ?,
              transport = ?, transport_date = ?,
              delivered = ?, delivered_date = ?,
              updated_at = ?
          WHERE order_id = ?
        `,
        args: [
          trackingData.confirmed,
          trackingData.confirmed_date,
          trackingData.packing,
          trackingData.packing_date,
          trackingData.transport,
          trackingData.transport_date,
          trackingData.delivered,
          trackingData.delivered_date,
          now,
          orderId
        ]
      });

      // Hämta uppdaterad tracking
      const updatedResponse = await client.execute({
        sql: `SELECT * FROM order_tracking WHERE order_id = ?`,
        args: [orderId]
      });

      return NextResponse.json({
        success: true,
        tracking: updatedResponse.rows[0]
      }, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }

    // Returnera med no-cache headers för att undvika caching
    return NextResponse.json({
      success: true,
      tracking: response.rows[0]
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error fetching order tracking:', error);
    return NextResponse.json(
      { error: 'Internt serverfel' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    const body = await request.json();
    const { status, products, order_number } = body;

    // Validera att status är giltig
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'confirmed', 'packing', 'transport'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Ogiltig status. Måste vara en av: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Hämta befintlig tracking för att validera steg-för-steg progression
    const existingResponse = await client.execute({
      sql: `
        SELECT * FROM order_tracking WHERE order_id = ?
      `,
      args: [orderId]
    });

    const now = new Date().toISOString();
    let trackingData: any = {
      confirmed: 0,
      confirmed_date: null,
      packing: 0,
      packing_date: null,
      transport: 0,
      transport_date: null,
      delivered: 0,
      delivered_date: null
    };

    // Om tracking finns, behåll befintliga datum
    if (existingResponse.rows.length > 0) {
      const existing = existingResponse.rows[0];
      trackingData = {
        confirmed: existing.confirmed || 0,
        confirmed_date: existing.confirmed_date,
        packing: existing.packing || 0,
        packing_date: existing.packing_date,
        transport: existing.transport || 0,
        transport_date: existing.transport_date,
        delivered: existing.delivered || 0,
        delivered_date: existing.delivered_date
      };
    }

    // Uppdatera tracking baserat på ny status - STRIKT STEG-FÖR-STEG
    // Varje status sätter endast sitt eget steg och alla tidigare steg
    if (status === 'pending' || status === 'processing' || status === 'confirmed') {
      trackingData.confirmed = 1;
      if (!trackingData.confirmed_date) trackingData.confirmed_date = now;
      // Säkerställ att framtida steg är 0
      trackingData.packing = 0;
      trackingData.transport = 0;
      trackingData.delivered = 0;
    } else if (status === 'shipped' || status === 'packing') {
      // Validera att confirmed är satt
      if (trackingData.confirmed !== 1) {
        trackingData.confirmed = 1;
        if (!trackingData.confirmed_date) trackingData.confirmed_date = now;
      }
      trackingData.packing = 1;
      if (!trackingData.packing_date) trackingData.packing_date = now;
      // Säkerställ att framtida steg är 0
      trackingData.transport = 0;
      trackingData.delivered = 0;
    } else if (status === 'transport') {
      // Validera att confirmed och packing är satta
      if (trackingData.confirmed !== 1) {
        trackingData.confirmed = 1;
        if (!trackingData.confirmed_date) trackingData.confirmed_date = now;
      }
      if (trackingData.packing !== 1) {
        trackingData.packing = 1;
        if (!trackingData.packing_date) trackingData.packing_date = now;
      }
      trackingData.transport = 1;
      if (!trackingData.transport_date) trackingData.transport_date = now;
      // Säkerställ att framtida steg är 0
      trackingData.delivered = 0;
    } else if (status === 'delivered') {
      // Validera att alla tidigare steg är satta
      if (trackingData.confirmed !== 1) {
        trackingData.confirmed = 1;
        if (!trackingData.confirmed_date) trackingData.confirmed_date = now;
      }
      if (trackingData.packing !== 1) {
        trackingData.packing = 1;
        if (!trackingData.packing_date) trackingData.packing_date = now;
      }
      if (trackingData.transport !== 1) {
        trackingData.transport = 1;
        if (!trackingData.transport_date) trackingData.transport_date = now;
      }
      trackingData.delivered = 1;
      if (!trackingData.delivered_date) trackingData.delivered_date = now;
    }

    if (existingResponse.rows.length > 0) {
      // Update existing record
      await client.execute({
        sql: `
          UPDATE order_tracking 
          SET order_number = ?,
              confirmed = ?, confirmed_date = ?,
              packing = ?, packing_date = ?,
              transport = ?, transport_date = ?,
              delivered = ?, delivered_date = ?,
              products = ?,
              updated_at = ?
          WHERE order_id = ?
        `,
        args: [
          order_number || null,
          trackingData.confirmed,
          trackingData.confirmed_date,
          trackingData.packing,
          trackingData.packing_date,
          trackingData.transport,
          trackingData.transport_date,
          trackingData.delivered,
          trackingData.delivered_date,
          products || null,
          now,
          orderId
        ]
      });
    } else {
      // Create new record
      const trackingId = `track_${orderId}_${Date.now()}`;
      await client.execute({
        sql: `
          INSERT INTO order_tracking 
          (id, order_id, order_number, confirmed, confirmed_date, packing, packing_date, transport, transport_date, delivered, delivered_date, products, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          trackingId,
          orderId,
          order_number || null,
          trackingData.confirmed,
          trackingData.confirmed_date,
          trackingData.packing,
          trackingData.packing_date,
          trackingData.transport,
          trackingData.transport_date,
          trackingData.delivered,
          trackingData.delivered_date,
          products || null,
          now,
          now
        ]
      });
    }

    // Update the main order status - använd den status som skickades in
    if (status) {
      await client.execute({
        sql: `
          UPDATE orders SET status = ?, updated_at = ? WHERE id = ?
        `,
        args: [status, now, orderId]
      });
    }

    // Fetch updated tracking
    const trackingResponse = await client.execute({
      sql: `
        SELECT * FROM order_tracking WHERE order_id = ?
      `,
      args: [orderId]
    });

    return NextResponse.json({
      success: true,
      message: `Order status uppdaterad till: ${status}`,
      tracking: trackingResponse.rows[0]
    });
  } catch (error) {
    console.error('Error updating order tracking:', error);
    return NextResponse.json(
      { error: 'Internt serverfel' },
      { status: 500 }
    );
  }
}
