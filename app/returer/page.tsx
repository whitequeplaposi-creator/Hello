'use client'

import PageShell from '@/components/PageShell'
import { useLanguage } from '@/lib/LanguageContext'

export default function Returer() {
  const { t } = useLanguage()

  return (
    <PageShell>
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow px-4 sm:px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <header className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('returnsAndExchanges')}</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('returnsSubtitle')}
            </p>
          </header>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">{t('howToReturn')}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-gray-50 rounded-lg text-center space-y-3">
                <svg width="40" height="40" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600 mx-auto">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                <h3 className="font-semibold text-gray-900">{t('registerReturn')}</h3>
                <p className="text-gray-600 text-sm">{t('registerReturnDesc')}</p>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg text-center space-y-3">
                <svg width="40" height="40" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600 mx-auto">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
                <h3 className="font-semibold text-gray-900">{t('packItem')}</h3>
                <p className="text-gray-600 text-sm">{t('packItemDesc')}</p>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg text-center space-y-3">
                <svg width="40" height="40" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600 mx-auto">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h3 className="font-semibold text-gray-900">{t('sendBack')}</h3>
                <p className="text-gray-600 text-sm">{t('sendBackDesc')}</p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">{t('returnConditions')}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600 flex-shrink-0 mt-0.5">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">{t('thirtyDaysReturn')}</h3>
                    <p className="text-gray-600 text-sm">{t('thirtyDaysReturnDesc')}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600 flex-shrink-0 mt-0.5">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">{t('freeReturnShipping')}</h3>
                    <p className="text-gray-600 text-sm">{t('freeReturnShippingDesc')}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600 flex-shrink-0 mt-0.5">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">{t('unusedItems')}</h3>
                    <p className="text-gray-600 text-sm">{t('unusedItemsDesc')}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600 flex-shrink-0 mt-0.5">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">{t('refundCondition')}</h3>
                    <p className="text-gray-600 text-sm">{t('refundDesc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">{t('exchanges')}</h2>
            <p className="text-gray-700 leading-relaxed">
              {t('exchangesText')}
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">{t('exchangeSize')}</h3>
                <p className="text-gray-600 text-sm">{t('exchangeSizeDesc')}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">{t('exchangeColor')}</h3>
                <p className="text-gray-600 text-sm">{t('exchangeColorDesc')}</p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">{t('complaintsTitle')}</h2>
            <p className="text-gray-700 leading-relaxed">
              {t('complaintsText')}
            </p>
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <p className="text-gray-900 font-semibold">{t('whenComplaining')}</p>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li className="flex items-center space-x-2">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600 flex-shrink-0">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t('complaintStep1')}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600 flex-shrink-0">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t('complaintStep2')}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600 flex-shrink-0">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t('complaintStep3')}</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-4 text-center">
            <h2 className="text-2xl font-semibold text-gray-900">{t('questionsAboutReturns')}</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              {t('questionsAboutReturnsText')}
            </p>
            <a
              href="/kontakt"
              className="inline-block bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
            >
              {t('contactUs')}
            </a>
          </section>
        </div>
      </main>
    </div>
    </PageShell>
  )
}

