'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAuth } from '@/lib/AuthContext'
import { useLanguage } from '@/lib/LanguageContext'
import Link from 'next/link'

export default function Logistics() {
  const { user } = useAuth()
  const router = useRouter()
  const { t, language } = useLanguage()
  const [shipments, setShipments] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const locale = language === 'en' ? 'en-US' : 'sv-SE'

  const formatLongDate = useCallback(
    (d: string | Date) =>
      new Date(d).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' }),
    [locale]
  )

  const shipmentStatusLabel = useCallback(
    (status: string) => {
      const map: Record<string, string> = {
        delivered: t('logisticsStatusDeliveredShort'),
        transport: t('logisticsStatusTransportShort'),
        packing: t('logisticsStatusPackingShort'),
        confirmed: t('logisticsStatusConfirmedShort'),
      }
      return map[status] ?? status
    },
    [t]
  )

  const loadShipments = useCallback(async () => {
    if (!user) return

    setLoading(true)
    try {
      const response = await fetch(`/api/shipments/${user.id}`)
      const data = await response.json()

      if (data.success && data.shipments) {
        setShipments(data.shipments)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error('Error loading shipments:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    loadShipments()

    const interval = setInterval(() => {
      loadShipments()
    }, 30000)

    return () => clearInterval(interval)
  }, [user, router, loadShipments])

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <main className="flex-grow">
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Link href="/mina-sidor" className="text-gray-400 hover:text-gray-600 transition-colors" aria-label={t('myPagesBackAria')}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </Link>
                  <h1 className="text-3xl font-bold text-gray-900">{t('logisticsTitle')}</h1>
                </div>
                <p className="text-gray-500">{t('logisticsSubtitle')}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {t('logisticsLastUpdated')}{' '}
                  {lastUpdated.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {shipments.length > 0 ? (
            <div className="space-y-6">
              {shipments.map((shipment) => {
                const s = shipment as {
                  id: string
                  carrier: string
                  tracking_number: string
                  status: string
                  estimated_delivery_date?: string
                  actual_delivery_date?: string
                }
                return (
                  <div
                    key={s.id}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-gray-900">{s.carrier}</p>
                            <p className="text-sm text-gray-500">
                              {t('logisticsTrackingLabel')}{' '}
                              <span className="font-mono">{s.tracking_number}</span>
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                            s.status === 'delivered'
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : s.status === 'transport'
                                ? 'bg-blue-100 text-blue-800 border-blue-200'
                                : s.status === 'packing'
                                  ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                  : 'bg-gray-100 text-gray-800 border-gray-200'
                          }`}
                        >
                          {shipmentStatusLabel(s.status)}
                        </span>
                      </div>

                      {s.estimated_delivery_date && (
                        <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg px-4 py-3 mb-4">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium">
                            {s.status === 'delivered' && s.actual_delivery_date
                              ? `${t('logisticsDeliveredPrefix')}${formatLongDate(s.actual_delivery_date)}`
                              : `${t('logisticsEstimatedPrefix')}${formatLongDate(s.estimated_delivery_date)}`}
                          </span>
                        </div>
                      )}

                      <Link
                        href="/mina-sidor/bestallningar"
                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        {t('logisticsSeeOrderDetails')}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">{t('logisticsNoShipmentsTitle')}</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">{t('logisticsNoShipmentsBody')}</p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
                >
                  {t('startShopping')}
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('logisticsInfoFastTitle')}</h3>
                  <p className="text-sm text-gray-600">{t('logisticsInfoFastBody')}</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('logisticsInfoRealtimeTitle')}</h3>
                  <p className="text-sm text-gray-600">{t('logisticsInfoRealtimeBody')}</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('logisticsInfoSupportTitle')}</h3>
                  <p className="text-sm text-gray-600">{t('logisticsInfoSupportBody')}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('logisticsPartnersTitle')}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <img src="/db-schenker-logo.png" alt="DB Schenker" className="w-16 h-16 object-contain mb-2" />
                    <p className="text-sm font-medium text-gray-900 text-center">DB Schenker</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <img src="/postnord-logo.png" alt="PostNord" className="w-16 h-16 object-contain mb-2" />
                    <p className="text-sm font-medium text-gray-900 text-center">PostNord</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <img src="/dhl-brand.svg" alt="DHL" className="w-16 h-16 object-contain mb-2" />
                    <p className="text-sm font-medium text-gray-900 text-center">DHL Express</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-2 border border-gray-200">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-900 text-center">{t('logisticsPartnersMore')}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('logisticsFaqTitle')}</h3>
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-4">
                    <h4 className="font-medium text-gray-900 mb-2">{t('logisticsFaq1Q')}</h4>
                    <p className="text-sm text-gray-600">{t('logisticsFaq1A')}</p>
                  </div>
                  <div className="border-b border-gray-100 pb-4">
                    <h4 className="font-medium text-gray-900 mb-2">{t('logisticsFaq2Q')}</h4>
                    <p className="text-sm text-gray-600">{t('logisticsFaq2A')}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{t('logisticsFaq3Q')}</h4>
                    <p className="text-sm text-gray-600">{t('logisticsFaq3A')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
