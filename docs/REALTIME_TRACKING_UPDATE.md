# Realtids Tracking-uppdatering

## Översikt

Tracking-sidan (`/spara-order/[id]`) uppdateras **automatiskt var 5:e sekund** från databasen utan att användaren behöver ladda om sidan. Detta ger en sömlös realtidsupplevelse där statusändringar visas omedelbart.

## Hur det fungerar

### 1. Automatisk Polling

Sidan använder en `setInterval` som hämtar tracking-data från API:et var 5:e sekund:

```typescript
useEffect(() => {
  const fetchTracking = async (isAutoRefresh = false) => {
    // Hämta data från API med cache-busting
    const response = await fetch(`/api/order-tracking/${orderId}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    });
    // Uppdatera state med ny data
  };

  // Initial fetch
  fetchTracking(false);
  
  // Uppdatera var 5:e sekund
  const interval = setInterval(() => fetchTracking(true), 5000);
  return () => clearInterval(interval);
}, [orderId]);
```

### 2. Statusändring-detektion

När ny data hämtas, jämförs den med tidigare data för att upptäcka ändringar:

```typescript
const currentStep = getCurrentStepFromTracking(data.tracking);
const oldStep = getCurrentStepFromTracking(tracking);

if (currentStep !== oldStep) {
  setHasNewUpdate(true); // Visa "Status uppdaterad" badge
  setTimeout(() => setHasNewUpdate(false), 5000); // Dölj efter 5 sek
}
```

### 3. Visuell Feedback

Användaren får flera visuella indikatorer:

- **Live-indikator**: Grön pulserande prick som visar att sidan är aktiv
- **"Status uppdaterad" badge**: Visas i 5 sekunder när status ändras
- **Uppdateringsindikator**: Orange pulserande prick under uppdatering
- **Tidsstämpel**: Visar senaste uppdateringstid
- **Manuell uppdateringsknapp**: Användaren kan tvinga en omedelbar uppdatering

## Funktioner

### Automatisk Uppdatering

- ✅ Uppdateras var 5:e sekund
- ✅ Ingen manuell siduppdatering behövs
- ✅ Cache-busting för att alltid få senaste data
- ✅ Fortsätter uppdatera även vid fel (behåller gammal data)

### Statusändring-notifikation

- ✅ "Status uppdaterad" badge visas vid ändringar
- ✅ Badge försvinner automatiskt efter 5 sekunder
- ✅ Animerad för att dra uppmärksamhet

### Live-indikator

- ✅ Grön pulserande prick = Aktiv och uppdaterad
- ✅ Orange pulserande prick = Uppdaterar just nu
- ✅ "Live" text för tydlighet

### Manuell Uppdatering

- ✅ Uppdateringsknapp i headern
- ✅ Spinner-animation under uppdatering
- ✅ Disabled under pågående uppdatering

## Användning

### För Användare

1. **Öppna tracking-sidan**
   ```
   https://yoursite.com/spara-order/[ORDER_ID]
   ```

2. **Observera live-indikatorn**
   - Grön prick = Sidan är aktiv och uppdateras automatiskt
   - Orange prick = Uppdaterar just nu

3. **Vänta på statusändringar**
   - När status ändras i systemet, uppdateras sidan automatiskt inom 5 sekunder
   - "Status uppdaterad" badge visas för att bekräfta ändringen

4. **Manuell uppdatering (valfritt)**
   - Klicka på uppdateringsknappen för omedelbar uppdatering
   - Användbart om du vet att status just ändrats

### För Administratörer

#### Uppdatera Status via Script

```bash
# Uppdatera till packing
npx tsx scripts/update-order-status.ts ORDER_ID packing

# Uppdatera till transport
npx tsx scripts/update-order-status.ts ORDER_ID transport

