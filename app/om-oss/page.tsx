'use client'

import PageShell from '@/components/PageShell'
import { useLanguage } from '@/lib/LanguageContext'
import Link from 'next/link'

export default function OmOss() {
  const { t } = useLanguage()

  return (
    <PageShell>
    <div className="min-h-screen bg-gray-50">
      <main>
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t('aboutUsTitle')}</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('aboutUsSubtitle')}
            </p>
          </div>
          <div className="max-w-5xl mx-auto px-4 pb-12">
            <img
              src="/company-image.png"
              alt={t('aboutUs')}
              className="rounded-xl shadow-md w-full h-auto object-cover"
              style={{ maxHeight: '420px' }}
            />
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-16 space-y-20">

          {/* Company Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">15+</div>
              <div className="text-gray-500 text-sm">{t('yearsInBusiness')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">50+</div>
              <div className="text-gray-500 text-sm">{t('employees')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">10 000+</div>
              <div className="text-gray-500 text-sm">{t('customers')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">98%</div>
              <div className="text-gray-500 text-sm">{t('customerSatisfaction')}</div>
            </div>
          </div>

          {/* Our Story */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('ourJourney')}</h2>
            <p className="text-gray-600 leading-relaxed mb-4 text-lg">
              {t('ourJourneyText1')}
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              {t('ourJourneyText2')}
            </p>
          </div>

          {/* Mission & Values */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('ourMission')}</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t('ourMissionText')}
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{t('handpickedProducts')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{t('fastSecureDeliveries')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{t('personalCustomerService')}</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('ourCoreValues')}</h2>
              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t('quality')}</h3>
                  <p className="text-gray-600 text-sm">{t('qualityDesc')}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t('trust')}</h3>
                  <p className="text-gray-600 text-sm">{t('trustDesc')}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t('innovation')}</h3>
                  <p className="text-gray-600 text-sm">{t('innovationDesc')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-10">{t('keyMilestones')}</h2>
            <div className="space-y-8 max-w-3xl">
              {[
                { year: '2009', title: t('founding'), desc: t('foundingDesc') },
                { year: '2015', title: t('expansion'), desc: t('expansionDesc') },
                { year: '2020', title: t('digitalTransformation'), desc: t('digitalTransformationDesc') },
                { year: '2024', title: t('internationalExpansion'), desc: t('internationalExpansionDesc') },
              ].map((item) => (
                <div key={item.year} className="flex gap-8">
                  <div className="flex-shrink-0 w-14 text-right">
                    <span className="text-lg font-bold text-gray-900">{item.year}</span>
                  </div>
                  <div className="border-l border-gray-200 pl-8 pb-2">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sustainability */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('sustainability')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">{t('ourSustainabilityPromise')}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {t('sustainabilityPromiseText')}
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                    <p className="text-gray-600 text-sm">{t('climateNeutralDeliveries')}: {t('climateNeutralDeliveriesDesc')}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                    <p className="text-gray-600 text-sm">{t('circularEconomy')}: {t('circularEconomyDesc')}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">{t('ourEnvironmentalGoals2025')}</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></span>
                    {t('goal1')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></span>
                    {t('goal2')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></span>
                    {t('goal4')}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Social Responsibility */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('socialResponsibility')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t('environmentalCommitment')}</h3>
                <p className="text-gray-600 text-sm">{t('environmentalCommitmentDesc')}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t('localEngagement')}</h3>
                <p className="text-gray-600 text-sm">{t('localEngagementDesc')}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t('charity')}</h3>
                <p className="text-gray-600 text-sm">{t('charityDesc')}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t('sustainabilityCommitment')}</h3>
                <p className="text-gray-600 text-sm">{t('sustainabilityCommitmentDesc')}</p>
              </div>
            </div>
          </div>

          {/* Location & Contact */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('address')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="font-semibold text-gray-900 mb-2">{t('companyName')}</p>
                <p className="text-gray-600">Storgatan 12</p>
                <p className="text-gray-600">111 22 Stockholm</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">{t('contactUs')}</p>
                <p className="text-gray-600">{t('phone')}: +46 (0)8-123 45 67</p>
                <p className="text-gray-600">{t('email')}: kundservice@example.se</p>
                <p className="text-gray-600 text-sm mt-1">{t('openingHours')}</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center border-t border-gray-200 pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('questionsAboutTerms')}</h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              {t('questionsAboutTermsText')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/kontakt"
                className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                {t('contactUs')}
              </Link>
              <Link
                href="/faq"
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                {t('faq')}
              </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
    </PageShell>
  )
}
