'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCart } from '@/lib/CartContext'
import { useAuth } from '@/lib/AuthContext'
import { cleanText } from '@/lib/utils'
import Link from 'next/link'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutForm() {
  const { items, totalPrice, clearCart } = useCart()
  const { user, alignCustomerId } = useAuth()
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()

  const [form, setForm] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    address: '',
    zip: '',
    city: '',
    country: 'Sverige',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [createdOrderId, setCreatedOrderId] = useState('')

  const shippingCost = totalPrice >= 120 ? 0 : 39
  const total = totalPrice + shippingCost

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.firstName || !form.lastName || !form.email || !form.address || !form.zip || !form.city) {
      setError('Vänligen fyll i alla obligatoriska fält.')
      return
    }

    if (!stripe || !elements) {
      setError('Betalningssystemet laddas fortfarande. Vänligen försök igen.')
      return
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setError('Kortuppgifter saknas.')
      return
    }

    if (items.length === 0) {
      setError('Din varukorg är tom.')
      return
    }

    setLoading(true)

    try {
      // Steg 1: Skapa ordern FÖRST (innan betalning)
      const orderItems = items.map(item => ({
        productId: item.product.id,
        productName: cleanText(item.product.name),
        quantity: item.quantity,
        unitPrice: item.product.price,
        size: item.selectedSize,
        color: item.selectedColor,
      }))

      console.log('📦 Creating order with customer data:', {
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        hasPhone: !!form.phone,
        totalAmount: total,
        itemsCount: orderItems.length
      })

      const requestBody = {
        customerId: user?.id?.toString() || null, // Säkerställ att ID är en sträng
        customerData: {
          email: form.email.trim(),
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim() || form.firstName.trim(), // Använd firstName som fallback
          phone: form.phone?.trim() || undefined,
          address: form.address.trim(),
          city: form.city.trim(),
          zip: form.zip.trim(),
          country: form.country,
        },
        orderData: {
          totalAmount: total,
          paymentMethod: 'card',
          items: orderItems,
          createBeforePayment: true, // Flagga för att skapa order innan betalning
        },
      }

      console.log('📤 Sending request to /api/orders:', JSON.stringify(requestBody, null, 2))

      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      console.log('📡 Order API response status:', orderRes.status);
      console.log('📡 Order API response headers:', Object.fromEntries(orderRes.headers.entries()));

      let orderData;
      try {
        orderData = await orderRes.json()
        console.log('📦 Order API response:', JSON.stringify(orderData, null, 2));
      } catch (parseError) {
        console.error('❌ Failed to parse response as JSON:', parseError);
        const textResponse = await orderRes.text();
        console.error('❌ Raw response text:', textResponse);
        throw new Error('Ogiltigt svar från servern');
      }

      if (!orderRes.ok || !orderData.success) {
        const errorMsg = orderData.error || 'Beställningen kunde inte skapas.'
        console.error('❌ Order creation failed:', errorMsg, orderData.details)
        console.error('❌ Full response:', JSON.stringify(orderData, null, 2))
        throw new Error(errorMsg)
      }

      const newOrderId = orderData.orderId
      const createdOrderNumber = orderData.orderNumber
      
      setCreatedOrderId(newOrderId)
      console.log('✅ Order created:', createdOrderNumber)

      // Order-API kan ha kopplat beställningen till DB-kund-id (t.ex. cust_…) medan sessionen
      // fortfarande har gammalt id från localStorage — annars syns inte ordern under Mina beställningar.
      if (typeof orderData.customerId === 'string' && orderData.customerId) {
        alignCustomerId(orderData.customerId)
      }

      // Steg 2: Skapa Payment Intent
      const paymentIntentRes = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(total * 100), // Stripe använder ören/cents
          currency: 'sek', // SEK för svenska kunder
          customerEmail: form.email,
          orderId: newOrderId, // Koppla payment intent till ordern
        }),
      })

      const { clientSecret, error: intentError } = await paymentIntentRes.json()

      if (intentError || !clientSecret) {
        // Betalning kunde inte skapas, men ordern finns redan
        await fetch('/api/orders', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: newOrderId,
            paymentStatus: 'failed',
            paymentError: intentError || 'Betalning kunde inte initieras',
          }),
        })
        setError('Betalningen kunde inte initieras, men din beställning har sparats.')
        setOrderNumber(createdOrderNumber)
        setSuccess(true)
        clearCart()
        return
      }

      // Steg 3: Bekräfta betalningen med Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${form.firstName} ${form.lastName}`,
            email: form.email,
            phone: form.phone || undefined,
            address: {
              line1: form.address,
              city: form.city,
              postal_code: form.zip,
              country: form.country === 'Sverige' ? 'SE' : 'SE',
            },
          },
        },
      })

      if (stripeError || paymentIntent?.status !== 'succeeded') {
        // Betalning misslyckades, men ordern finns redan
        // Uppdatera orderstatus till "payment_failed"
        await fetch('/api/orders', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: newOrderId,
            paymentStatus: 'failed',
            paymentError: stripeError?.message || 'Betalning misslyckades',
          }),
        })

        // Visa det faktiska felmeddelandet från Stripe
        const stripeErrorMsg = stripeError?.message || 'Betalning misslyckades'
        setError(`Betalningen misslyckades: ${stripeErrorMsg}. Din beställning har sparats och du kan försöka betala igen via Mina sidor.`)
        setOrderNumber(createdOrderNumber)
        setSuccess(true)
        clearCart()
        return
      }

      // Steg 4: Uppdatera ordern med betalningsinformation
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: newOrderId,
          paymentStatus: 'paid',
          paymentIntentId: paymentIntent.id,
        }),
      })

      clearCart()
      // Omdirigera till orderbekräftelsesidan med spårning
      router.push(`/spara-order/${newOrderId}?success=1`)
    } catch (err: any) {
      console.error('Checkout error:', err)
      setError(err.message || 'Något gick fel. Försök igen.')
    } finally {
      setLoading(false)
    }
  }

  // Success view (only shown when payment failed but order was saved)
  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center px-4 py-16">
          <div className="max-w-lg w-full text-center">
            <div className="bg-white rounded-2xl border border-gray-200 p-10 shadow-sm">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Betalningen misslyckades</h1>
              <p className="text-gray-500 mb-1">Ordernummer: <span className="font-semibold text-gray-800">{orderNumber}</span></p>
              <p className="text-gray-500 mb-4">Din beställning har sparats men betalningen gick inte igenom.</p>
              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mb-6">{error}</p>
              )}
              <p className="text-gray-500 mb-8">Du kan försöka betala igen via Mina sidor.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/mina-sidor/bestallningar" className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  Mina beställningar
                </Link>
                <Link href="/" className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  Fortsätt handla
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Din varukorg är tom</h1>
            <p className="text-gray-500 mb-6">Lägg till produkter innan du går till kassan.</p>
            <Link href="/" className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">Fortsätt handla</Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center gap-3 mb-2">
              <Link href="/varukorg" className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Kassa</h1>
            </div>
            {/* Steps */}
            <div className="flex items-center gap-2 mt-4 text-sm">
              <span className="text-gray-400">Varukorg</span>
              <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <span className="font-semibold text-gray-900">Uppgifter & Betalning</span>
              <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <span className="text-gray-400">Bekräftelse</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Info */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <h2 className="text-lg font-semibold text-gray-900">Kontaktuppgifter</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Förnamn *</label>
                      <input name="firstName" value={form.firstName} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all" placeholder="Ditt förnamn" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Efternamn *</label>
                      <input name="lastName" value={form.lastName} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all" placeholder="Ditt efternamn" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">E-post *</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all" placeholder="din@email.se" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                      <input name="phone" type="tel" value={form.phone} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all" placeholder="070-123 45 67" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <h2 className="text-lg font-semibold text-gray-900">Leveransadress</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gatuadress *</label>
                    <input name="address" value={form.address} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all" placeholder="Gatuadress 123" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postnummer *</label>
                      <input name="zip" value={form.zip} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all" placeholder="123 45" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stad *</label>
                      <input name="city" value={form.city} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all" placeholder="Stockholm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Land</label>
                      <select name="country" value={form.country} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all bg-white">
                        <option value="Sverige">Sverige</option>
                        <option value="Norge">Norge</option>
                        <option value="Danmark">Danmark</option>
                        <option value="Finland">Finland</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <h2 className="text-lg font-semibold text-gray-900">Betalning</h2>
                </div>
                <div className="p-6 space-y-4">
                  {/* Payment Method Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                    <div>
                      <p className="font-medium text-gray-900">Kortbetalning</p>
                      <p className="text-xs text-gray-500 mt-0.5">Visa, Mastercard, American Express</p>
                    </div>
                    <div className="flex gap-2">
                      <img src="/visa.svg" alt="Visa" className="h-6 w-auto" />
                      <img src="/mastercard.svg" alt="Mastercard" className="h-6 w-auto" />
                    </div>
                  </div>

                  {/* Stripe Card Element */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kortuppgifter *</label>
                    <div className="border border-gray-300 rounded-lg p-4 bg-white">
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: '16px',
                              color: '#111827',
                              fontFamily: 'system-ui, -apple-system, sans-serif',
                              '::placeholder': {
                                color: '#9CA3AF',
                              },
                            },
                            invalid: {
                              color: '#EF4444',
                            },
                          },
                          hidePostalCode: true,
                        }}
                      />
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                    <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Dina kortuppgifter hanteras säkert av Stripe och krypteras med SSL-teknik. Vi lagrar aldrig dina kortuppgifter.</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 sticky top-4 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">Ordersammanfattning</h2>
                </div>

                {/* Items */}
                <div className="px-6 py-4 space-y-3 max-h-72 overflow-y-auto border-b border-gray-100">
                  {items.map(item => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="w-14 h-14 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                        {item.product.image ? (
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Bild</div>
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{cleanText(item.product.name)}</p>
                        <p className="text-xs text-gray-500">Antal: {item.quantity}</p>
                        {(item.selectedSize || item.selectedColor) && (
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {item.selectedSize && (
                              <span className="text-xs text-gray-500">Storlek: {item.selectedSize}</span>
                            )}
                            {item.selectedSize && item.selectedColor && (
                              <span className="text-xs text-gray-400">·</span>
                            )}
                            {item.selectedColor && (
                              <span className="text-xs text-gray-500">Färg: {item.selectedColor}</span>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-gray-900 flex-shrink-0">{item.product.price * item.quantity} SEK</p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="p-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Delsumma</span>
                    <span className="text-gray-700">{totalPrice} SEK</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Frakt</span>
                    <span className={shippingCost === 0 ? 'text-green-600 font-medium' : 'text-gray-700'}>
                      {shippingCost === 0 ? 'Gratis' : `${shippingCost} SEK`}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="font-semibold text-gray-900">Totalt</span>
                    <span className="font-bold text-lg text-gray-900">{total} SEK</span>
                  </div>
                </div>

                {/* Pay Button */}
                <div className="px-6 pb-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-900 text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Behandlar...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        Betala {total} SEK
                      </>
                    )}
                  </button>
                </div>

                {/* Trust */}
                <div className="px-6 pb-6">
                  <div className="flex items-center justify-center gap-4 py-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      <span className="text-xs">Trygg handel</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                      <span className="text-xs">Snabb leverans</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  )
}
