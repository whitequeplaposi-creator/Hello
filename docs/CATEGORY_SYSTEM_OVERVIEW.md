# Kategoriystem - Översikt

## Systemarkitektur

```
┌─────────────────────────────────────────────────────────────┐
│                         DATABASE                             │
│                    (Eprolo-tabellen)                         │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ id │ namn                          │ price │ ...     │  │
│  ├────┼───────────────────────────────┼───────┼─────────┤  │
│  │ 1  │ Women's Jacket                │ 599   │ ...     │  │
│  │ 2  │ Men's Running Shoes           │ 899   │ ...     │  │
│  │ 3  │ Silver Bracelet               │ 299   │ ...     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   KATEGORIGENERATOR                          │
│                (lib/categoryGenerator.ts)                    │
│                                                              │
│  Analyserar produktnamn och matchar mot nyckelord:          │
│                                                              │
│  "Women's Jacket" → Kläder, Dam                             │
│  "Men's Running Shoes" → Skor, Herr, Sport & Fritid        │
│  "Silver Bracelet" → Smycken                                │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API ENDPOINTS                           │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ GET /api/categories                                │    │
│  │ → Returnerar alla genererade kategorier            │    │
│  │   ["Kläder", "Skor", "Smycken", ...]              │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ GET /api/categories/filter?category=Kläder         │    │
│  │ → Returnerar produkter i vald kategori             │    │
│  │   [{ id: 1, name: "Women's Jacket", ... }]        │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND KOMPONENTER                      │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Header.tsx                                         │    │
│  │ - Hämtar kategorier från API                       │    │
│  │ - Visar kategorimeny                               │    │
│  │ - Hanterar kategoriväxling                         │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ ProductGrid.tsx                                    │    │
│  │ - Filtrerar produkter baserat på vald kategori     │    │
│  │ - Visar filtrerade produkter                       │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Dataflöde

### 1. Kategorigenerering

```typescript
// 1. Hämta produkter från databasen
const products = await getProducts()

// 2. Extrahera produktnamn
const productNames = products.map(p => p.name)

// 3. Generera kategorier
const categories = generateCategoriesFromProducts(productNames)
// → ["Kläder", "Herr", "Dam", "Smycken", ...]
```

### 2. Kategorifiltrering

```typescript
// 1. Användaren väljer kategori "Kläder"
setSelectedCategory("Kläder")

// 2. Produkter filtreras baserat på nyckelord
const keywords = ["tröja", "byxa", "jacket", "coat", ...]
const filtered = products.filter(p => 
  keywords.some(keyword => p.name.toLowerCase().includes(keyword))
)

// 3. Filtrerade produkter visas
<ProductGrid products={filtered} />
```

## Nyckelkomponenter

### 1. `lib/categoryGenerator.ts`

**Huvudfunktioner:**
- `generateCategoriesFromProducts()` - Genererar kategorier från produktnamn
- `filterProductsByCategory()` - Filtrerar produkter baserat på kategori
- `getAllCategoryNames()` - Returnerar alla tillgängliga kategorier

**Nyckelord-mappning:**
```typescript
const categoryKeywords = {
  'Kläder': ['tröja', 'byxa', 'jacket', 'coat', ...],
  'Skor': ['sko', 'sneaker', 'boot', ...],
  // ... fler kategorier
}
```

### 2. `app/api/categories/route.ts`

**Endpoint:** `GET /api/categories`

**Response:**
```json
{
  "categories": ["Kläder", "Herr", "Dam", ...],
  "metadata": {
    "totalProducts": 1000,
    "categoriesGenerated": 9,
    "details": [...]
  }
}
```

### 3. `app/api/categories/filter/route.ts`

**Endpoint:** `GET /api/categories/filter?category=Kläder`

**Response:**
```json
{
  "category": "Kläder",
  "products": [...],
  "count": 621
}
```

### 4. `components/Header.tsx`

**Ansvar:**
- Hämtar kategorier från API
- Visar kategorimeny (desktop + mobil)
- Hanterar kategoriväxling
- Synkroniserar med CategoryContext

**Kod:**
```typescript
useEffect(() => {
  fetch('/api/categories')
    .then(res => res.json())
    .then(data => setCategories(['All', ...data.categories]))
}, [])
```

### 5. `components/ProductGrid.tsx`

**Ansvar:**
- Filtrerar produkter baserat på vald kategori
- Visar filtrerade produkter
- Hanterar paginering

**Kod:**
```typescript
if (selectedCategory && selectedCategory !== 'All') {
  const keywords = categoryKeywords[selectedCategory]
  filtered = filtered.filter(p => 
    keywords.some(keyword => p.name.toLowerCase().includes(keyword))
  )
}
```

## Prestanda

### Caching

- **API-nivå**: 1 timmes cache (`revalidate: 3600`)
- **Database-nivå**: Next.js `unstable_cache` för produkter
- **Frontend-nivå**: React state management

### Optimeringar

1. **Lazy loading**: Produkter laddas i omgångar (70 produkter åt gången)
2. **Memoization**: `useCallback` för filtreringsfunktioner
3. **Effektiv filtrering**: Använder `Array.some()` för snabb nyckelordsmatchning

## Testning

### Manuell testning

```bash
# 1. Starta utvecklingsserver
npm run dev

