'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAuth } from '@/lib/AuthContext'
import { useLanguage } from '@/lib/LanguageContext'
import { useCart } from '@/lib/CartContext'
import Link from 'next/link'

interface OrderItem {
  id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
  size?: string
  color?: string
  image?: string
}

interface Order {
  id: string
  order_number: string
  status: string
  total_amount: number
  currency: string
  payment_method: string
  payment_status: string
  created_at: string
  items: OrderItem[]
}

export default function Orders() {
  const { user } = useAuth()
  const router = useRouter()
  const { t, language } = useLanguage()
  const { addToCart, clearCart } = useCart()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryingOrderId, setRetryingOrderId] = useState<string | null>(null)

  const handleRetryPayment = useCallback(
    async (order: Order) => {
      setRetryingOrderId(order.id)
      try {
        // Rensa varukorgen och lägg till orderartiklarna
        clearCart()
        for (const item of order.items) {
          const product = {
            id: item.product_id,
            name: item.product_name,
            description: '',
            price: item.unit_price,
            category: '',
            inStock: true,
            image: item.image,
          }
          for (let i = 0; i < item.quantity; i++) {
            addToCart(product)
          }
        }
        router.push('/kassa')
      } finally {
        setRetryingOrderId(null)
      }
    },
    [addToCart, clearCart, router]
  )

  const locale = language === 'en' ? 'en-US' : 'sv-SE'

  const getStatusText = useCallback(
    (status: string) => {
      const map: Record<string, string> = {
        confirmed: t('orderStatusConfirmed'),
        packing: t('orderStatusPacking'),
        transport: t('orderStatusTransport'),
        delivered: t('orderStatusDelivered'),
      }
      return map[status] ?? status
    },
    [t]
  )

  const getPaymentStatusText = useCallback(
    (status: string) => {
      const map: Record<string, string> = {
        paid: t('paymentStatusPaid'),
        pending: t('paymentStatusPending'),
        failed: t('paymentStatusFailed'),
        refunded: t('paymentStatusRefunded'),
      }
      return map[status] ?? status
    },
    [t]
  )

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const fetchOrders = async () => {
      try {
        setLoading(true)
        const timestamp = new Date().getTime()
        const response = await fetch(`/api/customers/${user.id}/orders?t=${timestamp}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
          },
        })
        const data = await response.json()

        if (data.success) {
          setOrders(data.orders)
          setError('')
        } else {
          setError(t('ordersFetchError'))
        }
      } catch (err) {
        console.error('Error fetching orders:', err)
        setError(t('ordersGenericError'))
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user, router])

  if (!user) {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'packing':
        return 'bg-purple-100 text-purple-800'
      case 'transport':
        return 'bg-sky-100 text-sky-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
            <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3 mb-2">
              <Link
                href="/mina-sidor"
                className="text-gray-400 hover:text-gray-600 w-fit"
                aria-label={t('myPagesBackAria')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                {t('myPagesOrdersPageTitle')}
              </h1>
            </div>
            <p className="text-sm sm:text-base text-gray-500">{t('myPagesOrdersPageSubtitle')}</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          {loading ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">{t('ordersLoading')}</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 lg:p-12 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{t('ordersEmptyTitle')}</h2>
              <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 px-2">{t('ordersEmptyBody')}</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-gray-800 transition-colors"
              >
                {t('startShopping')}
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div>
                          <p className="text-xs text-gray-500">{t('orderNumberLabel')}</p>
                          <p className="font-semibold text-gray-900">{order.order_number}</p>
                        </div>
                        <div className="hidden sm:block w-px h-8 bg-gray-200" />
                        <div>
                          <p className="text-xs text-gray-500">{t('orderDateLabel')}</p>
                          <p className="text-sm text-gray-700">{formatDate(order.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                        {order.payment_status === 'failed' && (
                          <button
                            onClick={() => handleRetryPayment(order)}
                            disabled={retryingOrderId === order.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-400 text-white rounded-full text-xs font-medium hover:bg-sky-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {retryingOrderId === order.id ? (
                              <>
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                {t('loading') || 'Laddar...'}
                              </>
                            ) : (
                              <>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                                Betala
                              </>
                            )}
                          </button>
                        )}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}
                        >
                          {getPaymentStatusText(order.payment_status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 sm:px-6 py-4">
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-3 sm:gap-4">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                            {item.image ? (
                              <img src={item.image} alt={item.product_name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                {t('orderLineImage')}
                              </div>
                            )}
                          </div>
                          <div className="flex-grow min-w-0">
                            <Link
                              href={`/produkt/${item.product_id}`}
                              className="font-medium text-gray-900 hover:text-gray-700 line-clamp-2"
                            >
                              {item.product_name}
                            </Link>
                            <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
                              <span>
                                {t('orderQtyShort')} {item.quantity}
                              </span>
                              {item.size && (
                                <span>
                                  • {t('orderSizeShort')} {item.size}
                                </span>
                              )}
                              {item.color && (
                                <span>
                                  • {t('orderColorShort')} {item.color}
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-semibold text-gray-900 mt-1">
                              {item.unit_price} {order.currency}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="px-4 sm:px-6 py-4 border-t border-gray-100 bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <span className="text-gray-600">
                          {order.payment_method === 'card' ? t('paymentMethodCard') : order.payment_method}
                        </span>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="text-right">
                          <p className="text-xs text-gray-500">{t('total')}</p>
                          <p className="text-lg font-bold text-gray-900">
                            {order.total_amount} {order.currency}
                          </p>
                        </div>
                        <Link
                          href={`/spara-order/${order.id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {t('orderTrackButton')}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
