// Test script to verify payment flow
// Run with: npx tsx scripts/test-payment-flow.ts

console.log('🧪 Testing Payment Flow\n')

console.log('📋 Expected Flow:')
console.log('1. User fills in checkout form')
console.log('2. User clicks "Betala X kr"')
console.log('3. Stripe creates payment intent')
console.log('4. User enters card details')
console.log('5. Stripe confirms payment')
console.log('6. If redirect needed: User is redirected to /kassa?payment_success=true&payment_intent=pi_xxx')
console.log('7. System detects redirect and processes order')
console.log('8. Order is saved to database')
console.log('9. User sees success message with order number')
console.log('10. Order appears in "Mina beställningar"\n')

console.log('🔍 Debug Checklist:')
console.log('✓ Check browser console for logs starting with 💳, 🔄, ✅, ❌')
console.log('✓ Verify sessionStorage has "pendingOrderData" before payment')
console.log('✓ Check URL parameters after Stripe redirect')
console.log('✓ Verify payment_intent or payment_intent_client_secret in URL')
console.log('✓ Check that order is created in database')
console.log('✓ Verify order appears in /mina-sidor/bestallningar\n')

console.log('🧪 Payment Mode Information:')
console.log('Kontrollera .env.local för att se vilket läge du är i:')
console.log('- sk_live_... och pk_live_... = LIVE MODE (riktiga betalningar)')
console.log('- sk_test_... och pk_test_... = TEST MODE (testbetalningar)\n')

console.log('💳 Test Cards (endast för TEST MODE):')
console.log('Success: 4242 4242 4242 4242')
console.log('Requires 3D Secure: 4000 0025 0000 3155')
console.log('Declined: 4000 0000 0000 9995')
console.log('Any future expiry date, any 3-digit CVC\n')

console.log('⚠️  VARNING: I LIVE MODE måste du använda RIKTIGA kort!')
console.log('Testkort fungerar inte i live-läge.\n')

console.log('🐛 Common Issues:')
console.log('1. "Din varukorg är tom" after payment:')
console.log('   → Check if payment_success=true is in URL')
console.log('   → Check if pendingOrderData exists in sessionStorage')
console.log('   → Check browser console for error messages\n')

console.log('2. Order not appearing in "Mina beställningar":')
console.log('   → Check if order was created in database')
console.log('   → Verify customer_id matches logged-in user')
console.log('   → Check /api/orders response in Network tab\n')

console.log('3. Redirect loop:')
console.log('   → Clear sessionStorage')
console.log('   → Clear browser cache')
console.log('   → Try in incognito mode\n')

console.log('📝 To test manually:')
console.log('1. Add any product to cart')
console.log('2. Go to /kassa')
console.log('3. Fill in form with test data')
console.log('4. Click "Fortsätt till betalning"')
console.log('5. Use test card: 4242 4242 4242 4242')
console.log('6. Watch browser console for logs')
console.log('7. Verify success page appears')
console.log('8. Check /mina-sidor/bestallningar for order\n')

console.log('✅ Test script complete. Open browser console to see live logs.')
