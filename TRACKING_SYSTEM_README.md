# 📦 Order Tracking System - Komplett Guide

## Översikt

Ett professionellt order tracking-system med **realtidsuppdatering** och **steg-för-steg statusprogression**.

### Huvudfunktioner

✅ **Realtidsuppdatering** - Sidan uppdateras automatiskt var 5:e sekund  
✅ **Steg-för-steg logik** - Status följer strikt ordning utan att hoppa över steg  
✅ **Visuell feedback** - Live-indikator och "Status uppdaterad" badge  
✅ **Manuell uppdatering** - Användaren kan tvinga omedelbar uppdatering  
✅ **Mobilanpassad** - Responsiv design som fungerar på alla enheter  
✅ **Professionell design** - Inspirerad av moderna e-handelsplattformar  

## Snabbstart

### För Användare

1. **Visa dina beställningar**
   ```
   https://yoursite.com/mina-sidor/bestallningar
   ```

2. **Spåra en order**
   - Klicka på "Spåra Order" för önskad beställning
   - Sidan uppdateras automatiskt var 5:e sekund
   - Observera live-indikatorn (grön pulserande prick)

### För Administratörer

#### Uppdatera Orderstatus

```bash
# Sätt status till packing
npx tsx scripts/update-order-status.ts ORDER_ID packing

# Sätt status till transport
npx tsx scripts/update-order-status.ts ORDER_ID transport

# Sätt status till delivered
npx tsx scripts/update-order-status.ts ORDER_ID delivered
```

#### Visa Tracking-status

```bash
npx tsx scripts/view-order-tracking.ts ORDER_ID
```

#### Demo av Realtidsuppdatering

```bash
npx tsx scripts/demo-realtime-tracking.ts
```

## Status Ordning

```
confirmed → packing → transport → delivered
```

### Status Beskrivningar

| Status | Beskrivning | Steg |
|--------|-------------|------|
| **confirmed** | Order bekräftad och registrerad | 1/4 |
| **packing** | Produkterna packas i lagret | 2/4 |
| **transport** | Paketet är på väg till kunden | 3/4 |
| **delivered** | Paketet har levererats | 4/4 |

## Realtidsuppdatering

### Hur det fungerar

1. **Automatisk polling**: Sidan hämtar data var 5:e sekund
2. **Statusändring-detektion**: Jämför ny data med gammal
3. **Visuell feedback**: Visar "Status uppdaterad" badge vid ändringar
4. **Live-indikator**: Grön prick = aktiv, Orange prick = uppdaterar

### Funktioner

- ✅ Uppdateras automatiskt var 5:e sekund
- ✅ Cache-busting för färsk data
- ✅ "Status uppdaterad" badge vid ändringar
- ✅ Live-indikator med pulserande animation
- ✅ Manuell uppdateringsknapp
- ✅ Tidsstämpel för senaste uppdatering

## Steg-för-Steg Logik

### Regler

1. ✅ Status följer ordningen: confirmed → packing → transport → delivered
2. ✅ Alla tidigare steg sätts automatiskt till 1
3. ✅ Alla framtida steg sätts automatiskt till 0
4. ✅ Datum sätts automatiskt för nya steg
5. ✅ Befintliga datum bevaras

### Status Mappning

| Status | confirmed | packing | transport | delivered |
|--------|-----------|---------|-----------|-----------|
| confirmed | ✅ 1 | ❌ 0 | ❌ 0 | ❌ 0 |
| packing | ✅ 1 | ✅ 1 | ❌ 0 | ❌ 0 |
| transport | ✅ 1 | ✅ 1 | ✅ 1 | ❌ 0 |
| delivered | ✅ 1 | ✅ 1 | ✅ 1 | ✅ 1 |

## API Endpoints

### GET /api/order-tracking/[id]

Hämta tracking-information för en order.

```bash
curl http://localhost:3000/api/order-tracking/ORDER_ID
```

### PUT /api/order-tracking/[id]

Uppdatera orderstatus.

```bash
curl -X PUT http://localhost:3000/api/order-tracking/ORDER_ID \
  -H "Content-Type: application/json" \
  -d '{"status": "packing"}'
```

**Giltiga värden:** `confirmed`, `packing`, `transport`, `delivered`

### POST /api/sync-order-status

Synkronisera från `orders.status` till `order_tracking`.

```bash
curl -X POST http://localhost:3000/api/sync-order-status \
  -H "Content-Type: application/json" \
  -d '{"order_id": "ORDER_ID"}'
```

## Scripts

### update-order-status.ts

Uppdatera orderstatus via API.

```bash
npx tsx scripts/update-order-status.ts ORDER_ID STATUS

# Exempel
npx tsx scripts/update-order-status.ts order_123 packing
npx tsx scripts/update-order-status.ts order_123 transport
npx tsx scripts/update-order-status.ts order_123 delivered
```

### view-order-tracking.ts

Visa detaljerad tracking-information.

```bash
npx tsx scripts/view-order-tracking.ts ORDER_ID
```

Visar:
- Order information
- Aktuell status
- Status timeline med datum
- Progress bar
- Länkar till tracking-sida

### demo-realtime-tracking.ts

Demonstrera realtidsuppdatering.

```bash
npx tsx scripts/demo-realtime-tracking.ts
```

