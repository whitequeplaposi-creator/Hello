-- ============================================================
-- Migration 002: Skapa recensioner-tabell
-- Kör detta skript i databasterminalen om tabellen saknas.
-- ============================================================

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
);

-- Index för snabba sökningar
CREATE INDEX IF NOT EXISTS idx_recensioner_produkt_id    ON recensioner(produkt_id);
CREATE INDEX IF NOT EXISTS idx_recensioner_kund_id       ON recensioner(kund_id);
CREATE INDEX IF NOT EXISTS idx_recensioner_anvandare_namn ON recensioner(anvandare_namn);
CREATE INDEX IF NOT EXISTS idx_recensioner_betyg         ON recensioner(betyg);
CREATE INDEX IF NOT EXISTS idx_recensioner_status        ON recensioner(status);

-- ============================================================
-- Exempel på vanliga SQL-kommandon för databasterminalen
-- ============================================================

-- Visa alla recensioner
-- SELECT * FROM recensioner ORDER BY created_at DESC;

-- Visa recensioner för en specifik produkt
-- SELECT * FROM recensioner WHERE produkt_id = 'PRODUKT_ID';

-- Visa alla recensioner skrivna av en specifik användare
-- SELECT * FROM recensioner WHERE anvandare_namn = 'Lokana';

-- Radera alla recensioner för ett specifikt användarnamn
-- DELETE FROM recensioner WHERE anvandare_namn = 'Lokana';

-- Radera en specifik recension via ID
-- DELETE FROM recensioner WHERE id = 'rev_1234567890_abc123';

-- Radera recensioner med lågt betyg (t.ex. 1 stjärna) för en användare
-- DELETE FROM recensioner WHERE anvandare_namn = 'Lokana' AND betyg = 1;

-- Dölj en recension istället för att radera (säkrare alternativ)
-- UPDATE recensioner SET status = 'dold' WHERE anvandare_namn = 'Lokana';

-- Räkna antal recensioner per användare
-- SELECT anvandare_namn, COUNT(*) as antal FROM recensioner GROUP BY anvandare_namn ORDER BY antal DESC;

-- Visa genomsnittligt betyg per produkt
-- SELECT produkt_id, AVG(betyg) as snittbetyg, COUNT(*) as antal FROM recensioner WHERE status = 'publicerad' GROUP BY produkt_id;
