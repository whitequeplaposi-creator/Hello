import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Stripe är inte konfigurerat' },
      { status: 500 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-04-22.dahlia',
  });
  try {
    console.log('📡 Payment Intent API called');
    const body = await request.json();
    console.log('📤 Request body:', JSON.stringify(body, null, 2));

    const { amount, currency, customerEmail, orderId } = body;

    if (!amount || amount <= 0) {
      console.error('❌ Invalid amount:', amount);
      return NextResponse.json(
        { error: 'Ogiltigt belopp' },
        { status: 400 }
      );
    }

    console.log('💳 Creating Stripe Payment Intent:', {
      amount: Math.round(amount),
      currency: currency || 'sek',
      customerEmail,
      orderId
    });

    if (!customerEmail) {
      console.error('❌ customerEmail saknas – Stripe kan inte skicka betalningskvitto');
      return NextResponse.json(
        { error: 'Kundens e-postadress krävs för att skapa betalning' },
        { status: 400 }
      );
    }

    // Skapa Payment Intent med Stripe
    // Använder 'card' som payment_method_types för kompatibilitet med CardElement
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Måste vara heltal (ören/cents)
      currency: currency || 'sek', // SEK för svenska kunder
      receipt_email: customerEmail, // Stripe skickar automatiskt kvitto när betalningen genomförs
      payment_method_types: ['card'],
      metadata: {
        customerEmail: customerEmail,
        orderId: orderId || 'unknown',
      },
    });

    console.log('✅ Payment Intent created:', {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      customerEmail
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error('❌ Payment Intent error:', error.message);
    console.error('❌ Error stack:', error.stack);
    return NextResponse.json(
      { error: error.message || 'Kunde inte skapa betalning' },
      { status: 500 }
    );
  }
}
