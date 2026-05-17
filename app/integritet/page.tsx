'use client'

import PageShell from '@/components/PageShell'
import FooterProductStrip from '@/components/FooterProductStrip'
import { useLanguage } from '@/lib/LanguageContext'

export default function Integritetspolicy() {
  const { language, t } = useLanguage()
  const locale = language === 'en' ? 'en-GB' : 'sv-SE'

  const sections: { titleKey: string; contentKeys: string[] }[] = [
    { titleKey: 'whoAreWe', contentKeys: ['whoAreWeText1', 'whoAreWeText2'] },
    { titleKey: 'whatDataCollect', contentKeys: ['whatDataCollectText1', 'whatDataCollectText2'] },
    { titleKey: 'whyProcessData', contentKeys: ['whyProcessDataText1', 'whyProcessDataText2', 'whyProcessDataText3'] },
    { titleKey: 'legalBasis', contentKeys: ['legalBasisText1', 'legalBasisText2', 'legalBasisText3', 'legalBasisText4', 'legalBasisText5'] },
    { titleKey: 'howLongStore', contentKeys: ['howLongStoreText1', 'howLongStoreText2'] },
    { titleKey: 'whoShareWith', contentKeys: ['whoShareWithText1', 'whoShareWithText2', 'whoShareWithText3'] },
    { titleKey: 'yourRights', contentKeys: ['yourRightsText1', 'yourRightsText2', 'yourRightsText3', 'yourRightsText4', 'yourRightsText5', 'yourRightsText6', 'yourRightsText7'] },
    { titleKey: 'contactAndComplaints', contentKeys: ['contactAndComplaintsText1', 'contactAndComplaintsText2'] },
  ]

  return (
    <PageShell>
      <div className="bg-white">
        <main className="max-w-2xl mx-auto px-6 py-16">

          <div className="mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{t('privacyPolicyTitle')}</h1>
            <p className="text-sm text-gray-400">{t('lastUpdated')} {new Date().toLocaleDateString(locale)}</p>
            <p className="text-sm text-gray-600 leading-relaxed mt-3">{t('privacyPolicyIntro')}</p>
          </div>

          <div className="space-y-10">
            {sections.map(section => (
              <section key={section.titleKey}>
                <h2 className="text-base font-semibold text-gray-900 mb-2">{t(section.titleKey)}</h2>
                <div className="space-y-2">
                  {section.contentKeys.map(key => (
                    <p key={key} className="text-sm text-gray-600 leading-relaxed">
                      {t(key)}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-900 mb-1">{t('questionsAboutPrivacy')}</p>
            <p className="text-sm text-gray-400 mb-4">{t('questionsAboutPrivacyText')}</p>
            <a
              href="/kontakt"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:underline"
            >
              {t('contactCustomerService')}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          <FooterProductStrip />
        </main>
      </div>
    </PageShell>
  )
}
