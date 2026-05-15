/**
 * Test för att verifiera att hela betalningsflödet fungerar
 * Detta testar:
 * 1. Skapa payment intent
 * 2. Simulera lyckad betalning
 * 3. Skapa order med payment intent ID
 */

async function testCompletePaymentFlow() {
  console.log('🧪 Testing complete payment flow...\n')

  // Steg 1: Skapa payment intent
  console.log('📝 Step 1: Creating payment intent...')
  const paymentIntentResponse = await fetch('http://localhost:3000/api/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: 299 })
  })

  if (!paymentIntentResponse.ok) {
    const error = await paymentIntentResponse.text()
    console.error('❌ Failed to create payment intent:', error)
    return
  }

  const { clientSecret, paymentIntentId } = await paymentIntentResponse.json()
  console.log('✅ Payment intent created:', paymentIntentId)
  console.log('   Client secret:', clientSecret?.substring(0, 20) + '...')

  // Steg 2: Simulera att betalningen lyckades (i verkligheten görs detta av Stripe)
  console.log('\n💳 Step 2: Simulating successful payment...')
  console.log('   (In real flow, Stripe handles this)')
  console.log('   Payment Intent ID:', paymentIntentId)

  // Steg 3: Skapa order med payment intent ID
  console.log('\n📦 Step 3: Creating order with payment intent...')
  const orderData = {
    customerData: {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'Testsson',
      phone: '+46701234567',
      address: 'Testgatan 123',
      city: 'Stockholm',
      zip: '123 45',
      country: 'Sverige'
    },
    orderData: {
      totalAmount: 299,
      paymentMethod: 'card',
      notes: 'Test order',
      items: [
        {
          productId: 'test-product-1',
          productName: 'Test Product',
          quantity: 1,
          unitPrice: 299,
          image: '/test.jpg'
        }
      ]
    },
    paymentIntentId
  }

  const orderResponse = await fetch('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  })

  if (!orderResponse.ok) {
    const error = await orderResponse.text()
    console.error('❌ Failed to create order:', error)
    return
  }

  const orderResult = await orderResponse.json()
  console.log('✅ Order created successfully!')
  console.log('   Order ID:', orderResult.orderId)
  console.log('   Customer ID:', orderResult.customerId)

  // Steg 4: Verifiera att ordern inte kan skapas igen med samma payment intent
  console.log('\n🔒 Step 4: Testing duplicate prevention...')
  const duplicateResponse = await fetch('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  })

  const duplicateResult = await duplicateResponse.json()
  if (duplicateResult.success && duplicateResult.message === 'Order already processed') {
    console.log('✅ Duplicate prevention works!')
    console.log('   Same order ID returned:', duplicateResult.orderId)
  } else {
    console.log('⚠️ Duplicate prevention may not be working correctly')
  }

  console.log('\n✅ Complete payment flow test finished!')
}

testCompletePaymentFlow().catch(console.error)
