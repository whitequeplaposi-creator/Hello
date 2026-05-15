import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import client from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
});

// App Router: raw body via request.text() (inte Pages `bodyParser: false`)
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  // Om webhook secret finns, verifiera signaturen
  if (webhookSecret && signature) {
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('❌ Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }
  } else {
    // Utan webhook secret, parsa bara JSON (för lokal testning)
    // VARNING: I produktion bör STRIPE_WEBHOOK_SECRET alltid vara satt
    try {
      event = JSON.parse(body) as Stripe.Event;
      console.warn('⚠️ STRIPE_WEBHOOK_SECRET saknas – signaturverifiering hoppas över. Sätt STRIPE_WEBHOOK_SECRET i .env.local för produktion.');
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
  }

  console.log('📨 Stripe webhook received:', event.type);

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSucceeded(paymentIntent);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailed(paymentIntent);
        break;
      }

      case 'charge.succeeded': {
        // Stripe skickar automatiskt kvitto via receipt_email vid charge.succeeded
        const charge = event.data.object as Stripe.Charge;
        if (charge.receipt_email) {
          console.log('✅ Charge succeeded – Stripe skickar betalningskvitto till:', charge.receipt_email);
        } else {
          console.warn('⚠️ Charge succeeded men receipt_email saknas – inget kvitto skickas av Stripe. Kontrollera att receipt_email sätts vid skapande av PaymentIntent.');
        }
        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }
  } catch (err: any) {
    console.error('❌ Webhook handler error:', err.message);
    // Returnera 200 ändå så Stripe inte försöker igen i onödan
    return NextResponse.json({ received: true, warning: err.message });
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata?.orderId;
  const customerEmail = paymentIntent.metadata?.customerEmail || paymentIntent.receipt_email;

  console.log('✅ Payment succeeded via webhook:', {
    paymentIntentId: paymentIntent.id,
    orderId,
    customerEmail,
    amount: paymentIntent.amount / 100,
    currency: paymentIntent.currency.toUpperCase(),
  });

  if (!orderId || orderId === 'unknown') {
    console.warn('⚠️ No orderId in payment intent metadata, skipping order update');
    return;
  }

  // Uppdatera orderstatus till betald
  await client.execute({
    sql: `UPDATE orders SET payment_status = ?, notes = ?, updated_at = ? WHERE id = ?`,
    args: [
      'paid',
      `payment_intent:${paymentIntent.id}`,
      new Date().toISOString(),
      orderId,
    ],
  });

  console.log('✅ Order updated to paid via webhook:', orderId);

  // Skapa leverans om den inte redan finns
  const existingShipment = await client.execute({
    sql: 'SELECT id FROM shipments WHERE order_id = ?',
    args: [orderId],
  });

  if (existingShipment.rows.length === 0) {
    const shipmentId = `ship_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const trackingNumber = `TRK${Date.now().toString().slice(-10)}`;
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 4);

    // Hämta leveransadress från kund
    const orderResult = await client.execute({
      sql: 'SELECT customer_id FROM orders WHERE id = ?',
      args: [orderId],
    });

    let shippingAddress = 'Adress saknas';
    if (orderResult.rows.length > 0) {
      const customerId = orderResult.rows[0].customer_id?.toString();
      if (customerId) {
        const addrResult = await client.execute({
          sql: 'SELECT * FROM customer_addresses WHERE customer_id = ? AND address_type = ? ORDER BY created_at DESC LIMIT 1',
          args: [customerId, 'shipping'],
        });
        if (addrResult.rows.length > 0) {
          const a = addrResult.rows[0];
          shippingAddress = `${a.street}, ${a.postal_code} ${a.city}, ${a.country}`;
        }
      }
    }

    await client.execute({
      sql: `INSERT INTO shipments (id, order_id, tracking_number, carrier, status, shipped_date, estimated_delivery_date, shipping_address)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        shipmentId,
        orderId,
        trackingNumber,
        'PostNord',
        'confirmed',
        new Date().toISOString(),
        estimatedDelivery.toISOString(),
        shippingAddress,
      ],
    });

    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    await client.execute({
      sql: `INSERT INTO shipment_events (id, shipment_id, status, description, event_date) VALUES (?, ?, ?, ?, ?)`,
      args: [
        eventId,
        shipmentId,
        'confirmed',
        'Betalning bekräftad – beställning förbereds för leverans',
        new Date().toISOString(),
      ],
    });

    console.log('✅ Shipment created via webhook:', shipmentId);
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata?.orderId;
  const failureMessage = paymentIntent.last_payment_error?.message || 'Betalning misslyckades';

  console.log('❌ Payment failed via webhook:', {
    paymentIntentId: paymentIntent.id,
    orderId,
    reason: failureMessage,
  });

  if (!orderId || orderId === 'unknown') {
    console.warn('⚠️ No orderId in payment intent metadata');
    return;
  }

  await client.execute({
    sql: `UPDATE orders SET payment_status = ?, notes = ?, updated_at = ? WHERE id = ?`,
    args: [
      'failed',
      `Betalningsfel: ${failureMessage}`,
      new Date().toISOString(),
      orderId,
    ],
  });

  console.log('✅ Order updated to payment_failed via webhook:', orderId);
}
