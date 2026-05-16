'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCart } from '@/lib/CartContext'
import { useLanguage } from '@/lib/LanguageContext'
import { cleanText } from '@/lib/utils'
import Link from 'next/link'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart()
  const { t } = useLanguage()

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50/80">
        <Header />
        <main className="flex-grow flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
              <img src="/empty-white-box.svg" alt="" className="h-9 w-9 opacity-70" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">{t('emptyCart')}</h1>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">{t('cartEmptyBody')}</p>
            <Link
              href="/"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              {t('continueShoppingBtn')}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const shippingCost = totalPrice >= 120 ? 0 : 39
  const amountToFreeShipping = Math.max(0, 120 - totalPrice)
  const progressPct = Math.min((totalPrice / 120) * 100, 100)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/80">
      <Header />

      <main className="flex-grow">
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl">
                  {t('cart')}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  {items.length}{' '}
                  {items.length === 1 ? t('itemsSingular') : t('itemsPlural')}
                </p>
              </div>
              <Link
                href="/"
                className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-800 sm:self-center"
              >
                ← {t('continueShoppingBtn')}
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
            <div className="lg:col-span-2 space-y-5">
              {shippingCost > 0 ? (
                <div className="rounded-xl border border-amber-200/80 bg-amber-50/90 px-4 py-4 text-sm text-amber-950">
                  <p>
                    {t('cartFreeShip1')}
                    <strong>
                      {amountToFreeShipping} USD
                    </strong>
                    {t('cartFreeShip2')}
                    <strong>{t('cartFreeShipFree')}</strong>
                    {t('cartFreeShip3')}
                  </p>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-amber-200/60">
                    <div
                      className="h-full rounded-full bg-amber-500 transition-all duration-300"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/90 px-4 py-3 text-sm font-medium text-emerald-900">
                  {t('cartFreeShippingOnOrder')}
                </div>
              )}

              <ul>
                {items.map((item) => (
                  <li
                    key={`${item.product.id}-${item.selectedSize ?? ''}-${item.selectedColor ?? ''}`}
                  >
                    <div className="flex gap-4">
                      <Link
                        href={`/produkt/${item.product.id}`}
                        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-200/80 sm:h-28 sm:w-28"
                      >
                        {item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={cleanText(item.product.name)}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                            {t('cartNoImage')}
                          </span>
                        )}
                      </Link>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:gap-4">
                          <div className="min-w-0">
                            <Link
                              href={`/produkt/${item.product.id}`}
                              className="text-sm font-semibold leading-snug text-gray-900 transition-colors hover:text-blue-700 sm:text-base line-clamp-2"
                            >
                              {cleanText(item.product.name)}
                            </Link>
                            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                              {item.product.price} USD <span className="text-gray-300">·</span>{' '}
                              {t('pricePerUnit')}
                            </p>
                            {(item.selectedSize || item.selectedColor) && (
                              <div className="mt-1 flex flex-wrap gap-2">
                                {item.selectedSize && (
                                  <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                                    Storlek: {item.selectedSize}
                                  </span>
                                )}
                                {item.selectedColor && (
                                  <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                                    Färg: {item.selectedColor}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <p className="text-right text-base font-semibold tabular-nums text-gray-900 sm:shrink-0">
                            {item.product.price * item.quantity} USD
                          </p>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                          <div className="inline-flex items-center overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                              className="flex h-9 w-9 items-center justify-center text-gray-600 transition-colors hover:bg-gray-50"
                              aria-label={t('decreaseQuantity')}
                            >
                              <span className="text-lg leading-none">−</span>
                            </button>
                            <span className="flex min-w-[2.75rem] items-center justify-center border-x border-gray-200 px-2 text-sm font-semibold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                              className="flex h-9 w-9 items-center justify-center text-gray-600 transition-colors hover:bg-gray-50"
                              aria-label={t('increaseQuantity')}
                            >
                              <span className="text-lg leading-none">+</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                            className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                          >
                            <img src="/delete-icon.svg" alt="" width={18} height={18} />
                            {t('removeBtn')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-left text-sm font-medium text-red-600 transition-colors hover:text-red-700"
                >
                  {t('clearCartBtn')}
                </button>
                <Link
                  href="/"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 sm:hidden"
                >
                  {t('continueShoppingBtn')}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">{t('cartSummaryTitle')}</h2>

                <dl className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between gap-4 text-gray-600">
                    <dt>{t('cartSubtotal')}</dt>
                    <dd className="font-medium tabular-nums text-gray-900">{totalPrice} USD</dd>
                  </div>
                  <div className="flex justify-between gap-4 text-gray-600">
                    <dt>{t('cartShipping')}</dt>
                    <dd className="font-medium tabular-nums text-gray-900">
                      {shippingCost === 0 ? t('cartShippingFree') : `${shippingCost} USD`}
                    </dd>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between gap-4">
                    <dt className="font-semibold text-gray-900">{t('total')}</dt>
                    <dd className="text-base font-semibold tabular-nums text-gray-900">
                      {totalPrice + shippingCost} USD
                    </dd>
                  </div>
                </dl>
                <p className="mt-2 text-xs text-gray-500">{t('cartVatIncluded')}</p>

                <div className="mt-6 space-y-3">
                  <Link
                    href="/kassa"
                    className="flex w-full items-center justify-center rounded-xl bg-blue-600 py-3.5 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                  >
                    {t('goToCheckout')}
                  </Link>
                  <Link
                    href="/"
                    className="flex w-full items-center justify-center rounded-xl border border-gray-200 py-3 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    {t('continueShoppingBtn')}
                  </Link>
                </div>

                <ul className="mt-8 space-y-2 border-t border-gray-100 pt-6 text-xs text-gray-600">
                  <li className="flex gap-2">
                    <span className="text-emerald-600" aria-hidden>✓</span>
                    {t('cartTrustFast')}
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-600" aria-hidden>✓</span>
                    {t('cartTrustSecure')}
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-600" aria-hidden>✓</span>
                    {t('cartTrustReturns')}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
