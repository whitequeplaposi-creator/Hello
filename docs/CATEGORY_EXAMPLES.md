# Kategoriystem - Exempel och användningsfall

## Exempel 1: Lägga till en ny kategori

### Scenario
Du vill lägga till kategorin "Väskor & Ryggsäckar" för att bättre organisera väskprodukter.

### Steg 1: Uppdatera categoryGenerator.ts

```typescript
const categoryKeywords: Record<string, string[]> = {
  // ... befintliga kategorier
  'Väskor & Ryggsäckar': [
    'väska', 'bag', 'ryggsäck', 'backpack', 
    'handväska', 'handbag', 'axelväska', 'shoulder bag',
    'messenger', 'tote', 'clutch', 'portfölj', 'briefcase'
  ],
}
```

### Steg 2: Uppdatera ProductGrid.tsx

```typescript
const categoryKeywords: Record<string, string[]> = {
  // ... befintliga kategorier
  'Väskor & Ryggsäckar': [
    'väska', 'bag', 'ryggsäck', 'backpack', 
    'handväska', 'handbag', 'axelväska', 'shoulder bag',
    'messenger', 'tote', 'clutch', 'portfölj', 'briefcase'
  ],
}
```

### Steg 3: Testa

```bash
npx tsx scripts/test-category-generation.ts
```

**Förväntat resultat:**
```
📊 Genererade kategorier:
  ...
  10. Väskor & Ryggsäckar
     - Antal produkter: 45
     - Nyckelord: väska, bag, ryggsäck, backpack, handväska
```

## Exempel 2: Förbättra matchning för befintlig kategori

### Scenario
Kategorin "Elektronik" missar vissa produkter som innehåller "smartwatch" eller "earbuds".

### Lösning

```typescript
'Elektronik': [
  'telefon', 'dator', 'laptop', 'tablet', 
  'hörlurar', 'headphones', 'phone', 'computer', 
  'charger', 'laddare', 'kabel', 'cable',
  // Lägg till nya nyckelord
  'smartwatch', 'earbuds', 'bluetooth', 'wireless',
  'powerbank', 'adapter', 'usb'
],
```

## Exempel 3: Skapa underkategorier

### Scenario
Du vill dela upp "Kläder" i mer specifika kategorier.

### Lösning

```typescript
const categoryKeywords: Record<string, string[]> = {
  // Huvudkategori
  'Kläder': [
    'tröja', 'byxa', 'kjol', 'klänning', 'jacka', 
    'kappa', 'shorts', 'jeans', 'hoodie', 'sweatshirt'
  ],
  
  // Underkategorier
  'Kläder - Jackor': [
    'jacka', 'jacket', 'kappa', 'coat', 'blazer',
    'bomber', 'parka', 'windbreaker', 'varsity'
  ],
  
  'Kläder - Byxor': [
    'byxa', 'pants', 'jeans', 'chinos', 'trousers',
    'leggings', 'cargo', 'joggers'
  ],
  
  'Kläder - Tröjor': [
    'tröja', 'shirt', 't-shirt', 'tshirt', 'polo',
    'sweatshirt', 'hoodie', 'sweater', 'pullover'
  ],
}
```

## Exempel 4: Flerspråkigt stöd

### Scenario
Du vill lägga till tyska nyckelord för internationell expansion.

### Lösning

```typescript
'Kläder': [
  // Svenska
  'tröja', 'byxa', 'kjol', 'klänning', 'jacka',
  
  // Engelska
  'shirt', 'pants', 'skirt', 'dress', 'jacket',
  
  // Tyska
  'hemd', 'hose', 'rock', 'kleid', 'jacke',
  'pullover', 'mantel'
],
```

## Exempel 5: Säsongsbaserade kategorier

### Scenario
Du vill skapa kategorier för säsongsvaror.

### Lösning

```typescript
const categoryKeywords: Record<string, string[]> = {
  // ... befintliga kategorier
  
  'Vinter': [
    'vinter', 'winter', 'vinterjacka', 'winter jacket',
    'mössa', 'beanie', 'vantar', 'gloves', 'mittens',
    'halsduk', 'scarf', 'stickad', 'knitted', 'wool'
  ],
  
  'Sommar': [
    'sommar', 'summer', 'shorts', 'bikini', 'swimsuit',
    'badkläder', 'swimwear', 'sandal', 'flip-flop',
    'solglasögon', 'sunglasses', 'linne', 'tank top'
  ],
}
```

