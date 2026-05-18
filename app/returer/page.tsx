'use client'

import PageShell from '@/components/PageShell'
import { useLanguage } from '@/lib/LanguageContext'

export default function Returer() {
  const { t } = useLanguage()

  return (
    <PageShell>
      <div className="bg-white">
        <main className="max-w-2xl mx-auto px-6 py-16">

          <h1 className="text-3xl font-bold text-gray-900 mb-3">{t('returnsAndExchanges')}</h1>
          <p className="text-sm text-gray-600 leading-relaxed mb-12">{t('returnsSubtitle')}</p>

          <div className="space-y-8">

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">{t('howToReturn')}</h2>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 leading-relaxed">
                <li><span className="font-medium text-gray-900">{t('registerReturn')}</span> — {t('registerReturnDesc')}</li>
                <li><span className="font-medium text-gray-900">{t('packItem')}</span> — {t('packItemDesc')}</li>
                <li><span className="font-medium text-gray-900">{t('sendBack')}</span> — {t('sendBackDesc')}</li>
              </ol>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">{t('returnConditions')}</h2>
              <ul className="space-y-2 text-sm text-gray-600 leading-relaxed list-disc list-inside">
                <li><span className="font-medium text-gray-900">{t('thirtyDaysReturn')}</span> — {t('thirtyDaysReturnDesc')}</li>
                <li><span className="font-medium text-gray-900">{t('freeReturnShipping')}</span> — {t('freeReturnShippingDesc')}</li>
                <li><span className="font-medium text-gray-900">{t('unusedItems')}</span> — {t('unusedItemsDesc')}</li>
                <li><span className="font-medium text-gray-900">{t('refundCondition')}</span> — {t('refundDesc')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">{t('exchanges')}</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">{t('exchangesText')}</p>
              <div className="space-y-2 text-sm text-gray-600 leading-relaxed">
                <p><span className="font-medium text-gray-900">{t('exchangeSize')}</span> — {t('exchangeSizeDesc')}</p>
                <p><span className="font-medium text-gray-900">{t('exchangeColor')}</span> — {t('exchangeColorDesc')}</p>
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">{t('complaintsTitle')}</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">{t('complaintsText')}</p>
              <p className="text-sm font-medium text-gray-900 mb-1">{t('whenComplaining')}</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 leading-relaxed">
                <li>{t('complaintStep1')}</li>
                <li>{t('complaintStep2')}</li>
                <li>{t('complaintStep3')}</li>
              </ul>
            </section>

            <div className="pt-8 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-900 mb-1">{t('questionsAboutReturns')}</p>
              <p className="text-sm text-gray-400 mb-4">{t('questionsAboutReturnsText')}</p>
              <a
                href="/kontakt"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:underline"
              >
                {t('contactUs')}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>

          </div>

        </main>
      </div>
    </PageShell>
  )
}
