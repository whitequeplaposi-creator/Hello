# Order Status & Tracking System

## Översikt

Systemet synkroniserar automatiskt orderstatus från `orders`-tabellen till `order_tracking`-tabellen för att visa leveransstatus på tracking-sidan.

## Statusvärden

### Orders-tabellen (orders.status)

Orders-tabellen har en CHECK constraint som ENDAST tillåter dessa statusvärden:

- `pending` - Order mottagen, väntar på bearbetning
- `processing` - Order bearbetas och packas
- `shipped` - Order har skickats
- `delivered` - Order har levererats
- `cancelled` - Order avbruten
- `returned` - Order returnerad

### Order Tracking-tabellen (order_tracking)

Tracking-tabellen har separata kolumner för varje leveranssteg:

- `confirmed` (0/1) - Order bekräftad
- `packing` (0/1) - Order packas
- `transport` (0/1) - Order i transport
- `delivered` (0/1) - Order levererad

Varje kolumn har också ett motsvarande datum-fält (t.ex. `confirmed_date`, `packing_date`).

## Statusmappning

Systemet mappar automatiskt `orders.status` till tracking-kolumner:

| orders.status | confirmed | packing | transport | delivered |
|--------------|-----------|---------|-----------|-----------|
| pending      | 1         | 0       | 0         | 0         |
| processing   | 1         | 1       | 0         | 0         |
| shipped      | 1         | 1       | 1         | 0         |
| delivered    | 1         | 1       | 1         | 1         |
| cancelled    | 0         | 0       | 0         | 0         |
| returned     | 1         | 1       | 1         | 0         |

## Hur man uppdaterar orderstatus

### 1. Via SQL (Direkt i databasen)

```sql
-- Uppdatera till processing (packning påbörjad)
UPDATE orders SET status = 'processing' WHERE order_number = 'ORD-17438574';

-- Uppdatera till shipped (i transport)
UPDATE orders SET status = 'shipped' WHERE order_number = 'ORD-17438574';

-- Uppdatera till delivered (levererad)
UPDATE orders SET status = 'delivered' WHERE order_number = 'ORD-17438574';
```

**VIKTIGT:** Efter SQL-uppdatering måste du synkronisera till tracking-tabellen:

```bash
# Anropa sync API
curl -X POST http://localhost:3000/api/sync-order-status \
  -H "Content-Type: application/json" \
  -d '{"order_number": "ORD-17438574"}'
```

Eller kör sync-scriptet:

```bash
npx tsx scripts/sync-order-to-tracking.ts
```

### 2. Via API (Rekommenderat)

API:et synkroniserar automatiskt till tracking-tabellen:

```bash
# Uppdatera orderstatus via API
curl -X PATCH http://localhost:3000/api/orders/ORDER_ID \
  -H "Content-Type: application/json" \
  -d '{"status": "shipped"}'
```

### 3. Via Admin-gränssnitt

När admin-gränssnittet är implementerat kommer statusuppdateringar att ske automatiskt via API:et.

## Automatisk synkronisering

Systemet synkroniserar automatiskt i följande fall:

1. **När order skapas** - Tracking-post skapas med status `pending`
2. **När status uppdateras via API** - `updateOrderStatus()` i `customerDb.ts` synkroniserar automatiskt
3. **Manuell synkronisering** - Via `/api/sync-order-status` endpoint

## Tracking-sidan

Tracking-sidan (`/spara-order/[id]`) visar leveransstatus i realtid:

- **URL:** `/spara-order/ORDER_ID`
- **Uppdateringsfrekvens:** Var 10:e sekund
- **Data:** Hämtas från `order_tracking`-tabellen via `/api/order-tracking/[id]`

### Visuell representation

Sidan visar 4 steg:

1. ✅ **Confirmed** - Order bekräftad
2. 📦 **Packing** - Packning pågår
3. 🚚 **Transport** - I transport
4. 🏠 **Delivered** - Levererad

