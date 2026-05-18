'use client'

import PageShell from '@/components/PageShell'
import { useLanguage } from '@/lib/LanguageContext'

export default function FraktLeverans() {
  const { t } = useLanguage()

  return (
    <PageShell>
      <div className="bg-white">
        <main className="max-w-2xl mx-auto px-6 py-16">

          <h1 className="text-3xl font-bold text-gray-900 mb-3">{t('shippingAndDelivery')}</h1>
          <p className="text-sm text-gray-600 leading-relaxed mb-12">{t('shippingSubtitle')}</p>

          <div className="space-y-8">

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">{t('deliveryOptions')}</h2>
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <div>
                  <span className="font-medium text-gray-900">{t('standardShipping')}</span> — {t('standardShippingTime')} — $39<br />
                  {t('standardShippingDesc')}
                </div>
                <div>
                  <span className="font-medium text-gray-900">{t('expressShipping')}</span> — {t('expressShippingTime')} — $79<br />
                  {t('expressShippingDesc')}
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">{t('deliveryAreas')}</h2>
              <div className="space-y-2 text-sm text-gray-600 leading-relaxed">
                <p><span className="font-medium text-gray-900">{t('sweden')}</span> — {t('swedenDesc')}</p>
                <p><span className="font-medium text-gray-900">{t('nordics')}</span> — {t('nordicsDesc')}</p>
                <p><span className="font-medium text-gray-900">{t('eu')}</span> — {t('euDesc')}</p>
                <p><span className="font-medium text-gray-900">{t('restOfWorld')}</span> — {t('restOfWorldDesc')}</p>
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">{t('trackYourDelivery')}</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">{t('trackYourDeliveryText')}</p>
              <p className="text-sm font-medium text-gray-900 mb-1">{t('transportMethods')}</p>
              <ul className="text-sm text-gray-600 leading-relaxed space-y-1 list-disc list-inside">
                <li>{t('postnordDesc')}</li>
                <li>{t('dhlDesc')}</li>
                <li>{t('schenkerDesc')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-4">{t('deliveryTimes')}</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-2 pr-4 text-gray-900 font-semibold">{t('region')}</th>
                      <th className="py-2 pr-4 text-gray-900 font-semibold">{t('deliveryTimeTable')}</th>
                      <th className="py-2 text-gray-900 font-semibold">{t('shippingPrice')}</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-4">{t('sweden')}</td>
                      <td className="py-2 pr-4">{t('standardShippingTime')}</td>
                      <td className="py-2">$39 / $79</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-4">{t('nordics')}</td>
                      <td className="py-2 pr-4">{t('standardShippingTime')}</td>
                      <td className="py-2">$79 / $149</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-4">{t('eu')}</td>
                      <td className="py-2 pr-4">{t('standardShippingTime')}</td>
                      <td className="py-2">$99 / $199</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">{t('restOfWorld')}</td>
                      <td className="py-2 pr-4">{t('standardShippingTime')}</td>
                      <td className="py-2">Från $149</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <div className="pt-8 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-900 mb-1">{t('questionsAboutDelivery')}</p>
              <p className="text-sm text-gray-400 mb-4">{t('questionsAboutDeliveryText')}</p>
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
