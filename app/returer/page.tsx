'use client'

import { useLanguage } from '@/lib/LanguageContext'

export default function Returer() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow px-4 sm:px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <header className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Returer & Byten</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Vi vill att du ska vara nöjd med ditt köp. Här hittar du all information om hur du returnerar eller byter en vara.
            </p>
          </header>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Så här returnerar du</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-gray-50 rounded-lg text-center space-y-3">
                <svg width="40" height="40" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600 mx-auto">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                <h3 className="font-semibold text-gray-900">1. Registrera retur</h3>
                <p className="text-gray-600 text-sm">Logga in på ditt konto och registrera din retur digitalt.</p>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg text-center space-y-3">
                <svg width="40" height="40" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600 mx-auto">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
                <h3 className="font-semibold text-gray-900">2. Paketera varan</h3>
                <p className="text-gray-600 text-sm">Packa varan i originalförpackningen med alla etiketter kvar.</p>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg text-center space-y-3">
                <svg width="40" height="40" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600 mx-auto">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h3 className="font-semibold text-gray-900">3. Skicka tillbaka</h3>
                <p className="text-gray-600 text-sm">Använd den medföljande returetiketten och lämna in paketet.</p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Returvillkor</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600 flex-shrink-0 mt-0.5">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">30 dagars öppet köp</h3>
                    <p className="text-gray-600 text-sm">Du har alltid 30 dagars öppet köp från det att du mottagit din beställning.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600 flex-shrink-0 mt-0.5">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">Gratis returfrakt</h3>
                    <p className="text-gray-600 text-sm">Vi skickar en returetikett utan extra kostnad vid alla returer.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600 flex-shrink-0 mt-0.5">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">Oanvända varor</h3>
                    <p className="text-gray-600 text-sm">Varan ska vara oanvänd och i obrutet originalskick med alla etiketter kvar.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600 flex-shrink-0 mt-0.5">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">Återbetalning</h3>
                    <p className="text-gray-600 text-sm">Återbetalning sker inom 5 arbetsdagar efter att vi mottagit din retur.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Byten</h2>
            <p className="text-gray-700 leading-relaxed">
              Vill du byta till en annan storlek eller färg? Kontakta vår kundservice så hjälper vi dig med ditt byte. Byten är kostnadsfria inom 30 dagar från mottagandet.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Byte till annan storlek</h3>
                <p className="text-gray-600 text-sm">Skicka tillbaka varan och ange önskad storlek vid returen. Vi skickar den nya storleken så snart vi mottagit din retur.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Byte till annan färg</h3>
                <p className="text-gray-600 text-sm">Om färgen inte stämmer överens med förväntan kan du enkelt byta till en annan färg inom 30 dagar.</p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Reklamationer</h2>
            <p className="text-gray-700 leading-relaxed">
              Har du fått en defekt eller felaktig vara? Vi ber om ursäkt för besväret och hjälper dig självklart att lösa det så snabbt som möjligt.
            </p>
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <p className="text-gray-900 font-semibold">Vid reklamation:</p>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li className="flex items-center space-x-2">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600 flex-shrink-0">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Kontakta kundservice med ordernummer och bild på felet</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600 flex-shrink-0">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Vi skickar en kostnadsfri returetikett för reklamationen</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600 flex-shrink-0">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Du kan välja mellan ny vara eller full återbetalning</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-4 text-center">
            <h2 className="text-2xl font-semibold text-gray-900">Har du frågor om returer?</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Kontakta vår kundservice så hjälper vi dig med din retur, ditt byte eller din reklamation.
            </p>
            <a
              href="/kontakt"
              className="inline-block bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
            >
              Kontakta oss
            </a>
          </section>
        </div>
      </main>
    </div>
  )
}
