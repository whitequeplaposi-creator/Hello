import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Ladda .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

async function testStripeKeys() {
  console.log('\n🔍 Testar Stripe-konfiguration...\n');

  // Kontrollera att nycklarna finns
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  console.log('📋 Kontrollerar miljövariabler:');
  console.log('STRIPE_SECRET_KEY:', secretKey ? `${secretKey.substring(0, 20)}...` : '❌ SAKNAS');
  console.log('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:', publishableKey ? `${publishableKey.substring(0, 20)}...` : '❌ SAKNAS');

  if (!secretKey || !publishableKey) {
    console.error('\n❌ Stripe-nycklar saknas i .env.local');
    console.log('\n📝 Instruktioner:');
    console.log('1. Gå till https://dashboard.stripe.com/test/apikeys');
    console.log('2. Kopiera dina test-nycklar');
    console.log('3. Uppdatera .env.local med riktiga nycklar');
    process.exit(1);
  }

  // Kontrollera vilken typ av nycklar vi använder
  if (secretKey.startsWith('sk_live_')) {
    console.log('\n✅ LIVE MODE: Du använder LIVE Stripe-nycklar (riktiga betalningar)');
    console.log('Secret key börjar med:', secretKey.substring(0, 8));
    console.log('Live-nycklar börjar med: sk_live_');
  } else if (secretKey.startsWith('sk_test_')) {
    console.log('\n⚠️  TEST MODE: Du använder TEST Stripe-nycklar (testbetalningar)');
    console.log('Secret key börjar med:', secretKey.substring(0, 8));
    console.log('Test-nycklar börjar med: sk_test_');
  } else {
    console.warn('\n⚠️  OKÄND MODE: Nyckeln börjar inte med sk_live_ eller sk_test_');
    console.log('Secret key börjar med:', secretKey.substring(0, 8));
  }

  if (publishableKey.startsWith('pk_live_')) {
    console.log('✅ LIVE MODE: Du använder LIVE publishable key');
    console.log('Publishable key börjar med:', publishableKey.substring(0, 8));
  } else if (publishableKey.startsWith('pk_test_')) {
    console.log('⚠️  TEST MODE: Du använder TEST publishable key');
    console.log('Publishable key börjar med:', publishableKey.substring(0, 8));
  } else {
    console.warn('⚠️  OKÄND MODE: Publishable key börjar inte med pk_live_ eller pk_test_');
    console.log('Publishable key börjar med:', publishableKey.substring(0, 8));
  }

  // Testa att skapa en Stripe-instans
  console.log('\n🔧 Skapar Stripe-instans...');
  try {
    const stripe = new Stripe(secretKey, {
      apiVersion: '2026-04-22.dahlia',
    });
    console.log('✅ Stripe-instans skapad');

    // Testa att skapa ett payment intent
    console.log('\n💳 Testar att skapa Payment Intent...');
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 300, // 3 kr i ören
      currency: 'sek',
      payment_method_types: ['card'],
      metadata: {
        test: 'true',
      },
    });

    console.log('✅ Payment Intent skapad!');
    console.log('   ID:', paymentIntent.id);
    console.log('   Belopp:', paymentIntent.amount / 100, 'kr');
    console.log('   Valuta:', paymentIntent.currency.toUpperCase());
    console.log('   Status:', paymentIntent.status);

    // Avbryt payment intent (städa upp)
    await stripe.paymentIntents.cancel(paymentIntent.id);
    console.log('✅ Payment Intent avbruten (cleanup)');

    console.log('\n✅ Alla tester lyckades! Stripe är korrekt konfigurerat.');
    console.log('\n📝 Nästa steg:');
    console.log('1. Starta om Next.js servern: npm run dev');
    console.log('2. Gå till http://localhost:3000/testprodukt');
    console.log('3. Använd testkortet: 4242 4242 4242 4242');

  } catch (error: any) {
    console.error('\n❌ Stripe-fel:', error.message);
    console.error('\nFeldetaljer:');
    console.error('Type:', error.type);
    console.error('Code:', error.code);
    
    if (error.type === 'StripeAuthenticationError') {
      console.log('\n💡 Lösning:');
      console.log('Dina Stripe-nycklar är ogiltiga eller felaktiga.');
      console.log('1. Gå till https://dashboard.stripe.com/test/apikeys');
      console.log('2. Kopiera HELA secret key (börjar med sk_test_51...)');
      console.log('3. Kopiera HELA publishable key (börjar med pk_test_51...)');
      console.log('4. Uppdatera .env.local med de nya nycklarna');
      console.log('5. Kör detta skript igen: npm run test:stripe-keys');
    }
    
    process.exit(1);
  }
}

testStripeKeys();
