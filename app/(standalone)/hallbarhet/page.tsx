'use client'

import PageShell from '@/components/PageShell'
import { useLanguage } from '@/lib/LanguageContext'

export default function Hallbarhet() {
  const { t } = useLanguage()

  const ecoImages = [
    {
      title: t('solarEnergy'),
      image: (
        <img src="/solenergi.jpg" alt={t('solarEnergy')} className="w-full h-full object-cover" />
      ),
    },
    {
      title: t('recyclingCircular'),
      image: (
        <img src="/atervinning.jpg" alt={t('recyclingCircular')} className="w-full h-full object-cover" />
      ),
    },
    {
      title: t('organicFarming'),
      image: (
        <img src="/organisk-odling.jpg" alt={t('organicFarming')} className="w-full h-full object-cover" />
      ),
    },
    {
      title: t('sustainableTransport'),
      image: (
        <img src="/hallbart-transport.jpg" alt={t('sustainableTransport')} className="w-full h-full object-cover" />
      ),
    },
    {
      title: t('rainforestCompensation'),
      image: (
        <img src="/regnskog.jpg" alt={t('rainforestCompensation')} className="w-full h-full object-cover" />
      ),
    },
    {
      title: t('cleanWater'),
      image: (
        <img src="/rent-vatten.jpg" alt={t('cleanWater')} className="w-full h-full object-cover" />
      ),
    },
    {
      title: t('localCommunityFairTrade'),
      image: (
        <img src="/lokal-gemenskap.jpg" alt={t('localCommunityFairTrade')} className="w-full h-full object-cover" />
      ),
    },
  ]

  return (
    <PageShell>
    <main className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/30 to-stone-50">
      <div className="max-w-7xl mx-auto px-6 py-20 space-y-32">

        <header className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-emerald-800 to-emerald-600 bg-clip-text text-transparent tracking-tight leading-tight">{t('sustainabilityPageTitle')}</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 mx-auto rounded-full" />
          </div>
          <p className="text-xl md:text-2xl text-emerald-700/90 max-w-3xl mx-auto font-light leading-relaxed">
            {t('sustainabilityPageSubtitle')}
          </p>
          <div className="mt-12 max-w-5xl mx-auto">
            <img 
              src="/hallbarhet.png" 
              alt={t('sustainabilityPageSubtitle')} 
              className="w-full h-auto rounded-3xl shadow-2xl ring-1 ring-emerald-100/50"
            />
          </div>
        </header>

        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-semibold text-emerald-900">{t('sustainabilityPromise')}</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 mx-auto rounded-full" />
          </div>
          <p className="text-stone-700 leading-relaxed text-center max-w-4xl mx-auto mb-12 text-xl font-light">
            {t('sustainabilityPromiseText')}
          </p>
          <ul className="grid md:grid-cols-3 gap-8">
            {[
              { title: t('climateNeutralDeliveries'), desc: t('climateNeutralDeliveriesDesc') },
              { title: t('circularEconomy'), desc: t('circularEconomyDesc') },
              { title: t('ethicalProduction'), desc: t('ethicalProductionDesc') },
            ].map((item, i) => (
              <li key={i} className="flex items-start space-x-5 p-7 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/50 hover:shadow-xl transition-all duration-300 hover:bg-white">
                <span className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                  {i + 1}
                </span>
                <div className="space-y-1">
                  <h4 className="text-stone-900 font-bold text-lg">{item.title}</h4>
                  <p className="text-stone-700 font-medium text-base leading-relaxed">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-semibold text-emerald-900">{t('miljoIBilder')}</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 mx-auto rounded-full" />
            <p className="text-stone-600 text-lg font-light">{t('miljoIBilderDesc')}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {ecoImages.map((img, i) => (
              <div
                key={i}
                className={`relative rounded-3xl overflow-hidden ${i === 0 || i === 3 ? 'md:col-span-2 md:row-span-2 min-h-[250px] md:min-h-[380px]' : 'min-h-[250px]'} group shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]`}
              >
                <div className="absolute inset-0">
                  {img.image}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-semibold text-lg md:text-xl leading-tight drop-shadow-lg">{img.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-semibold text-emerald-900">{t('ourCoreValues')}</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: t('environmentalResponsibility'),
                desc: t('environmentalResponsibilityDesc'),
              },
              {
                title: t('transparency'),
                desc: t('transparencyDesc'),
              },
              {
                title: t('innovationSustainability'),
                desc: t('innovationSustainabilityDesc'),
              },
            ].map((v, i) => (
              <div key={i} className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-lg border border-emerald-100/50 text-center hover:shadow-xl transition-all duration-300 hover:bg-white hover:scale-[1.02]">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                </div>
                <h3 className="font-semibold text-emerald-900 text-xl mb-3">{v.title}</h3>
                <p className="text-stone-600 leading-relaxed text-lg">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-semibold text-emerald-900">{t('ourMainInitiatives')}</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: t('climateNeutralDeliveries'),
                desc: t('climateNeutralDeliveriesDesc'),
              },
              {
                title: t('circularEconomy'),
                desc: t('circularEconomyDesc'),
              },
              {
                title: t('ethicalProduction'),
                desc: t('ethicalProductionDesc'),
              },
            ].map((item, i) => (
              <div key={i} className="group bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-lg border border-emerald-100/50 hover:border-emerald-200 transition-all duration-300 hover:bg-white hover:shadow-xl hover:scale-[1.02]">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center mb-6 text-xl font-bold shadow-emerald-200 shadow-lg">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-emerald-900 text-2xl mb-4">{item.title}</h3>
                <p className="text-stone-600 leading-relaxed text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-br from-white to-emerald-50/30 py-20 rounded-3xl">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-semibold text-emerald-900">{t('environmentalGoals2025')}</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 mx-auto rounded-full" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                t('goal1'),
                t('goal2'),
                t('goal3'),
                t('goal4'),
                t('goal5'),
                t('goal6'),
              ].map((goal, i) => (
                <div key={i} className="flex items-center space-x-4 p-5 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-emerald-100/50 hover:shadow-md transition-all">
                  <span className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${
                    i % 2 === 0 ? 'bg-gradient-to-br from-green-500 to-green-600 text-white' : 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white'
                  }`}>
                    {i + 1}
                  </span>
                  <span className="text-stone-700 font-medium text-lg">{goal}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-semibold text-emerald-900">{t('responsibilityInChain')}</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 mx-auto rounded-full" />
          </div>
          <p className="text-stone-700 leading-relaxed text-center max-w-4xl mx-auto mb-12 text-xl font-light">
            {t('responsibilityInChainText')}
          </p>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: t('transparentTraceability'), desc: t('transparentTraceabilityDesc') },
              { title: t('regularAudits'), desc: t('regularAuditsDesc') },
              { title: t('longTermPartnerships'), desc: t('longTermPartnershipsDesc') },
            ].map((item, i) => (
              <div key={i} className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-lg border border-emerald-100/50 text-center hover:shadow-xl transition-all duration-300 hover:bg-white">
                <div className="w-16 h-16 bg-gradient-to-br from-stone-100 to-stone-200 text-stone-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-emerald-900 text-xl mb-3">{item.title}</h3>
                <p className="text-stone-600 leading-relaxed text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-semibold text-emerald-900">{t('socialResponsibility')}</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: t('charity'), desc: t('charityDesc') },
              { title: t('education'), desc: t('educationDesc') },
              { title: t('localEngagement'), desc: t('localEngagementDesc') },
            ].map((item, i) => (
              <div key={i} className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-lg border border-emerald-100/50 text-center hover:shadow-xl transition-all duration-300 hover:bg-white">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-emerald-900 text-xl mb-3">{item.title}</h3>
                <p className="text-stone-600 leading-relaxed text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-semibold text-emerald-900">{t('sustainabilityMilestones')}</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 mx-auto rounded-full" />
          </div>
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-emerald-200 to-emerald-300 hidden md:block" />
            {[
              { year: '2020', text: t('milestone2020'), side: 'left' },
              { year: '2021', text: t('milestone2021'), side: 'right' },
              { year: '2023', text: t('milestone2023'), side: 'left' },
              { year: '2025', text: t('milestone2025'), side: 'right' },
            ].map((m, i) => (
              <div key={i} className={`relative flex md:items-center mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className={`hidden md:block w-1/2 ${i % 2 === 0 ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-emerald-100/50 inline-block hover:shadow-xl transition-all duration-300">
                    <h3 className="font-bold text-emerald-600 text-2xl mb-3">{m.year}</h3>
                    <p className="text-stone-700 leading-relaxed max-w-sm text-lg">{m.text}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full border-4 border-white shadow-xl hidden md:block" />
                <div className="md:hidden w-full">
                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-emerald-100/50">
                    <h3 className="font-bold text-emerald-600 text-2xl mb-3">{m.year}</h3>
                    <p className="text-stone-700 leading-relaxed text-lg">{m.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-semibold text-emerald-900">{t('certificationsAwards')}</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {[
              { title: t('fairTrade'), desc: t('fairTradeDesc'), color: 'bg-gradient-to-br from-amber-50 to-amber-100 text-amber-700 border-amber-200' },
              { title: t('bCorp'), desc: t('bCorpDesc'), color: 'bg-gradient-to-br from-stone-100 to-stone-200 text-stone-700 border-stone-300' },
              { title: t('climateNeutralCert'), desc: t('climateNeutralCertDesc'), color: 'bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200' },
            ].map((cert, i) => (
              <div key={i} className={`rounded-3xl p-10 text-center border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] ${cert.color}`}>
                <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                </div>
                <h3 className="font-bold text-2xl mb-3">{cert.title}</h3>
                <p className="text-lg opacity-90 leading-relaxed">{cert.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-br from-emerald-600 to-green-600 py-24 rounded-3xl">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-white mb-8">{t('makeADifference')}</h2>
              <p className="text-white/90 leading-relaxed text-xl font-light max-w-3xl mx-auto">
                {t('makeADifferenceText')}
              </p>
              <a href="/products" className="inline-block bg-white text-emerald-700 px-10 py-4 font-semibold hover:bg-stone-50 transition-all duration-300 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.05] text-lg">
                {t('exploreSustainableProducts')}
              </a>
            </div>
          </div>
        </section>

      </div>
    </main>
    </PageShell>
  )
}