## Exempel 6: Prisbaserade kategorier

### Scenario
Du vill kombinera kategorigenerering med prisfiltrering.

### Lösning

Skapa en ny funktion i `categoryGenerator.ts`:

```typescript
export function filterProductsByPriceRange(
  products: Product[],
  minPrice: number,
  maxPrice: number
): Product[] {
  return products.filter(p => p.price >= minPrice && p.price <= maxPrice)
}

export function generatePriceCategories(products: Product[]): string[] {
  return [
    'Under 200 kr',
    '200-500 kr',
    '500-1000 kr',
    'Över 1000 kr'
  ]
}
```

Använd i `ProductGrid.tsx`:

```typescript
// Kombinera kategori- och prisfiltrering
let filtered = products

// Filtrera efter kategori
if (selectedCategory !== 'All') {
  filtered = filterProductsByCategory(filtered, selectedCategory)
}

// Filtrera efter pris
if (selectedPriceRange === 'Under 200 kr') {
  filtered = filterProductsByPriceRange(filtered, 0, 200)
} else if (selectedPriceRange === '200-500 kr') {
  filtered = filterProductsByPriceRange(filtered, 200, 500)
}
// ... etc
```

## Exempel 7: Popularitetsbaserade kategorier

### Scenario
Du vill visa "Populära produkter" som en kategori.

### Lösning

Skapa en ny API-endpoint `app/api/categories/popular/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { getProducts } from '@/lib/db'

export async function GET() {
  try {
    const products = await getProducts()
    
    // Simulera popularitet (i verkligheten skulle du använda faktisk data)
    const popularProducts = products
      .sort(() => Math.random() - 0.5) // Slumpmässig sortering
      .slice(0, 20)
    
    return NextResponse.json({ 
      category: 'Populära produkter',
      products: popularProducts,
      count: popularProducts.length
    })
  } catch (error) {
    console.error('Error fetching popular products:', error)
    return NextResponse.json({ 
      error: 'Kunde inte hämta populära produkter',
      products: []
    }, { status: 500 })
  }
}
```

## Exempel 8: Märkesbaserade kategorier

### Scenario
Du vill skapa kategorier baserat på varumärken.

### Lösning

```typescript
const brandKeywords: Record<string, string[]> = {
  'Nike': ['nike'],
  'Adidas': ['adidas'],
  'H&M': ['h&m', 'hm'],
  'Zara': ['zara'],
  'Levi\'s': ['levis', 'levi'],
}

export function generateBrandCategories(productNames: string[]): GeneratedCategory[] {
  const brandMap = new Map<string, { count: number; keywords: Set<string> }>()

  for (const productName of productNames) {
    const nameLower = productName.toLowerCase()
    
    for (const [brand, keywords] of Object.entries(brandKeywords)) {
      for (const keyword of keywords) {
        if (nameLower.includes(keyword)) {
          if (!brandMap.has(brand)) {
            brandMap.set(brand, { count: 0, keywords: new Set() })
          }
          brandMap.get(brand)!.count++
          brandMap.get(brand)!.keywords.add(keyword)
          break
        }
      }
    }
  }

  return Array.from(brandMap.entries())
    .map(([name, data]) => ({
      name,
      count: data.count,
      keywords: Array.from(data.keywords),
    }))
    .sort((a, b) => b.count - a.count)
}
```

## Exempel 9: Kombinera flera filtreringsmetoder

### Scenario
Du vill låta användare filtrera på både kategori, pris och märke samtidigt.

### Lösning

Skapa en avancerad filtreringsfunktion:

```typescript
interface FilterOptions {
  category?: string
  priceMin?: number
  priceMax?: number
  brand?: string
  inStock?: boolean
}

export function filterProducts(
  products: Product[],
  options: FilterOptions
): Product[] {
  let filtered = products

  // Filtrera efter kategori
  if (options.category && options.category !== 'All') {
    filtered = filterProductsByCategory(filtered, options.category)
  }

  // Filtrera efter pris
  if (options.priceMin !== undefined || options.priceMax !== undefined) {
    filtered = filtered.filter(p => {
      const price = p.price
      if (options.priceMin !== undefined && price < options.priceMin) return false
      if (options.priceMax !== undefined && price > options.priceMax) return false
      return true
    })
  }

  // Filtrera efter märke
  if (options.brand) {
    const brandLower = options.brand.toLowerCase()
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(brandLower)
    )
  }

  // Filtrera efter lagerstatus
  if (options.inStock !== undefined) {
    filtered = filtered.filter(p => p.inStock === options.inStock)
  }

  return filtered
}
```

Använd i komponenten:

```typescript
const filteredProducts = filterProducts(products, {
  category: selectedCategory,
  priceMin: 200,
  priceMax: 1000,
  brand: 'Nike',
  inStock: true
})
```

## Exempel 10: Dynamiska kategorier baserat på tid

### Scenario
Du vill visa olika kategorier beroende på tid på året.

### Lösning

```typescript
export function getSeasonalCategories(): string[] {
  const month = new Date().getMonth() + 1 // 1-12
  
  if (month >= 12 || month <= 2) {
    // Vinter
    return ['Vinterjackor', 'Mössor & Vantar', 'Vinterstövlar']
  } else if (month >= 3 && month <= 5) {
    // Vår
    return ['Vårkläder', 'Regnjackor', 'Sneakers']
  } else if (month >= 6 && month <= 8) {
    // Sommar
    return ['Badkläder', 'Shorts', 'Sandaler', 'Solglasögon']
  } else {
    // Höst
    return ['Höstjackor', 'Stövlar', 'Halsdukar']
  }
}
```

Använd i API:et:

```typescript
export async function GET() {
  const categories = await generateCategoriesFromProducts(productNames)
  const seasonalCategories = getSeasonalCategories()
  
  return NextResponse.json({ 
    categories: [...seasonalCategories, ...categories]
  })
}
```

## Best Practices

### 1. Nyckelord
- Använd både singular och plural ("sko", "skor")
- Inkludera både svenska och engelska termer
- Använd gemener (lowercase) för alla nyckelord
- Undvik för generiska ord som kan matcha fel produkter

### 2. Kategorier
- Håll kategorinamn korta och beskrivande
- Använd konsekvent namngivning
- Undvik överlappande kategorier
- Testa med verklig produktdata

### 3. Prestanda
- Cacha genererade kategorier
- Använd effektiva filtreringsalgoritmer
- Begränsa antal kategorier som visas samtidigt
- Implementera lazy loading för stora produktkataloger

### 4. Användarvänlighet
- Visa antal produkter per kategori
- Implementera "Inga resultat"-meddelanden
- Lägg till laddningsindikatorer
- Gör det enkelt att rensa filter

## Felsökning

### Problem: För många produkter i en kategori

**Lösning:** Gör nyckelorden mer specifika

```typescript
// Dåligt - för brett
'Kläder': ['kläder', 'clothes']

// Bra - mer specifikt
'Kläder': ['tröja', 'byxa', 'kjol', 'klänning', 'jacka']
```

### Problem: För få produkter i en kategori

**Lösning:** Lägg till fler nyckelord eller synonymer

```typescript
// Före
'Skor': ['sko', 'shoe']

// Efter
'Skor': ['sko', 'skor', 'shoe', 'shoes', 'sneaker', 'boot', 'sandal']
```

### Problem: Produkter hamnar i fel kategori

**Lösning:** Använd mer specifika nyckelord eller exkludera vissa termer

```typescript
// Lägg till logik för att exkludera vissa matchningar
function analyzeProductName(productName: string): string[] {
  const nameLower = productName.toLowerCase()
  const matchedCategories: string[] = []
  
  // Exkludera produkter med vissa ord
  if (nameLower.includes('leksak') && nameLower.includes('bil')) {
    return ['Leksaker'] // Inte "Elektronik" även om det innehåller "bil"
  }
  
  // ... fortsätt med normal matchning
}
```

## Sammanfattning

Kategorigenerering är ett kraftfullt verktyg för att organisera produkter dynamiskt. Genom att kombinera olika filtreringsmetoder och anpassa nyckelord kan du skapa en flexibel och användarvänlig kategoristruktur som automatiskt uppdateras när nya produkter läggs till.
