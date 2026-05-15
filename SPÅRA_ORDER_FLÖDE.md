# "Spåra Order"-flöde - Komplett Guide

## 🎯 Översikt

Detta dokument beskriver hela flödet från att användaren klickar på "Spåra Order"-knappen till att spårningssidan visar korrekt och uppdaterad leveransstatus.

## 🔄 Komplett Flöde

```
1. Användare loggar in
   ↓
2. Navigerar till /mina-sidor/bestallningar
   ↓
3. Beställningssidan hämtar orders från API
   GET /api/customers/{customerId}/orders
   ↓
4. Visar lista med orders och "Spåra Order"-knappar
   ↓
5. Användare klickar "Spåra Order"
   ↓
6. Navigerar till /spara-order/{orderId}
   ↓
7. Spårningssidan hämtar tracking-data
   GET /api/order-tracking/{orderId}?t={timestamp}
   ↓
8. Visar leveransstatus med timeline
   ↓
9. Automatisk uppdatering var 10:e sekund
   ↓
10. Visar "Status uppdaterad!" vid ändringar
```

## ✅ Implementerade Förbättringar

### 1. Beställningssidan (`/mina-sidor/bestallningar`)

#### Cache-prevention
```typescript
// Timestamp i API-anrop
const timestamp = new Date().getTime()
fetch(`/api/customers/${user.id}/orders?t=${timestamp}`, {
  cache: 'no-store',
  headers: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache'
  }
})
```

#### "Spåra Order"-knapp
```tsx
<Link
  href={`/spara-order/${order.id}`}
  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
>
  <svg>...</svg>
  Spåra Order
</Link>
```

### 2. Customer Orders API (`/api/customers/[id]/orders`)

#### No-cache headers
```typescript
return NextResponse.json({
  success: true,
  orders
}, {
  headers: {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
});
```

### 3. Spårningssidan (`/spara-order/[id]`)

#### Förbättrad polling med cleanup
```typescript
useEffect(() => {
  if (!orderId) return;
  
  let isMounted = true;
  
  const fetchTracking = async (isAutoRefresh = false) => {
    // ... fetch logic with isMounted checks
  };
  
  fetchTracking(false); // Initial fetch
  const interval = setInterval(() => {
    if (isMounted) fetchTracking(true);
  }, 10000);
  
  return () => {
    isMounted = false;
    clearInterval(interval);
  };
}, [orderId]);
```

#### Visuella förbättringar
- 🟢 Live-spårning indikator
- 🟠 Orange uppdateringsknapp
- 🎉 "Status uppdaterad!"-notifikation
- 🕐 Senaste uppdateringstid
- ℹ️ Informationstext om automatisk uppdatering

### 4. Order Tracking API (`/api/order-tracking/[id]`)

#### No-cache headers
```typescript
return NextResponse.json({
  success: true,
  tracking: response.rows[0]
}, {
  headers: {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
});
```

## 🧪 Testning

### Automatiskt Test
```bash
npx tsx scripts/test-track-order-flow.ts
```

Detta skript testar:
- ✅ Order finns i databasen
- ✅ Order tracking finns och är korrekt
- ✅ Beställningssidan kan hämta orders
- ✅ "Spåra Order"-länk pekar på rätt URL
- ✅ Spårningssidan kan hämta tracking-data
- ✅ Cache-prevention fungerar
- ✅ Nuvarande status beräknas korrekt

### Manuellt Test

#### Steg 1: Förberedelse
1. Skapa en testorder via `/kassa`
2. Notera order-ID och kunduppgifter

#### Steg 2: Beställningssidan
1. Logga in som kund
2. Gå till `/mina-sidor/bestallningar`
3. Verifiera att ordern visas
4. Kontrollera att status är korrekt

#### Steg 3: Klicka "Spåra Order"
1. Klicka på "Spåra Order"-knappen
2. Verifiera att URL är `/spara-order/{orderId}`
3. Kontrollera att sidan laddas utan fel

