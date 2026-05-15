-- ============================================================
-- RECENSIONER - SQL-SKRIPT FÖR DATABASHANTERING
-- Använd dessa kommandon direkt i databasterminalen (Turso CLI)
-- ============================================================

-- -------------------------------------------------------
-- SKAPA TABELLEN (körs automatiskt av appen, men kan
-- köras manuellt om det behövs)
-- -------------------------------------------------------
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

CREATE INDEX IF NOT EXISTS idx_recensioner_produkt_id ON recensioner(produkt_id);
CREATE INDEX IF NOT EXISTS idx_recensioner_kund_id ON recensioner(kund_id);
CREATE INDEX IF NOT EXISTS idx_recensioner_anvandare_namn ON recensioner(anvandare_namn);
CREATE INDEX IF NOT EXISTS idx_recensioner_betyg ON recensioner(betyg);
CREATE INDEX IF NOT EXISTS idx_recensioner_status ON recensioner(status);


-- -------------------------------------------------------
-- VISA ALLA RECENSIONER
-- -------------------------------------------------------
SELECT * FROM recensioner ORDER BY created_at DESC;


-- -------------------------------------------------------
-- VISA RECENSIONER FÖR EN SPECIFIK PRODUKT
-- -------------------------------------------------------
SELECT * FROM recensioner WHERE produkt_id = 'PRODUKT_ID_HÄR';


-- -------------------------------------------------------
-- VISA RECENSIONER FRÅN EN SPECIFIK ANVÄNDARE
-- -------------------------------------------------------
SELECT * FROM recensioner WHERE anvandare_namn = 'Lokana';


-- -------------------------------------------------------
-- RADERA ALLA RECENSIONER FRÅN EN SPECIFIK ANVÄNDARE
-- Exempel: ta bort alla recensioner skrivna av 'Lokana'
-- -------------------------------------------------------
DELETE FROM recensioner WHERE anvandare_namn = 'Lokana';


-- -------------------------------------------------------
-- RADERA EN SPECIFIK RECENSION VIA ID
-- -------------------------------------------------------
DELETE FROM recensioner WHERE id = 'rev_XXXXXXXXXX';


-- -------------------------------------------------------
-- RADERA ALLA RECENSIONER FÖR EN SPECIFIK PRODUKT
-- -------------------------------------------------------
DELETE FROM recensioner WHERE produkt_id = 'PRODUKT_ID_HÄR';


-- -------------------------------------------------------
-- ÄNDRA STATUS PÅ EN RECENSION (publicerad/granskas/dold)
-- -------------------------------------------------------
UPDATE recensioner SET status = 'dold' WHERE anvandare_namn = 'Lokana';
UPDATE recensioner SET status = 'publicerad' WHERE id = 'rev_XXXXXXXXXX';


-- -------------------------------------------------------
-- STATISTIK - GENOMSNITTLIGT BETYG PER PRODUKT
-- -------------------------------------------------------
SELECT
  produkt_id,
  COUNT(*) AS antal_recensioner,
  ROUND(AVG(betyg), 1) AS genomsnitt_betyg,
  MIN(betyg) AS lagsta_betyg,
  MAX(betyg) AS hogsta_betyg
FROM recensioner
WHERE status = 'publicerad'
GROUP BY produkt_id
ORDER BY antal_recensioner DESC;


-- -------------------------------------------------------
-- VISA SENASTE 10 RECENSIONER
-- -------------------------------------------------------
SELECT
  id,
  anvandare_namn,
  betyg,
  titel,
  SUBSTR(kommentar, 1, 80) AS kommentar_forhandsvisning,
  status,
  created_at
FROM recensioner
ORDER BY created_at DESC
LIMIT 10;
