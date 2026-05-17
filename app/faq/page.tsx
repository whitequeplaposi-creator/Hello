'use client'

import PageShell from '@/components/PageShell'
import FooterProductStrip from '@/components/FooterProductStrip'
import { useState, useMemo } from 'react'
import { useLanguage } from '@/lib/LanguageContext'

type FaqCategoryId = 'all' | 'delivery' | 'payment' | 'returns' | 'products' | 'service'

interface FaqItem {
  categoryId: Exclude<FaqCategoryId, 'all'>
  question: string
  answer: string
}

const FAQ_SV: FaqItem[] = [
  { categoryId: 'delivery', question: 'Hur lång är leveranstiden?', answer: 'Standardleverans tar 24 arbetsdagar inom Sverige. Expressleverans med 1–2 arbetsdagar finns som tillval vid utcheckning. Leveranser till Norden tar 3–6 arbetsdagar och till EU 5–10 arbetsdagar.' },
  { categoryId: 'delivery', question: 'Hur mycket kostar frakten?', answer: 'Standardfrakt kostar $39. Expressleverans kostar $79. Vi erbjuder alltid fri frakt på beställningar över $500.' },
  { categoryId: 'payment', question: 'Vilka betalningsmetoder accepterar ni?', answer: 'Vi accepterar kortbetalning (Visa, Mastercard) och Klarna delbetalning. Alla betalningar sker säkert via krypterade anslutningar.' },
  { categoryId: 'returns', question: 'Hur fungerar returer?', answer: 'Du har 30 dagars öppet köp från det att du mottagit din beställning. Returfrakt är alltid gratis. Registrera din retur på ditt konto, packa varan i originalförpackningen och använd den medföljande returetiketten.' },
  { categoryId: 'returns', question: 'När får jag min återbetalning?', answer: 'Återbetalning sker inom 5 arbetsdagar efter att vi mottagit och kontrollerat din retur. Pengarna sätts tillbaka till samma betalningsmetod som användes vid köpet.' },
  { categoryId: 'delivery', question: 'Kan jag ändra eller avbryta min beställning?', answer: 'Kontakta vår kundservice inom 30 minuter efter att du lagt din beställning så hjälper vi dig. Ändringar efter detta kan inte garanteras då ordern redan kan ha packats.' },
  { categoryId: 'delivery', question: 'Levererar ni utanför Sverige?', answer: 'Ja, vi levererar till hela Norden (Norge, Danmark, Finland, Island) och EU. Fraktkostnaden varierar beroende på destination. Kontakta oss för leverans utanför EU.' },
  { categoryId: 'delivery', question: 'Hur spårar jag min beställning?', answer: 'När din beställning har skickats får du ett e-postmeddelande med ett spårningsnummer. Du kan även logga in på ditt konto och se aktuell status på din order.' },
  { categoryId: 'delivery', question: 'Vad händer om jag inte är hemma vid leverans?', answer: 'Om du inte är hemma lämnas paketet hos ett ombud i ditt närområde. Du får ett meddelande via SMS eller e-post om var du kan hämta det. Paket som inte hämtas ut inom 14 dagar returneras till oss.' },
  { categoryId: 'products', question: 'Är era förpackningar hållbara?', answer: 'Ja! Alla våra kartonger är FSC-certifierade och tillverkade av 100% återvunnet papper. Fyllnadsmaterialet är komposterbara papperfibrer och stärkelsebaserade lösnötskydd. Sedan 2020 är alla leveranser klimatkompenserade.' },
  { categoryId: 'service', question: 'Hur kontaktar jag kundservice?', answer: 'Du når oss via e-post på kundservice@example.se eller telefon på +46 (0)8-123 45 67 måndag–fredag 08:00–17:00. Du kan även använda vårt kontaktformulär på sidan Kontakta oss.' },
]