#### Steg 4: Verifiera Spårningssidan
1. **Order Information:**
   - ✓ Order nummer visas korrekt
   - ✓ Datum visas korrekt
   - ✓ Nuvarande status visas

2. **Delivery Status Timeline:**
   - ✓ Alla 4 steg visas (Confirmed, Packing, Transport, Delivered)
   - ✓ Slutförda steg har orange färg
   - ✓ Aktuellt steg har "In Progress"-badge
   - ✓ Framtida steg är gråa
   - ✓ Datum och tid visas för slutförda steg

3. **Order History:**
   - ✓ Visar alla slutförda steg i omvänd ordning
   - ✓ Datum och tid för varje steg

4. **Live-funktioner:**
   - ✓ Grön pulsande indikator visar "Live-spårning"
   - ✓ Orange "Uppdatera"-knapp fungerar
   - ✓ Senaste uppdateringstid visas och tickar
   - ✓ Informationstext: "Uppdateras automatiskt var 10:e sekund"

#### Steg 5: Testa Automatisk Uppdatering
1. Öppna admin-panelen i ny flik: `/admin/orders`
2. Hitta samma order
3. Ändra status till nästa steg (t.ex. confirmed → packing)
4. Gå tillbaka till spårningssidan
5. Vänta max 10 sekunder
6. Verifiera:
   - ✓ "Status uppdaterad!"-badge visas (grön, pulsande)
   - ✓ Timeline uppdateras med ny status
   - ✓ Order History visar ny händelse
   - ✓ Datum och tid är korrekta
   - ✓ Badge försvinner efter 5 sekunder

#### Steg 6: Testa Manuell Uppdatering
1. Ändra status igen i admin-panelen
2. Klicka omedelbart på "Uppdatera"-knappen
3. Verifiera:
   - ✓ Spinner-animation visas
   - ✓ Knapptext ändras till "Uppdaterar..."
   - ✓ Data uppdateras omedelbart
   - ✓ Senaste uppdateringstid uppdateras

#### Steg 7: Testa Cache-prevention
1. Öppna DevTools → Network-fliken
2. Filtrera på "order-tracking"
3. Observera API-anrop
4. Verifiera:
   - ✓ Nya anrop görs var 10:e sekund
   - ✓ URL innehåller olika timestamps: `?t=1234567890`
   - ✓ Request headers innehåller no-cache
   - ✓ Response headers innehåller no-cache
   - ✓ Status Code: 200
   - ✓ Response data är korrekt

## 🐛 Felsökning

### Problem: Status uppdateras inte

**Möjliga orsaker:**
1. Cache-problem
2. Polling fungerar inte
3. API returnerar gammal data
4. order_tracking inte synkroniserad

**Lösningar:**
1. Kontrollera DevTools → Network
2. Verifiera att timestamp ändras i URL
3. Kontrollera att no-cache headers skickas
4. Kör `npx tsx scripts/test-track-order-flow.ts`

### Problem: "Status uppdaterad!"-badge visas inte

**Möjliga orsaker:**
1. Status ändras inte faktiskt
2. Jämförelselogik fungerar inte
3. State uppdateras inte korrekt

**Lösningar:**
1. Kontrollera att status faktiskt ändras i databasen
2. Lägg till console.log i fetchTracking
3. Verifiera att getCurrentStepFromTracking fungerar

### Problem: Gammal data visas

**Möjliga orsaker:**
1. Webbläsarcache
2. Next.js cache
3. API cache

**Lösningar:**
1. Hårduppdatera sidan (Ctrl+Shift+R)
2. Rensa webbläsarcache
3. Verifiera timestamp i URL
4. Kontrollera API no-cache headers

### Problem: Polling slutar fungera

**Möjliga orsaker:**
1. Component unmounted
2. Interval inte rensad
3. JavaScript-fel

**Lösningar:**
1. Kontrollera console för fel
2. Verifiera cleanup-funktion i useEffect
3. Testa med `isMounted`-flagga

## 📊 Prestanda

