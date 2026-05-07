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
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-2">
              <ShoppingCartIcon className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Kundvagn</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-grow overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">{t('emptyCart')}</p>
                <button
                  onClick={onClose}
                  className="text-gray-600 hover:underline"
                >
                  {t('continueShoppingBtn')}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 pb-4 border-b">
                    <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">{t('image')}</span>
                      )}
                    </div>

                    <div className="flex-grow">
                      <h3 className="font-semibold mb-1">{cleanText(item.product.name)}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        ${item.product.price}
                      </p>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="w-7 h-7 border rounded hover:bg-gray-100 flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="w-7 h-7 border rounded hover:bg-gray-100 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        {t('removeBtn')}
                      </button>
                      <p className="font-semibold">
                        ${item.product.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}

                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    {t('clearCartBtn')}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-6 space-y-4">
              <div className="flex justify-between text-lg font-bold">
                <span>{t('total')}:</span>
                <span>${totalPrice}</span>
              </div>

              <Link
                href="/kassa"
                onClick={onClose}
                className="block w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 text-center font-semibold"
              >
                {t('checkout')}
              </Link>

              <button
                onClick={onClose}
                className="block w-full text-center text-gray-600 hover:underline"
              >
                {t('continueShoppingBtn')}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
