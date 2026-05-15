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
        <div className="bg-gradient-to-r from-white to-gray-100 text-gray-900 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('aboutUsTitle')}</h1>
              <p className="text-xl md:text-2xl text-gray-800 max-w-3xl mx-auto">
                {t('aboutUsSubtitle')}
              </p>
            </div>
            <div className="flex justify-center mt-8">
              <img 
                src="/company-image.png" 
                alt={t('aboutUs')} 
                className="rounded-lg shadow-lg max-w-full h-auto"
                style={{ maxHeight: '400px' }}
              />
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-16">
          {/* Customer Satisfaction */}
          <div className="text-center mb-16">
            <div className="text-6xl font-bold text-gray-900 mb-2">98%</div>
            <div className="text-xl text-gray-600">{t('customerSatisfaction')}</div>
          </div>

          {/* Company Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">15+</div>
              <div className="text-gray-600">{t('yearsInBusiness')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">50+</div>
              <div className="text-gray-600">{t('employees')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">10 000+</div>
              <div className="text-gray-600">{t('customers')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-gray-600">{t('productsCount')}</div>
            </div>
          </div>

          {/* Mission & Values */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="py-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <svg className="w-8 h-8 mr-3 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {t('ourMission')}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t('ourMissionText')}
              </p>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-3 text-gray-900 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t('handpickedProducts')}</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-3 text-gray-900 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t('fastSecureDeliveries')}</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-3 text-gray-900 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t('personalCustomerService')}</span>
                </li>
              </ul>
            </div>

            <div className="py-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <svg className="w-8 h-8 mr-3 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {t('ourCoreValues')}
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-gray-900 mr-4 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">{t('quality')}</h4>
                    <p className="text-gray-600">{t('qualityDesc')}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-gray-900 mr-4 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">{t('trust')}</h4>
                    <p className="text-gray-600">{t('trustDesc')}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-gray-900 mr-4 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">{t('innovation')}</h4>
                    <p className="text-gray-600">{t('innovationDesc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Story Section */}
          <div className="py-16 mb-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">{t('ourJourney')}</h3>
            <div className="max-w-4xl mx-auto">
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                {t('ourJourneyText1')}
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                {t('ourJourneyText2')}
              </p>
            </div>
          </div>

          {/* Timeline/Milestones */}
          <div className="py-16 mb-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-12 text-center">{t('keyMilestones')}</h3>
            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-16 text-right">
                    <div className="text-lg font-bold text-gray-900">2009</div>
                  </div>
                  <div className="ml-8">
                    <h4 className="font-semibold text-gray-800 mb-2">{t('founding')}</h4>
                    <p className="text-gray-600">{t('foundingDesc')}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-16 text-right">
                    <div className="text-lg font-bold text-gray-900">2015</div>
                  </div>
                  <div className="ml-8">
                    <h4 className="font-semibold text-gray-800 mb-2">{t('expansion')}</h4>
                    <p className="text-gray-600">{t('expansionDesc')}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-16 text-right">
                    <div className="text-lg font-bold text-gray-900">2020</div>
                  </div>
                  <div className="ml-8">
                    <h4 className="font-semibold text-gray-800 mb-2">{t('digitalTransformation')}</h4>
                    <p className="text-gray-600">{t('digitalTransformationDesc')}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-16 text-right">
                    <div className="text-lg font-bold text-gray-900">2024</div>
                  </div>
                  <div className="ml-8">
                    <h4 className="font-semibold text-gray-800 mb-2">{t('internationalExpansion')}</h4>
                    <p className="text-gray-600">{t('internationalExpansionDesc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="py-16 mb-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-12 text-center">{t('meetOurTeam')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">Anna Andersson</h4>
                <p className="text-gray-600 text-sm mb-2">{t('ceo')}</p>
                <p className="text-gray-500 text-sm">{t('ceoDesc')}</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">Erik Berg</h4>
                <p className="text-gray-600 text-sm mb-2">{t('cto')}</p>
                <p className="text-gray-500 text-sm">{t('ctoDesc')}</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">Maria Lindberg</h4>
                <p className="text-gray-600 text-sm mb-2">{t('cmo')}</p>
                <p className="text-gray-500 text-sm">{t('cmoDesc')}</p>
              </div>
            </div>
          </div>

          {/* Vision Section */}
          <div className="py-16 mb-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">{t('ourVisionForFuture')}</h3>
            <div className="max-w-4xl mx-auto">
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                {t('visionText')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <svg className="w-12 h-12 text-gray-900 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                  <h4 className="font-semibold text-gray-800 mb-2">{t('sustainabilityVision')}</h4>
                  <p className="text-gray-600 text-sm">{t('sustainabilityVisionDesc')}</p>
                </div>
                <div className="text-center">
                  <svg className="w-12 h-12 text-gray-900 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M12 6V4a2 2 0 00-2-2 2 2 0 00-2 2v2H4v8a2 2 0 002 2h8a2 2 0 002-2V6h-4zM8 4a2 2 0 014 0v2H8V4z" />
                  </svg>
                  <h4 className="font-semibold text-gray-800 mb-2">{t('growth')}</h4>
                  <p className="text-gray-600 text-sm">{t('growthDesc')}</p>
                </div>
                <div className="text-center">
                  <svg className="w-12 h-12 text-gray-900 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <h4 className="font-semibold text-gray-800 mb-2">{t('community')}</h4>
                  <p className="text-gray-600 text-sm">{t('communityDesc')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Certifications & Awards */}
          <div className="py-16 mb-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-12 text-center">{t('certificationsAwards')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <svg className="w-16 h-16 text-gray-900 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <h4 className="font-semibold text-gray-800 mb-2">{t('swedishEcommerce')}</h4>
                <p className="text-gray-600 text-sm">{t('swedishEcommerceDesc')}</p>
              </div>
              <div className="text-center">
                <svg className="w-16 h-16 text-gray-900 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h4 className="font-semibold text-gray-800 mb-2">{t('iso9001')}</h4>
                <p className="text-gray-600 text-sm">{t('iso9001Desc')}</p>
              </div>
              <div className="text-center">
                <svg className="w-16 h-16 text-gray-900 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
                <h4 className="font-semibold text-gray-800 mb-2">{t('gazelle')}</h4>
                <p className="text-gray-600 text-sm">{t('gazelleDesc')}</p>
              </div>
            </div>
          </div>

          {/* Partnerships */}
          <div className="py-16 mb-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-12 text-center">{t('partnerships')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm font-medium">PostNord</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm font-medium">Klarna</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm font-medium">Google</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm font-medium">Microsoft</p>
              </div>
            </div>
          </div>

          {/* Social Responsibility */}
          <div className="py-16 mb-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-12 text-center">{t('socialResponsibility')}</h3>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start">
                  <svg className="w-8 h-8 text-gray-900 mr-4 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">{t('environmentalCommitment')}</h4>
                    <p className="text-gray-600">{t('environmentalCommitmentDesc')}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-8 h-8 text-gray-900 mr-4 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">{t('localEngagement')}</h4>
                    <p className="text-gray-600">{t('localEngagementDesc')}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-8 h-8 text-gray-900 mr-4 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">{t('charity')}</h4>
                    <p className="text-gray-600">{t('charityDesc')}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-8 h-8 text-gray-900 mr-4 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M12 6V4a2 2 0 00-2-2 2 2 0 00-2 2v2H4v8a2 2 0 002 2h8a2 2 0 002-2V6h-4zM8 4a2 2 0 014 0v2H8V4z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">{t('sustainabilityCommitment')}</h4>
                    <p className="text-gray-600">{t('sustainabilityCommitmentDesc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technology & Innovation */}
          <div className="py-16 mb-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-12 text-center">{t('technologyInnovation')}</h3>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-900 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  <h4 className="font-semibold text-gray-800 mb-2">{t('modernTechnology')}</h4>
                  <p className="text-gray-600 text-sm">{t('modernTechnologyDesc')}</p>
                </div>
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-900 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  <h4 className="font-semibold text-gray-800 mb-2">{t('cloudNative')}</h4>
                  <p className="text-gray-600 text-sm">{t('cloudNativeDesc')}</p>
                </div>
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-900 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  <h4 className="font-semibold text-gray-800 mb-2">{t('fastDeliveries')}</h4>
                  <p className="text-gray-600 text-sm">{t('fastDeliveriesDesc')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sustainability Section */}
          <div className="py-16 mb-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-12 text-center">{t('sustainability')}</h3>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                <div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-6">{t('ourSustainabilityPromise')}</h4>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {t('sustainabilityPromiseText')}
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <svg className="w-6 h-6 text-green-600 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-1">{t('climateNeutralDeliveries')}</h5>
                        <p className="text-gray-600 text-sm">{t('climateNeutralDeliveriesDesc')}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-6 h-6 text-green-600 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-1">{t('circularEconomy')}</h5>
                        <p className="text-gray-600 text-sm">{t('circularEconomyDesc')}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-6">{t('responsibilityInChain')}</h4>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {t('responsibilityInChainText')}
                  </p>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h5 className="font-semibold text-gray-800 mb-3">{t('ourEnvironmentalGoals2025')}</h5>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                        {t('goal1')}
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                        {t('goal2')}
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                        {t('goal4')}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location & Contact */}
          <div className="py-16 mb-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">{t('address')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div>
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {t('companyName')}
                </h4>
                <p className="text-gray-600 mb-2">Storgatan 12</p>
                <p className="text-gray-600">111 22 Stockholm</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  {t('contactUs')}
                </h4>
                <p className="text-gray-600 mb-2">{t('phone')}: +46 (0)8-123 45 67</p>
                <p className="text-gray-600 mb-2">{t('email')}: kundservice@example.se</p>
                <p className="text-gray-600">{t('openingHours')}</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('questionsAboutTerms')}</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
              {t('questionsAboutTermsText')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/kontakt" 
                className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors inline-block"
              >
                {t('contactUs')}
              </Link>
              <Link 
                href="/faq" 
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-block"
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
