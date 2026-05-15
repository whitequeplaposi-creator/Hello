'use client'

import PageShell from '@/components/PageShell'
import { useLanguage } from '@/lib/LanguageContext'

export default function Kopvillkor() {
  const { language, t } = useLanguage()
  const locale = language === 'en' ? 'en-GB' : 'sv-SE'

  const sections = [
    {
      titleKey: 'generalTerms',
      contentKey: 'generalTermsText'
    },
    {
      titleKey: 'pricesAndPayment',
      contentKey: 'pricesAndPaymentText'
    },
    {
      titleKey: 'delivery',
      contentKey: 'deliveryText'
    },
    {
      titleKey: 'rightOfWithdrawalSection',
      contentKey: 'rightOfWithdrawalText'
    },
    {
      titleKey: 'complaints',
      contentKey: 'complaintsTermsText'
    },
    {
      titleKey: 'personalData',
      contentKey: 'personalDataText'
    },
    {
      titleKey: 'forceMajeure',
      contentKey: 'forceMajeureText'
    },
    {
      titleKey: 'disputes',
      contentKey: 'disputesText'
    }
  ]

  return (
    <PageShell>
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">{t('termsOfPurchaseTitle')}</h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              {t('termsOfPurchaseIntro')}
            </p>
            <p className="text-sm text-gray-400 mt-2">{t('lastUpdated')} {new Date().toLocaleDateString(locale)}</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
          {sections.map((section, index) => (
            <section key={index} className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-4 border-b border-gray-100">
                {t(section.titleKey)}
              </h2>
              <div className="space-y-3">
                <p className="text-gray-600 leading-relaxed">
                  {t(section.contentKey)}
                </p>
              </div>
            </section>
          ))}

          <section className="text-center bg-white border border-gray-200 rounded-xl p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('questionsAboutTerms')}</h2>
            <p className="text-gray-500 max-w-lg mx-auto mb-6">
              {t('questionsAboutTermsText')}
            </p>
            <a
              href="/kontakt"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              {t('contactUs')}
            </a>
          </section>
        </div>
      </main>
    </div>
    </PageShell>
  )
}
