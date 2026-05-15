# Order Tracking System

## Översikt

Ett professionellt tracking-system inspirerat av Temu som visar live-status för ordrar direkt från databasen.

## Funktioner

### 🎯 Huvudfunktioner

- **Live Tracking Timeline** - Visuell tidslinje som uppdateras automatiskt var 30:e sekund
- **4 Tracking-statusar** - Bekräftad → Packas → Transport → Levererad
- **Databasdriven** - All data hämtas direkt från `order_tracking` tabellen
- **Professionell Design** - Inspirerad av Temu med gradients och animationer
- **Mobilanpassad** - Responsiv design som fungerar på alla enheter

### 📊 Tracking-statusar

Systemet följer dessa statuskolumner i databasen:

1. **confirmed** - Order bekräftad
   - Kolumner: `confirmed`, `confirmed_date`
   - Beskrivning: "Din beställning har mottagits och bekräftats"

2. **packing** - Packas
   - Kolumner: `packing`, `packing_date`
   - Beskrivning: "Din order packas för leverans"

3. **transport** - Under Transport
   - Kolumner: `transport`, `transport_date`
   - Beskrivning: "Paketet är på väg till dig"

4. **delivered** - Levererad
   - Kolumner: `delivered`, `delivered_date`
   - Beskrivning: "Paketet har levererats"

## Databasstruktur

### order_tracking Tabell

```sql
CREATE TABLE order_tracking (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE,
  order_number TEXT,
  
  -- Status 1: Bekräftad
  confirmed INTEGER DEFAULT 0,
  confirmed_date TEXT,
  
  -- Status 2: Packas
  packing INTEGER DEFAULT 0,
  packing_date TEXT,
  
  -- Status 3: Transport
  transport INTEGER DEFAULT 0,
  transport_date TEXT,
  
  -- Status 4: Levererad
  delivered INTEGER DEFAULT 0,
  delivered_date TEXT,
  
  -- Metadata
  products TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

## Användning

### För Användare

1. **Visa Tracking**
   - Gå till "Mina Beställningar" (`/mina-sidor/bestallningar`)
   - Klicka på "Spåra Order" för önskad beställning
   - Se live-tracking på `/spara-order/[order_id]`

2. **Tracking-sidan visar**
   - Visuell tidslinje med alla statusar
   - Datum och tid för varje slutförd status
   - Produktinformation
   - Hjälplänkar till kundservice

### För Administratörer

#### Uppdatera Tracking via API

**Rekommenderad metod** - Använd API:et för att säkerställa steg-för-steg logik:

```bash
# Bekräfta order (initial status)
curl -X PUT http://localhost:3000/api/order-tracking/order_123 \
  -H "Content-Type: application/json" \
  -d '{"status": "confirmed"}'

# Sätt till packas
curl -X PUT http://localhost:3000/api/order-tracking/order_123 \
  -H "Content-Type: application/json" \
  -d '{"status": "packing"}'

# Sätt till transport
curl -X PUT http://localhost:3000/api/order-tracking/order_123 \
  -H "Content-Type: application/json" \
  -d '{"status": "transport"}'

# Markera som levererad
curl -X PUT http://localhost:3000/api/order-tracking/order_123 \
  -H "Content-Type: application/json" \
  -d '{"status": "delivered"}'
```

#### Synkronisera från orders.status

Om `orders.status` har uppdaterats direkt, synkronisera till tracking:

```bash
curl -X POST http://localhost:3000/api/sync-order-status \
  -H "Content-Type: application/json" \
  -d '{"order_id": "order_123"}'
```

#### Uppdatera via SQL (Ej rekommenderat)

**VARNING**: Direkt SQL-uppdateringar kan bryta steg-för-steg logiken. Använd API:et istället.

Om du måste uppdatera direkt i databasen, följ denna mappning:

```sql
-- Status: confirmed (endast confirmed aktiv)
UPDATE order_tracking 
SET confirmed = 1, 
    confirmed_date = datetime('now'),
    packing = 0,
    packing_date = NULL,
    transport = 0,
    transport_date = NULL,
    delivered = 0,
    delivered_date = NULL,
    updated_at = datetime('now')
WHERE order_id = 'order_123';

-- Status: packing (confirmed + packing aktiva)
UPDATE order_tracking 
SET confirmed = 1,
    confirmed_date = COALESCE(confirmed_date, datetime('now')),
    packing = 1,
    packing_date = datetime('now'),
    transport = 0,
    transport_date = NULL,
    delivered = 0,
    delivered_date = NULL,
    updated_at = datetime('now')
WHERE order_id = 'order_123';

-- Status: transport (confirmed + packing + transport aktiva)
UPDATE order_tracking 
SET confirmed = 1,
    confirmed_date = COALESCE(confirmed_date, datetime('now')),
    packing = 1,
    packing_date = COALESCE(packing_date, datetime('now')),
    transport = 1,
    transport_date = datetime('now'),
    delivered = 0,
    delivered_date = NULL,
    updated_at = datetime('now')
WHERE order_id = 'order_123';

-- Status: delivered (alla steg aktiva)
UPDATE order_tracking 
SET confirmed = 1,
    confirmed_date = COALESCE(confirmed_date, datetime('now')),
    packing = 1,
    packing_date = COALESCE(packing_date, datetime('now')),
    transport = 1,
    transport_date = COALESCE(transport_date, datetime('now')),
    delivered = 1,
    delivered_date = datetime('now'),
    updated_at = datetime('now')
WHERE order_id = 'order_123';

