# Orderstatus Steg-för-Steg System

## Översikt

Leveransstatusen följer en **strikt steg-för-steg ordning** där varje status representerar ett specifikt steg i leveransprocessen. Systemet förhindrar att steg hoppas över eller att flera statusar visas samtidigt.

## Statusordning

Orderstatus följer denna fasta ordning:

```
confirmed → packing → transport → delivered
```

### Status Beskrivningar

1. **confirmed** (Bekräftad)
   - Order har mottagits och bekräftats
   - Första steget i processen
   - Sätts automatiskt när order skapas

2. **packing** (Packas)
   - Produkterna packas i lagret
   - Kan endast sättas om `confirmed` är aktivt
   - Föregående steg: confirmed

3. **transport** (Transport)
   - Paketet är på väg till kunden
   - Kan endast sättas om `confirmed` och `packing` är aktiva
   - Föregående steg: confirmed, packing

4. **delivered** (Levererad)
   - Paketet har levererats till kunden
   - Slutsteg i processen
   - Kan endast sättas om alla tidigare steg är aktiva
   - Föregående steg: confirmed, packing, transport

## Teknisk Implementation

### Database Schema

Tabellen `order_tracking` innehåller följande kolumner för varje steg:

```sql
confirmed TINYINT(1)      -- 0 eller 1
confirmed_date DATETIME   -- Tidsstämpel när steget aktiverades
packing TINYINT(1)        -- 0 eller 1
packing_date DATETIME     -- Tidsstämpel när steget aktiverades
transport TINYINT(1)      -- 0 eller 1
transport_date DATETIME   -- Tidsstämpel när steget aktiverades
delivered TINYINT(1)      -- 0 eller 1
delivered_date DATETIME   -- Tidsstämpel när steget aktiverades
```

### Status Mappning

Varje status i `orders.status` mappas till specifika värden i `order_tracking`:

| orders.status | confirmed | packing | transport | delivered |
|--------------|-----------|---------|-----------|-----------|
| confirmed    | 1         | 0       | 0         | 0         |
| packing      | 1         | 1       | 0         | 0         |
| transport    | 1         | 1       | 1         | 0         |
| delivered    | 1         | 1       | 1         | 1         |

### Viktiga Regler

1. **Steg-för-steg progression**: När en status uppdateras, sätts endast det steget och alla tidigare steg
2. **Framtida steg nollställs**: Steg som kommer efter den aktuella statusen sätts alltid till 0
3. **Datum bevaras**: Om ett steg redan har ett datum, behålls det när man går tillbaka
4. **Nya datum sätts**: När ett steg aktiveras för första gången, sätts datum till aktuell tid

## API Endpoints

### Uppdatera Order Status

**Endpoint**: `PUT /api/order-tracking/[id]`

**Request Body**:
```json
{
  "status": "packing",
  "order_number": "ORD-12345",
  "products": "Product details..."
}
```

**Giltiga status värden**:
- `confirmed`
- `packing`
- `transport`
- `delivered`

**Response**:
```json
{
  "success": true,
  "message": "Order status uppdaterad till: packing",
  "tracking": {
    "id": "track_...",
    "order_id": "...",
    "confirmed": 1,
    "confirmed_date": "2024-01-15T10:00:00Z",
    "packing": 1,
    "packing_date": "2024-01-15T11:00:00Z",
    "transport": 0,
    "transport_date": null,
    "delivered": 0,
    "delivered_date": null
  }
}
```

### Synkronisera Order Status

**Endpoint**: `POST /api/sync-order-status`

**Request Body**:
```json
{
  "order_id": "order_123",
  "order_number": "ORD-12345"
}
```

Detta endpoint läser `orders.status` och synkroniserar den till `order_tracking` enligt mappningen ovan.

## Frontend Visning

### Tracking Page (`/spara-order/[id]`)

Tracking-sidan visar statusen visuellt med:

