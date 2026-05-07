'use client'

import { useLanguage } from '@/lib/LanguageContext'

export default function Angerratt() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Ångerrätt</h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Din lagstadgade rätt att ångra ett distansköp inom 14 dagar. Vi erbjuder utökat öppet köp på 30 dagar.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
          <section className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-4 border-b border-gray-100">Din ångerrätt</h2>
            <div className="space-y-3 text-gray-600 leading-relaxed">
              <p>Enligt lagen (2005:59) om distansavtal har du rätt att frånträda ett distansavtal inom 14 kalenderdagar från det att du mottagit varan.</p>
              <p>Vi erbjuder utökat öppet köp och ger dig <strong className="text-gray-900">30 dagar</strong> på dig att bestämma om du vill behålla din vara. Ångerfristen börjar löpa från den dag du mottog varan.</p>
              <p>Ångerrätten gäller under förutsättning att varan returneras i väsentligen oförändrat skick. Varan får gärna provas, men den ska inte ha använts eller skadats.</p>
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-4 border-b border-gray-100">Så här ångrar du ett köp</h2>
            <ol className="space-y-4 text-gray-600 leading-relaxed list-decimal list-inside">
              <li>Kontakta vår kundservice på <a href="mailto:kundservice@example.se" className="text-gray-900 underline">kundservice@example.se</a> eller använd formuläret nedan.</li>
              <li>Ange ditt ordernummer och vilka varor du vill returnera.</li>
              <li>Vi skickar en kostnadsfri returetikett till dig.</li>
              <li>Packa varan i originalförpackningen med alla etiketter och tillbehör.</li>
              <li>Lämna in paketet enligt instruktionerna på returetiketten.</li>
            </ol>
          </section>

          <section className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-4 border-b border-gray-100">Återbetalning</h2>
            <div className="space-y-3 text-gray-600 leading-relaxed">
              <p>Vi återbetalar alla betalningar vi mottagit från dig, inklusive leveranskostnader, senast inom 14 dagar från det att vi mottagit ditt meddelande om ånger.</p>
              <p>Vi väntar med återbetalningen tills vi mottagit varan tillbaka alternativt du tillhandahållit oss bevis på att varan returnerats.</p>
              <p>Återbetalningen sker via samma betalningsmetod som användes vid köpet.</p>
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-4 border-b border-gray-100">Undantag från ångerrätten</h2>
            <p className="text-gray-600 leading-relaxed mb-4">Ångerrätten gäller inte för följande varor enligt lag:</p>
            <ul className="space-y-2 text-gray-600 leading-relaxed list-disc list-inside">
              <li>Varor som tillverkats enligt dina anvisningar eller har en tydlig personlig prägel.</li>
              <li>Varor som på grund av sin beskaffenhet kan bli förstörda eller föråldrade snabbt.</li>
              <li>Förseglade varor som av hälso- eller hygieniska skäl inte lämpar sig att returnera, om förseglingen brutits.</li>
              <li>Ljud- och bildupptagningar eller programvara i förseglad förpackning, om förseglingen brutits.</li>
              <li>Tidningar, tidskrifter eller magasin med undantag för prenumerationsavtal.</li>
            </ul>
          </section>

          <section className="text-center bg-white border border-gray-200 rounded-xl p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Behöver du hjälp med din retur?</h2>
            <p className="text-gray-500 max-w-lg mx-auto mb-6">
              Vår kundservice hjälper dig med alla frågor om ångerrätt och returer.
            </p>
            <a
              href="/kontakt"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Kontakta kundservice
            </a>
          </section>
        </div>
      </main>
    </div>
  )
}
