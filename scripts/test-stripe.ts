// Test Stripe-anslutning
import Stripe from 'stripe'
import { config } from 'dotenv'
import { resolve } from 'path'

// Ladda miljövariabler från .env.local
config({ path: resolve(process.cwd(), '.env.local') })

async function testStripe() {
  console.log('🔍 Testar Stripe-anslutning...\n')

  // Kontrollera miljövariabler
  const secretKey = process.env.STRIPE_SECRET_KEY
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

  console.log('Miljövariabler:')
  console.log('- STRIPE_SECRET_KEY:', secretKey ? `${secretKey.substring(0, 20)}...` : '❌ SAKNAS')
  console.log('- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:', publishableKey ? `${publishableKey.substring(0, 20)}...` : '❌ SAKNAS')
  console.log()

  if (!secretKey) {
    console.error('❌ STRIPE_SECRET_KEY saknas i .env.local')
    process.exit(1)
  }

  if (!publishableKey) {
    console.error('❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY saknas i .env.local')
    process.exit(1)
  }

  try {
    // Initiera Stripe
    const stripe = new Stripe(secretKey, {
      apiVersion: '2026-04-22.dahlia',
    })

    console.log('✅ Stripe initialiserad')

    // Testa att skapa en Payment Intent
    console.log('\n🧪 Testar att skapa Payment Intent...')
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 10000, // 100 kr
      currency: 'sek',
      automatic_payment_methods: {
        enabled: true,
      },
    })

    console.log('✅ Payment Intent skapad:')
    console.log('  - ID:', paymentIntent.id)
    console.log('  - Belopp:', paymentIntent.amount / 100, 'kr')
    console.log('  - Valuta:', paymentIntent.currency.toUpperCase())
    console.log('  - Status:', paymentIntent.status)
    console.log('  - Client Secret:', paymentIntent.client_secret ? 'Finns' : 'Saknas')

    console.log('\n✅ Alla tester lyckades!')
    console.log('Stripe är korrekt konfigurerat och fungerar.')

  } catch (error: any) {
    console.error('\n❌ Fel vid test av Stripe:')
    console.error('  Meddelande:', error.message)
    if (error.type) {
      console.error('  Typ:', error.type)
    }
    if (error.code) {
      console.error('  Kod:', error.code)
    }
    process.exit(1)
  }
}

testStripe()
