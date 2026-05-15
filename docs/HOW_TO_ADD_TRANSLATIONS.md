# Guide: Hur man lägger till översättningar

## Steg 1: Identifiera text som behöver översättas

Leta efter hårdkodad text i komponenter, till exempel:
```tsx
<h1>Välkommen</h1>
<button>Lägg till i varukorg</button>
```

## Steg 2: Lägg till översättningsnycklar

Öppna `lib/LanguageContext.tsx` och lägg till dina nycklar i både svenska och engelska:

```tsx
const translations = {
  sv: {
    // ... befintliga översättningar
    welcome: 'Välkommen',
    addToCartButton: 'Lägg till i varukorg',
  },
  en: {
    // ... befintliga översättningar
    welcome: 'Welcome',
    addToCartButton: 'Add to cart',
  },
}
```

## Steg 3: Använd översättningsfunktionen i komponenten

```tsx
'use client'

import { useLanguage } from '@/lib/LanguageContext'

export default function MyComponent() {
  const { t } = useLanguage()
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <button>{t('addToCartButton')}</button>
    </div>
  )
}
```

## Steg 4: Testa båda språken

1. Starta utvecklingsservern: `npm run dev`
2. Öppna webbplatsen i webbläsaren
3. Klicka på språkväxlaren i headern
4. Verifiera att texten ändras korrekt

## Tips och best practices

### Namngivning av nycklar
- Använd camelCase: `myTranslationKey`
- Var beskrivande: `productAddToCart` istället för `btn1`
- Gruppera relaterade nycklar med prefix: `product*`, `cart*`, `auth*`

### Organisera översättningar
Använd kommentarer för att gruppera relaterade översättningar:

```tsx
const translations = {
  sv: {
    // Product Page
    productTitle: 'Produkttitel',
    productPrice: 'Pris',
    productDescription: 'Beskrivning',
    
    // Cart
    cartTotal: 'Totalt',
    cartEmpty: 'Varukorgen är tom',
  },
  // ...
}
```

### Dynamisk text
För text med variabler, använd template strings:

```tsx
// I LanguageContext.tsx
const translations = {
  sv: {
    itemsInCart: 'artiklar i varukorgen',
  },
  en: {
    itemsInCart: 'items in cart',
  },
}

// I komponenten
<p>{totalItems} {t('itemsInCart')}</p>
```

### Pluralformer
För plural, skapa separata nycklar:

```tsx
const translations = {
  sv: {
    oneItem: 'artikel',
    multipleItems: 'artiklar',
  },
  en: {
    oneItem: 'item',
    multipleItems: 'items',
  },
}

// Användning
<p>{count} {count === 1 ? t('oneItem') : t('multipleItems')}</p>
```

## Vanliga misstag att undvika

❌ **Hårdkoda text direkt**
```tsx
<button>Lägg till i varukorg</button>
```

✅ **Använd översättningsfunktionen**
```tsx
<button>{t('addToCart')}</button>
```

❌ **Glömma engelska översättningen**
```tsx
const translations = {
  sv: {
    newKey: 'Ny text',
  },
  en: {
    // Glömt att lägga till newKey här!
  },
}
```

✅ **Lägg alltid till båda språken**
```tsx
const translations = {
  sv: {
    newKey: 'Ny text',
  },
  en: {
    newKey: 'New text',
  },
}
```

❌ **Använda samma nyckel för olika kontexter**
```tsx
// Förvirrande - "name" kan betyda olika saker
userName: 'Namn',
productName: 'Namn',
```

✅ **Var specifik med nyckelnamn**
```tsx
userName: 'Användarnamn',
productName: 'Produktnamn',
```

## Checklista för nya översättningar

- [ ] Lagt till nyckel i både `sv` och `en`
- [ ] Använt beskrivande nyckelnamn
- [ ] Testat båda språken i webbläsaren
- [ ] Kontrollerat att texten passar i UI:t på båda språken
- [ ] Lagt till kommentar om nyckeln tillhör en specifik grupp

## Exempel: Komplett implementation

### Före (hårdkodad text)
```tsx
export default function ProductCard({ product }) {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>Pris: {product.price} kr</p>
      <button>Lägg till i varukorg</button>
      <span>I lager</span>
    </div>
  )
}
```

### Efter (med översättningar)
```tsx
'use client'

import { useLanguage } from '@/lib/LanguageContext'

export default function ProductCard({ product }) {
  const { t } = useLanguage()
  
  return (
    <div>
      <h3>{product.name}</h3>
      <p>{t('price')}: {product.price} kr</p>
      <button>{t('addToCart')}</button>
      <span>{t('inStock')}</span>
    </div>
  )
}
```

### Översättningar i LanguageContext.tsx
```tsx
const translations = {
  sv: {
    // Product Card
    price: 'Pris',
    addToCart: 'Lägg till i varukorg',
    inStock: 'I lager',
  },
  en: {
    // Product Card
    price: 'Price',
    addToCart: 'Add to cart',
    inStock: 'In stock',
  },
}
```