const FAQ_EN: FaqItem[] = [
  { categoryId: 'delivery', question: 'How long does delivery take?', answer: 'Standard delivery takes 24 business days within Sweden. Express delivery (1–2 business days) is available at checkout. Deliveries to the Nordics take 3–6 business days and to the EU 5–10 business days.' },
  { categoryId: 'delivery', question: 'How much does shipping cost?', answer: 'Standard shipping is $39. Express delivery is $79. We always offer free shipping on orders over $500.' },
  { categoryId: 'payment', question: 'Which payment methods do you accept?', answer: 'We accept card payments (Visa, Mastercard) and Klarna instalments. All payments are processed securely over encrypted connections.' },
  { categoryId: 'returns', question: 'How do returns work?', answer: 'You have a 30-day returns policy from when you receive your order. Return shipping is always free. Register your return in your account, pack the item in its original packaging and use the enclosed return label.' },
  { categoryId: 'returns', question: 'When will I receive my refund?', answer: 'Refunds are processed within 5 business days after we have received and inspected your return. The money is refunded to the same payment method used for the purchase.' },
  { categoryId: 'delivery', question: 'Can I change or cancel my order?', answer: 'Contact our customer service within 30 minutes of placing your order and we will help you. Changes after that cannot be guaranteed as the order may already have been packed.' },
  { categoryId: 'delivery', question: 'Do you ship outside Sweden?', answer: 'Yes, we ship to the whole Nordic region (Norway, Denmark, Finland, Iceland) and the EU. Shipping cost varies by destination. Contact us for delivery outside the EU.' },
  { categoryId: 'delivery', question: 'How do I track my order?', answer: 'When your order has shipped, you will receive an email with a tracking number. You can also log in to your account to see the current status of your order.' },
  { categoryId: 'delivery', question: 'What if I am not home for delivery?', answer: 'If you are not home, the parcel is left at a pickup point near you. You will be notified by SMS or email where to collect it. Parcels not collected within 14 days are returned to us.' },
  { categoryId: 'products', question: 'Are your packages sustainable?', answer: 'Yes! All our boxes are FSC-certified and made from 100% recycled paper. Fill material is compostable paper fibres and starch-based void fill. Since 2020, all deliveries are climate-compensated.' },
  { categoryId: 'service', question: 'How do I contact customer service?', answer: 'Reach us by email at kundservice@example.se or by phone +46 (0)8-123 45 67 Monday–Friday 08:00–17:00. You can also use our contact form on the Contact us page.' },
]

const CATEGORY_ORDER: Exclude<FaqCategoryId, 'all'>[] = ['delivery', 'payment', 'returns', 'products', 'service']

const CATEGORY_TKEY: Record<Exclude<FaqCategoryId, 'all'>, string> = {
  delivery: 'faqCatDelivery',
  payment: 'faqCatPayment',
  returns: 'faqCatReturns',
  products: 'faqCatProducts',
  service: 'faqCatCustomerService',
}

export default function Faq() {
  const { language, t } = useLanguage()
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState<FaqCategoryId>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const faqs = language === 'en' ? FAQ_EN : FAQ_SV

  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesCategory = activeCategory === 'all' || faq.categoryId === activeCategory
      const q = searchQuery.toLowerCase()
      const matchesSearch = searchQuery === '' || faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q)
      return matchesCategory && matchesSearch
    })
  }, [faqs, activeCategory, searchQuery])

  return (
    <PageShell>
      <div className="bg-white">
        <main className="max-w-2xl mx-auto px-6 py-16">

          <h1 className="text-3xl font-bold text-gray-900 mb-3">{t('faqPageTitle')}</h1>
          <p className="text-sm text-gray-600 leading-relaxed mb-10">{t('faqPageSubtitle')}</p>

          {/* Search */}
          <div className="relative mb-6">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={t('faqSearchPlaceholder')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${activeCategory === 'all' ? 'bg-gray-900 text-white' : 'text-gray-600 border border-gray-200 hover:border-gray-400'}`}
            >
              {t('faqCatAll')}
            </button>
            {CATEGORY_ORDER.map(cat => (
              <button
                type="button"
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${activeCategory === cat ? 'bg-gray-900 text-white' : 'text-gray-600 border border-gray-200 hover:border-gray-400'}`}
              >
                {t(CATEGORY_TKEY[cat])}
              </button>
            ))}
          </div>

          {/* FAQ items */}
          <div className="space-y-0">
            {filteredFaqs.length === 0 ? (
              <div className="py-12">
                <p className="text-sm text-gray-500">{t('faqNoResults')}</p>
                <p className="text-xs text-gray-400 mt-1">{t('faqNoResultsHint')}</p>
              </div>
            ) : (
              filteredFaqs.map(faq => {
                const globalIndex = faqs.indexOf(faq)
                const isOpen = openIndex === globalIndex
                return (
                  <div key={`${faq.question}-${globalIndex}`} className="border-b border-gray-100">
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                      className="w-full flex items-center justify-between py-4 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">{t(CATEGORY_TKEY[faq.categoryId])}</span>
                        <span className="text-sm font-medium text-gray-900">{faq.question}</span>
                      </div>
                      <svg
                        className={`w-4 h-4 text-gray-400 flex-shrink-0 ml-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={`overflow-hidden transition-all duration-200 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <p className="text-sm text-gray-600 leading-relaxed pb-4">{faq.answer}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* CTA */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-900 mb-1">{t('faqContactTitle')}</p>
            <p className="text-sm text-gray-400 mb-4">{t('faqContactSubtitle')}</p>
            <a
              href="/kontakt"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:underline"
            >
              {t('faqContactButton')}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          <FooterProductStrip />
        </main>
      </div>
    </PageShell>
  )
}
