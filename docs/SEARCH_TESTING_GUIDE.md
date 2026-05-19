# Guide: Testa sökprestandaoptimering

## Snabbstart

### 1. Starta applikationen
```bash
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000) i din webbläsare.

## Manuella tester

### Test 1: Grundläggande sökning
**Syfte:** Verifiera att sökning fungerar korrekt

1. Klicka i sökfältet i headern
2. Skriv "shirt"
3. Tryck Enter eller klicka på sökknappen

**Förväntat resultat:**
- ✅ Sökknappen visar en spinner under sökning
- ✅ Texten ändras till "Söker..." (svenska) eller "Searching..." (engelska)
- ✅ Resultat visas inom 500ms
- ✅ Produkter som matchar "shirt" visas

### Test 2: Cachad sökning
**Syfte:** Verifiera att caching fungerar

1. Sök efter "jeans"
2. Notera hur lång tid det tar
3. Sök efter "jeans" igen

**Förväntat resultat:**
- ✅ Första sökningen: 200-500ms
- ✅ Andra sökningen: <50ms (mycket snabbare)
- ✅ Samma resultat båda gångerna

### Test 3: Sökförslag med debouncing
**Syfte:** Verifiera att debouncing fungerar

1. Klicka i sökfältet
2. Skriv långsamt: "s" ... "h" ... "i" ... "r" ... "t"
3. Observera när förslag visas

**Förväntat resultat:**
- ✅ Förslag visas inte omedelbart
- ✅ Förslag visas efter ~150ms av inaktivitet
- ✅ Förslag flimrar inte när du skriver snabbt

### Test 4: Populära sökningar
**Syfte:** Verifiera att populära sökningar visas

1. Klicka i sökfältet (utan att skriva något)
2. Observera dropdown-menyn

**Förväntat resultat:**
- ✅ "Populära sökningar" visas
- ✅ Kategorier visas
- ✅ Senaste sökningar visas (om du sökt tidigare)

### Test 5: Senaste sökningar
**Syfte:** Verifiera att senaste sökningar sparas

1. Sök efter "shoes"
2. Sök efter "jacket"
3. Sök efter "dress"
4. Klicka i sökfältet igen

**Förväntat resultat:**
- ✅ "Senaste sökningar" visas
- ✅ De tre senaste sökningarna visas i ordning
- ✅ Klicka på en tidigare sökning för att söka igen

### Test 6: Rensa senaste sökningar
**Syfte:** Verifiera att man kan rensa historik

1. Klicka i sökfältet
2. Klicka på "Rensa" bredvid "Senaste sökningar"

**Förväntat resultat:**
- ✅ Senaste sökningar försvinner
- ✅ Populära sökningar och kategorier visas fortfarande

### Test 7: Relevanssortering
**Syfte:** Verifiera att resultat sorteras efter relevans

1. Sök efter "shirt"
2. Observera ordningen på resultaten

**Förväntat resultat:**
- ✅ Produkter med "shirt" i namnet kommer först
- ✅ Exakta matchningar kommer före partiella matchningar
- ✅ Produkter där "shirt" är i början av namnet kommer före produkter där det är i mitten

### Test 8: Flerspråkig sökning
**Syfte:** Verifiera att sökning fungerar på båda språken

1. Byt språk till Svenska (om du är på Engelska)
2. Sök efter något
3. Byt språk till Engelska
4. Sök efter samma sak

**Förväntat resultat:**
- ✅ Sökning fungerar på båda språken
- ✅ UI-text ändras baserat på språk
- ✅ Samma resultat oavsett språk

### Test 9: Mobil responsivitet
**Syfte:** Verifiera att sökning fungerar på mobil

1. Öppna Chrome DevTools (F12)
2. Aktivera mobil-läge (Ctrl+Shift+M)
3. Klicka på sök-ikonen
4. Sök efter något

**Förväntat resultat:**
- ✅ Sökfältet öppnas i fullskärm på mobil
- ✅ Sökning fungerar som på desktop
- ✅ Resultat visas korrekt

### Test 10: Edge cases
**Syfte:** Verifiera att edge cases hanteras

**Test 10a: Tom sökning**
1. Klicka i sökfältet
2. Tryck Enter utan att skriva något

**Förväntat resultat:**
- ✅ Ingen sökning utförs
- ✅ Inga resultat visas

**Test 10b: Kort sökning (1 tecken)**
1. Skriv "a"
2. Tryck Enter

**Förväntat resultat:**
- ✅ Inga förslag visas (kräver minst 2 tecken)
- ✅ Sökning utförs men returnerar inga resultat

**Test 10c: Specialtecken**
1. Sök efter "t-shirt"
2. Sök efter "t shirt"

**Förväntat resultat:**
- ✅ Båda sökningarna fungerar
- ✅ Liknande resultat för båda

**Test 10d: Case-insensitive**
1. Sök efter "SHIRT"
2. Sök efter "shirt"
3. Sök efter "ShIrT"

**Förväntat resultat:**
- ✅ Alla tre sökningarna ger samma resultat
- ✅ Sökning är case-insensitive

## Automatiska tester

### Kör prestandatest
```bash
# I en terminal, starta utvecklingsservern
npm run dev

