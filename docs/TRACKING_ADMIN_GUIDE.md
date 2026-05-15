# Order Tracking - Admin Guide

## Översikt

Detta är en guide för administratörer som behöver hantera order tracking-systemet.

## Tillgängliga Scripts

### 1. Kontrollera Tracking-status

Visa alla orders och deras tracking-information:

```bash
npx tsx scripts/check-tracking.ts
```

**Output:**
```
=== Checking Order Tracking Data ===

Found 4 tracking records:

Order ID: order_1778620011196_8giqupsm2
  Order Number: ORD-20011204
  Confirmed: 1 | Packing: 1 | Transport: 1 | Delivered: 0
  Created: 2026-05-12T21:06:53.023Z
  Updated: 2026-05-12T21:11:16.999Z
---
```

### 2. Uppdatera Tracking-status

Uppdatera en orders tracking-status:

```bash
npx tsx scripts/update-tracking-status.ts <order_id> <status>
```

**Status-alternativ:**
- `confirmed` - Order bekräftad
- `packing` - Order packas
- `transport` - Order under transport
- `delivered` - Order levererad

**Exempel:**

```bash
# Sätt order till "packing"
npx tsx scripts/update-tracking-status.ts order_1778620011196_8giqupsm2 packing

# Sätt order till "transport"
npx tsx scripts/update-tracking-status.ts order_1778620011196_8giqupsm2 transport

# Markera order som levererad
npx tsx scripts/update-tracking-status.ts order_1778620011196_8giqupsm2 delivered
```

**Output:**
```
=== Updating Order Tracking ===
Order ID: order_1778620011196_8giqupsm2
New Status: transport

Order Number: ORD-20011204
Current Order Status: confirmed

✅ Tracking updated successfully!

Updated Tracking Status:
  ✓ Confirmed: YES (2026-05-12 23:06:53)
  ✓ Packing: YES (2026-05-12 23:11:16)
  ✓ Transport: YES (2026-05-12 23:11:16)
  ○ Delivered: NO

🔗 View tracking: http://localhost:3000/spara-order/order_1778620011196_8giqupsm2
```

### 3. Skapa Saknade Tracking-poster

Om en order saknar tracking-information, kör:

```bash
npx tsx scripts/create-missing-tracking.ts
```

Detta script:
- Hittar alla orders utan tracking
- Skapar tracking-poster baserat på orderns nuvarande status
- Visar en sammanfattning av skapade poster

**Output:**
```
=== Creating Missing Tracking Records ===

Found 3 orders without tracking

Creating tracking for order: order_1778517438574_owdddwsgb
  Order Number: ORD-17438574
  Status: packing
  ✅ Tracking created: track_order_1778517438574_owdddwsgb_1778619827902
     Confirmed: YES
     Packing: YES
     Transport: NO
     Delivered: NO
---

✅ All missing tracking records created!
Total tracking records: 3
```

### 4. Testa Tracking-sidan

Simulera hur tracking-sidan fungerar:

```bash
npx tsx scripts/test-tracking-page.ts
```

Detta visar:
- Alla orders med tracking
- Tracking-URLs för varje order
- Simulerat API-svar

## Vanliga Uppgifter

### Bekräfta en Order

När en order har betalats och bekräftats:

```bash
npx tsx scripts/update-tracking-status.ts <order_id> confirmed
```

### Starta Packning

När ordern börjar packas:

```bash
npx tsx scripts/update-tracking-status.ts <order_id> packing
```

### Skicka Order

När ordern har skickats:

```bash
npx tsx scripts/update-tracking-status.ts <order_id> transport
```

### Markera som Levererad

När ordern har levererats:

```bash
npx tsx scripts/update-tracking-status.ts <order_id> delivered
```

## Tracking-status Progression

Tracking-statusar är **progressiva**, vilket betyder att när du sätter en högre status, sätts alla tidigare statusar automatiskt:

```
confirmed → packing → transport → delivered
```

**Exempel:**

Om du sätter status till `transport`:
- ✓ Confirmed (sätts automatiskt)
- ✓ Packing (sätts automatiskt)
- ✓ Transport (din valda status)
- ○ Delivered (väntar)

