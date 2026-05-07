const ecoImages = [
  {
    title: 'Solenergi & Förnybar energi',
    image: (
      <img src="/solenergi.jpg" alt="Solenergi & Förnybar energi" className="w-full h-full object-cover" />
    ),
  },
  {
    title: 'Återvinning & Cirkulär ekonomi',
    image: (
      <img src="/atervinning.jpg" alt="Återvinning & Cirkulär ekonomi" className="w-full h-full object-cover" />
    ),
  },
  {
    title: 'Organisk odling & Bomull',
    image: (
      <img src="/organisk-odling.jpg" alt="Organisk odling & Bomull" className="w-full h-full object-cover" />
    ),
  },
  {
    title: 'Hållbart transportsystem',
    image: (
      <img src="/hallbart-transport.jpg" alt="Hållbart transportsystem" className="w-full h-full object-cover" />
    ),
  },
  {
    title: 'Regnskog & Klimatkompensation',
    image: (
      <img src="/regnskog.jpg" alt="Regnskog & Klimatkompensation" className="w-full h-full object-cover" />
    ),
  },
  {
    title: 'Rent vatten & Vattenvård',
    image: (
      <img src="/rent-vatten.jpg" alt="Rent vatten & Vattenvård" className="w-full h-full object-cover" />
    ),
  },
  {
    title: 'Lokal gemenskap & Fair Trade',
    image: (
      <img src="/lokal-gemenskap.jpg" alt="Lokal gemenskap & Fair Trade" className="w-full h-full object-cover" />
    ),
  },
]