# I en annan terminal, kör testet
npx tsx scripts/test-search-performance.ts
```

**Förväntat resultat:**
```
🔍 Testar sökprestandaoptimering...

📋 Test 1: API-sökning fungerar
✅ API-sökning fungerar - X produkter hittades

⏱️  Test 2: Sökhastighet (första sökningen)
  shirt: XXXms (X resultat)
  t-shirt: XXXms (X resultat)
  ...
  Genomsnittlig tid: XXXms
✅ Sökhastighet är bra (<500ms)

💾 Test 3: Caching (upprepade sökningar)
  shirt: XXms (cachad)
  ...
  Genomsnittlig cachad tid: XXms
✅ Caching ger betydande prestandaförbättring

🎯 Test 4: Relevanssortering
  Top 5 resultat för "shirt":
    1. Product Name ⭐⭐⭐
    ...
✅ Relevanssortering fungerar korrekt

... (fler tester)

📊 SAMMANFATTNING
Genomsnittlig söktid (första): XXXms
Genomsnittlig söktid (cachad): XXms
Prestandaförbättring: XX%
Totalt antal tester: 8

✅ Alla tester slutförda!
```

## Prestandamätning

### Använd Chrome DevTools
1. Öppna Chrome DevTools (F12)
2. Gå till "Network" tab
3. Sök efter något
4. Observera nätverkstrafiken

**Vad att titta efter:**
- ✅ Request till `/api/products/search?q=...`
- ✅ Response time (bör vara <500ms)
- ✅ Response size (bör vara rimlig)
- ✅ Cachade requests är snabbare

### Använd Performance tab
1. Öppna Chrome DevTools (F12)
2. Gå till "Performance" tab
3. Klicka "Record"
4. Sök efter något
5. Stoppa inspelningen
6. Analysera resultatet

**Vad att titta efter:**
- ✅ Låg CPU-användning under skrivning (tack vare debouncing)
- ✅ Snabb rendering av resultat
- ✅ Inga onödiga re-renders

## Felsökning

### Problem: Sökning är långsam
**Möjliga orsaker:**
1. Databasen är långsam
2. För många produkter
3. Nätverkslatens

**Lösningar:**
1. Kontrollera databasanslutning
2. Implementera paginering
3. Öka cache-tiden

### Problem: Caching fungerar inte
**Möjliga orsaker:**
1. Cache rensas för ofta
2. Cache-nycklar matchar inte

**Lösningar:**
1. Kontrollera cache-logik i `route.ts`
2. Kontrollera att query normaliseras (lowercase, trim)

### Problem: Sökförslag visas inte
**Möjliga orsaker:**
1. Kategorier laddas inte
2. Populära sökningar laddas inte
3. Debouncing är för lång

**Lösningar:**
1. Kontrollera `/api/categories` endpoint
2. Kontrollera `/api/search/popular` endpoint
3. Justera debounce-tiden (150ms)

### Problem: Resultat är irrelevanta
**Möjliga orsaker:**
1. Sökalgorithmen behöver förbättras
2. Sorteringen fungerar inte korrekt

**Lösningar:**
1. Justera sökalgorithmen i `route.ts`
2. Förbättra relevanssortering

## Checklista för release

Innan du släpper sökoptimeringarna till produktion:

- [ ] Alla manuella tester passerar
- [ ] Automatiska tester passerar
- [ ] Prestanda är acceptabel (<500ms)
- [ ] Caching fungerar korrekt
- [ ] Sökförslag visas korrekt
- [ ] Mobil-versionen fungerar
- [ ] Båda språken fungerar
- [ ] Edge cases hanteras
- [ ] Dokumentation är uppdaterad
- [ ] README är uppdaterad

## Support

Om du stöter på problem:
1. Kontrollera konsolen för felmeddelanden
2. Kontrollera Network tab i DevTools
3. Kör automatiska tester
4. Läs dokumentationen i `docs/SEARCH_PERFORMANCE_OPTIMIZATION.md`

## Sammanfattning

Denna guide hjälper dig att:
- ✅ Verifiera att alla sökfunktioner fungerar
- ✅ Mäta prestanda
- ✅ Identifiera och lösa problem
- ✅ Säkerställa kvalitet innan release

Lycka till med testningen! 🚀
