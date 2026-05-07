'use client'

import { useLanguage } from '@/lib/LanguageContext'

export default function FraktLeverans() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow px-4 sm:px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <header className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Frakt & Leverans</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Vi erbjuder globala leveranser. Standardfrakt 24 arbetsdagar, express 21 arbetsdagar.
            </p>
          </header>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Leveransalternativ</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-gray-50 rounded-lg text-center space-y-3">
                <svg width="40" height="40" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600 mx-auto">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
                <h3 className="font-semibold text-gray-900">Standardfrakt</h3>
                <p className="text-gray-600 text-sm">24 arbetsdagar</p>
                <p className="text-gray-900 font-bold">$39</p>
                <p className="text-gray-500 text-xs">Global leverans • Fri frakt över $500</p>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg text-center space-y-3">
                <svg width="40" height="40" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600 mx-auto">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <h3 className="font-semibold text-gray-900">Expressleverans</h3>
                <p className="text-gray-600 text-sm">21 arbetsdagar</p>
                <p className="text-gray-900 font-bold">$79</p>
                <p className="text-gray-500 text-xs">Global leverans • Leverans till dörr</p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Leveransområden</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600 flex-shrink-0">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">Sverige</h3>
                    <p className="text-gray-600 text-sm">Leverans till hela landet</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600 flex-shrink-0">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">Norden</h3>
                    <p className="text-gray-600 text-sm">Norge, Danmark, Finland, Island</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600 flex-shrink-0">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">EU</h3>
                    <p className="text-gray-600 text-sm">Alla EU-länder</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600 flex-shrink-0">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">Övriga världen</h3>
                    <p className="text-gray-600 text-sm">Global leverans</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Spåra din leverans</h2>
            <p className="text-gray-700 leading-relaxed">
              När din beställning har skickats får du ett e-postmeddelande med ett spårningsnummer. Du kan använda detta nummer för att följa din försändelse på transportörens webbplats.
            </p>
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <p className="text-gray-900 font-semibold">Transportmetoder:</p>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li className="flex items-center space-x-2">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600 flex-shrink-0">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>PostNord – Globala leveranser</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600 flex-shrink-0">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>DHL – Internationella frakter</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600 flex-shrink-0">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>DB Schenker – Logistiklösningar</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Leveranstider</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-gray-900 font-semibold">Region</th>
                    <th className="py-3 px-4 text-gray-900 font-semibold">Leveranstid</th>
                    <th className="py-3 px-4 text-gray-900 font-semibold">Fraktpris</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700">Sverige</td>
                    <td className="py-3 px-4 text-gray-600">24 arbetsdagar</td>
                    <td className="py-3 px-4 text-gray-700">$39 / $79</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700">Norden</td>
                    <td className="py-3 px-4 text-gray-600">24 arbetsdagar</td>
                    <td className="py-3 px-4 text-gray-700">$79 / $149</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700">EU</td>
                    <td className="py-3 px-4 text-gray-600">24 arbetsdagar</td>
                    <td className="py-3 px-4 text-gray-700">$99 / $199</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-gray-700">Övriga världen</td>
                    <td className="py-3 px-4 text-gray-600">24 arbetsdagar</td>
                    <td className="py-3 px-4 text-gray-700">Från $149</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-4 text-center">
            <h2 className="text-2xl font-semibold text-gray-900">Har du frågor om leverans?</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Kontakta vår kundservice så hjälper vi dig med spårning, leveransstatus eller andra frågor.
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
