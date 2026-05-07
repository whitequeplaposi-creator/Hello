'use client'

import { useLanguage } from '@/lib/LanguageContext'

export default function Integritetspolicy() {
  const { t } = useLanguage()

  const sections = [
    {
      title: 'Vem är vi?',
      content: [
        'E-handel AB (org.nr 556123-4567) är personuppgiftsansvarig för behandlingen av dina personuppgifter på denna webbplats.',
        'Vår adress är Storgatan 12, 111 22 Stockholm. Du når vår kundservice på kundservice@example.se eller telefon +46 (0)8-123 45 67.'
      ]
    },
    {
      title: 'Vilka uppgifter samlar vi in?',
      content: [
        'Vi samlar in de personuppgifter som du själv lämnar till oss när du gör en beställning, kontaktar kundservice eller anmäler dig till vårt nyhetsbrev. Detta kan inkludera namn, adress, e-postadress, telefonnummer och betalningsuppgifter.',
        'Vi samlar även in teknisk information om din enhet och din användning av webbplatsen, såsom IP-adress, webbläsartyp, operativsystem och besöksstatistik, via cookies och liknande tekniker.'
      ]
    },
    {
      title: 'Varför behandlar vi dina uppgifter?',
      content: [
        'Vi behandlar dina personuppgifter för att kunna fullgöra vårt avtal med dig, det vill säga hantera din beställning, leverera varor och hantera betalningar.',
        'Uppgifterna används också för kundservice, reklamationer och returer. Med ditt samtycke kan vi använda uppgifterna för marknadsföring och nyhetsbrev.',
        'Vi analyserar besöksdata för att förbättra vår webbplats, anpassa vårt utbud och förebygga bedrägerier.'
      ]
    },
    {
      title: 'Rättslig grund',
      content: [
        'Behandlingen av dina personuppgifter grundar sig på följande rättsliga grunder enligt GDPR:',
        'Avtal — för att fullgöra köpavtalet med dig.',
        'Rättslig förpliktelse — för att uppfylla bokföringskrav och konsumenträttsliga lagar.',
        'Berättigat intresse — för att förebygga bedrägeri, säkerställa teknisk drift och analysera webbtrafik.',
        'Samtycke — för marknadsföring och nyhetsbrev. Du kan när som helst återkalla ditt samtycke.'
      ]
    },
    {
      title: 'Hur länge sparar vi uppgifterna?',
      content: [
        'Vi sparar dina personuppgifter endast så länge som det är nödvändigt för de ändamål som anges i denna policy.',
        'Order- och betalningsuppgifter sparas i enlighet med bokföringslagen (minst 7 år). Kundkontoinformation sparas så länge du har ett aktivt konto. Marknadsföringsrelaterade uppgifter sparas tills du återkallar ditt samtycke.'
      ]
    },
    {
      title: 'Vem delar vi uppgifter med?',
      content: [
        'Vi delar endast dina uppgifter med utvalda partners som hjälper oss att driva vår verksamhet, och endast i den utsträckning som krävs.',
        'Detta inkluderar logistikpartners (PostNord, DHL, DB Schenker) för leverans, betalningsleverantörer (Klarna, Stripe) för transaktionshantering och IT-leverantörer för drift av webbplatsen.',
        'Vi säljer aldrig dina personuppgifter till tredje part för marknadsföringsändamål.'
      ]
    },
    {
      title: 'Dina rättigheter',
      content: [
        'Enligt GDPR har du följande rättigheter vad gäller dina personuppgifter:',
        'Rätt till tillgång — begära ett utdrag över vilka uppgifter vi har om dig.',
        'Rätt till rättelse — begära att felaktiga uppgifter korrigeras.',
        'Rätt till radering — begära att dina uppgifter raderas ("rätten att bli bortglömd"), med vissa undantag enligt lag.',
        'Rätt till begränsning — begära att behandlingen av dina uppgifter begränsas.',
        'Rätt till dataportabilitet — få ut dina uppgifter i ett strukturerat format.',
        'Rätt att göra invändningar — invända mot behandling baserad på berättigat intresse eller direktmarknadsföring.'
      ]
    },
    {
      title: 'Kontakt och klagomål',
      content: [
        'Om du har frågor om vår personuppgiftshantering eller vill utöva dina rättigheter, kontakta vår kundservice på kundservice@example.se.',
        'Om du anser att vi inte har hanterat dina personuppgifter korrekt har du rätt att lämna in ett klagomål till Datainspektionen (Integritetsskyddsmyndigheten, IMY).'
      ]
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Integritetspolicy</h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Din integritet är viktig för oss. Här beskriver vi hur vi samlar in, använder och skyddar dina personuppgifter.
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Har du frågor om vår integritetspolicy?</h2>
            <p className="text-gray-500 max-w-lg mx-auto mb-6">
              Kontakta vår kundservice om du har frågor om hur vi hanterar dina personuppgifter.
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
