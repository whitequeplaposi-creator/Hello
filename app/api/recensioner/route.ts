import { NextRequest, NextResponse } from 'next/server';
import { getRecensionerForProdukt, skapaRecension, getGenomsnittligBetyg, raderaRecensionerForAnvandare, raderaRecension } from '@/lib/reviewsDb';

// GET /api/recensioner?produktId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const produktId = searchParams.get('produktId');

    if (!produktId) {
      return NextResponse.json({ error: 'produktId krävs' }, { status: 400 });
    }

    const [recensioner, betyg] = await Promise.all([
      getRecensionerForProdukt(produktId),
      getGenomsnittligBetyg(produktId),
    ]);

    return NextResponse.json({
      recensioner,
      genomsnittBetyg: betyg.genomsnitt,
      antalRecensioner: betyg.antal,
    });
  } catch (error) {
    console.error('GET /api/recensioner fel:', error);
    return NextResponse.json({ error: 'Kunde inte hämta recensioner' }, { status: 500 });
  }
}

// POST /api/recensioner
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { produktId, kundId, anvandareNamn, betyg, titel, kommentar } = body;

    if (!produktId || !anvandareNamn || !kommentar || !betyg) {
      return NextResponse.json(
        { error: 'produktId, anvandareNamn, betyg och kommentar krävs' },
        { status: 400 }
      );
    }

    if (typeof betyg !== 'number' || betyg < 1 || betyg > 5) {
      return NextResponse.json(
        { error: 'Betyg måste vara ett heltal mellan 1 och 5' },
        { status: 400 }
      );
    }

    const recension = await skapaRecension({
      produktId,
      kundId,
      anvandareNamn,
      betyg,
      titel,
      kommentar,
    });

    return NextResponse.json({ recension }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/recensioner fel:', error);
    return NextResponse.json(
      { error: error.message || 'Kunde inte spara recensionen' },
      { status: 500 }
    );
  }
}

// DELETE /api/recensioner?anvandareNamn=Lokana   — raderar alla recensioner för ett användarnamn
// DELETE /api/recensioner?id=rev_xxx             — raderar en specifik recension via ID
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const anvandareNamn = searchParams.get('anvandareNamn');
    const id = searchParams.get('id');

    if (!anvandareNamn && !id) {
      return NextResponse.json(
        { error: 'Ange antingen anvandareNamn eller id som query-parameter' },
        { status: 400 }
      );
    }

    if (anvandareNamn) {
      const antal = await raderaRecensionerForAnvandare(anvandareNamn);
      return NextResponse.json({
        meddelande: `${antal} recension(er) raderade för användaren "${anvandareNamn}"`,
        raderade: antal,
      });
    }

    if (id) {
      const lyckades = await raderaRecension(id);
      if (!lyckades) {
        return NextResponse.json({ error: 'Recensionen hittades inte' }, { status: 404 });
      }
      return NextResponse.json({ meddelande: `Recension ${id} raderad` });
    }
  } catch (error: any) {
    console.error('DELETE /api/recensioner fel:', error);
    return NextResponse.json(
      { error: error.message || 'Kunde inte radera recensionen' },
      { status: 500 }
    );
  }
}