1. **Progress Tracker**: Visuell representation av alla steg
   - Aktiva steg: Orange färg med checkmark
   - Aktuellt steg: Orange border med "In Progress" badge
   - Framtida steg: Grå färg

2. **Order History**: Lista över genomförda steg med datum och tid

3. **Status Badge**: Visar aktuell status i header

### Beställningssida (`/mina-sidor/bestallningar`)

Visar orderstatus med färgkodade badges:
- **Bekräftad** (confirmed): Blå
- **Packas** (packing): Lila
- **Transport** (transport): Orange
- **Levererad** (delivered): Grön

## Exempel på Användning

### Scenario 1: Normal Progression

```typescript
// 1. Order skapas (automatiskt confirmed)
POST /api/orders
// Status: confirmed

// 2. Order börjar packas
PUT /api/order-tracking/[id]
{ "status": "packing" }
// Status: packing (confirmed=1, packing=1, transport=0, delivered=0)

// 3. Order skickas
PUT /api/order-tracking/[id]
{ "status": "transport" }
// Status: transport (confirmed=1, packing=1, transport=1, delivered=0)

// 4. Order levereras
PUT /api/order-tracking/[id]
{ "status": "delivered" }
// Status: delivered (confirmed=1, packing=1, transport=1, delivered=1)
```

### Scenario 2: Gå Tillbaka i Status

```typescript
// Order är i transport
// Status: transport (confirmed=1, packing=1, transport=1, delivered=0)

// Gå tillbaka till packing
PUT /api/order-tracking/[id]
{ "status": "packing" }
// Status: packing (confirmed=1, packing=1, transport=0, delivered=0)
// Notera: transport och delivered nollställs
```

## Testning

Kör testskriptet för att verifiera att steg-för-steg logiken fungerar:

```bash
npx tsx scripts/test-order-status-progression.ts
```

Testet verifierar:
- ✅ Initial status är confirmed
- ✅ Progression till packing sätter confirmed=1, packing=1
- ✅ Progression till transport sätter confirmed=1, packing=1, transport=1
- ✅ Progression till delivered sätter alla steg till 1
- ✅ Gå tillbaka nollställer framtida steg
- ✅ Datum sätts korrekt för aktiva steg
- ✅ Datum nollställs för inaktiva steg

## Felsökning

### Problem: Flera statusar visas samtidigt

**Orsak**: Gamla data eller manuell databasändring

**Lösning**: Kör sync-order-status för att återställa korrekt mappning:
```bash
curl -X POST http://localhost:3000/api/sync-order-status \
  -H "Content-Type: application/json" \
  -d '{"order_id": "order_123"}'
```

### Problem: Steg hoppas över

**Orsak**: Direkt databasändring eller gammal API-version

**Lösning**: Använd alltid API:et för att uppdatera status. API:et säkerställer att alla tidigare steg är aktiva.

### Problem: Datum saknas för aktivt steg

**Orsak**: Manuell databasändring

**Lösning**: Uppdatera status via API:et så sätts datum automatiskt:
```bash
curl -X PUT http://localhost:3000/api/order-tracking/[id] \
  -H "Content-Type: application/json" \
  -d '{"status": "packing"}'
```

## Säkerhet och Validering

1. **Status Validering**: API:et validerar att endast giltiga statusvärden accepteras
2. **Steg-för-steg Enforcement**: API:et säkerställer att alla tidigare steg är aktiva
3. **Datum Integritet**: Datum sätts automatiskt och kan inte manipuleras direkt
4. **Atomära Uppdateringar**: Alla ändringar görs i en transaktion

## Framtida Förbättringar

- [ ] Lägg till notifikationer när status ändras
- [ ] Implementera automatisk status-progression baserat på tid
- [ ] Lägg till möjlighet att lägga till kommentarer per steg
- [ ] Integrera med externa tracking-system (PostNord, DHL, etc.)
- [ ] Lägg till admin-gränssnitt för manuell statushantering
