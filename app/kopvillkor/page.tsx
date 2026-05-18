'use client'

import PageShell from '@/components/PageShell'
import { useLanguage } from '@/lib/LanguageContext'

const sections = [
  { titleKey: 'generalTerms',            contentKey: 'generalTermsText' },
  { titleKey: 'pricesAndPayment',         contentKey: 'pricesAndPaymentText' },
  { titleKey: 'delivery',                 contentKey: 'deliveryText' },
  { titleKey: 'rightOfWithdrawalSection', contentKey: 'rightOfWithdrawalText' },
  { titleKey: 'complaints',               contentKey: 'complaintsTermsText' },
  { titleKey: 'personalData',             contentKey: 'personalDataText' },
  { titleKey: 'forceMajeure',             contentKey: 'forceMajeureText' },
  { titleKey: 'disputes',                 contentKey: 'disputesText' },
]

export default function Kopvillkor() {
  const { language, t } = useLanguage()
  const locale = language === 'en' ? 'en-GB' : 'sv-SE'

  return (
    <PageShell>
      <div className="min-h-screen bg-white">
        <main className="max-w-2xl mx-auto px-6 py-16 sm:py-24">

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{t('termsOfPurchaseTitle')}</h1>
            <p className="text-gray-500 text-sm">{t('lastUpdated')} {new Date().toLocaleDateString(locale)}</p>
            <p className="text-gray-600 mt-4 leading-relaxed">{t('termsOfPurchaseIntro')}</p>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {sections.map((s) => (
              <section key={s.titleKey}>
                <h2 className="text-base font-semibold text-gray-900 mb-2">{t(s.titleKey)}</h2>
                <p className="text-gray-600 leading-relaxed text-sm">{t(s.contentKey)}</p>
              </section>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="mt-16 pt-8 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-1 font-medium">{t('questionsAboutTerms')}</p>
            <p className="text-sm text-gray-400 mb-4">{t('questionsAboutTermsText')}</p>
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

        </main>
      </div>
    </PageShell>
  )
}
