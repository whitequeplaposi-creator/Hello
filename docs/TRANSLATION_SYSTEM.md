# Översättningssystem / Translation System

## Översikt / Overview

Webbplatsen stödjer fullständig automatisk språköversättning för alla komponenter och sidor. Användare kan växla mellan svenska och engelska, och hela innehållet anpassas automatiskt.

The website supports complete automatic language translation for all components and pages. Users can switch between Swedish and English, and all content adapts automatically.

## Hur det fungerar / How it works

### 1. LanguageContext

Språkhanteringen sker via `lib/LanguageContext.tsx` som tillhandahåller:
- `language`: Aktuellt språk ('sv' eller 'en')
- `setLanguage`: Funktion för att byta språk
- `t(key)`: Översättningsfunktion

Language management is handled via `lib/LanguageContext.tsx` which provides:
- `language`: Current language ('sv' or 'en')
- `setLanguage`: Function to change language
- `t(key)`: Translation function

### 2. Användning i komponenter / Usage in components

```tsx
'use client'

import { useLanguage } from '@/lib/LanguageContext'

export default function MyComponent() {
  const { t, language, setLanguage } = useLanguage()
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  )
}
```

### 3. Lägga till nya översättningar / Adding new translations

För att lägga till nya översättningar, uppdatera `translations`-objektet i `lib/LanguageContext.tsx`:

To add new translations, update the `translations` object in `lib/LanguageContext.tsx`:

```tsx
const translations = {
  sv: {
    myNewKey: 'Min svenska text',
    // ... andra översättningar
  },
  en: {
    myNewKey: 'My English text',
    // ... other translations
  },
}
```

## Översatta komponenter / Translated components

Följande komponenter använder översättningssystemet:
The following components use the translation system:

- ✅ Header (navigation, search, user menu)
- ✅ Footer (all sections, links, copyright)
- ✅ ProductGrid
- ✅ ProductCard
- ✅ Cart
- ✅ Login/Register pages
- ✅ Checkout page

## Översättningsnycklar / Translation keys

### Navigation
- `menu`, `categories`, `search`, `cart`, `login`, `logout`
- `home`, `products`, `quickLinks`, `information`

### Footer
- `aboutUs`, `customerService`, `terms`, `followUs`
- `paymentMethods`, `deliveryMethods`, `allRightsReserved`
- `contactUs`, `shippingDelivery`, `returnsExchanges`, `faq`
- `termsOfPurchase`, `privacyPolicy`, `cookies`, `rightOfWithdrawal`

### Products
- `products`, `addToCart`, `outOfStock`, `inStock`
- `price`, `category`, `availability`, `quantity`
- `productDetails`, `specifications`, `description`
- `colors`, `relatedProducts`

### Cart & Checkout
- `total`, `emptyCart`, `continueShoppingBtn`
- `removeBtn`, `clearCartBtn`, `image`

### Auth
- `login`, `register`, `email`, `password`, `name`
- `welcomeBack`, `createAccount`, `logout`
- `alreadyHaveAccount`, `noAccount`, `loginHere`

### Delivery
- `deliveryInfo`, `deliveryTime`, `deliveryTimeValue`
- `freeShipping`, `returnPolicy`, `returnPolicyValue`

## Best Practices

1. **Använd alltid t() för text** / **Always use t() for text**
   - Hårdkoda aldrig text direkt i komponenter
   - Never hardcode text directly in components

2. **Lägg till båda språken** / **Add both languages**
   - När du lägger till en ny nyckel, lägg till översättning för både svenska och engelska
   - When adding a new key, add translation for both Swedish and English

3. **Använd beskrivande nycklar** / **Use descriptive keys**
   - `productAddToCart` är bättre än `btn1`
   - `productAddToCart` is better than `btn1`

4. **Gruppera relaterade nycklar** / **Group related keys**
   - Använd kommentarer för att organisera översättningar
   - Use comments to organize translations

## Språkväxlare / Language Switcher

Språkväxlaren finns i:
The language switcher is located in:

- Header (desktop): Dropdown i topbar
- Header (mobile): I mobilmenyn
- Header (desktop): Dropdown in topbar
- Header (mobile): In mobile menu

Användare kan växla mellan:
Users can switch between:
- 🇸🇪 Svenska (Swedish)
- 🇬🇧 English

## Framtida förbättringar / Future improvements

- [ ] Lägg till fler språk (norska, danska, finska)
- [ ] Spara språkval i localStorage
- [ ] Automatisk språkdetektering baserat på webbläsare
- [ ] Översättning av produktbeskrivningar från databas

- [ ] Add more languages (Norwegian, Danish, Finnish)
- [ ] Save language preference in localStorage
- [ ] Automatic language detection based on browser
- [ ] Translation of product descriptions from database
