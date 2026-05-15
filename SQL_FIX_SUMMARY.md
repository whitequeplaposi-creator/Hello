# SQL Syntax Error - Fix

## 🐛 Problemet

SQL-syntaxfel uppstod när systemet försökte uppdatera tracking-data. Felet var:

```
There's a syntax error in your SQL query.
```

### Rotorsak

Jag använde CASE-satser i UPDATE-statements på ett sätt som inte fungerar korrekt med LibSQL/SQLite:

```sql
-- ❌ FELAKTIG SQL (orsakade syntaxfel)
UPDATE order_tracking 
SET 
  confirmed_date = CASE WHEN ? = 1 AND confirmed_date IS NULL THEN ? ELSE confirmed_date END,
  ...
WHERE order_id = ?
```

Problemet var att CASE-satserna med parametrar (`?`) inte hanterades korrekt av LibSQL-klienten.

## ✅ Lösningen

Ändrade till en enklare approach där vi:
1. Först hämtar befintliga datum från databasen
2. Beräknar nya värden i JavaScript
3. Uppdaterar med enkla värden (inga CASE-satser)

```sql
-- ✅ KORREKT SQL
UPDATE order_tracking 
SET 
  confirmed = ?,
  confirmed_date = ?,
  packing = ?,
  packing_date = ?,
  transport = ?,
  transport_date = ?,
  delivered = ?,
  delivered_date = ?,
  updated_at = ?
WHERE order_id = ?
```

Med logiken i JavaScript:

```typescript
// Hämta befintliga datum
const existingData = await client.execute({
  sql: 'SELECT confirmed_date, packing_date, transport_date, delivered_date FROM order_tracking WHERE order_id = ?',
  args: [orderId]
});

const existingDates = existingData.rows[0];

// Beräkna nya värden
const newConfirmedDate = mapping.confirmed === 1 && !existingDates.confirmed_date ? now : existingDates.confirmed_date;
// ... osv för andra datum
```

## 📝 Uppdaterade filer

1. **lib/customerDb.ts** - `syncOrderToTracking()` funktion
2. **app/api/sync-order-status/route.ts** - Sync API endpoint
3. **scripts/sync-order-to-tracking.ts** - Sync script

## 🧪 Testresultat

```bash
$ npx tsx scripts/test-status-update.ts

🧪 Testing Status Update with Fixed SQL

📦 Testing order: ORD-17438574
   Original status: processing

1️⃣ Updating to "shipped"...
   ✅ Sync successful: Orderstatus synkroniserad: shipped
   Tracking: confirmed=1, packing=1, transport=1, delivered=0

2️⃣ Updating to "delivered"...
   ✅ Sync successful: Orderstatus synkroniserad: delivered
   Tracking: confirmed=1, packing=1, transport=1, delivered=1

3️⃣ Restoring original status...
   ✅ Restored to: processing

✅ All tests passed! SQL syntax error is fixed.
```

## ✨ Resultat

- ✅ SQL-syntaxfel fixat
- ✅ Tracking uppdateras korrekt
- ✅ Befintliga datum bevaras
- ✅ Alla tester passerar

## 🚀 Användning

Systemet fungerar nu som förväntat:

```sql
-- Uppdatera status
UPDATE orders SET status = 'shipped' WHERE order_number = 'ORD-17438574';
```

```bash
-- Synkronisera
curl -X POST http://localhost:3000/api/sync-order-status \
  -H "Content-Type: application/json" \
  -d '{"order_number": "ORD-17438574"}'
```

Tracking-sidan uppdateras automatiskt inom 10 sekunder!
