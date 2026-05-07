'use client'

import { useState, useMemo } from 'react'
import { useLanguage } from '@/lib/LanguageContext'

const categories = ['Alla', 'Leverans', 'Betalning', 'Returer', 'Produkter', 'Kundservice'] as const

type Category = typeof categories[number]

interface FaqItem {
  question: string
  answer: string
  category: Category
}

export default function Faq() {
  const { t } = useLanguage()
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState<Category>('Alla')
  const [searchQuery, setSearchQuery] = useState('')

  const faqs: FaqItem[] = [
    { question: 'Hur lång är leveranstiden?', answer: 'Standardleverans tar 3–5 arbetsdagar inom Sverige. Expressleverans med 1–2 arbetsdagar finns som tillval vid utcheckning. Leveranser till Norden tar 3–6 arbetsdagar och till EU 5–10 arbetsdagar.', category: 'Leverans' },
    { question: 'Hur mycket kostar frakten?', answer: 'Standardfrakt kostar $39. Expressleverans kostar $79. Vi erbjuder alltid fri frakt på beställningar över $500.', category: 'Leverans' },
    { question: 'Vilka betalningsmetoder accepterar ni?', answer: 'Vi accepterar kortbetalning (Visa, Mastercard) och Klarna delbetalning. Alla betalningar sker säkert via krypterade anslutningar.', category: 'Betalning' },
    { question: 'Hur fungerar returer?', answer: 'Du har 30 dagars öppet köp från det att du mottagit din beställning. Returfrakt är alltid gratis. Registrera din retur på ditt konto, packa varan i originalförpackningen och använd den medföljande returetiketten.', category: 'Returer' },
    { question: 'När får jag min återbetalning?', answer: 'Återbetalning sker inom 5 arbetsdagar efter att vi mottagit och kontrollerat din retur. Pengarna sätts tillbaka till samma betalningsmetod som användes vid köpet.', category: 'Returer' },
    { question: 'Kan jag ändra eller avbryta min beställning?', answer: 'Kontakta vår kundservice inom 30 minuter efter att du lagt din beställning så hjälper vi dig. Ändringar efter detta kan inte garanteras då ordern redan kan ha packats.', category: 'Leverans' },
    { question: 'Levererar ni utanför Sverige?', answer: 'Ja, vi levererar till hela Norden (Norge, Danmark, Finland, Island) och EU. Fraktkostnaden varierar beroende på destination. Kontakta oss för leverans utanför EU.', category: 'Leverans' },
    { question: 'Hur spårar jag min beställning?', answer: 'När din beställning har skickats får du ett e-postmeddelande med ett spårningsnummer. Du kan även logga in på ditt konto och se aktuell status på din order.', category: 'Leverans' },
    { question: 'Vad händer om jag inte är hemma vid leverans?', answer: 'Om du inte är hemma lämnas paketet hos ett ombud i ditt närområde. Du får ett meddelande via SMS eller e-post om var du kan hämta det. Paket som inte hämtas ut inom 14 dagar returneras till oss.', category: 'Leverans' },
        { question: 'Är era förpackningar hållbara?', answer: 'Ja! Alla våra kartonger är FSC-certifierade och tillverkade av 100% återvunnet papper. Fyllnadsmaterialet är komposterbara papperfibrer och stärkelsebaserade lösnötskydd. Sedan 2020 är alla leveranser klimatkompenserade.', category: 'Produkter' },
    { question: 'Hur kontaktar jag kundservice?', answer: 'Du når oss via e-post på kundservice@example.se eller telefon på +46 (0)8-123 45 67 måndag–fredag 08:00–17:00. Du kan även använda vårt kontaktformulär på sidan Kontakta oss.', category: 'Kundservice' }
  ]

  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesCategory = activeCategory === 'Alla' || faq.category === activeCategory
      const matchesSearch = searchQuery === '' || faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [faqs, activeCategory, searchQuery])

  const getCategoryIcon = (cat: Category) => {
    switch (cat) {
      case 'Leverans': return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
      case 'Betalning': return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
      case 'Returer': return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
      case 'Produkter': return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
      case 'Kundservice': return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
      default: return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Vanliga frågor</h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Hitta snabba svar på dina frågor. Använd sök eller filtrera efter ämne nedan.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              placeholder="Sök bland frågor och svar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 placeholder-gray-400"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {cat !== 'Alla' && getCategoryIcon(cat)}
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 21a7.962 7.962 0 01-5.657-2.343A7.962 7.962 0 013 12a7.962 7.962 0 013.343-5.657A7.962 7.962 0 0112 3a7.962 7.962 0 015.657 2.343A7.962 7.962 0 0121 12a7.962 7.962 0 01-2.343 5.657z" /></svg>
                <p className="text-gray-500 font-medium">Inga frågor hittades</p>
                <p className="text-gray-400 text-sm mt-1">Prova en annan sökning eller kategori</p>
              </div>
            ) : (
              filteredFaqs.map((faq, index) => {
                const globalIndex = faqs.indexOf(faq)
                const isOpen = openIndex === globalIndex
                return (
                  <div
                    key={globalIndex}
                    className={`bg-white border rounded-xl overflow-hidden transition-shadow ${isOpen ? 'border-gray-300 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          {faq.category}
                        </span>
                        <span className="font-semibold text-gray-900">{faq.question}</span>
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-400 flex-shrink-0 ml-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-200 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                      <div className="px-5 pb-5 pt-0">
                        <div className="border-t border-gray-100 pt-4">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          <section className="text-center bg-white border border-gray-200 rounded-xl p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Hittar du inte svaret?</h2>
            <p className="text-gray-500 max-w-lg mx-auto mb-6">
              Vår kundservice finns tillgänglig måndag–fredag och svarar vanligtvis inom 24 timmar.
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