export default function Hallbarhet() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/30 to-stone-50">
      <div className="max-w-7xl mx-auto px-6 py-20 space-y-32">

        <header className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-emerald-800 to-emerald-600 bg-clip-text text-transparent tracking-tight leading-tight">Hållbarhet</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 mx-auto rounded-full" />
          </div>
          <p className="text-xl md:text-2xl text-emerald-700/90 max-w-3xl mx-auto font-light leading-relaxed">
            Vi bygger en grönare framtid — ett val, en produkt och ett partnerskap i taget.
          </p>
          <div className="mt-12 max-w-5xl mx-auto">
            <img 
              src="/hallbarhet.png" 
              alt="Hållbarhet - Vi bygger en grönare framtid" 
              className="w-full h-auto rounded-3xl shadow-2xl ring-1 ring-emerald-100/50"
            />
          </div>
        </header>

        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-semibold text-emerald-900">Vårt hållbarhetslöfte</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 mx-auto rounded-full" />
          </div>
          <p className="text-stone-700 leading-relaxed text-center max-w-4xl mx-auto mb-12 text-xl font-light">
            Vi är djupt engagerade i att bygga en hållbar framtid för kommande generationer.
            Vårt arbete med hållbarhet omfattar allt från miljövänliga produkter
            till etisk produktion och socialt ansvar.
          </p>
          <ul className="grid md:grid-cols-3 gap-8">
            {[
              'Klimatneutrala leveranser genom klimatkompensation',
              'Cirkulär ekonomi och återvinning i hela kedjan',
              'Etisk produktion med respekt för mänskliga rättigheter',
            ].map((text, i) => (
              <li key={i} className="flex items-start space-x-5 p-7 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/50 hover:shadow-xl transition-all duration-300 hover:bg-white">
                <span className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                  {i + 1}
                </span>
                <span className="text-stone-700 font-medium text-lg leading-relaxed">{text}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-semibold text-emerald-900">Miljö i bilder</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 mx-auto rounded-full" />
            <p className="text-stone-600 text-lg font-light">Sju miljöbaserade bilder som speglar våra värderingar</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {ecoImages.map((img, i) => (
              <div
                key={i}
                className={`relative rounded-3xl overflow-hidden ${i === 0 || i === 3 ? 'md:col-span-2 md:row-span-2 min-h-[250px] md:min-h-[380px]' : 'min-h-[250px]'} group shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]`}
              >
                <div className="absolute inset-0">
                  {img.image}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-semibold text-lg md:text-xl leading-tight drop-shadow-lg">{img.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-semibold text-emerald-900">Våra kärnvärden</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: 'Miljöansvar',
                desc: 'Skydda och återställa våra naturresurser genom medvetna val i varje led.',
              },
              {
                title: 'Transparens',
                desc: 'Öppenhet om vår påverkan och framsteg, med årliga hållbarhetsrapporter.',
              },
              {
                title: 'Innovation',
                desc: 'Ständigt söka nya hållbara lösningar för material, processer och logistik.',
              },
            ].map((v, i) => (
              <div key={i} className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-lg border border-emerald-100/50 text-center hover:shadow-xl transition-all duration-300 hover:bg-white hover:scale-[1.02]">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                </div>
                <h3 className="font-semibold text-emerald-900 text-xl mb-3">{v.title}</h3>
                <p className="text-stone-600 leading-relaxed text-lg">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-semibold text-emerald-900">Våra huvudinitiativ</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: 'Klimatneutrala leveranser',
                desc: 'Alla våra leveranser är klimatneutrala genom klimatkompensation och val av miljövänliga transportalternativ.',
              },
              {
                title: 'Cirkulär ekonomi',
                desc: 'Vi återvinner och återanvänder material i hela vår kedja, från produktion till förpackning.',
              },
              {
                title: 'Etisk produktion',
                desc: 'Vi arbetar endast med leverantörer som uppfyller höga standarder för arbetsvillkor och mänskliga rättigheter.',
              },
            ].map((item, i) => (
              <div key={i} className="group bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-lg border border-emerald-100/50 hover:border-emerald-200 transition-all duration-300 hover:bg-white hover:shadow-xl hover:scale-[1.02]">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center mb-6 text-xl font-bold shadow-emerald-200 shadow-lg">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-emerald-900 text-2xl mb-4">{item.title}</h3>
                <p className="text-stone-600 leading-relaxed text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-br from-white to-emerald-50/30 py-20 rounded-3xl">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-semibold text-emerald-900">Våra miljömål för 2025</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 mx-auto rounded-full" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                '100% återvunna material i alla produkter',
                'Noll koldioxidutsläpp från vår verksamhet',
                'Alla förpackningar 100% återvinningsbara',
                'Fair Trade-certifiering för alla produkter',
                '100% förnybar energi i alla våra lokaler',
                'Noll vattenavfall i produktionen',
              ].map((goal, i) => (
                <div key={i} className="flex items-center space-x-4 p-5 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-emerald-100/50 hover:shadow-md transition-all">
                  <span className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${
                    i % 2 === 0 ? 'bg-gradient-to-br from-green-500 to-green-600 text-white' : 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white'
                  }`}>
                    {i + 1}
                  </span>
                  <span className="text-stone-700 font-medium text-lg">{goal}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-semibold text-emerald-900">Ansvar i hela kedjan</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 mx-auto rounded-full" />
          </div>
          <p className="text-stone-700 leading-relaxed text-center max-w-4xl mx-auto mb-12 text-xl font-light">
            Från råmaterial till färdig produkt — vi tar ansvar för varje steg i vår leveranskedja.
            Våra produkter tillverkas under rättvisa förhållanden med respekt för både människa och miljö.
          </p>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: 'Transparent spårbarhet', desc: 'Vi kan spåra varje produkt tillbaka till källan med full insyn.' },
              { title: 'Regelbundna revisioner', desc: 'Oberoende kontroller av alla våra leverantörer varje år.' },
              { title: 'Långsiktiga partnerskap', desc: 'Vi bygger starka relationer med våra leverantörer över tid.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-lg border border-emerald-100/50 text-center hover:shadow-xl transition-all duration-300 hover:bg-white">
                <div className="w-16 h-16 bg-gradient-to-br from-stone-100 to-stone-200 text-stone-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-emerald-900 text-xl mb-3">{item.title}</h3>
                <p className="text-stone-600 leading-relaxed text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-semibold text-emerald-900">Socialt ansvar</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: 'Välgörenhet', desc: '1% av vår omsättning går till välgörenhetsorganisationer som arbetar med miljö och utbildning.' },
              { title: 'Utbildning', desc: 'Stöd till utbildningsprojekt i våra produktionsländer för jämlikhet och framtidstro.' },
              { title: 'Lokalt engagemang', desc: 'Samarbete med lokala organisationer och projekt i samhällen där vi verkar.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-lg border border-emerald-100/50 text-center hover:shadow-xl transition-all duration-300 hover:bg-white">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-emerald-900 text-xl mb-3">{item.title}</h3>
                <p className="text-stone-600 leading-relaxed text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-semibold text-emerald-900">Våra hållbarhetsmilstolpar</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 mx-auto rounded-full" />
          </div>
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-emerald-200 to-emerald-300 hidden md:block" />
            {[
              { year: '2020', text: 'Alla våra leveranser blev klimatneutrala genom klimatkompensation', side: 'left' },
              { year: '2021', text: 'Våra lokaler och lager drivs helt med förnybar energi', side: 'right' },
              { year: '2023', text: '50% av våra produkter är nu Fair Trade-certifierade', side: 'left' },
              { year: '2025', text: 'Vårt mål att uppnå noll koldioxidutsläpp i hela verksamheten', side: 'right' },
            ].map((m, i) => (
              <div key={i} className={`relative flex md:items-center mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className={`hidden md:block w-1/2 ${i % 2 === 0 ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-emerald-100/50 inline-block hover:shadow-xl transition-all duration-300">
                    <h3 className="font-bold text-emerald-600 text-2xl mb-3">{m.year}</h3>
                    <p className="text-stone-700 leading-relaxed max-w-sm text-lg">{m.text}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full border-4 border-white shadow-xl hidden md:block" />
                <div className="md:hidden w-full">
                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-emerald-100/50">
                    <h3 className="font-bold text-emerald-600 text-2xl mb-3">{m.year}</h3>
                    <p className="text-stone-700 leading-relaxed text-lg">{m.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-semibold text-emerald-900">Certifieringar & Utmärkelser</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {[
              { title: 'Fair Trade', desc: 'Certifierad för rättvis handel', color: 'bg-gradient-to-br from-amber-50 to-amber-100 text-amber-700 border-amber-200' },
              { title: 'B Corp', desc: 'Certifierad för social och miljömässig prestation', color: 'bg-gradient-to-br from-stone-100 to-stone-200 text-stone-700 border-stone-300' },
              { title: 'Climate Neutral', desc: 'Klimatneutral certifiering för hela verksamheten', color: 'bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200' },
            ].map((cert, i) => (
              <div key={i} className={`rounded-3xl p-10 text-center border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] ${cert.color}`}>
                <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                </div>
                <h3 className="font-bold text-2xl mb-3">{cert.title}</h3>
                <p className="text-lg opacity-90 leading-relaxed">{cert.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-br from-emerald-600 to-green-600 py-24 rounded-3xl">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-white mb-8">Gör skillnad tillsammans</h2>
              <p className="text-white/90 leading-relaxed text-xl font-light max-w-3xl mx-auto">
                Varje köp du gör hos oss bidrar till en mer hållbar framtid. Tillsammans kan vi skapa
                verklig förändring — för planeten, för människor och för kommande generationer.
              </p>
              <button className="bg-white text-emerald-700 px-10 py-4 font-semibold hover:bg-stone-50 transition-all duration-300 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.05] text-lg">
                Utforska våra hållbara produkter
              </button>
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}