# 2. Öppna webbläsaren
http://localhost:3000

# 3. Testa kategorimenyn
- Klicka på "Kategorier"
- Välj olika kategorier
- Verifiera att produkter filtreras korrekt
```

### Automatisk testning

```bash
# Kör kategorigenerering-test
npx tsx scripts/test-category-generation.ts

# Förväntat resultat:
# ✅ Hämtade 1000 produkter
# ✅ Genererade 9 kategorier
# ✅ Test slutfört!
```

### API-testning

```bash
# Testa kategorier
curl http://localhost:3000/api/categories | jq

# Testa filtrering
curl "http://localhost:3000/api/categories/filter?category=Kläder" | jq
```

## Underhåll

### Lägga till nya kategorier

1. Öppna `lib/categoryGenerator.ts`
2. Lägg till ny kategori i `categoryKeywords`:
```typescript
'Din Nya Kategori': ['nyckelord1', 'nyckelord2', ...]
```
3. Uppdatera även `ProductGrid.tsx` med samma nyckelord
4. Testa med `npx tsx scripts/test-category-generation.ts`

### Uppdatera nyckelord

1. Identifiera vilken kategori som behöver uppdateras
2. Lägg till/ta bort nyckelord i `categoryKeywords`
3. Testa att produkter filtreras korrekt
4. Rensa cache (starta om server)

### Felsökning

**Problem:** Kategorier visas inte i menyn
- Kontrollera att API:et returnerar kategorier: `curl http://localhost:3000/api/categories`
- Verifiera att Header.tsx hämtar kategorier korrekt
- Kolla console för fel

**Problem:** Produkter filtreras inte korrekt
- Verifiera att nyckelord matchar produktnamn
- Kontrollera att `ProductGrid.tsx` använder samma nyckelord som `categoryGenerator.ts`
- Testa med testskriptet

**Problem:** Kategorier uppdateras inte
- Rensa cache genom att starta om servern
- Kontrollera `revalidate`-inställningar i API-endpoints

## Framtida utveckling

### Kort sikt
- [ ] Lägg till fler kategorier baserat på produktdata
- [ ] Förbättra nyckelordsmatchning med regex
- [ ] Lägg till kategoriikoner

### Medellång sikt
- [ ] Implementera hierarkiska kategorier (huvudkategori → underkategori)
- [ ] Lägg till admin-panel för att hantera kategorier
- [ ] Implementera kategorisynonymer

### Lång sikt
- [ ] AI-baserad kategorisering med maskininlärning
- [ ] Automatisk översättning av kategorier
- [ ] Användardefinierade kategorier
- [ ] Kategorianalys och rekommendationer

## Relaterad dokumentation

- [DYNAMIC_CATEGORY_GENERATION.md](DYNAMIC_CATEGORY_GENERATION.md) - Detaljerad teknisk dokumentation
- [README_CATEGORIES.md](../README_CATEGORIES.md) - Snabbguide för användare
- [DATABASE_DRIVEN_UI.md](DATABASE_DRIVEN_UI.md) - Databasdriven UI-dokumentation
