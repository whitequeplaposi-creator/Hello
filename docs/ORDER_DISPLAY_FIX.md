# Order Display Fix - Mina Beställningar

## Problem
Beställningar visades inte under "Mina sidor" → "Mina beställningar" trots att de skapades framgångsrikt i databasen.

## Root Cause
Det fanns en mismatch mellan användarens ID i localStorage och customer ID i databasen:

1. **Vid registrering**: Användaren fick ett ID (t.ex. `cust_1776888910825`) som sparades i localStorage
2. **Vid checkout**: API:et ignorerade detta ID och skapade/hittade en kund baserat på e-post, vilket resulterade i ett annat customer ID (t.ex. `1777319918227`)
3. **Vid visning av beställningar**: Sidan använde user.id från localStorage för att hämta beställningar, men beställningarna var kopplade till ett annat customer ID

## Lösning

### 1. Uppdaterad Order Creation Logic (`app/api/orders/route.ts`)
- **Före**: API:et ignorerade alltid customerId från frontend och skapade/hittade kund baserat på e-post
- **Efter**: API:et prioriterar customerId från inloggad användare:
  1. Om användaren är inloggad (customerId finns), använd det ID:t
  2. Verifiera att e-posten matchar
  3. Om ingen match, sök efter kund med rätt e-post
  4. Om ingen kund hittas, skapa ny kund (använd customerId från frontend om det finns)

```typescript
// Ny logik
if (customerId && customerId.trim()) {
  const existingCustomer = await customerDb.getCustomer(customerId);
  if (existingCustomer && existingCustomer.email === customerData.email) {
    finalCustomerId = existingCustomer.id; // Använd inloggad användares ID
  }
}
```

### 2. Uppdaterad Login Logic (`lib/AuthContext.tsx`)
- **Före**: Login använde ID från localStorage
- **Efter**: Login hämtar korrekt customer ID från databasen baserat på e-post

```typescript
// Ny logik vid login
const response = await fetch(`/api/customers?email=${encodeURIComponent(email)}`)
const data = await response.json()
if (data.success && data.customer) {
  customerId = data.customer.id // Använd ID från databasen
}
```

### 3. Ny API Endpoint (`app/api/customers/route.ts`)
Lagt till stöd för att hämta kund via e-post:
```typescript
GET /api/customers?email=user@example.com
```

### 4. Checkout Page Update (`app/kassa/page.tsx`)
Säkerställer att user.id skickas som sträng:
```typescript
customerId: user?.id?.toString() || null
```

## Testning

### Test Script 1: Order-Customer Link
```bash
npx tsx scripts/test-order-customer-link.ts
```
Visar:
- Alla kunder och deras beställningar
- Orphaned orders (beställningar utan kund)
- Dubbletter av kunder

### Test Script 2: User-Customer ID Sync
```bash
npx tsx scripts/sync-user-customer-ids.ts [email]
```
Visar:
- Customer ID för varje e-post
- Antal beställningar (recorded vs actual)
- Detaljerad information för specifik e-post

## För Användare

### Om du inte ser dina beställningar:

#### Metod 1: Logga ut och in igen (Rekommenderas)
1. Klicka på "Logga ut"
2. Logga in igen med samma e-post och lösenord
3. Systemet kommer nu att använda korrekt customer ID från databasen
4. Dina beställningar ska nu visas

#### Metod 2: Manuell Fix (Avancerad)
1. Öppna browser console (F12)
2. Kör: `localStorage.getItem("user")`
3. Hitta ditt korrekta customer ID i databasen (kontakta admin)
4. Uppdatera localStorage:
```javascript
localStorage.setItem("user", JSON.stringify({
  id: "DITT_KORREKTA_CUSTOMER_ID",
  email: "din@email.com",
  name: "Ditt Namn"
}))
```
5. Ladda om sidan

## Tekniska Detaljer

### Database Schema
```sql
-- Customers table
CREATE TABLE customers (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  total_orders INTEGER DEFAULT 0,
  total_spent REAL DEFAULT 0,
  last_order_date TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Orders table
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL,
  total_amount REAL NOT NULL,
  currency TEXT DEFAULT 'SEK',
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

### API Flow
```
1. User Login
   ↓
2. Fetch customer by email from DB
   ↓
3. Update localStorage with correct customer ID
   ↓
4. User creates order
   ↓
5. Order API uses customer ID from localStorage
   ↓
6. Order is linked to correct customer
   ↓
7. "Mina beställningar" fetches orders using customer ID
   ↓
8. Orders are displayed correctly
```

## Framtida Förbättringar

1. **Migrera från localStorage till JWT tokens**: Mer säkert och konsekvent
2. **Server-side sessions**: Eliminera risk för ID mismatch
3. **Automatisk ID migration**: Script för att migrera gamla användare
4. **Better error handling**: Visa tydligare felmeddelanden vid ID mismatch

## Relaterade Filer
- `app/api/orders/route.ts` - Order creation logic
- `app/api/customers/route.ts` - Customer lookup
- `lib/AuthContext.tsx` - Login logic
- `lib/customerDb.ts` - Database operations
- `app/mina-sidor/bestallningar/page.tsx` - Orders display page
- `app/kassa/page.tsx` - Checkout page

## Status
✅ **FIXED** - Orders are now correctly linked to logged-in users and display in "Mina beställningar"
