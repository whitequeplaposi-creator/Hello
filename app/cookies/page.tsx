'use client'

import PageShell from '@/components/PageShell'
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
    {
      titleKey: 'howManageCookies',
      contentKeys: ['howManageCookiesText1', 'howManageCookiesText2', 'howManageCookiesText3'],
    },
    { titleKey: 'thirdPartyCookies', contentKeys: ['thirdPartyCookiesText1', 'thirdPartyCookiesText2'] },
    { titleKey: 'cookiesContact', contentKeys: ['cookiesContactText'] },
  ]

  return (
    <PageShell>
      <div className="min-h-screen bg-white">
        <main className="flex-grow">
          <div className="border-b border-gray-100">
            <div className="max-w-4xl mx-auto px-6 py-20 text-center">
              <h1 className="text-3xl font-semibold text-gray-900 mb-3 tracking-tight">{t('cookiesTitle')}</h1>
              <p className="text-base text-gray-600 max-w-2xl mx-auto">{t('cookiesIntro')}</p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-6 py-16">
            <div className="space-y-12">
              {sections.map(section => (
                <section key={section.titleKey}>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">{t(section.titleKey)}</h2>
                  <div className="space-y-4">
                    {section.contentKeys.map(key => (
                      <p key={key} className="text-sm text-gray-600 leading-relaxed">
                        {t(key)}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-16 pt-12 border-t border-gray-100">
              <div className="text-center">
                <h2 className="text-lg font-medium text-gray-900 mb-3">{t('manageCookies')}</h2>
                <p className="text-sm text-gray-600 mb-8 max-w-xl mx-auto">{t('manageCookiesText')}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    type="button"
                    onClick={openSettings}
                    className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    {t('cookieSettings')}
                  </button>
                  <a
                    href="/kontakt"
                    className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 border border-gray-200 px-6 py-2.5 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    {t('contactUs')}
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-xs text-gray-400">
                {t('lastUpdated')} {new Date().toLocaleDateString(locale)}
              </p>
            </div>
          </div>
        </main>
      </div>
    </PageShell>
  )
}
