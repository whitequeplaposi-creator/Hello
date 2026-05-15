'use client';

import { useState, useEffect, useCallback } from 'react';

interface Recension {
  id: string;
  produktId: string;
  anvandareNamn: string;
  betyg: number;
  titel?: string;
  kommentar: string;
  verifieradKop: boolean;
  createdAt: string;
}

interface Props {
  produktId: string;
  anvandareNamn?: string; // Inloggad användares namn (valfritt)
  kundId?: string;
}

function StarRating({
  value,
  onChange,
  readonly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-0.5" aria-label={`Betyg: ${value} av 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`text-2xl transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer'} ${
            star <= (hover || value) ? 'text-yellow-400' : 'text-gray-300'
          }`}
          aria-label={`${star} stjärnor`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ProductReviews({ produktId, anvandareNamn = '', kundId }: Props) {
  const [recensioner, setRecensioner] = useState<Recension[]>([]);
  const [genomsnitt, setGenomsnitt] = useState(0);
  const [antal, setAntal] = useState(0);
  const [laddar, setLaddar] = useState(true);
  const [visaFormular, setVisaFormular] = useState(false);
  const [skickar, setSkickar] = useState(false);
  const [felmeddelande, setFelmeddelande] = useState('');
  const [framgangsMeddelande, setFramgangsMeddelande] = useState('');

  // Formulärfält
  const [namn, setNamn] = useState(anvandareNamn);
  const [betyg, setBetyg] = useState(0);
  const [titel, setTitel] = useState('');
  const [kommentar, setKommentar] = useState('');

  const hamtaRecensioner = useCallback(async () => {
    try {
      setLaddar(true);
      const res = await fetch(`/api/recensioner?produktId=${encodeURIComponent(produktId)}`);
      if (!res.ok) throw new Error('Kunde inte hämta recensioner');
      const data = await res.json();
      setRecensioner(data.recensioner || []);
      setGenomsnitt(data.genomsnittBetyg || 0);
      setAntal(data.antalRecensioner || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLaddar(false);
    }
  }, [produktId]);

  useEffect(() => {
    hamtaRecensioner();
  }, [hamtaRecensioner]);

  async function skickaRecension(e: React.FormEvent) {
    e.preventDefault();
    setFelmeddelande('');
    setFramgangsMeddelande('');

    if (!namn.trim()) {
      setFelmeddelande('Ange ditt namn.');
      return;
    }
    if (betyg === 0) {
      setFelmeddelande('Välj ett betyg.');
      return;
    }
    if (!kommentar.trim()) {
      setFelmeddelande('Skriv en kommentar.');
      return;
    }

    setSkickar(true);
    try {
      const res = await fetch('/api/recensioner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          produktId,
          kundId,
          anvandareNamn: namn.trim(),
          betyg,
          titel: titel.trim() || undefined,
          kommentar: kommentar.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Något gick fel');
      }

      setFramgangsMeddelande('Tack för din recension!');
      setVisaFormular(false);
      setBetyg(0);
      setTitel('');
      setKommentar('');
      setNamn(anvandareNamn);
      await hamtaRecensioner();
    } catch (err: any) {
      setFelmeddelande(err.message || 'Kunde inte skicka recensionen.');
    } finally {
      setSkickar(false);
    }
  }

  function formateraDatum(dateStr: string) {
    try {
      return new Date(dateStr).toLocaleDateString('sv-SE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  }

  return (
    <section className="mt-12 border-t pt-10" aria-labelledby="recensioner-rubrik">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 id="recensioner-rubrik" className="text-2xl font-semibold text-gray-900">
            Kundrecensioner
          </h2>
          {antal > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <StarRating value={Math.round(genomsnitt)} readonly />
              <span className="text-gray-600 text-sm">
                {genomsnitt.toFixed(1)} av 5 ({antal} {antal === 1 ? 'recension' : 'recensioner'})
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => {
            setVisaFormular(!visaFormular);
            setFelmeddelande('');
            setFramgangsMeddelande('');
          }}
          className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          {visaFormular ? 'Avbryt' : 'Skriv en recension'}
        </button>
      </div>

      {/* Framgångsmeddelande */}
      {framgangsMeddelande && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
          {framgangsMeddelande}
        </div>
      )}

      {/* Recensionsformulär */}
      {visaFormular && (
        <form
          onSubmit={skickaRecension}
          className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200"
          noValidate
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Din recension</h3>

          <div className="space-y-4">
            {/* Namn */}
            <div>
              <label htmlFor="recension-namn" className="block text-sm font-medium text-gray-700 mb-1">
                Ditt namn <span aria-hidden="true">*</span>
              </label>
              <input
                id="recension-namn"
                type="text"
                value={namn}
                onChange={(e) => setNamn(e.target.value)}
                placeholder="Ange ditt namn"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            {/* Betyg */}
            <div>
              <span className="block text-sm font-medium text-gray-700 mb-1">
                Betyg <span aria-hidden="true">*</span>
              </span>
              <StarRating value={betyg} onChange={setBetyg} />
            </div>

            {/* Titel */}
            <div>
              <label htmlFor="recension-titel" className="block text-sm font-medium text-gray-700 mb-1">
                Rubrik (valfritt)
              </label>
              <input
                id="recension-titel"
                type="text"
                value={titel}
                onChange={(e) => setTitel(e.target.value)}
                placeholder="Sammanfatta din upplevelse"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Kommentar */}
            <div>
              <label htmlFor="recension-kommentar" className="block text-sm font-medium text-gray-700 mb-1">
                Kommentar <span aria-hidden="true">*</span>
              </label>
              <textarea
                id="recension-kommentar"
                value={kommentar}
                onChange={(e) => setKommentar(e.target.value)}
                placeholder="Berätta om din upplevelse av produkten..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                required
              />
            </div>

            {/* Felmeddelande */}
            {felmeddelande && (
              <p role="alert" className="text-red-600 text-sm">
                {felmeddelande}
              </p>
            )}

            <button
              type="submit"
              disabled={skickar}
              className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {skickar ? 'Skickar...' : 'Skicka recension'}
            </button>
          </div>
        </form>
      )}

      {/* Recensionslista */}
      {laddar ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse p-4 bg-gray-100 rounded-xl h-24" />
          ))}
        </div>
      ) : recensioner.length === 0 ? (
        <p className="text-gray-500 text-sm py-6 text-center">
          Inga recensioner ännu. Bli den första att recensera denna produkt!
        </p>
      ) : (
        <ul className="space-y-5" aria-label="Kundrecensioner">
          {recensioner.map((r) => (
            <li key={r.id} className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 text-sm">{r.anvandareNamn}</span>
                    {r.verifieradKop && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        Verifierat köp
                      </span>
                    )}
                  </div>
                  <StarRating value={r.betyg} readonly />
                </div>
                <time
                  dateTime={r.createdAt}
                  className="text-xs text-gray-400 whitespace-nowrap"
                >
                  {formateraDatum(r.createdAt)}
                </time>
              </div>
              {r.titel && (
                <p className="mt-2 font-medium text-gray-800 text-sm">{r.titel}</p>
              )}
              <p className="mt-1 text-gray-600 text-sm leading-relaxed">{r.kommentar}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
