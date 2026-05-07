'use client'

import { useLanguage } from '@/lib/LanguageContext'

export default function Cookies() {
  const { t } = useLanguage()

  const sections = [
    {
      title: 'Vad är cookies?',
      content: [
        'Cookies är små textfiler som lagras på din dator, surfplatta eller mobiltelefon när du besöker en webbplats. De används för att webbplatsen ska kunna känna igen din enhet vid återbesök.',
        'Cookies är vanliga på internet och utgör en viktig del av hur moderna webbplatser fungerar. Utan cookies skulle många funktioner, såsom inloggning, varukorg och språkinställningar, inte fungera korrekt.'
      ]
    },
    {
      title: 'Hur använder vi cookies?',
      content: [
        'Vi använder cookies för att förbättra din upplevelse på vår webbplats, analysera trafik och anpassa vårt innehåll. Nedan beskriver vi de olika kategorier av cookies vi använder.'
      ]
    },
    {
      title: 'Nödvändiga cookies',
      content: [
        'Dessa cookies är nödvändiga för att webbplatsen ska fungera korrekt. De kan inte stängas av i våra system och lagrar inga personligt identifierbara uppgifter.',
        'Exempel: sessionscookies för varukorgen, inloggningsstatus och säkerhetsfunktioner.'
      ]
    },
    {
      title: 'Funktionella cookies',
      content: [
        'Funktionella cookies gör det möjligt för webbplatsen att komma ihåg val du gör (t.ex. språk, region eller valuta) och ge förbättrade, mer personliga funktioner.',
        'Exempel: språkinställningar, sparade inloggningsuppgifter och anpassade preferenser.'
      ]
    },
    {
      title: 'Analytiska cookies',
      content: [
        'Dessa cookies hjälper oss att förstå hur besökare använder vår webbplats genom att samla in och rapportera information anonymt. Informationen används för att förbättra webbplatsens struktur och innehåll.',
        'Exempel: Google Analytics, besöksstatistik, sidvisningar och trafikkällor.'
      ]
    },
    {
      title: 'Marknadsföringscookies',
      content: [
        'Marknadsföringscookies används för att spåra besökare över webbplatser. Avsikten är att visa annonser som är relevanta och engagerande för den enskilda användaren.',
        'Exempel: sociala medier-pixel, remarketing och annonspartners.'
      ]
    },
    {
      title: 'Hur hanterar du cookies?',
      content: [
        'Du kan när som helst ändra dina cookie-inställningar genom att klicka på knappen nedan eller genom att justera inställningarna i din webbläsare.',
        'Observera att inaktivering av vissa cookies kan påverka funktionaliteten på vår webbplats och göra att vissa tjänster inte fungerar som förväntat.',
        'De flesta webbläsare låter dig kontrollera cookies via sina inställningar. Information om hur du gör detta finns i hjälpmenyn för din webbläsare.'
      ]
    },
    {
      title: 'Tredjepartscookies',
      content: [
        'Vissa cookies på vår webbplats sätts av tredje parter, såsom betalningsleverantörer och analysverktyg. Dessa parter har sina egna integritetspolicyer och vi rekommenderar att du läser dem.',        'Vi använder i dagsläget följande tredjepartstjänster som kan sätta cookies: Google Analytics (analys), Klarna (delbetalning) och Meta Pixel (marknadsföring).'
      ]
    },
    {
      title: 'Kontakt',
      content: [
        'Om du har frågor om vår användning av cookies är du välkommen att kontakta vår kundservice på kundservice@example.se.'
      ]
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Cookies</h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Här kan du läsa om hur vi använder cookies och hur du hanterar dina inställningar.
            </p>
            <p className="text-sm text-gray-400 mt-2">Senast uppdaterad: {new Date().toLocaleDateString('sv-SE')}</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
          {sections.map((section, index) => (
            <section key={index} className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-4 border-b border-gray-100">
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-gray-600 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}

          <section className="text-center bg-white border border-gray-200 rounded-xl p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Hantera dina cookies</h2>
            <p className="text-gray-500 max-w-lg mx-auto mb-6">
              Du kan när som helst uppdatera dina cookie-inställningar eller kontakta oss om du har frågor.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => alert('Cookie-inställningar skulle visas här.')}
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Cookie-inställningar
              </button>
              <a
                href="/kontakt"
                className="inline-flex items-center gap-2 bg-white text-gray-900 border border-gray-200 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Kontakta oss
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
