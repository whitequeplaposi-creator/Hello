# Dynamisk Produktuppdatering

## Översikt

Systemet har nu en dynamisk produktuppdateringsfunktion som automatiskt uppdaterar produktlistan när kunder interagerar med produkter på startsidan. Detta säkerställer att nya eller ändrade produkter från databasen visas korrekt utan att sidan behöver laddas om manuellt.

## Funktioner

### 1. Automatisk Uppdatering vid Klick

- **Trigger**: Efter var 10:e produktklick uppdateras produktlistan automatiskt
- **Beteende**: Hämtar nya produkter från databasen och uppdaterar visningen
- **Användarvänligt**: Sker i bakgrunden utan att störa användarupplevelsen

### 2. Manuell Uppdateringsknapp

- **Placering**: Ovanför produktlistan
- **Funktion**: Användare kan manuellt uppdatera produktlistan när som helst
- **Visuell feedback**: Spinner-animation under uppdatering

### 3. Interaktionsspårning

- **Spårning**: Alla produktklick loggas i localStorage
- **Analytics**: Kan användas för att analysera användarinteraktioner
- **Historik**: Behåller de senaste 100 interaktionerna

## Teknisk Implementation

### Komponenter

#### `hooks/useProductInteraction.ts`
- `useProductInteraction`: Spårar produktinteraktioner
- `useProductRefresh`: Hanterar produktuppdatering från API

#### `components/ProductGrid.tsx`
- Hanterar produktvisning och uppdatering
- Räknar klick och triggar automatisk uppdatering
- Visar uppdateringsstatus

#### `components/ProductCard.tsx`
- Triggar interaktionsevent vid klick
- Skickar callback till parent-komponenten

#### `app/api/products/route.ts`
- Stödjer `refresh=true` parameter för att tvinga ny data
- Sätter no-cache headers vid refresh
- Stödjer `limit` parameter för att begränsa antal produkter

## Användning

### För Användare

1. **Automatisk uppdatering**: Klicka på produkter - efter 10 klick uppdateras listan automatiskt
2. **Manuell uppdatering**: Klicka på "Uppdatera"-knappen ovanför produktlistan
3. **Visuell feedback**: Se spinner och meddelande under uppdatering

### För Utvecklare

```typescript
// Använd hooks i en komponent
import { useProductInteraction, useProductRefresh } from '@/hooks/useProductInteraction'

const { trackInteraction } = useProductInteraction()
const { refreshProducts } = useProductRefresh()

// Spåra interaktion
trackInteraction(productId, 'click')

// Uppdatera produkter manuellt
const newProducts = await refreshProducts()
```

## API Endpoints

### GET /api/products

**Query Parameters:**
- `refresh=true`: Tvingar ny data från databasen (ingen cache)
- `limit=50`: Begränsar antal produkter som returneras

**Response:**
```json
{
  "success": true,
  "products": [...],
  "count": 50,
  "timestamp": 1234567890
}
```

## Konfiguration

### Anpassa Uppdateringsfrekvens

I `components/ProductGrid.tsx`, ändra denna rad:

```typescript
// Uppdatera automatiskt efter var 10:e klick
if (newCount >= 10) {
  handleProductRefresh()
}
```

Ändra `10` till önskat antal klick.

### Anpassa Produktgräns

I `hooks/useProductInteraction.ts`, ändra limit-parametern:

```typescript
const response = await fetch('/api/products?refresh=true&limit=50', {
  // ...
})
```

## Fördelar

1. **Alltid Aktuell Data**: Produkter uppdateras automatiskt från databasen
2. **Bättre Användarupplevelse**: Ingen manuell siduppdatering krävs
3. **Flexibel**: Både automatisk och manuell uppdatering
4. **Prestanda**: Uppdaterar endast när det behövs
5. **Analytics**: Spårar användarinteraktioner för framtida analys

## Framtida Förbättringar

- [ ] Lägg till WebSocket för realtidsuppdateringar
- [ ] Implementera smart caching-strategi
- [ ] Lägg till A/B-testning för uppdateringsfrekvens
- [ ] Integrera med analytics-plattform
- [ ] Lägg till användarpreferenser för uppdateringsfrekvens
