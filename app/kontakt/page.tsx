'use client'

import PageShell from '@/components/PageShell'
import { useLanguage } from '@/lib/LanguageContext'

export default function Kontakt() {
  const { t } = useLanguage()

  return (
    <PageShell>
      <div className="bg-white">
        <main className="max-w-2xl mx-auto px-6 py-16">

          <h1 className="text-3xl font-bold text-gray-900 mb-3">{t('contactPageTitle')}</h1>
          <p className="text-sm text-gray-600 leading-relaxed mb-12">{t('contactPageSubtitle')}</p>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            {/* Contact info */}
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-4">{t('contactInfo')}</h2>
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <div>
                  <span className="font-medium text-gray-900">{t('address')}</span><br />
                  Storgatan 12<br />
                  111 22 Stockholm
                </div>
                <div>
                  <span className="font-medium text-gray-900">{t('phone')}</span><br />
                  +46 (0)8-123 45 67<br />
                  <span className="text-gray-400">{t('openingHours')}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">{t('email')}</span><br />
                  kundservice@example.se<br />
                  <span className="text-gray-400">{t('weRespondWithin24h')}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">{t('organizationNumber')}</span><br />
                  556123-4567
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-4">{t('sendMessage')}</h2>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">{t('name')}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all"
                    placeholder={t('yourName')}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">{t('email')}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all"
                    placeholder={t('yourEmail')}
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-xs font-medium text-gray-700 mb-1">{t('subject')}</label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all bg-white"
                  >
                    <option value="">{t('selectSubject')}</option>
                    <option value="order">{t('orderQuestion')}</option>
                    <option value="return">{t('returnComplaint')}</option>
                    <option value="product">{t('productQuestion')}</option>
                    <option value="sustainability">{t('sustainabilityQuestion')}</option>
                    <option value="other">{t('other')}</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-gray-700 mb-1">{t('message')}</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all resize-none"
                    placeholder={t('writeMessageHere')}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white px-4 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  {t('sendMessageBtn')}
                </button>
              </form>
            </div>
          </div>

          {/* FAQ section */}
          <div className="mt-12 space-y-6">
            <h2 className="text-base font-semibold text-gray-900">{t('faq')}</h2>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{t('howLongDelivery')}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{t('deliveryAnswer')}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{t('whichPaymentMethods')}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{t('paymentAnswer')}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{t('howReturns')}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{t('returnsAnswer')}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{t('canChangeOrder')}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{t('changeOrderAnswer')}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{t('deliverOutsideSweden')}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{t('outsideSwedenAnswer')}</p>
            </div>
          </div>

        </main>
      </div>
    </PageShell>
  )
}
