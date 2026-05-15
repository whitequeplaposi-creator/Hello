'use client'

import PageShell from '@/components/PageShell'
import { useLanguage } from '@/lib/LanguageContext'

export default function Angerratt() {
  const { t } = useLanguage()

  return (
    <PageShell>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-grow">
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">{t('rightOfWithdrawalTitle')}</h1>
              <p className="text-lg text-gray-500 max-w-xl mx-auto">{t('rightOfWithdrawalIntro')}</p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
            <section className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-4 border-b border-gray-100">
                {t('yourRightOfWithdrawal')}
              </h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>{t('yourRightOfWithdrawalText1')}</p>
                <p>{t('yourRightOfWithdrawalText2')}</p>
                <p>{t('yourRightOfWithdrawalText3')}</p>
              </div>
            </section>

            <section className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-4 border-b border-gray-100">
                {t('howToWithdraw')}
              </h2>
              <ol className="space-y-4 text-gray-600 leading-relaxed list-decimal list-inside">
                <li>{t('howToWithdrawText1')}</li>
                <li>{t('howToWithdrawText2')}</li>
                <li>{t('howToWithdrawText3')}</li>
                <li>{t('howToWithdrawText4')}</li>
                <li>{t('howToWithdrawText5')}</li>
              </ol>
            </section>

            <section className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-4 border-b border-gray-100">{t('refund')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>{t('refundText1')}</p>
                <p>{t('refundText2')}</p>
                <p>{t('refundText3')}</p>
              </div>
            </section>

            <section className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-4 border-b border-gray-100">
                {t('exceptionsFromWithdrawal')}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">{t('exceptionsFromWithdrawalText')}</p>
              <ul className="space-y-2 text-gray-600 leading-relaxed list-disc list-inside">
                <li>{t('exceptionsFromWithdrawalText1')}</li>
                <li>{t('exceptionsFromWithdrawalText2')}</li>
                <li>{t('exceptionsFromWithdrawalText3')}</li>
                <li>{t('exceptionsFromWithdrawalText4')}</li>
                <li>{t('exceptionsFromWithdrawalText5')}</li>
              </ul>
            </section>

            <section className="text-center bg-white border border-gray-200 rounded-xl p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('needHelpWithReturn')}</h2>
              <p className="text-gray-500 max-w-lg mx-auto mb-6">{t('needHelpWithReturnText')}</p>
              <a
                href="/kontakt"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {t('contactCustomerService')}
              </a>
            </section>
          </div>
        </main>
      </div>
    </PageShell>
  )
}
