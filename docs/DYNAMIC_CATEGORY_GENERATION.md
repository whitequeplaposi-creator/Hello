# Dynamisk Kategorigenerering

## Översikt

Systemet genererar automatiskt kategorier baserat på produktnamn istället för att använda en separat kategorikolumn i databasen. Detta gör att kategorimenyn uppdateras automatiskt när nya produkter läggs till. Systemet stöder även flerspråkig översättning av kategorier (svenska och engelska).

## Hur det fungerar

### 1. Kategorigenerator (`lib/categoryGenerator.ts`)

Huvudfunktionen analyserar produktnamn och identifierar kategorier baserat på nyckelord:

```typescript
generateCategoriesFromProducts(productNames: string[]): GeneratedCategory[]
```

#### Definierade kategorier och nyckelord:

- **Kläder**: tröja, byxa, kjol, klänning, jacka, shorts, jeans, hoodie, sweatshirt, etc.
- **Skor**: sko, sneaker, boot, sandal, stövel, etc.
- **Accessoarer**: väska, plånbok, bälte, hatt, mössa, scarf, handskar, solglasögon
- **Smycken**: halsband, armband, örhänge, ring, smycke, necklace, bracelet, earring
- **Elektronik**: telefon, dator, laptop, tablet, hörlurar, headphones, charger, laddare
- **Hem & Inredning**: kudde, filt, matta, lampa, vas, dekoration
- **Sport & Fritid**: träning, sport, fitness, yoga, löpning, gym, workout
- **Skönhet**: makeup, smink, parfym, hudvård, skincare, nagellack
- **Barn**: barn, baby, kids, children, leksak, toy
- **Herr**: herr, män, man, men, mens, herrmode
- **Dam**: dam, kvinna, kvinnor, women, womens, dammode, ladies

### 2. API-endpoint (`app/api/categories/route.ts`)

Hämtar produkter från databasen och genererar kategorier:

```typescript
GET /api/categories
```

**Response:**
```json
{
  "categories": ["Kläder", "Herr", "Dam", "Smycken", ...],
  "metadata": {
    "totalProducts": 1000,
    "categoriesGenerated": 9,
    "details": [
      {
        "name": "Kläder",
        "count": 621,
        "keywords": ["pants", "jacket", "coat", ...]
      }
    ]
  }
}
```

### 3. Filtrerings-endpoint (`app/api/categories/filter/route.ts`)

Filtrerar produkter baserat på en vald kategori:

```typescript
GET /api/categories/filter?category=Kläder
```

**Response:**
```json
{
  "category": "Kläder",
  "products": [...],
  "count": 621
}
```

### 4. Frontend-integration

#### Header-komponenten (`components/Header.tsx`)

Hämtar kategorier från API:et och visar dem i menyn:

```typescript
useEffect(() => {
  fetch('/api/categories')
    .then(res => res.json())
    .then(data => {
      if (data.categories && data.categories.length > 0) {
        setCategories(['All', ...data.categories])
      }
    })
}, [])
```

#### ProductGrid-komponenten (`components/ProductGrid.tsx`)

Filtrerar produkter baserat på vald kategori:

```typescript
if (selectedCategory && selectedCategory !== 'All') {
  const keywords = categoryKeywords[selectedCategory]
  if (keywords) {
    filtered = filtered.filter(p => {
      const nameLower = p.name.toLowerCase()
      return keywords.some(keyword => nameLower.includes(keyword))
    })
  }
}
```

## Fördelar

1. **Automatisk uppdatering**: Kategorier genereras automatiskt från produktdata
2. **Ingen databasändring**: Ingen separat kategorikolumn behövs
3. **Flexibilitet**: Enkelt att lägga till nya kategorier genom att uppdatera nyckelord
4. **Flerspråkigt**: Stöder både svenska och engelska nyckelord
5. **Skalbart**: Fungerar med stora produktkataloger

## Testning

Kör testskriptet för att verifiera kategorigenerering:

```bash
npx tsx scripts/test-category-generation.ts
```

**Exempel på output:**
```
✅ Hämtade 1000 produkter
✅ Genererade 9 kategorier

📊 Genererade kategorier:
  1. Kläder - 621 produkter
  2. Herr - 297 produkter
  3. Dam - 273 produkter
  4. Smycken - 41 produkter
  ...
```

## Anpassning

### Lägga till nya kategorier

Redigera `categoryKeywords` i `lib/categoryGenerator.ts`:

```typescript
const categoryKeywords: Record<string, string[]> = {
  'Din Nya Kategori': ['nyckelord1', 'nyckelord2', 'keyword1', 'keyword2'],
  // ... befintliga kategorier
}
```

### Justera nyckelord

Lägg till eller ta bort nyckelord för befintliga kategorier:

```typescript
'Kläder': ['tröja', 'byxa', 'ditt-nya-nyckelord', ...]
```

## Cache

API-endpointen använder Next.js cache med 1 timmes revalidering:

```typescript
export const revalidate = 3600 // Cache i 1 timme
```

För att rensa cache manuellt, starta om utvecklingsservern eller vänta på automatisk revalidering.

## Framtida förbättringar

1. **AI-baserad kategorisering**: Använd maskininlärning för att automatiskt identifiera kategorier
2. **Hierarkiska kategorier**: Stöd för underkategorier (t.ex. Kläder > Jackor > Vinterjackor)
3. **Användardefinierade kategorier**: Låt administratörer skapa egna kategorier via admin-panel
4. **Kategorisynonymer**: Stöd för alternativa namn på samma kategori
5. **Automatisk översättning**: Generera kategorier på flera språk automatiskt


## Översättningsfunktioner

Systemet inkluderar funktioner för att översätta kategorier mellan svenska och engelska:

```typescript
// Översätt en enskild kategori
translateCategory('Kläder', 'en') // → 'Clothes'
translateCategory('Clothes', 'sv') // → 'Kläder'

// Översätt en lista av kategorier
translateCategories(['Kläder', 'Skor', 'Dam'], 'en') 
// → ['Clothes', 'Shoes', 'Women']
```

### Översättningsmappning

| Svenska | Engelska |
|---------|----------|
| Kläder | Clothes |
| Skor | Shoes |
| Accessoarer | Accessories |
| Smycken | Jewelry |
| Elektronik | Electronics |
| Hem & Inredning | Home & Decor |
| Sport & Fritid | Sports & Fitness |
| Skönhet | Beauty |
| Barn | Kids |
| Herr | Men |
| Dam | Women |
| Alla | All |

### Användning i komponenter

I Header-komponenten används översättningsfunktionen automatiskt baserat på valt språk:

```typescript
import { translateCategory } from '@/lib/categoryGenerator'
import { useLanguage } from '@/lib/LanguageContext'

const { language } = useLanguage()

// I render:
{categories.map((category) => (
  <button key={category}>
    {translateCategory(category, language)}
  </button>
))}
```

### API-stöd för översättningar

API-endpointen stöder språkparameter:

```bash
# Hämta kategorier på svenska (standard)
curl http://localhost:3000/api/categories

# Hämta kategorier på engelska
curl http://localhost:3000/api/categories?lang=en
```

**Response (engelska):**
```json
{
  "categories": ["Clothes", "Men", "Women", "Jewelry", ...],
  "metadata": {
    "language": "en",
    "totalProducts": 1000,
    "categoriesGenerated": 9
  }
}
```