## Hitta Order ID

### Via Database

```bash
npx tsx scripts/check-tracking.ts
```

### Via Admin Panel

Gå till `/admin/orders` för att se alla orders och deras ID:n.

### Via API

```bash
curl http://localhost:3000/api/orders
```

## Tracking-URL Format

Tracking-sidan för en order finns på:

```
http://localhost:3000/spara-order/<order_id>
```

**Exempel:**
```
http://localhost:3000/spara-order/order_1778620011196_8giqupsm2
```

## Felsökning

### Problem: "Order Not Found"

**Orsak:** Ingen tracking-post finns för ordern.

**Lösning:**
```bash
npx tsx scripts/create-missing-tracking.ts
```

### Problem: Tracking visar fel status

**Orsak:** Tracking-status är inte synkroniserad med order-status.

**Lösning:**
```bash
# Uppdatera till korrekt status
npx tsx scripts/update-tracking-status.ts <order_id> <correct_status>
```

### Problem: Kan inte hitta order ID

**Lösning:**
```bash
# Lista alla orders
npx tsx scripts/check-tracking.ts
```

## API Endpoints

### Hämta Tracking

```bash
GET /api/order-tracking/<order_id>
```

**Exempel:**
```bash
curl http://localhost:3000/api/order-tracking/order_1778620011196_8giqupsm2
```

**Svar:**
```json
{
  "success": true,
  "tracking": {
    "id": "track_order_1778620011196_8giqupsm2_1778620013023",
    "order_id": "order_1778620011196_8giqupsm2",
    "order_number": "ORD-20011204",
    "confirmed": 1,
    "confirmed_date": "2026-05-12T21:06:53.023Z",
    "packing": 1,
    "packing_date": "2026-05-12T21:11:16.999Z",
    "transport": 1,
    "transport_date": "2026-05-12T21:11:16.999Z",
    "delivered": 0,
    "delivered_date": null
  }
}
```

### Uppdatera Tracking (via API)

```bash
PUT /api/order-tracking/<order_id>
```

**Request Body:**
```json
{
  "order_number": "ORD-20011204",
  "confirmed": {
    "completed": true,
    "date": "2026-05-12T21:06:53.023Z"
  },
  "packing": {
    "completed": true,
    "date": "2026-05-12T21:11:16.999Z"
  },
  "transport": {
    "completed": true,
    "date": "2026-05-12T21:11:16.999Z"
  },
  "delivered": {
    "completed": false,
    "date": null
  }
}
```

## Best Practices

### 1. Uppdatera Tracking Regelbundet

Uppdatera tracking-status så snart en order ändrar status i ert system.

### 2. Använd Scripts för Bulk-uppdateringar

Om du behöver uppdatera många orders, skapa ett custom script baserat på `update-tracking-status.ts`.

### 3. Verifiera Efter Uppdatering

Kör alltid `check-tracking.ts` efter bulk-uppdateringar för att verifiera att allt är korrekt.

### 4. Backup Innan Stora Ändringar

Gör en backup av databasen innan du gör stora ändringar:

```bash
# Backup database
cp .turso/libsql-databases/local.db .turso/libsql-databases/local.db.backup
```

## Automatisering

### Cron Job för Auto-uppdatering

Du kan skapa ett cron job som automatiskt uppdaterar tracking baserat på externa system:

```bash
# Exempel: Uppdatera tracking varje timme
0 * * * * cd /path/to/project && npx tsx scripts/sync-tracking-from-external.ts
```

### Webhook Integration

Integrera med fraktbolag för att automatiskt uppdatera tracking när paket scannas:

```typescript
// webhook-handler.ts
app.post('/webhook/shipment-update', async (req, res) => {
  const { orderId, status } = req.body;
  
  // Uppdatera tracking
  await updateTracking(orderId, status);
  
  res.json({ success: true });
});
```

## Support

För frågor eller problem, kontakta utvecklingsteamet eller se:
- `/docs/ORDER_TRACKING_SYSTEM.md` - Fullständig systemdokumentation
- `/docs/TRACKING_FIX_SUMMARY.md` - Fix-sammanfattning