### API-anrop
- **Beställningssidan:** 1 anrop vid laddning
- **Spårningssidan:** 
  - 1 initial anrop
  - 6 anrop per minut (var 10:e sekund)
  - 360 anrop per timme per användare

### Optimeringar
- ✅ Endast polling när sidan är aktiv
- ✅ Cleanup vid unmount
- ✅ isMounted-flagga för att undvika state updates efter unmount
- ✅ Effektiv statusjämförelse
- ✅ Minimal re-rendering

## 🚀 Framtida Förbättringar

### 1. WebSocket/Server-Sent Events
**Fördelar:**
- Omedelbar uppdatering vid statusändring
- Ingen polling behövs
- Lägre serverbelastning

**Implementation:**
```typescript
// Server
const wss = new WebSocketServer({ port: 8080 });
wss.on('connection', (ws) => {
  ws.on('message', (orderId) => {
    // Subscribe to order updates
  });
});

// Client
const ws = new WebSocket('ws://localhost:8080');
ws.onmessage = (event) => {
  const tracking = JSON.parse(event.data);
  setTracking(tracking);
};
```

### 2. Push-notifikationer
**Fördelar:**
- Användare meddelas även när sidan är stängd
- Bättre användarupplevelse

**Implementation:**
```typescript
// Request permission
Notification.requestPermission();

// Send notification
new Notification('Order uppdaterad!', {
  body: 'Din order är nu under transport',
  icon: '/icon.png'
});
```

### 3. Offline-stöd
**Fördelar:**
- Fungerar utan internetanslutning
- Synkroniserar vid återanslutning

**Implementation:**
```typescript
// Service Worker
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

### 4. Detaljerad GPS-spårning
**Fördelar:**
- Visa paketets position på karta
- Estimerad ankomsttid
- Realtidsuppdateringar

**Implementation:**
```typescript
// Integrera med transportör-API
const trackingData = await fetch(
  `https://carrier-api.com/track/${trackingNumber}`
);
```

## 📚 Relaterad Dokumentation

- `LEVERANSSTATUS_ÅTGÄRD.md` - Översikt av alla ändringar
- `SPÅRNINGSSIDA_UPPDATERING.md` - Detaljerad info om spårningssidan
- `docs/DELIVERY_STATUS_SYNC.md` - Teknisk dokumentation
- `docs/ORDER_TRACKING_SYSTEM.md` - Order tracking system

## ✅ Checklista

### Beställningssidan
- [x] Cache-prevention med timestamp
- [x] No-cache headers i fetch
- [x] "Spåra Order"-knapp fungerar
- [x] Korrekt URL till spårningssidan

### Customer Orders API
- [x] No-cache headers i response
- [x] Returnerar korrekt data
- [x] Hanterar fel korrekt

### Spårningssidan
- [x] Initial fetch fungerar
- [x] Automatisk polling var 10:e sekund
- [x] Cache-prevention med timestamp
- [x] isMounted-flagga för cleanup
- [x] Live-spårning indikator
- [x] "Status uppdaterad!"-notifikation
- [x] Orange uppdateringsknapp
- [x] Senaste uppdateringstid
- [x] Informationstext
- [x] Responsiv design

### Order Tracking API
- [x] No-cache headers i response
- [x] Returnerar färsk data
- [x] Hanterar fel korrekt

### Testning
- [x] Automatiskt testskript
- [x] Manuella testinstruktioner
- [x] Felsökningsguide
- [x] Dokumentation

## 🎉 Resultat

**Före:**
- ❌ Status uppdaterades inte automatiskt
- ❌ Cache-problem
- ❌ Ingen visuell feedback
- ❌ Användare måste ladda om sidan manuellt

**Efter:**
- ✅ Automatisk uppdatering var 10:e sekund
- ✅ Förbättrad cache-prevention
- ✅ Live-spårning indikator
- ✅ "Status uppdaterad!"-notifikation
- ✅ Manuell uppdateringsknapp
- ✅ Senaste uppdateringstid
- ✅ Informationstext
- ✅ Korrekt och uppdaterad status utan fördröjning
