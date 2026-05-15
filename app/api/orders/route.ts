import { NextRequest, NextResponse } from 'next/server';
import * as customerDb from '@/lib/customerDb';
import client from '@/lib/db';
import Stripe from 'stripe';

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY saknas');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-04-22.dahlia',
  });
}

export async function GET(request: NextRequest) {
  try {
    const response = await client.execute({
      sql: `
        SELECT 
          o.*,
          c.name as customer_name,
          c.email as customer_email
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.id
        ORDER BY o.created_at DESC
      `,
      args: []
    });

    const orders = await Promise.all(response.rows.map(async (row: any) => {
      // Fetch order items
      const itemsResponse = await client.execute({
        sql: `
          SELECT oi.*, e.Image, e.namn as product_name, e.price as product_price
          FROM order_items oi
          LEFT JOIN Eprolo e ON oi.product_id = e.id
          WHERE oi.order_id = ?
        `,
        args: [row.id]
      });

      const items = itemsResponse.rows.map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        name: item.product_name || item.name,
        quantity: item.quantity,
        price: item.price,
        currency: item.currency || 'USD',
        image: item.Image ? item.Image.split(', ')[0] : null
      }));

      return {
        id: row.id,
        order_number: row.order_number,
        customer_id: row.customer_id,
        customer_name: row.customer_name,
        customer_email: row.customer_email,
        status: row.status,
        total_amount: row.total_amount,
        currency: row.currency,
        payment_method: row.payment_method,
        payment_status: row.payment_status,
        created_at: row.created_at,
        updated_at: row.updated_at,
        items
      };
    }));

    return NextResponse.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internt serverfel' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, customerData, orderData } = body;

    console.log('📦 Order API called:', {
      hasCustomerId: !!customerId,
      hasCustomerData: !!customerData,
      hasOrderData: !!orderData,
      createBeforePayment: orderData?.createBeforePayment
    });

    // Om createBeforePayment är true, skapa ordern utan att verifiera betalning
    const createBeforePayment = orderData?.createBeforePayment === true;

    // KRITISKT: Verifiera betalningen med Stripe ENDAST om ordern skapas efter betalning
    if (!createBeforePayment && orderData.paymentIntentId) {
      console.log('🔍 Verifying payment with Stripe:', orderData.paymentIntentId);
      
      let paymentIntent;
      try {
        paymentIntent = await getStripe().paymentIntents.retrieve(orderData.paymentIntentId);
      } catch (stripeError: any) {
        console.error('❌ Stripe verification failed:', stripeError.message);
        return NextResponse.json(
          { error: 'Kunde inte verifiera betalningen' },
          { status: 400 }
        );
      }

      // Kontrollera att betalningen faktiskt har genomförts
      if (paymentIntent.status !== 'succeeded') {
        console.error('❌ Payment not succeeded:', paymentIntent.status);
        return NextResponse.json(
          { error: `Betalningen har inte genomförts. Status: ${paymentIntent.status}` },
          { status: 400 }
        );
      }

      // Kontrollera att beloppet stämmer
      const expectedAmount = Math.round(orderData.totalAmount * 100);
      if (paymentIntent.amount !== expectedAmount) {
        console.error('❌ Amount mismatch:', {
          expected: expectedAmount,
          received: paymentIntent.amount
        });
        return NextResponse.json(
          { error: 'Betalningsbeloppet stämmer inte' },
          { status: 400 }
        );
      }

      console.log('✅ Payment verified successfully:', {
        amount: paymentIntent.amount / 100,
        status: paymentIntent.status,
        id: paymentIntent.id
      });
    }

    let finalCustomerId: string | null = null;

    // Validera customer data
    if (!customerData || !customerData.email || !customerData.firstName) {
      console.error('❌ Missing required customer data:', { 
        hasCustomerData: !!customerData,
        hasEmail: !!customerData?.email, 
        hasFirstName: !!customerData?.firstName 
      });
      return NextResponse.json(
        { error: 'E-post och förnamn krävs för att skapa beställning' },
        { status: 400 }
      );
    }

    console.log('👤 Processing customer...', { 
      providedCustomerId: customerId,
      email: customerData.email 
    });
    
    try {
      // Om användaren är inloggad (customerId finns), använd det ID:t
      if (customerId && customerId.trim()) {
        console.log('👤 User is logged in, checking customer ID:', customerId);
        const existingCustomer = await customerDb.getCustomer(customerId);
        
        if (existingCustomer) {
          // Verifiera att e-posten matchar
          if (existingCustomer.email.toLowerCase() === customerData.email.toLowerCase()) {
            finalCustomerId = existingCustomer.id;
            console.log('✅ Using logged-in customer ID:', finalCustomerId);
          } else {
            console.warn('⚠️ Email mismatch for logged-in user, looking up by email instead');
            // E-posten matchar inte, sök efter kund med rätt e-post
            const customerByEmail = await customerDb.getCustomerByEmail(customerData.email);
            if (customerByEmail) {
              finalCustomerId = customerByEmail.id;
              console.log('✅ Found customer by email:', finalCustomerId);
            }
          }
        } else {
          console.warn('⚠️ Logged-in customer ID not found in database, will create/find by email');
        }
      }
      
      // Om vi inte har ett customer ID än, hitta eller skapa baserat på e-post
      if (!finalCustomerId) {
        console.log('👤 Looking up customer by email...', { email: customerData.email });
        const existingCustomer = await customerDb.getCustomerByEmail(customerData.email);
        
        if (existingCustomer) {
          finalCustomerId = existingCustomer.id;
          console.log('✅ Found existing customer by email:', finalCustomerId);
        } else {
          // Skapa ny kund (använd customerId från frontend om det finns)
          console.log('👤 Creating new customer...', {
            useProvidedId: !!customerId,
            email: customerData.email,
            firstName: customerData.firstName,
            lastName: customerData.lastName || customerData.firstName,
            phone: customerData.phone
          });
          
          const newCustomer = await customerDb.createCustomer(
            customerData.email,
            customerData.firstName,
            customerData.lastName || customerData.firstName,
            customerData.phone,
            customerId || undefined // Använd customerId från frontend om det finns
          );

          if (!newCustomer) {
            console.error('❌ Failed to create customer - createCustomer returned null');
            return NextResponse.json(
              { error: 'Kunde inte skapa kund i databasen. Kontrollera att alla uppgifter är korrekta.' },
              { status: 500 }
            );
          }
          finalCustomerId = newCustomer.id;
          console.log('✅ New customer created:', finalCustomerId);
        }
      }
    } catch (dbError: any) {
      console.error('❌ Database error during customer lookup/creation:', dbError.message);
      console.error('❌ Error stack:', dbError.stack);
      return NextResponse.json(
        { error: 'Databasfel vid kundskapande: ' + dbError.message },
        { status: 500 }
      );
    }

    if (!finalCustomerId) {
      console.error('❌ Failed to get or create customer');
      return NextResponse.json(
        { error: 'Kunde inte identifiera eller skapa kund' },
        { status: 500 }
      );
    }

    // Lägg till leveransadress
    console.log('📍 Adding shipping address...');
    try {
      await customerDb.addCustomerAddress(finalCustomerId, {
        type: 'shipping',
        name: `${customerData.firstName} ${customerData.lastName || customerData.firstName}`,
        address: customerData.address,
        city: customerData.city,
        zip: customerData.zip,
        country: customerData.country || 'Sverige'
      });
      console.log('✅ Address added');
    } catch (addressError) {
      console.error('⚠️ Address error:', addressError);
    }

    // Skapa beställning med rätt betalningsstatus
    console.log('🛒 Creating order...');
    const paymentStatus = createBeforePayment ? 'pending' : 'paid';
    
    // Validera order items
    if (!orderData.items || orderData.items.length === 0) {
      console.error('❌ No items in order');
      return NextResponse.json(
        { error: 'Ordern måste innehålla minst en produkt' },
        { status: 400 }
      );
    }

    console.log('📦 Order data before creation:', {
      customerId: finalCustomerId,
      totalAmount: orderData.totalAmount || orderData.total_amount,
      itemsCount: orderData.items.length,
      paymentStatus
    });
    
    let order;
    try {
      order = await customerDb.createOrder(finalCustomerId, customerData, {
        totalAmount: orderData.totalAmount || orderData.total_amount,
        paymentMethod: orderData.paymentMethod || orderData.payment_method || 'card',
        paymentIntentId: orderData.paymentIntentId,
        notes: orderData.notes,
        items: orderData.items,
        paymentStatus: paymentStatus, // Sätt status baserat på om betalning är klar
      });
    } catch (createError: any) {
      console.error('❌ Exception during order creation:', createError.message);
      console.error('Error stack:', createError.stack);
      return NextResponse.json(
        { 
          error: 'Kunde inte skapa beställning',
          details: createError.message 
        },
        { status: 500 }
      );
    }

    if (!order) {
      console.error('❌ Failed to create order');
      return NextResponse.json(
        { error: 'Kunde inte skapa beställning' },
        { status: 500 }
      );
    }
    console.log('✅ Order created:', order.id, 'Payment status:', paymentStatus);

    // Skapa tracking-post för ordern
    try {
      console.log('📍 Creating order tracking...');
      const trackingId = `track_${order.id}_${Date.now()}`;
      const now = new Date().toISOString();
      
      // Alla nya orders börjar som "confirmed"
      await client.execute({
        sql: `
          INSERT INTO order_tracking 
          (id, order_id, order_number, confirmed, confirmed_date, packing, packing_date, 
           transport, transport_date, delivered, delivered_date, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          trackingId,
          order.id,
          order.order_number,
          1, // confirmed = true
          now, // confirmed_date
          0, // packing = false
          null,
          0, // transport = false
          null,
          0, // delivered = false
          null,
          now,
          now
        ]
      });
      console.log('✅ Order tracking created:', trackingId);
    } catch (trackingError) {
      console.error('⚠️ Tracking error:', trackingError);
    }

    // Skapa automatisk leverans för ordern ENDAST om betalningen är klar
    if (!createBeforePayment) {
      try {
        console.log('🚚 Creating shipment...');
        const shipmentId = `ship_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const trackingNumber = `TRK${Date.now().toString().slice(-10)}`;
        
        const shippedDate = new Date();
        const estimatedDeliveryDate = new Date();
        estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 4);

        const shippingAddress = customerData 
          ? `${customerData.address}, ${customerData.zip} ${customerData.city}, ${customerData.country || 'Sverige'}`
          : 'Adress saknas';

        let carrier = 'PostNord';
        if (orderData.notes?.includes('Express')) {
          carrier = 'DHL';
        }

        await client.execute({
          sql: `
            INSERT INTO shipments 
            (id, order_id, tracking_number, carrier, status, shipped_date, estimated_delivery_date, shipping_address)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
          args: [
            shipmentId,
            order.id,
            trackingNumber,
            carrier,
            'pending',
            shippedDate.toISOString(),
            estimatedDeliveryDate.toISOString(),
            shippingAddress
          ]
        });

        const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        await client.execute({
          sql: `
            INSERT INTO shipment_events (id, shipment_id, status, description, event_date)
            VALUES (?, ?, ?, ?, ?)
          `,
          args: [
            eventId,
            shipmentId,
            'confirmed',
            'Beställning mottagen och förbereds för leverans',
            new Date().toISOString()
          ]
        });

        console.log('✅ Shipment created:', shipmentId);
      } catch (shipmentError) {
        console.error('⚠️ Shipment error:', shipmentError);
      }
    }

    console.log('✅ Order completed successfully');
    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
      customerId: finalCustomerId
    });

  } catch (error: any) {
    console.error('❌ Order API error:', error);
    return NextResponse.json(
      { 
        error: 'Internt serverfel',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, paymentStatus, paymentIntentId, paymentError } = body;

    console.log('🔄 Updating order:', {
      orderId,
      paymentStatus,
      hasPaymentIntentId: !!paymentIntentId,
      hasPaymentError: !!paymentError
    });

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID saknas' },
        { status: 400 }
      );
    }

    // Uppdatera orderstatus
    const fields = ['updated_at = ?'];
    const values: any[] = [new Date().toISOString()];

    if (paymentStatus) {
      fields.push('payment_status = ?');
      values.push(paymentStatus);
    }

    if (paymentIntentId && !paymentError) {
      // payment_intent_id column does not exist in schema; store in notes instead
      fields.push('notes = ?');
      values.push(`payment_intent:${paymentIntentId}`);
    }

    if (paymentError) {
      fields.push('notes = ?');
      const noteValue = paymentIntentId
        ? `payment_intent:${paymentIntentId} | Betalningsfel: ${paymentError}`
        : `Betalningsfel: ${paymentError}`;
      values.push(noteValue);
    }

    values.push(orderId);

    await client.execute({
      sql: `UPDATE orders SET ${fields.join(', ')} WHERE id = ?`,
      args: values
    });

    // Om betalningen lyckades, skapa tracking och leverans
    if (paymentStatus === 'paid') {
      // Skapa tracking om den inte finns
      try {
        console.log('📍 Checking/creating order tracking...');
        const trackingCheck = await client.execute({
          sql: 'SELECT id FROM order_tracking WHERE order_id = ?',
          args: [orderId]
        });

        if (trackingCheck.rows.length === 0) {
          const trackingId = `track_${orderId}_${Date.now()}`;
          const now = new Date().toISOString();
          
          const orderResult = await client.execute({
            sql: 'SELECT order_number FROM orders WHERE id = ?',
            args: [orderId]
          });
          
          const orderNumber = orderResult.rows[0]?.order_number;
          
          await client.execute({
            sql: `
              INSERT INTO order_tracking 
              (id, order_id, order_number, confirmed, confirmed_date, packing, packing_date, 
               transport, transport_date, delivered, delivered_date, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            args: [
              trackingId,
              orderId,
              orderNumber,
              1, // confirmed = true
              now,
              0, // packing = false
              null,
              0, // transport = false
              null,
              0, // delivered = false
              null,
              now,
              now
            ]
          });
          console.log('✅ Order tracking created:', trackingId);
        } else {
          console.log('✅ Order tracking already exists');
        }
      } catch (trackingError) {
        console.error('⚠️ Tracking error:', trackingError);
      }

      try {
        console.log('🚚 Creating shipment for paid order...');
        
        // Hämta orderinformation
        const orderResult = await client.execute({
          sql: 'SELECT * FROM orders WHERE id = ?',
          args: [orderId]
        });

        if (orderResult.rows.length > 0) {
          const order = orderResult.rows[0];
          const customerId = order.customer_id?.toString();

          // Hämta kundadress
          let shippingAddress = 'Adress saknas';
          if (customerId) {
            const addressResult = await client.execute({
              sql: 'SELECT * FROM customer_addresses WHERE customer_id = ? AND address_type = ? ORDER BY created_at DESC LIMIT 1',
              args: [customerId, 'shipping']
            });

            if (addressResult.rows.length > 0) {
              const addr = addressResult.rows[0];
              shippingAddress = `${addr.street}, ${addr.postal_code} ${addr.city}, ${addr.country}`;
            }
          }

          const shipmentId = `ship_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
          const trackingNumber = `TRK${Date.now().toString().slice(-10)}`;
          
          const shippedDate = new Date();
          const estimatedDeliveryDate = new Date();
          estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 4);

          await client.execute({
            sql: `
              INSERT INTO shipments 
              (id, order_id, tracking_number, carrier, status, shipped_date, estimated_delivery_date, shipping_address)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
            args: [
              shipmentId,
              orderId,
              trackingNumber,
              'PostNord',
              'confirmed',
              shippedDate.toISOString(),
              estimatedDeliveryDate.toISOString(),
              shippingAddress
            ]
          });

          const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
          await client.execute({
            sql: `
              INSERT INTO shipment_events (id, shipment_id, status, description, event_date)
              VALUES (?, ?, ?, ?, ?)
            `,
            args: [
              eventId,
              shipmentId,
              'confirmed',
              'Beställning mottagen och förbereds för leverans',
              new Date().toISOString()
            ]
          });

          console.log('✅ Shipment created:', shipmentId);
        }
      } catch (shipmentError) {
        console.error('⚠️ Shipment error:', shipmentError);
      }
    }

    console.log('✅ Order updated successfully');
    return NextResponse.json({
      success: true,
      orderId
    });

  } catch (error: any) {
    console.error('❌ Order update error:', error);
    return NextResponse.json(
      { 
        error: 'Internt serverfel',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
