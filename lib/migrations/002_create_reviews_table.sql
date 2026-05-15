-- Recensioner tabell
-- Sparar kundrecensioner kopplade till produkter och kunder
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
CREATE INDEX IF NOT EXISTS idx_recensioner_produkt_id ON recensioner(produkt_id);
CREATE INDEX IF NOT EXISTS idx_recensioner_kund_id ON recensioner(kund_id);
CREATE INDEX IF NOT EXISTS idx_recensioner_anvandare_namn ON recensioner(anvandare_namn);
CREATE INDEX IF NOT EXISTS idx_recensioner_betyg ON recensioner(betyg);
CREATE INDEX IF NOT EXISTS idx_recensioner_status ON recensioner(status);

-- Exempel på hur man raderar recensioner via SQL:
-- Radera alla recensioner av en specifik användare:
--   DELETE FROM recensioner WHERE anvandare_namn = 'Lokana';
--
-- Radera en specifik recension via ID:
--   DELETE FROM recensioner WHERE id = 'rev_123abc';
--
-- Radera alla recensioner för en produkt:
--   DELETE FROM recensioner WHERE produkt_id = '12345';
--
-- Dölj en recension istället för att radera:
--   UPDATE recensioner SET status = 'dold' WHERE anvandare_namn = 'Lokana';