Varje steg visar:
- Status (completed/in progress/pending)
- Datum och tid när steget slutfördes
- Beskrivning av steget

## API Endpoints

### GET /api/order-tracking/[id]

Hämtar tracking-information för en order.

**Response:**
```json
{
  "success": true,
  "tracking": {
    "id": "track_...",
    "order_id": "order_...",
    "order_number": "ORD-17438574",
    "confirmed": 1,
    "confirmed_date": "2026-05-12T10:30:00Z",
    "packing": 1,
    "packing_date": "2026-05-12T11:00:00Z",
    "transport": 0,
    "transport_date": null,
    "delivered": 0,
    "delivered_date": null
  }
}
```

### POST /api/sync-order-status

Synkroniserar orderstatus till tracking-tabellen.

**Request:**
```json
{
  "order_number": "ORD-17438574"
}
```

eller

```json
{
  "order_id": "order_1778517438574_owdddwsgb"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Orderstatus synkroniserad: shipped",
  "order_status": "shipped",
  "tracking": { ... }
}
```

### PATCH /api/orders/[id]

Uppdaterar orderstatus och synkroniserar automatiskt till tracking.

**Request:**
```json
{
  "status": "shipped"
}
```

## Testning

### Kör sync-script för alla orders

```bash
npx tsx scripts/sync-order-to-tracking.ts
```

### Testa tracking-uppdateringar

```bash
npx tsx scripts/test-tracking-update.ts
```

Detta script:
1. Hämtar en testorder
2. Testar alla statusvärden
3. Verifierar att tracking uppdateras korrekt
4. Återställer original status

### Manuell testning

1. Öppna tracking-sidan: `http://localhost:3000/spara-order/ORDER_ID`
2. I en annan terminal, uppdatera status:
   ```bash
   npx tsx -e "
   import client from './lib/db.ts';
   await client.execute({
     sql: 'UPDATE orders SET status = ? WHERE order_number = ?',
     args: ['shipped', 'ORD-17438574']
   });
   "
   ```
3. Synkronisera:
   ```bash
   curl -X POST http://localhost:3000/api/sync-order-status \
     -H "Content-Type: application/json" \
     -d '{"order_number": "ORD-17438574"}'
   ```
4. Tracking-sidan uppdateras automatiskt inom 10 sekunder

## Felsökning

### Problem: Tracking uppdateras inte efter SQL-uppdatering

**Lösning:** Du måste manuellt anropa sync API:et efter SQL-uppdateringar:

```bash
curl -X POST http://localhost:3000/api/sync-order-status \
  -H "Content-Type: application/json" \
  -d '{"order_number": "ORD-17438574"}'
```

### Problem: "CHECK constraint failed" fel

**Orsak:** Du försöker använda ett statusvärde som inte är tillåtet.

**Tillåtna värden:** `pending`, `processing`, `shipped`, `delivered`, `cancelled`, `returned`

**Inte tillåtna:** `confirmed`, `packing`, `transport` (dessa är tracking-kolumner, inte statusvärden)

### Problem: Tracking-sidan visar gammal data

**Lösning:** 
1. Kontrollera att sync API:et har anropats
2. Vänta 10 sekunder för automatisk uppdatering
3. Ladda om sidan manuellt

## Best Practices

1. **Använd alltid API:et** för statusuppdateringar när det är möjligt
2. **Synkronisera efter SQL-uppdateringar** om du måste uppdatera direkt i databasen
3. **Använd korrekta statusvärden** - kontrollera listan ovan
4. **Testa i utvecklingsmiljö** innan du uppdaterar produktionsdata
5. **Kör sync-script** efter bulk-uppdateringar eller migrationer

## Framtida förbättringar

- [ ] Automatisk synkronisering via database triggers
- [ ] Webhook-notifieringar vid statusändringar
- [ ] Email-notifieringar till kunder
- [ ] Admin-gränssnitt för statushantering
- [ ] Historik över alla statusändringar
- [ ] Integration med fraktbolag för automatisk uppdatering
