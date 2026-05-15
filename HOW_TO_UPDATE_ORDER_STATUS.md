# 📦 Hur man uppdaterar orderstatus

## 🚀 Enklaste sättet (Rekommenderat)

Använd det färdiga scriptet:

```bash
npx tsx scripts/update-order-status.ts ORDER_NUMBER STATUS
```

### Exempel:

```bash
# Order packas
npx tsx scripts/update-order-status.ts ORD-17438574 processing

# Order skickas
npx tsx scripts/update-order-status.ts ORD-17438574 shipped

# Order levereras
npx tsx scripts/update-order-status.ts ORD-17438574 delivered
```

**Detta script:**
- ✅ Uppdaterar orders-tabellen
- ✅ Synkroniserar automatiskt till tracking
- ✅ Visar resultat
- ✅ Ger dig tracking-URL

## 📋 Tillåtna statusvärden

| Status | Vad det betyder | Tracking-resultat |
|--------|----------------|-------------------|
| `pending` | Order mottagen | ✅ Confirmed |
| `processing` | Packning påbörjad | ✅ Confirmed + 📦 Packing |
| `shipped` | I transport | ✅ Confirmed + 📦 Packing + 🚚 Transport |
| `delivered` | Levererad | ✅ Alla steg klara 🎉 |
| `cancelled` | Avbruten | Alla steg nollställda |
| `returned` | Returnerad | ✅ Confirmed + 📦 Packing + 🚚 Transport |

## 🔧 Alternativ metod: SQL + Sync

Om du föredrar att använda SQL direkt:

### Steg 1: Uppdatera i databasen

```sql
UPDATE orders SET status = 'shipped' WHERE order_number = 'ORD-17438574';
```

### Steg 2: Synkronisera

```bash
curl -X POST http://localhost:3000/api/sync-order-status \
  -H "Content-Type: application/json" \
  -d '{"order_number": "ORD-17438574"}'
```

**OBS:** Du MÅSTE köra steg 2 efter SQL-uppdatering, annars uppdateras inte tracking-sidan!

## 🌐 Kontrollera resultatet

Efter uppdatering, öppna tracking-sidan:

```
http://localhost:3000/spara-order/ORDER_ID
```

Sidan uppdateras automatiskt var 10:e sekund.

## 📊 Exempel på fullständigt flöde

```bash
# 1. Order bekräftas (sker automatiskt vid skapande)
npx tsx scripts/update-order-status.ts ORD-17438574 pending

# 2. Order börjar packas
npx tsx scripts/update-order-status.ts ORD-17438574 processing

# 3. Order skickas
npx tsx scripts/update-order-status.ts ORD-17438574 shipped

# 4. Order levereras
npx tsx scripts/update-order-status.ts ORD-17438574 delivered
```

## 🔍 Felsökning

### Problem: "Order not found"

**Lösning:** Kontrollera att order_number är korrekt:

```bash
npx tsx -e "import client from './lib/db.ts'; const r = await client.execute({sql: 'SELECT order_number FROM orders', args: []}); console.log(r.rows);"
```

### Problem: "Invalid status"

**Lösning:** Använd endast tillåtna statusvärden:
- `pending`
- `processing`
- `shipped`
- `delivered`
- `cancelled`
- `returned`

### Problem: Tracking-sidan uppdateras inte

**Lösning:** 
1. Vänta 10 sekunder (automatisk uppdatering)
2. Ladda om sidan manuellt
3. Kontrollera att du körde synkroniseringen

## 🛠️ Andra användbara kommandon

### Visa alla orders

```bash
npx tsx -e "import client from './lib/db.ts'; const r = await client.execute({sql: 'SELECT order_number, status FROM orders', args: []}); console.table(r.rows);"
```

### Kontrollera tracking för en order

```bash
npx tsx scripts/check-tracking.ts
```

### Synkronisera alla orders

```bash
npx tsx scripts/sync-order-to-tracking.ts
```

### Diagnostik

```bash
npx tsx scripts/diagnose-tracking.ts
```

## ✅ Sammanfattning

**Enklaste sättet:**
```bash
npx tsx scripts/update-order-status.ts ORD-17438574 shipped
```

**Det är allt!** Scriptet gör allt åt dig och visar resultatet.

Tracking-sidan uppdateras automatiskt inom 10 sekunder! 🎉
