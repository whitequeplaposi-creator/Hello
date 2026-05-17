'use client'

import PageShell from '@/components/PageShell'
import FooterProductStrip from '@/components/FooterProductStrip'
import { useLanguage } from '@/lib/LanguageContext'
import { useCookies } from '@/lib/CookieContext'

export default function Cookies() {
  const { language, t } = useLanguage()
  const { openSettings } = useCookies()
  const locale = language === 'en' ? 'en-GB' : 'sv-SE'

  const sections: { titleKey: string; contentKeys: string[] }[] = [
    { titleKey: 'whatAreCookies', contentKeys: ['whatAreCookiesText1', 'whatAreCookiesText2'] },
    { titleKey: 'howUseCookies', contentKeys: ['howUseCookiesText'] },
    { titleKey: 'necessaryCookies', contentKeys: ['necessaryCookiesText1', 'necessaryCookiesText2'] },
    { titleKey: 'functionalCookies', contentKeys: ['functionalCookiesText1', 'functionalCookiesText2'] },
    { titleKey: 'analyticalCookies', contentKeys: ['analyticalCookiesText1', 'analyticalCookiesText2'] },
    { titleKey: 'marketingCookies', contentKeys: ['marketingCookiesText1', 'marketingCookiesText2'] },
    { titleKey: 'howManageCookies', contentKeys: ['howManageCookiesText1', 'howManageCookiesText2', 'howManageCookiesText3'] },
    { titleKey: 'thirdPartyCookies', contentKeys: ['thirdPartyCookiesText1', 'thirdPartyCookiesText2'] },
    { titleKey: 'cookiesContact', contentKeys: ['cookiesContactText'] },
  ]

  return (
    <PageShell>
      <div className="bg-white">
        <main className="max-w-2xl mx-auto px-6 py-16">

          <div className="mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{t('cookiesTitle')}</h1>
            <p className="text-sm text-gray-600 leading-relaxed">{t('cookiesIntro')}</p>
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
            <p className="text-sm font-medium text-gray-900 mb-1">{t('manageCookies')}</p>
            <p className="text-sm text-gray-400 mb-4">{t('manageCookiesText')}</p>
            <div className="flex flex-wrap gap-4 items-center">
              <button
                type="button"
                onClick={openSettings}
                className="text-sm font-medium text-gray-900 hover:underline"
              >
                {t('cookieSettings')}
              </button>
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
            <p className="text-xs text-gray-400 mt-8">
              {t('lastUpdated')} {new Date().toLocaleDateString(locale)}
            </p>
          </div>

          <FooterProductStrip />
        </main>
      </div>
    </PageShell>
  )
}
