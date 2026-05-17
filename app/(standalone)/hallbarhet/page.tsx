'use client'

import PageShell from '@/components/PageShell'
import { useLanguage } from '@/lib/LanguageContext'

export default function Hallbarhet() {
  const { t } = useLanguage()

  const ecoImages = [
    {
      title: t('solarEnergy'),
      image: <img src="/solenergi.jpg" alt={t('solarEnergy')} className="w-full h-full object-cover" />,
    },
    {
      title: t('recyclingCircular'),
      image: <img src="/atervinning.jpg" alt={t('recyclingCircular')} className="w-full h-full object-cover" />,
    },
    {
      title: t('organicFarming'),
      image: <img src="/organisk-odling.jpg" alt={t('organicFarming')} className="w-full h-full object-cover" />,
    },
    {
      title: t('sustainableTransport'),
      image: <img src="/hallbart-transport.jpg" alt={t('sustainableTransport')} className="w-full h-full object-cover" />,
    },
    {
      title: t('rainforestCompensation'),
      image: <img src="/regnskog.jpg" alt={t('rainforestCompensation')} className="w-full h-full object-cover" />,
    },
    {
      title: t('cleanWater'),
      image: <img src="/rent-vatten.jpg" alt={t('cleanWater')} className="w-full h-full object-cover" />,
    },
    {
      title: t('localCommunityFairTrade'),
      image: <img src="/lokal-gemenskap.jpg" alt={t('localCommunityFairTrade')} className="w-full h-full object-cover" />,
    },
  ]

  const coreValues = [
    {
      title: t('environmentalResponsibility'),
      desc: t('environmentalResponsibilityDesc'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
      ),
    },
    {
      title: t('transparency'),
      desc: t('transparencyDesc'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: t('innovationSustainability'),
      desc: t('innovationSustainabilityDesc'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      ),
    },
  ]

  const initiatives = [
    { title: t('climateNeutralDeliveries'), desc: t('climateNeutralDeliveriesDesc') },
    { title: t('circularEconomy'), desc: t('circularEconomyDesc') },
    { title: t('ethicalProduction'), desc: t('ethicalProductionDesc') },
  ]

  const chainItems = [
    {
      title: t('transparentTraceability'),
      desc: t('transparentTraceabilityDesc'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      ),
    },
    {
      title: t('regularAudits'),
      desc: t('regularAuditsDesc'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
    },
    {
      title: t('longTermPartnerships'),
      desc: t('longTermPartnershipsDesc'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
  ]

  const socialItems = [
    {
      title: t('charity'),
      desc: t('charityDesc'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
    },
    {
      title: t('education'),
      desc: t('educationDesc'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
        </svg>
      ),
    },
    {
      title: t('localEngagement'),
      desc: t('localEngagementDesc'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
    },
  ]

  const milestones = [
    { year: '2020', text: t('milestone2020') },
    { year: '2021', text: t('milestone2021') },
    { year: '2023', text: t('milestone2023') },
    { year: '2025', text: t('milestone2025') },
  ]

  const certs = [
    {
      title: t('fairTrade'),
      desc: t('fairTradeDesc'),
      accent: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      dot: 'bg-amber-400',
    },
    {
      title: t('bCorp'),
      desc: t('bCorpDesc'),
      accent: 'text-stone-700',
      bg: 'bg-stone-50',
      border: 'border-stone-200',
      dot: 'bg-stone-400',
    },
    {
      title: t('climateNeutralCert'),
      desc: t('climateNeutralCertDesc'),
      accent: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      dot: 'bg-emerald-500',
    },
  ]

  const goals = [
    t('goal1'), t('goal2'), t('goal3'),
    t('goal4'), t('goal5'), t('goal6'),
  ]

  return (
    <PageShell>
      <main className="min-h-screen bg-[#f9f8f6]">

        {/* ── Hero ── */}
        <section className="relative bg-white border-b border-stone-100">
          <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24">
            <div className="max-w-2xl">
              <span className="inline-block text-xs font-semibold tracking-widest text-emerald-600 uppercase mb-5">
                {t('sustainability')}
              </span>
              <h1 className="text-5xl md:text-6xl font-bold text-stone-900 leading-[1.1] tracking-tight mb-6">
                {t('sustainabilityPageTitle')}
              </h1>
              <p className="text-lg text-stone-500 leading-relaxed max-w-xl">
                {t('sustainabilityPageSubtitle')}
              </p>
            </div>
          </div>
          <div className="max-w-6xl mx-auto px-6 pb-0">
            <div className="rounded-t-2xl overflow-hidden shadow-xl">
              <img
                src="/hallbarhet.png"
                alt={t('sustainabilityPageTitle')}
                className="w-full h-auto object-cover max-h-[520px]"
              />
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6 py-24 space-y-28">

          {/* ── Löfte ── */}
          <section>
            <SectionLabel label="01" />
            <div className="grid md:grid-cols-2 gap-16 items-start mt-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-stone-900 leading-tight mb-5">
                  {t('sustainabilityPromise')}
                </h2>
                <p className="text-stone-500 leading-relaxed text-base">
                  {t('sustainabilityPromiseText')}
                </p>
              </div>
              <div className="space-y-4">
                {initiatives.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 bg-white rounded-xl border border-stone-100 shadow-sm">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-stone-800 text-sm mb-1">{item.title}</p>
                      <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Bildgalleri ── */}
          <section>
            <SectionLabel label="02" />
            <div className="mt-8 mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3">{t('miljoIBilder')}</h2>
              <p className="text-stone-500 text-base">{t('miljoIBilderDesc')}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {ecoImages.map((img, i) => (
                <div
                  key={i}
                  className={`relative rounded-xl overflow-hidden group ${
                    i === 0 || i === 3
                      ? 'md:col-span-2 md:row-span-2 min-h-[220px] md:min-h-[360px]'
                      : 'min-h-[180px]'
                  }`}
                >
                  <div className="absolute inset-0">{img.image}</div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm font-medium leading-snug drop-shadow">{img.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Kärnvärden ── */}
          <section>
            <SectionLabel label="03" />
            <div className="mt-8 mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900">{t('ourCoreValues')}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {coreValues.map((v, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 border border-stone-100 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                    {v.icon}
                  </div>
                  <h3 className="font-semibold text-stone-900 text-base mb-2">{v.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Miljömål ── */}
          <section className="bg-white rounded-2xl border border-stone-100 shadow-sm p-10 md:p-14">
            <SectionLabel label="04" />
            <div className="mt-6 mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900">{t('environmentalGoals2025')}</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {goals.map((goal, i) => (
                <div key={i} className="flex items-center gap-3 py-3 px-4 rounded-lg bg-stone-50 border border-stone-100">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 flex-shrink-0 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                  <span className="text-stone-700 text-sm font-medium">{goal}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── Ansvar i kedjan ── */}
          <section>
            <SectionLabel label="05" />
            <div className="grid md:grid-cols-2 gap-16 items-start mt-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-stone-900 leading-tight mb-5">
                  {t('responsibilityInChain')}
                </h2>
                <p className="text-stone-500 leading-relaxed text-base">
                  {t('responsibilityInChainText')}
                </p>
              </div>
              <div className="space-y-4">
                {chainItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 bg-white rounded-xl border border-stone-100 shadow-sm">
                    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-stone-800 text-sm mb-1">{item.title}</p>
                      <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Socialt ansvar ── */}
          <section>
            <SectionLabel label="06" />
            <div className="mt-8 mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900">{t('socialResponsibility')}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {socialItems.map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 border border-stone-100 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center mb-5">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-stone-900 text-base mb-2">{item.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Tidslinje ── */}
          <section>
            <SectionLabel label="07" />
            <div className="mt-8 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900">{t('sustainabilityMilestones')}</h2>
            </div>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-px bg-stone-200 md:-translate-x-px" />
              <div className="space-y-8">
                {milestones.map((m, i) => (
                  <div key={i} className={`relative flex gap-8 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Dot */}
                    <div className="absolute left-[11px] md:left-1/2 top-5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow md:-translate-x-2 z-10" />
                    {/* Card */}
                    <div className={`ml-12 md:ml-0 md:w-[46%] ${i % 2 === 0 ? 'md:mr-auto md:pr-10' : 'md:ml-auto md:pl-10'}`}>
                      <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
                        <span className="text-xs font-bold tracking-widest text-emerald-600 uppercase">{m.year}</span>
                        <p className="text-stone-700 text-sm leading-relaxed mt-2">{m.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Certifieringar ── */}
          <section>
            <SectionLabel label="08" />
            <div className="mt-8 mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900">{t('certificationsAwards')}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {certs.map((cert, i) => (
                <div key={i} className={`rounded-2xl p-8 border ${cert.bg} ${cert.border}`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${cert.dot} mb-5`} />
                  <h3 className={`font-bold text-base mb-2 ${cert.accent}`}>{cert.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{cert.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── CTA ── */}
          <section className="border-t border-stone-200 pt-16">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">{t('makeADifference')}</h2>
              <p className="text-stone-500 text-base leading-relaxed mb-8">
                {t('makeADifferenceText')}
              </p>
              <a
                href="/products"
                className="inline-flex items-center gap-2 bg-stone-900 text-white text-sm font-semibold px-7 py-3.5 rounded-xl hover:bg-stone-700 transition-colors duration-200"
              >
                {t('exploreSustainableProducts')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </section>

        </div>
      </main>
    </PageShell>
  )
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold tracking-widest text-stone-300 uppercase">{label}</span>
      <div className="flex-1 h-px bg-stone-200" />
    </div>
  )
}
