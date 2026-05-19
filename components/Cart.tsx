'use client'

import { useCart } from '@/lib/CartContext'
import { useLanguage } from '@/lib/LanguageContext'
import { cleanText } from '@/lib/utils'
import Link from 'next/link'
import ShoppingCartIcon from './ShoppingCartIcon'

interface CartProps {
  isOpen: boolean
  onClose: () => void
}

export default function Cart({ isOpen, onClose }: CartProps) {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart()
  const { t } = useLanguage()

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center text-gray-800">
              <ShoppingCartIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 className="text-base font-semibold tracking-tight text-gray-900">
                {t('cart')}
              </h2>
              {items.length > 0 && (
                <p className="text-xs text-gray-500">
                  {items.length}{' '}
                  {items.length === 1 ? t('itemsSingular') : t('itemsPlural')}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            aria-label={t('closeCart')}
          >
            <span className="text-2xl leading-none" aria-hidden>
              ×
            </span>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
              <span className="mb-4 flex h-16 w-16 items-center justify-center text-gray-400">
                <ShoppingCartIcon className="h-8 w-8" />
              </span>
              <p className="text-base font-medium text-gray-900">{t('emptyCart')}</p>
              <p className="mt-1 max-w-xs text-sm text-gray-500">{t('emptyCartHint')}</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
              >
                {t('continueShoppingBtn')}
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {items.map((item) => {
                const lineTotal = item.product.price * item.quantity
                return (
                  <li
                    key={item.product.id}
                    className="rounded-xl border border-gray-200 bg-gray-50/40 p-3 sm:p-4"
                  >
                    <div className="flex gap-3">
                      <Link
                        href={`/produkt/${item.product.id}`}
                        onClick={onClose}
                        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-gray-200/80"
                      >
                        {item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={cleanText(item.product.name)}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                            {t('image')}
                          </span>
                        )}
                      </Link>

                      <div className="min-w-0 flex-1">
                        <div className="flex gap-2">
                          <Link
                            href={`/produkt/${item.product.id}`}
                            onClick={onClose}
                            className="min-w-0 flex-1"
                          >
                            <span className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900 transition-colors hover:text-blue-700">
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
                          {item.product.price} USD{' '}
                          <span className="text-gray-400">·</span> {t('pricePerUnit')}
                        </p>

                        <div className="mt-3 flex items-center justify-between gap-2">
                          <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white shadow-sm">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity - 1)
                              }
                              className="flex h-8 w-8 items-center justify-center text-gray-600 transition-colors hover:bg-gray-50"
                              aria-label={t('decreaseQuantity')}
                            >
                              −
                            </button>
                            <span className="min-w-[2rem] px-1 text-center text-sm font-semibold tabular-nums text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity + 1)
                              }
                              className="flex h-8 w-8 items-center justify-center text-gray-600 transition-colors hover:bg-gray-50"
                              aria-label={t('increaseQuantity')}
                            >
                              +
                            </button>
                          </div>
                          <p className="text-sm font-semibold tabular-nums text-gray-900">
                            {lineTotal} USD
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="shrink-0 space-y-3 border-t border-gray-200 bg-gray-50/95 px-4 py-4 backdrop-blur-sm sm:px-5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-600">{t('total')}</span>
              <span className="text-lg font-semibold tabular-nums text-gray-900">
                {totalPrice} USD
              </span>
            </div>

            <Link
              href="/varukorg"
              onClick={onClose}
              className="flex w-full items-center justify-center rounded-xl bg-gray-900 py-3.5 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-700"
            >
              {t('goToCart')}
            </Link>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={onClose}
                className="text-center text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
              >
                {t('continueShoppingBtn')}
              </button>
              <button
                type="button"
                onClick={clearCart}
                className="text-center text-sm font-medium text-red-600 transition-colors hover:text-red-700"
              >
                {t('clearCartBtn')}
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
