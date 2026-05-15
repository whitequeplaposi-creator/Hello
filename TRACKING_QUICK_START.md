# Order Tracking - Snabbguide

## 🎯 Snabbstart

### Uppdatera orderstatus via SQL

```sql
-- Steg 1: Uppdatera status i orders-tabellen
UPDATE orders SET status = 'shipped' WHERE order_number = 'ORD-17438574';

-- Steg 2: Synkronisera till tracking (kör i terminal)
```

```bash
curl -X POST http://localhost:3000/api/sync-order-status \
  -H "Content-Type: application/json" \
  -d '{"order_number": "ORD-17438574"}'
```

### Tillåtna statusvärden

| Status | Beskrivning | Tracking-resultat |
|--------|-------------|-------------------|
| `pending` | Order mottagen | ✅ Confirmed |
| `processing` | Packning påbörjad | ✅ Confirmed + 📦 Packing |
| `shipped` | I transport | ✅ Confirmed + 📦 Packing + 🚚 Transport |
| `delivered` | Levererad | ✅ Confirmed + 📦 Packing + 🚚 Transport + 🏠 Delivered |

## 📋 Exempel

### Exempel 1: Order packas

```sql
UPDATE orders SET status = 'processing' WHERE order_number = 'ORD-17438574';
```

```bash
curl -X POST http://localhost:3000/api/sync-order-status \
  -H "Content-Type: application/json" \
  -d '{"order_number": "ORD-17438574"}'
```

**Resultat på tracking-sidan:**
- ✅ Confirmed (grön)
- 📦 Packing (grön, "In Progress")
- 🚚 Transport (grå)
- 🏠 Delivered (grå)

### Exempel 2: Order skickad

```sql
UPDATE orders SET status = 'shipped' WHERE order_number = 'ORD-17438574';
```

```bash
curl -X POST http://localhost:3000/api/sync-order-status \
  -H "Content-Type: application/json" \
  -d '{"order_number": "ORD-17438574"}'
```

**Resultat på tracking-sidan:**
- ✅ Confirmed (grön)
- 📦 Packing (grön)
- 🚚 Transport (grön, "In Progress")
- 🏠 Delivered (grå)

### Exempel 3: Order levererad

```sql
UPDATE orders SET status = 'delivered' WHERE order_number = 'ORD-17438574';
```

```bash
curl -X POST http://localhost:3000/api/sync-order-status \
  -H "Content-Type: application/json" \
  -d '{"order_number": "ORD-17438574"}'
```

**Resultat på tracking-sidan:**
- ✅ Confirmed (grön)
- 📦 Packing (grön)
- 🚚 Transport (grön)
- 🏠 Delivered (grön, "Completed")

## 🔧 Verktyg

### Synkronisera alla orders

```bash
npx tsx scripts/sync-order-to-tracking.ts
```

### Kontrollera tracking för en order

```bash
npx tsx -e "
import client from './lib/db.ts';
const result = await client.execute({
  sql: 'SELECT * FROM order_tracking WHERE order_number = ?',
  args: ['ORD-17438574']
});
console.log(result.rows[0]);
" | node
```

### Testa tracking-systemet

```bash
npx tsx scripts/test-tracking-update.ts
```

## 🌐 Tracking-sidan

**URL:** `http://localhost:3000/spara-order/ORDER_ID`

Exempel: `http://localhost:3000/spara-order/order_1778517438574_owdddwsgb`

Sidan uppdateras automatiskt var 10:e sekund.

## ⚠️ Viktigt att komma ihåg

1. **Använd ENDAST tillåtna statusvärden:** `pending`, `processing`, `shipped`, `delivered`, `cancelled`, `returned`

2. **Synkronisera efter SQL-uppdateringar:** Tracking uppdateras INTE automatiskt vid SQL-uppdateringar

3. **Använd API:et när möjligt:** API:et synkroniserar automatiskt

4. **Vänta 10 sekunder:** Tracking-sidan uppdateras automatiskt var 10:e sekund

## 🚫 Vanliga fel

### Fel: "CHECK constraint failed"

```sql
-- ❌ FEL - 'packing' är inte ett tillåtet statusvärde
UPDATE orders SET status = 'packing' WHERE order_number = 'ORD-17438574';

-- ✅ RÄTT - Använd 'processing' istället
UPDATE orders SET status = 'processing' WHERE order_number = 'ORD-17438574';
```

### Fel: Tracking uppdateras inte

**Problem:** Du uppdaterade status via SQL men tracking-sidan visar gammal data.

**Lösning:** Anropa sync API:et:

```bash
curl -X POST http://localhost:3000/api/sync-order-status \
  -H "Content-Type: application/json" \
  -d '{"order_number": "ORD-17438574"}'
```

## 📚 Mer information

Se [ORDER_STATUS_TRACKING.md](./docs/ORDER_STATUS_TRACKING.md) för fullständig dokumentation.
