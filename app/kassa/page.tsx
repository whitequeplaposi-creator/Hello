'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCart } from '@/lib/CartContext'
import { useAuth } from '@/lib/AuthContext'
import Link from 'next/link'

type ShippingMethod = 'standard' | 'express'

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart()
  const { user } = useAuth()

  const [form, setForm] = useState({
    email: user?.email || '',
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    country: 'Sverige',
  })

  const [shippingMethod, setShippingMethod] = useState<ShippingMethod | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const shippingCost = totalPrice >= 120 ? 0 : (shippingMethod === 'standard' ? 39 : shippingMethod === 'express' ? 79 : 0)
  const grandTotal = totalPrice + shippingCost

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate shipping method selection if total is under 120
    if (totalPrice < 120 && !shippingMethod) {
      alert('Vänligen välj ett fraktsätt')
      return
    }
    
    setIsSubmitting(true)
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    clearCart()
    setOrderPlaced(true)
    setIsSubmitting(false)
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center px-4 py-16">
          <div className="max-w-lg w-full text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Tack för din beställning!</h1>
            <p className="text-gray-600 mb-2">Ordernummer: <span className="font-semibold text-gray-900">#{Date.now().toString().slice(-8)}</span></p>
            <p className="text-gray-500 mb-8">En bekräftelse har skickats till din e-postadress.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Fortsätt handla
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Din varukorg är tom</h1>
            <p className="text-gray-500 mb-6">Lägg till produkter innan du går till kassan.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Fortsätt handla
            </Link>
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
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Kassa</h1>
                <p className="text-gray-500 mt-1">{items.length} artikel{items.length > 1 ? 'er' : ''} i din beställning</p>
              </div>
              <Link href="/varukorg" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Tillbaka till varukorg
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Forms */}
              <div className="lg:col-span-2 space-y-8">

                {/* Contact Information */}
                <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                      <h2 className="text-lg font-semibold text-gray-900">Kontaktuppgifter</h2>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Förnamn *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={form.firstName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                          placeholder="Förnamn"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Efternamn *</label>
                        <input
                          type="text"
                          name="lastName"
                          value={form.lastName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                          placeholder="Efternamn"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">E-postadress *</label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                          placeholder="din@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefonnummer *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                          placeholder="+46 7X XXX XX XX"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Shipping Address */}
                <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                      <h2 className="text-lg font-semibold text-gray-900">Leveransadress</h2>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Adress *</label>
                      <input
                        type="text"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                        placeholder="Gatuadress och husnummer"
                      />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Postnummer *</label>
                        <input
                          type="text"
                          name="zip"
                          value={form.zip}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                          placeholder="123 45"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stad *</label>
                        <input
                          type="text"
                          name="city"
                          value={form.city}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                          placeholder="Stad"
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Land</label>
                        <select
                          name="country"
                          value={form.country}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all bg-white"
                        >
                          <option value="Sverige">Sverige</option>
                          <option value="Norge">Norge</option>
                          <option value="Danmark">Danmark</option>
                          <option value="Finland">Finland</option>
                          <option value="Island">Island</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Shipping Method - Only show if total is under 120 */}
                {totalPrice < 120 && (
                <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                      <h2 className="text-lg font-semibold text-gray-900">Fraktsätt</h2>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <label
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        shippingMethod === 'standard'
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        value="standard"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                        className="w-4 h-4 text-gray-900 focus:ring-gray-900"
                      />
                      <div className="flex items-center gap-3">
                        <img src="/db-schenker-logo.png" alt="DB Schenker" className="w-12 h-12 object-contain" />
                        <img src="/postnord-logo.png" alt="PostNord" className="w-12 h-12 object-contain" />
                      </div>
                      <span className="ml-auto font-semibold text-gray-900">39</span>
                    </label>

                    <label
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        shippingMethod === 'express'
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        value="express"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                        className="w-4 h-4 text-gray-900 focus:ring-gray-900"
                      />
                      <div className="flex items-center gap-3">
                        <img src="/dhl-brand.svg" alt="DHL Express" className="w-12 h-12 object-contain" />
                      </div>
                      <span className="ml-auto font-semibold text-gray-900">79</span>
                    </label>
                  </div>
                </section>
                )}

                {/* Payment */}
                <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold">{totalPrice < 120 ? '4' : '3'}</span>
                      <h2 className="text-lg font-semibold text-gray-900">Betalning</h2>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <label
                      className="flex items-center gap-4 p-4 rounded-lg border-2 border-gray-900 bg-gray-50"
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={true}
                        readOnly
                        className="w-4 h-4 text-gray-900 focus:ring-gray-900"
                      />
                      <div className="flex items-center gap-2">
                        <img src="/visa.svg" alt="Visa" className="w-10 h-10 object-contain" />
                        <img src="/mastercard.svg" alt="Mastercard" className="w-10 h-10 object-contain" />
                        <img src="/paypal-svgrepo-com.svg" alt="PayPal" className="w-10 h-10 object-contain" />
                      </div>
                    </label>

                    {true && (
                      <div className="mt-4 space-y-4 pl-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Kortnummer</label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Utgångsdatum</label>
                            <input
                              type="text"
                              placeholder="MM/ÅÅ"
                              maxLength={5}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                            <input
                              type="text"
                              placeholder="123"
                              maxLength={3}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border border-gray-200 sticky top-4 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Ordersammanfattning</h2>
                  </div>

                  {/* Cart Items */}
                  <div className="p-6 space-y-4 max-h-80 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 relative">
                          {item.product.image ? (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <span className="text-gray-400 text-xs">Bild</span>
                          )}
                          <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                          <p className="text-sm text-gray-500">${item.product.price}</p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
                          ${item.product.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="px-6 py-4 border-t border-gray-100 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Delsumma</span>
                      <span className="text-gray-700">${totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Frakt</span>
                      <span className="text-gray-700">
                        {totalPrice >= 120 ? 'Gratis' : shippingCost}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between">
                      <span className="font-semibold text-gray-900">Totalt</span>
                      <span className="font-bold text-lg text-gray-900">${grandTotal}</span>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="p-6 border-t border-gray-100 space-y-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gray-900 text-white py-3.5 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Bearbetar...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Slutför köp
                        </>
                      )}
                    </button>
                    <p className="text-xs text-gray-400 text-center">
                      Genom att slutföra köpet godkänner du våra <Link href="/kopvillkor" className="underline hover:text-gray-600">köpvillkor</Link>
                    </p>
                  </div>

                  {/* Trust badges */}
                  <div className="px-6 pb-6">
                    <div className="flex items-center justify-center gap-4 py-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="text-xs">Säker betalning</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className="text-xs">Krypterad</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <span className="text-xs">SSL</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
