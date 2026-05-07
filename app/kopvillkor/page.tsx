'use client'

import { useLanguage } from '@/lib/LanguageContext'

export default function Kopvillkor() {
  const { t } = useLanguage()

  const sections = [
    {
      title: 'Allmänna villkor',
      content: [
        'Dessa allmänna villkor gäller för alla köp som görs via vår webbplats.',
        'Genom att beställa från oss accepterar du dessa villkor. Villkoren utgör tillsammans med din orderbekräftelse det avtal som gäller mellan dig och oss.',
        'Vi förbehåller oss rätten att ändra dessa villkor. Vid varje beställning gäller de villkor som är publicerade på webbplatsen vid beställningstillfället.',
        'För att handla hos oss måste du ha fyllt 18 år. Vi accepterar inte beställningar från minderåriga utan målsmans godkännande.'
      ]
    },
    {
      title: 'Priser och betalning',
      content: [
        'Alla priser anges i USD och inkluderar moms. Vid beställning från länder utanför Sverige kan ytterligare tullavgifter och skatter tillkomma.',
        'Vi erbjuder följande betalningsmetoder: kortbetalning (Visa, Mastercard) och Klarna delbetalning.',
        'Betalning sker i samband med beställning. Vid delbetalning via Klarna gäller Klarnas egna villkor, vilka du accepterar i samband med betalningen.',
        'Vi förbehåller oss rätten att justera priser på webbplatsen utan föregående avisering. Gällande pris är det som anges på webbplatsen vid beställningstillfället.'
      ]
    },
    {
      title: 'Leverans',
      content: [
        'Standardleverans tar 3–5 arbetsdagar inom Sverige. Expressleverans med 1–2 arbetsdagar finns som tillval vid utcheckning.',
        'Leveranser sker med PostNord, DHL eller Budbee beroende på valt leveranssätt och destination.',
        'Vid beställning över $500 erbjuder vi fri standardfrakt inom Sverige. För beställningar under $500 tillkommer en fraktavgift om $39 för standardfrakt och $79 för expressfrakt.',
        'Om en vara är tillfälligt slut i lager informerar vi dig via e-post med beräknad leveranstid. Du har då rätt att häva köpet om leveranstiden inte passar.'
      ]
    },
    {
      title: 'Ångerrätt och returer',
      content: [
        'Enligt lagen om distansavtal har du 14 dagars ångerrätt från det att du mottagit varan. Vi erbjuder utökat öppet köp om 30 dagar.',
        'För att utnyttja ångerrätten måste varan vara oanvänd och i samma skick som när du mottog den. Alla etiketter och förpackningar ska vara kvar.',
        'Returfrakt är alltid gratis. Kontakta vår kundservice för att få en returetikett. Vid åberopande av ångerrätt återbetalas hela köpesumman inom 14 dagar från det att vi mottagit varan.',
        'Undantag från ångerrätten gäller för varor med bruten förpackning, specialtillverkade produkter samt hygienartiklar och underkläder där förpackningen har brutits.'
      ]
    },
    {
      title: 'Reklamationer',
      content: [
        'Enligt konsumentköplagen har du rätt att reklamera en vara inom tre år från inköpsdatum, förutsatt att felet fanns vid köpet.',
        'Reklamation ska ske inom skälig tid efter det att du upptäckt eller bort upptäcka felet. Reklamation som sker inom två månader från upptäckten anses alltid ha skett inom skälig tid.',
        'Vid godkänd reklamation står vi för returfrakten. Du har rätt att välja mellan reparation, ny vara, prisavdrag eller återbetalning.',
        'Kontakta vår kundservice för att påbörja en reklamation. Bifoga ordernummer och beskrivning av felet. Vi rekommenderar att du fotograferar felet för att underlätta hanteringen.'
      ]
    },
    {
      title: 'Personuppgifter',
      content: [
        'Vi behandlar dina personuppgifter i enlighet med GDPR och vår integritetspolicy. Du hittar den fullständiga integritetspolicyn under länken Integritetspolicy längst ner på sidan.',
        'De personuppgifter vi samlar in används för att hantera din beställning, leverans och betalning. Uppgifterna lagras säkert och delas endast med våra betalningsleverantörer och logistikpartners i den utsträckning som krävs för att fullfölja avtalet.',
        'Du har rätt att begära utdrag, rättelse eller radering av dina personuppgifter. Kontakta vår kundservice för frågor om personuppgiftshantering.'
      ]
    },
    {
      title: 'Force majeure',
      content: [
        'Vi är befriade från påföljd för underlåtenhet att fullgöra vissa förpliktelser enligt dessa villkor, om underlåtenheten har sin grund i befriande omständigheter enligt nedan och omständigheten förhindrar, försvårar eller försenar fullgörelsen.',
        'Såsom befriande omständighet ska anses vara bland annat myndighets åtgärd eller underlåtenhet, nytillkommen eller ändrad lagstiftning, konflikt på arbetsmarknaden, blockad, brand, översvämning, sabotage, olyckshändelse av större omfattning eller annan typ av naturkatastrof.',
        'I force majeure-fall har vi rätt att häva avtalet utan skyldighet att betala skadestånd.'
      ]
    },
    {
      title: 'Tvist',
      content: [
        'Vi strävar alltid efter att lösa eventuella tvister i samförstånd med dig. Om vi trots detta inte skulle lyckas nå en överenskommelse kan du vända dig till Allmänna reklamationsnämnden (ARN).',
        'Du kan också använda EU-kommissionens onlineplattform för tvistlösning (ODR), som finns tillgänglig på http://ec.europa.eu/odr.',
        'Eventuell tvist ska i första hand lösas genom förhandling. Om parterna inte kan enas ska tvisten avgöras av svensk allmän domstol med tillämpning av svensk rätt.'
      ]
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Köpvillkor</h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Här finner du de allmänna villkor som gäller vid köp från vår webbplats.
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Har du frågor om våra villkor?</h2>
            <p className="text-gray-500 max-w-lg mx-auto mb-6">
              Kontakta vår kundservice om något är oklart eller om du behöver hjälp med en beställning.
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
