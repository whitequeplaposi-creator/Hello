'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Cart from '@/components/Cart'

/**
 * /varukorg — visar samma Cart-komponent som i headern,
 * men inbäddad som en helsida (alltid öppen, ingen overlay).
 */
export default function CartPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow flex items-start justify-center py-8 px-4">
        {/* Cart rendered as inline page — isOpen=true, onClose navigates back */}
        <div className="w-full max-w-md">
          <CartInline />
        </div>
      </main>
      <Footer />
    </div>
  )
}

/**
 * Wrapper that renders Cart content without the slide-in panel shell.
 * We reuse CartContext directly so it's the same data as the header cart.
 */
import { useCart } from '@/lib/CartContext'
import { useLanguage } from '@/lib/LanguageContext'
import { cleanText } from '@/lib/utils'
import Link from 'next/link'
import ShoppingCartIcon from '@/components/ShoppingCartIcon'

function CartInline() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart()
  const { t } = useLanguage()

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center">
        <span className="mb-4 flex h-16 w-16 items-center justify-center text-gray-400 mx-auto">
          <ShoppingCartIcon className="h-10 w-10" />
        </span>
        <p className="text-base font-medium text-gray-900">{t('emptyCart')}</p>
        <p className="mt-1 text-sm text-gray-500">{t('emptyCartHint')}</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
        >
          {t('continueShoppingBtn')}
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-gray-200 px-5 py-4">
        <ShoppingCartIcon className="h-5 w-5 text-gray-800" />
        <div>
          <h1 className="text-base font-semibold text-gray-900">{t('cart')}</h1>
          <p className="text-xs text-gray-500">
            {items.length} {items.length === 1 ? t('itemsSingular') : t('itemsPlural')}
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="px-4 py-4 sm:px-5 space-y-3 max-h-[60vh] overflow-y-auto">
        {items.map((item) => {
          const lineTotal = item.product.price * item.quantity
          return (
            <div key={item.product.id} className="rounded-xl border border-gray-200 bg-gray-50/40 p-3 sm:p-4">
              <div className="flex gap-3">
                <Link
                  href={`/produkt/${item.product.id}`}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-gray-200/80"
                >
                  {item.product.image ? (
                    <img src={item.product.image} alt={cleanText(item.product.name)} className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">{t('image')}</span>
                  )}
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex gap-2">
                    <Link href={`/produkt/${item.product.id}`} className="min-w-0 flex-1">
                      <span className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900 hover:text-gray-600 transition-colors">
                        {cleanText(item.product.name)}
                      </span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label={t('removeProduct')}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <p className="mt-1 text-xs text-gray-500">
                    {item.product.price} USD <span className="text-gray-400">·</span> {t('pricePerUnit')}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white shadow-sm">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                      >−</button>
                      <span className="min-w-[2rem] px-1 text-center text-sm font-semibold tabular-nums text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                      >+</button>
                    </div>
                    <p className="text-sm font-semibold tabular-nums text-gray-900">{lineTotal} USD</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50/95 px-4 py-4 sm:px-5 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-600">{t('total')}</span>
          <span className="text-lg font-semibold tabular-nums text-gray-900">{totalPrice} USD</span>
        </div>

        <Link
          href="/kassa"
          className="flex w-full items-center justify-center rounded-xl bg-gray-900 py-3.5 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-700"
        >
          {t('goToCheckout')}
        </Link>

        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            {t('continueShoppingBtn')}
          </Link>
          <button
            type="button"
            onClick={clearCart}
            className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
          >
            {t('clearCartBtn')}
          </button>
        </div>
      </div>
    </div>
  )
}
