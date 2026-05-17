'use client'

import PageShell from '@/components/PageShell'
import FooterProductStrip from '@/components/FooterProductStrip'
import { useLanguage } from '@/lib/LanguageContext'

export default function Angerratt() {
  const { t } = useLanguage()

  return (
    <PageShell>
      <div className="bg-white">
        <main className="max-w-2xl mx-auto px-6 py-16">

          <h1 className="text-3xl font-bold text-gray-900 mb-3">{t('rightOfWithdrawalTitle')}</h1>
          <p className="text-sm text-gray-600 leading-relaxed mb-12">{t('rightOfWithdrawalIntro')}</p>

          <div className="space-y-10">

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">{t('yourRightOfWithdrawal')}</h2>
              <div className="space-y-2 text-sm text-gray-600 leading-relaxed">
                <p>{t('yourRightOfWithdrawalText1')}</p>
                <p>{t('yourRightOfWithdrawalText2')}</p>
                <p>{t('yourRightOfWithdrawalText3')}</p>
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">{t('howToWithdraw')}</h2>
              <ol className="space-y-2 text-sm text-gray-600 leading-relaxed list-decimal list-inside">
                <li>{t('howToWithdrawText1')}</li>
                <li>{t('howToWithdrawText2')}</li>
                <li>{t('howToWithdrawText3')}</li>
                <li>{t('howToWithdrawText4')}</li>
                <li>{t('howToWithdrawText5')}</li>
              </ol>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">{t('refund')}</h2>
              <div className="space-y-2 text-sm text-gray-600 leading-relaxed">
                <p>{t('refundText1')}</p>
                <p>{t('refundText2')}</p>
                <p>{t('refundText3')}</p>
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">{t('exceptionsFromWithdrawal')}</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">{t('exceptionsFromWithdrawalText')}</p>
              <ul className="space-y-1 text-sm text-gray-600 leading-relaxed list-disc list-inside">
                <li>{t('exceptionsFromWithdrawalText1')}</li>
                <li>{t('exceptionsFromWithdrawalText2')}</li>
                <li>{t('exceptionsFromWithdrawalText3')}</li>
                <li>{t('exceptionsFromWithdrawalText4')}</li>
                <li>{t('exceptionsFromWithdrawalText5')}</li>
              </ul>
            </section>

          </div>

          <div className="mt-16 pt-8 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-900 mb-1">{t('needHelpWithReturn')}</p>
            <p className="text-sm text-gray-400 mb-4">{t('needHelpWithReturnText')}</p>
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