Detta skript:
1. Skapar en testorder
2. Ger dig en tracking-länk
3. Uppdaterar status steg för steg med 8 sekunders mellanrum
4. Visar hur sidan uppdateras automatiskt

### test-order-status-progression.ts

Testa steg-för-steg logiken.

```bash
npx tsx scripts/test-order-status-progression.ts
```

Verifierar:
- ✅ Initial status är confirmed
- ✅ Progression till packing sätter rätt värden
- ✅ Progression till transport sätter rätt värden
- ✅ Progression till delivered sätter alla steg
- ✅ Gå tillbaka nollställer framtida steg

## Användningsexempel

### Scenario 1: Normal Progression

```bash
# 1. Order skapas (automatiskt confirmed)
# Status: confirmed (1,0,0,0)

# 2. Börja packa
npx tsx scripts/update-order-status.ts order_123 packing
# Status: packing (1,1,0,0)
# Tracking-sidan uppdateras inom 5 sekunder

# 3. Skicka
npx tsx scripts/update-order-status.ts order_123 transport
# Status: transport (1,1,1,0)
# Tracking-sidan uppdateras inom 5 sekunder

# 4. Leverera
npx tsx scripts/update-order-status.ts order_123 delivered
# Status: delivered (1,1,1,1)
# Tracking-sidan uppdateras inom 5 sekunder
```

### Scenario 2: Visa Status

```bash
# Visa aktuell status
npx tsx scripts/view-order-tracking.ts order_123

# Output:
# ═══════════════════════════════════════════════════════
#                   ORDER TRACKING                       
# ═══════════════════════════════════════════════════════
# 
# 📋 Order Information:
#    Order ID:       order_123
#    Order Number:   ORD-2024-001
# 
# 🎯 Aktuell Status: Packas (Steg 2/4)
# 
# 📊 Status Timeline:
# ───────────────────────────────────────────────────────
# ✅ 1. Bekräftad
#    2024-01-15 10:00:00
# 
# ✅ 2. Packas
#    2024-01-15 11:00:00
# 
# ⏳ 3. Under Transport
#    Väntar på transport
# 
# ⭕ 4. Levererad
#    Inte tillgänglig än
```

### Scenario 3: Demo

```bash
# Kör demo
npx tsx scripts/demo-realtime-tracking.ts

# Följ instruktionerna:
# 1. Öppna tracking-länken i webbläsaren
# 2. Observera hur sidan uppdateras automatiskt
# 3. Se "Status uppdaterad" badge vid ändringar
# 4. Notera live-indikatorn
```

## Dokumentation

### Detaljerad Dokumentation

- **[ORDER_STATUS_PROGRESSION.md](./docs/ORDER_STATUS_PROGRESSION.md)**  
  Komplett guide om steg-för-steg systemet

- **[REALTIME_TRACKING_UPDATE.md](./docs/REALTIME_TRACKING_UPDATE.md)**  
  Hur realtidsuppdateringen fungerar

- **[ORDER_TRACKING_SYSTEM.md](./docs/ORDER_TRACKING_SYSTEM.md)**  
  Översikt över tracking-systemet

- **[ORDER_STATUS_FIX_SUMMARY.md](./docs/ORDER_STATUS_FIX_SUMMARY.md)**  
  Sammanfattning av senaste ändringar

### Snabbreferens

- **[ORDER_STATUS_QUICK_REFERENCE.md](./ORDER_STATUS_QUICK_REFERENCE.md)**  
  Snabb referensguide för daglig användning

## Felsökning

### Problem: Sidan uppdateras inte

**Lösning:**
1. Kontrollera browser console för fel
2. Testa manuell uppdateringsknapp
3. Verifiera att API:et fungerar:
   ```bash
   curl http://localhost:3000/api/order-tracking/ORDER_ID
   ```

### Problem: Flera statusar samtidigt

**Lösning:**
```bash
# Synkronisera från orders.status
curl -X POST http://localhost:3000/api/sync-order-status \
  -H "Content-Type: application/json" \
  -d '{"order_id": "ORDER_ID"}'
```

### Problem: Steg hoppas över

**Lösning:**
Använd alltid API:et för att uppdatera status. API:et säkerställer att alla tidigare steg är aktiva.

## Teknisk Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Turso (LibSQL)
- **Realtid**: Client-side polling (5 sekunder)
- **State Management**: React useState/useEffect

## Prestanda

- **Polling-intervall**: 5 sekunder
- **Requests per minut**: 12
- **Requests per timme**: 720
- **Cache-strategi**: No-cache för färsk data

## Säkerhet

- ✅ Order-ID validering
- ✅ Status validering
- ✅ Steg-för-steg enforcement
- ✅ SQL injection-skydd
- ✅ CORS-konfiguration

## Framtida Förbättringar

- [ ] WebSocket för instant uppdateringar
- [ ] Push-notifikationer
- [ ] Email-notifikationer vid statusändringar
- [ ] SMS-notifikationer
- [ ] Integration med fraktbolag (PostNord, DHL, etc.)
- [ ] Karta med paketets position
- [ ] Leveransfoto
- [ ] Signatur vid leverans

## Support

För frågor eller problem:
1. Läs dokumentationen ovan
2. Kör demo-skriptet för att se hur det fungerar
3. Kontakta utvecklingsteamet

---

**Version:** 1.0.0  
**Status:** ✅ Produktionsklar  
**Senast uppdaterad:** 2024-01-15
