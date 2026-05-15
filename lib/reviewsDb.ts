import client from './db';

export interface Recension {
  id: string;
  produktId: string;
  kundId?: string;
  anvandareNamn: string;
  betyg: number;
  titel?: string;
  kommentar: string;
  verifieradKop: boolean;
  status: 'publicerad' | 'granskas' | 'dold';
  createdAt: Date;
  updatedAt: Date;
}

export interface SkapaRecensionInput {
  produktId: string;
  kundId?: string;
  anvandareNamn: string;
  betyg: number;
  titel?: string;
  kommentar: string;
  verifieradKop?: boolean;
}

// Säkerställ att recensioner-tabellen finns
let recensionerTabellSkapad = false;

async function initReviewsTable() {
  if (recensionerTabellSkapad) return;

  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS recensioner (
        id TEXT PRIMARY KEY,
        produkt_id TEXT NOT NULL,
        kund_id TEXT,
        anvandare_namn TEXT NOT NULL,
        betyg INTEGER NOT NULL CHECK(betyg BETWEEN 1 AND 5),
        titel TEXT,
        kommentar TEXT NOT NULL,
        verifierad_kop INTEGER DEFAULT 0,
        status TEXT DEFAULT 'publicerad' CHECK(status IN ('publicerad', 'granskas', 'dold')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (kund_id) REFERENCES customers(id) ON DELETE SET NULL
      )
    `);

    await client.execute(`CREATE INDEX IF NOT EXISTS idx_recensioner_produkt_id ON recensioner(produkt_id)`);
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_recensioner_kund_id ON recensioner(kund_id)`);
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_recensioner_anvandare_namn ON recensioner(anvandare_namn)`);
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_recensioner_betyg ON recensioner(betyg)`);
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_recensioner_status ON recensioner(status)`);

    recensionerTabellSkapad = true;
    console.log('✅ Recensioner-tabellen är redo');
  } catch (error) {
    console.error('❌ Fel vid skapande av recensioner-tabell:', error);
  }
}

// Kör initiering direkt
initReviewsTable().catch(console.error);

function mapRadTillRecension(row: Record<string, unknown>): Recension {
  return {
    id: row.id?.toString() || '',
    produktId: row.produkt_id?.toString() || '',
    kundId: row.kund_id?.toString() || undefined,
    anvandareNamn: row.anvandare_namn?.toString() || '',
    betyg: parseInt(row.betyg?.toString() || '0'),
    titel: row.titel?.toString() || undefined,
    kommentar: row.kommentar?.toString() || '',
    verifieradKop: Boolean(row.verifierad_kop),
    status: (row.status?.toString() || 'publicerad') as Recension['status'],
    createdAt: new Date(row.created_at?.toString() || ''),
    updatedAt: new Date(row.updated_at?.toString() || ''),
  };
}

// Hämta alla publicerade recensioner för en produkt
export async function getRecensionerForProdukt(produktId: string): Promise<Recension[]> {
  await initReviewsTable();
  try {
    const result = await client.execute({
      sql: `SELECT * FROM recensioner WHERE produkt_id = ? AND status = 'publicerad' ORDER BY created_at DESC`,
      args: [produktId],
    });
    return result.rows.map(row => mapRadTillRecension(row as Record<string, unknown>));
  } catch (error) {
    console.error('Fel vid hämtning av recensioner:', error);
    return [];
  }
}

// Hämta genomsnittligt betyg för en produkt
export async function getGenomsnittligBetyg(produktId: string): Promise<{ genomsnitt: number; antal: number }> {
  await initReviewsTable();
  try {
    const result = await client.execute({
      sql: `SELECT AVG(betyg) as genomsnitt, COUNT(*) as antal FROM recensioner WHERE produkt_id = ? AND status = 'publicerad'`,
      args: [produktId],
    });
    const row = result.rows[0];
    return {
      genomsnitt: parseFloat(row?.genomsnitt?.toString() || '0'),
      antal: parseInt(row?.antal?.toString() || '0'),
    };
  } catch (error) {
    console.error('Fel vid hämtning av genomsnittligt betyg:', error);
    return { genomsnitt: 0, antal: 0 };
  }
}

// Skapa en ny recension
export async function skapaRecension(input: SkapaRecensionInput): Promise<Recension | null> {
  await initReviewsTable();

  if (!input.anvandareNamn?.trim()) {
    throw new Error('Användarnamn krävs');
  }
  if (!input.kommentar?.trim()) {
    throw new Error('Kommentar krävs');
  }
  if (input.betyg < 1 || input.betyg > 5) {
    throw new Error('Betyg måste vara mellan 1 och 5');
  }

  const id = `rev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();

  try {
    await client.execute({
      sql: `
        INSERT INTO recensioner (id, produkt_id, kund_id, anvandare_namn, betyg, titel, kommentar, verifierad_kop, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'publicerad', ?, ?)
      `,
      args: [
        id,
        input.produktId,
        input.kundId || null,
        input.anvandareNamn.trim(),
        input.betyg,
        input.titel?.trim() || null,
        input.kommentar.trim(),
        input.verifieradKop ? 1 : 0,
        now,
        now,
      ],
    });

    const result = await client.execute({
      sql: 'SELECT * FROM recensioner WHERE id = ?',
      args: [id],
    });

    if (result.rows.length === 0) return null;
    return mapRadTillRecension(result.rows[0] as Record<string, unknown>);
  } catch (error) {
    console.error('Fel vid skapande av recension:', error);
    throw error;
  }
}

// Radera recensioner för ett användarnamn (används via SQL eller API)
export async function raderaRecensionerForAnvandare(anvandareNamn: string): Promise<number> {
  await initReviewsTable();
  try {
    const result = await client.execute({
      sql: 'DELETE FROM recensioner WHERE anvandare_namn = ?',
      args: [anvandareNamn],
    });
    return result.rowsAffected ?? 0;
  } catch (error) {
    console.error('Fel vid radering av recensioner:', error);
    throw error;
  }
}

// Radera en specifik recension via ID
export async function raderaRecension(id: string): Promise<boolean> {
  await initReviewsTable();
  try {
    await client.execute({
      sql: 'DELETE FROM recensioner WHERE id = ?',
      args: [id],
    });
    return true;
  } catch (error) {
    console.error('Fel vid radering av recension:', error);
    return false;
  }
}

// Hämta alla recensioner (för admin)
export async function getAllaRecensioner(): Promise<Recension[]> {
  await initReviewsTable();
  try {
    const result = await client.execute(
      'SELECT * FROM recensioner ORDER BY created_at DESC'
    );
    return result.rows.map(row => mapRadTillRecension(row as Record<string, unknown>));
  } catch (error) {
    console.error('Fel vid hämtning av alla recensioner:', error);
    return [];
  }
}