-- Synkronisera orders.status
UPDATE orders 
SET status = 'packing', 
    updated_at = datetime('now')
WHERE id = 'order_123';
```

## API Endpoints

### GET /api/order-tracking/[id]

Hämta tracking-information för en order.

**Response:**
```json
{
  "success": true,
  "tracking": {
    "id": "track_order_123_1234567890",
    "order_id": "order_123",
    "order_number": "ORD-2024-001",
    "confirmed": 1,
    "confirmed_date": "2024-01-10T10:00:00Z",
    "packing": 1,
    "packing_date": "2024-01-11T14:30:00Z",
    "transport": 1,
    "transport_date": "2024-01-12T08:00:00Z",
    "delivered": 0,
    "delivered_date": null,
    "products": "2x T-shirt, 1x Jeans",
    "created_at": "2024-01-10T10:00:00Z",
    "updated_at": "2024-01-12T08:00:00Z"
  }
}
```

### PUT /api/order-tracking/[id]

Uppdatera tracking-information. API:et säkerställer steg-för-steg logik.

**Request Body:**
```json
{
  "status": "packing",
  "order_number": "ORD-2024-001",
  "products": "2x T-shirt, 1x Jeans"
}
```

**Giltiga status-värden:**
- `confirmed` - Order bekräftad
- `packing` - Packas (sätter automatiskt confirmed=1)
- `transport` - Transport (sätter automatiskt confirmed=1, packing=1)
- `delivered` - Levererad (sätter automatiskt alla tidigare steg=1)

**Response:**
```json
{
  "success": true,
  "message": "Order status uppdaterad till: packing",
  "tracking": {
    "id": "track_order_123_1234567890",
    "order_id": "order_123",
    "order_number": "ORD-2024-001",
    "confirmed": 1,
    "confirmed_date": "2024-01-10T10:00:00Z",
    "packing": 1,
    "packing_date": "2024-01-11T14:30:00Z",
    "transport": 0,
    "transport_date": null,
    "delivered": 0,
    "delivered_date": null,
    "products": "2x T-shirt, 1x Jeans",
    "created_at": "2024-01-10T10:00:00Z",
    "updated_at": "2024-01-11T14:30:00Z"
  }
}
```

### POST /api/sync-order-status

Synkronisera `orders.status` till `order_tracking` tabellen.

**Request Body:**
```json
{
  "order_id": "order_123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Orderstatus synkroniserad: packing",
  "order_status": "packing",
  "tracking": {
    "confirmed": 1,
    "packing": 1,
    "transport": 0,
    "delivered": 0
  }
}
```

## Design-detaljer

### Färgschema (Temu-inspirerat)

- **Primär gradient**: Orange (#f97316) → Pink (#ec4899)
- **Bakgrund**: Gradient från orange-50 via white till pink-50
- **Aktiv status**: Orange/Pink gradient med shadow och scale
- **Slutförd status**: Grön (#10b981)
- **Väntande status**: Grå (#e5e7eb)

### Animationer

- **Live-indikator**: Pulserande grön prick
- **Progress bar**: Smooth transition med gradient
- **Aktiv status**: Pulse-animation
- **Hover-effekter**: Shadow och scale transitions

### Ikoner

- ✓ - Order Bekräftad
- 📦 - Packas
- 🚚 - Under Transport
- 🎉 - Levererad

## Automatisk Uppdatering

Tracking-sidan uppdateras automatiskt var 30:e sekund för att visa live-status utan att användaren behöver ladda om sidan.

```typescript
// Auto-refresh var 30:e sekund
useEffect(() => {
  const interval = setInterval(fetchTracking, 30000);
  return () => clearInterval(interval);
}, [orderId]);
```

## Integration med Order-systemet

Tracking-systemet är integrerat med huvudorder-systemet:

- När tracking uppdateras, uppdateras även `orders.status`
- **VIKTIGT**: Systemet följer strikt steg-för-steg logik
- Mapping:
  - `confirmed` → orders.status = 'confirmed'
  - `packing` → orders.status = 'packing'
  - `transport` → orders.status = 'transport'
  - `delivered` → orders.status = 'delivered'

### Steg-för-Steg Logik

Systemet säkerställer att:
1. ✅ Status följer ordningen: confirmed → packing → transport → delivered
2. ✅ Inga steg hoppas över
3. ✅ Endast ett steg är aktivt åt gången (plus alla tidigare steg)
4. ✅ Framtida steg nollställs när man går tillbaka

Se [ORDER_STATUS_PROGRESSION.md](./ORDER_STATUS_PROGRESSION.md) för detaljerad dokumentation.

## Filer

### Frontend
- `/app/spara-order/[id]/page.tsx` - Tracking-sidan

### Backend
- `/app/api/order-tracking/[id]/route.ts` - API för tracking

### Scripts
- `/scripts/update-tracking.ts` - Uppdatera tracking-status
- `/scripts/view-tracking.ts` - Visa tracking-status

### Database
- `/lib/migrations/003_create_order_tracking.sql` - Tabell-schema
- `/lib/migrations/004_add_order_status_trigger.sql` - Auto-sync triggers

## Framtida Förbättringar

- [ ] Email-notifikationer vid statusändringar
- [ ] SMS-notifikationer
- [ ] Tracking-nummer från fraktbolag
- [ ] Karta med paketets position
- [ ] Uppskattad leveranstid
- [ ] Leveransfoto
- [ ] Signatur vid leverans
- [ ] Push-notifikationer

## Support

För frågor eller problem, kontakta utvecklingsteamet eller se dokumentationen i `/docs`.