# Uppdatera till delivered
npx tsx scripts/update-order-status.ts ORDER_ID delivered
```

#### Visa Aktuell Status

```bash
npx tsx scripts/view-order-tracking.ts ORDER_ID
```

#### Demo av Realtidsuppdatering

```bash
# Kör demo som visar hur realtidsuppdateringen fungerar
npx tsx scripts/demo-realtime-tracking.ts
```

Detta skript:
1. Skapar en testorder
2. Ger dig en tracking-länk
3. Uppdaterar status steg för steg
4. Visar hur sidan uppdateras automatiskt

## Teknisk Implementation

### API Endpoint

**GET** `/api/order-tracking/[id]`

Returnerar aktuell tracking-data från databasen:

```json
{
  "success": true,
  "tracking": {
    "id": "track_...",
    "order_id": "order_123",
    "confirmed": 1,
    "confirmed_date": "2024-01-15T10:00:00Z",
    "packing": 1,
    "packing_date": "2024-01-15T11:00:00Z",
    "transport": 0,
    "transport_date": null,
    "delivered": 0,
    "delivered_date": null,
    "updated_at": "2024-01-15T11:00:00Z"
  }
}
```

### Cache-busting

För att säkerställa att vi alltid får senaste data:

```typescript
fetch(url, {
  cache: 'no-store',
  headers: { 'Cache-Control': 'no-cache' }
})
```

### State Management

```typescript
const [tracking, setTracking] = useState<TrackingData | null>(null);
const [isRefreshing, setIsRefreshing] = useState(false);
const [hasNewUpdate, setHasNewUpdate] = useState(false);
const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
const [previousStatus, setPreviousStatus] = useState<number>(0);
```

## Prestanda

### Optimeringar

1. **Effektiv polling**: Endast 5 sekunders intervall (balans mellan realtid och serverlast)
2. **Cache-busting**: Säkerställer färsk data utan onödig cache
3. **Conditional updates**: UI uppdateras endast vid faktiska ändringar
4. **Cleanup**: Interval rensas när komponenten unmountas

### Serverlast

- **Requests per minut**: 12 (var 5:e sekund)
- **Requests per timme**: 720
- **Databas-queries**: 1 per request (enkel SELECT)

För en sida med 100 samtidiga användare:
- **Total requests/min**: 1,200
- **Total requests/timme**: 72,000

Detta är hanterbart för de flesta servrar och databaser.

## Felsökning

### Problem: Sidan uppdateras inte

**Möjliga orsaker:**
1. JavaScript är inaktiverat
2. Nätverksproblem
3. API:et svarar inte

**Lösning:**
- Kontrollera browser console för fel
- Testa manuell uppdateringsknapp
- Verifiera att API:et fungerar: `curl http://localhost:3000/api/order-tracking/[ID]`

### Problem: "Status uppdaterad" visas inte

**Möjliga orsaker:**
1. Status ändrades inte faktiskt
2. Ändringen skedde för länge sedan (badge visas i 5 sek)

**Lösning:**
- Verifiera status i databasen
- Använd `view-order-tracking.ts` för att se aktuell status

### Problem: Live-indikatorn är röd/grå

**Möjliga orsaker:**
1. API-fel
2. Nätverksproblem
3. Order finns inte

**Lösning:**
- Kontrollera browser console
- Verifiera order-ID
- Testa API-endpoint manuellt

## Framtida Förbättringar

- [ ] WebSocket för instant uppdateringar (istället för polling)
- [ ] Push-notifikationer vid statusändringar
- [ ] Offline-support med service workers
- [ ] Optimistiska uppdateringar
- [ ] Batch-requests för flera ordrar
- [ ] Server-Sent Events (SSE) som alternativ till polling

## Exempel

### Scenario 1: Normal Användning

1. Kund öppnar tracking-sidan
2. Ser "Bekräftad" status
3. Admin uppdaterar till "Packas" i systemet
4. Inom 5 sekunder ser kunden "Status uppdaterad" badge
5. Timeline uppdateras automatiskt till "Packas"

### Scenario 2: Snabb Progression

1. Kund öppnar tracking-sidan
2. Ser "Packas" status
3. Admin uppdaterar till "Transport"
4. Inom 5 sekunder uppdateras sidan
5. Admin uppdaterar till "Levererad"
6. Inom ytterligare 5 sekunder uppdateras sidan igen

### Scenario 3: Manuell Uppdatering

1. Kund vet att paketet just levererats
2. Klickar på uppdateringsknappen
3. Ser spinner-animation
4. Status uppdateras omedelbart till "Levererad"

## Relaterad Dokumentation

- [ORDER_STATUS_PROGRESSION.md](./ORDER_STATUS_PROGRESSION.md) - Steg-för-steg logik
- [ORDER_TRACKING_SYSTEM.md](./ORDER_TRACKING_SYSTEM.md) - Tracking-systemet
- [ORDER_STATUS_FIX_SUMMARY.md](./ORDER_STATUS_FIX_SUMMARY.md) - Senaste ändringar

## Scripts

| Script | Beskrivning |
|--------|-------------|
| `update-order-status.ts` | Uppdatera orderstatus |
| `view-order-tracking.ts` | Visa aktuell tracking-status |
| `demo-realtime-tracking.ts` | Demo av realtidsuppdatering |
| `test-order-status-progression.ts` | Testa steg-för-steg logik |

---

**Uppdaterad:** 2024-01-15  
**Version:** 1.0.0  
**Status:** ✅ Implementerad och testad
