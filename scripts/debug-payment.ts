// Debug script to check payment flow
// This script helps identify where the redirect is happening

console.log('🔍 Payment Flow Debug Guide\n')

console.log('Step 1: Open browser DevTools (F12)')
console.log('Step 2: Go to Console tab')
console.log('Step 3: Go to Network tab')
console.log('Step 4: Add test product to cart and go to /kassa')
console.log('Step 5: Fill in form and click "Betala"\n')

console.log('🔍 What to look for in Console:')
console.log('- "💳 Starting payment confirmation for amount: X"')
console.log('- "💳 Payment confirmation result:"')
console.log('- Check if hasError is true or false')
console.log('- Check if hasPaymentIntent is true or false')
console.log('- Check the status value\n')

console.log('🔍 What to look for in Network tab:')
console.log('- Look for POST to /api/create-payment-intent')
console.log('- Check the response - should have clientSecret')
console.log('- Look for any redirects (status 301, 302, 307, 308)')
console.log('- Check if there is a redirect to /mina-sidor/bestallningar\n')

console.log('🔍 Common Issues:')
console.log('1. If you see redirect to /mina-sidor immediately:')
console.log('   → Something is triggering a redirect before payment completes')
console.log('   → Check if there is a form submission happening')
console.log('   → Check if there is a Link component being clicked\n')

console.log('2. If payment completes but then redirects to /mina-sidor:')
console.log('   → Check handlePaymentSuccess function')
console.log('   → Look for router.push or window.location in code\n')

console.log('3. If Stripe redirects to wrong URL:')
console.log('   → Check return_url in StripePaymentForm')
console.log('   → Should be: ${window.location.origin}/kassa?payment_success=true\n')

console.log('📝 Please run the test and share:')
console.log('1. Console logs (especially lines with 💳, 🔄, ✅, ❌)')
console.log('2. Network tab - any redirects?')
console.log('3. Final URL after clicking "Betala"')
console.log('4. Any error messages\n')
