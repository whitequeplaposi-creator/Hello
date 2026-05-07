'use client'

import { useLanguage } from '@/lib/LanguageContext'

export default function Kontakt() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow px-4 sm:px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <header className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Kontakta oss</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Har du frågor, synpunkter eller behöver hjälp? Vi finns här för dig och svarar så snart vi kan.
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-8">
            <section className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Kontaktuppgifter</h2>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600 flex-shrink-0 mt-0.5">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">Adress</h3>
                    <p className="text-gray-600">Storgatan 12<br />111 22 Stockholm</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600 flex-shrink-0 mt-0.5">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">Telefon</h3>
                    <p className="text-gray-600">+46 (0)8-123 45 67</p>
                    <p className="text-gray-500 text-sm">Mån–Fre: 08:00–17:00</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600 flex-shrink-0 mt-0.5">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">E-post</h3>
                    <p className="text-gray-600">kundservice@example.se</p>
                    <p className="text-gray-500 text-sm">Vi svarar inom 24 timmar</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor" className="text-gray-600 flex-shrink-0 mt-0.5">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">Organisationsnummer</h3>
                    <p className="text-gray-600">556123-4567</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Skicka ett meddelande</h2>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Namn</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all"
                    placeholder="Ditt namn"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-post</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all"
                    placeholder="din@epost.se"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Ämne</label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all bg-white"
                  >
                    <option value="">Välj ämne</option>
                    <option value="order">Fråga om beställning</option>
                    <option value="return">Retur och reklamation</option>
                    <option value="product">Produktfråga</option>
                    <option value="sustainability">Hållbarhet</option>
                    <option value="other">Annat</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Meddelande</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Skriv ditt meddelande här..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
                >
                  Skicka meddelande
                </button>
              </form>
            </section>
          </div>

          
          <section className="space-y-4 text-center">
            <h2 className="text-2xl font-semibold text-gray-900">Vanliga frågor</h2>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Hur lång är leveranstiden?</h3>
                <p className="text-gray-600 text-sm">Standardleverans tar 3–5 arbetsdagar. Expressleverans finns tillgänglig vid utcheckning.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Vilka betalningsmetoder accepterar ni?</h3>
                <p className="text-gray-600 text-sm">Vi accepterar kortbetalning (Visa, Mastercard) och Klarna delbetalning.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Hur fungerar returer?</h3>
                <p className="text-gray-600 text-sm">Du har 30 dagars öppet köp. Returfrakt är kostnadsfri med vår returetikett.</p>
              </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Kan jag ändra eller avbryta en beställning?</h3>
                <p className="text-gray-600 text-sm">Kontakta kundservice inom 30 minuter efter beställningen så hjälper vi dig.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Levererar ni utanför Sverige?</h3>
                <p className="text-gray-600 text-sm">Ja, vi levererar till hela Norden och EU. Fraktkostnaden varierar beroende på destination.</p>
              </div>
            </div>
          </section>

          <section className="space-y-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-900">Följ oss</h2>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors" aria-label="Facebook">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors" aria-label="Instagram">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors" aria-label="X / Twitter">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors" aria-label="LinkedIn">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
