# Leveransstatus Synkronisering

## Problem
Leveransstatusen på logistiksidan uppdaterades inte automatiskt eftersom det fanns två separata system:
1. **`order_tracking`-tabellen** - spårar orderstatus (confirmed, packing, transport, delivered)
2. **`shipments`-tabellen** - visar leveranser på logistiksidan

## Lösning

### 1. Automatisk Uppdatering (Polling)
Logistiksidan uppdateras nu automatiskt var 30:e sekund:
```typescript
useEffect(() => {
  loadShipments()
  
  // Automatisk uppdatering var 30:e sekund
  const interval = setInterval(() => {
    loadShipments()
  }, 30000)
  
  return () => clearInterval(interval)
}, [user, router])
```

### 2. Manuell Uppdateringsknapp
Användare kan klicka på "Uppdatera"-knappen för att omedelbart hämta senaste status.

### 3. Synkronisering mellan Tabeller
`logisticsDb.ts` synkroniserar nu automatiskt `shipments`-tabellen med `order_tracking`:

```typescript
// Mappning från order_tracking till shipment status
if (tracking.delivered === 1) {
  shipmentStatus = 'delivered';
} else if (tracking.transport === 1) {
  shipmentStatus = 'in_transit';
} else if (tracking.packing === 1) {
  shipmentStatus = 'processing';
} else if (tracking.confirmed === 1) {
  shipmentStatus = 'pending';
}
```

### 4. Status Mappning

| order_tracking | shipments | Visning |
|---------------|-----------|---------|
| confirmed = 1 | pending | Bekräftad |
| packing = 1 | processing | Packas |
| transport = 1 | in_transit | Under transport |
| delivered = 1 | delivered | Levererad |

### 5. Visuell Feedback
- **Senast uppdaterad**: Visar tid för senaste uppdatering
- **Färgkodade statusar**: 
  - 🟢 Grön = Levererad
  - 🔵 Blå = Under transport
  - 🟡 Gul = Packas
  - ⚪ Grå = Bekräftad

## API Endpoints

### GET `/api/shipments/[customerId]`
Hämtar alla leveranser för en kund och synkroniserar automatiskt med order_tracking.

### GET `/api/shipments/order/[id]`
Hämtar leveransinformation för en specifik order och synkroniserar status.

### PUT `/api/order-tracking/[id]`
Uppdaterar orderstatus i order_tracking-tabellen.

## Användning

### För Administratörer
Uppdatera orderstatus via admin-panelen:
```
/admin/orders
```

Status uppdateras automatiskt i både `order_tracking` och `shipments`.

### För Kunder
Besök logistiksidan:
```
/mina-sidor/logistik
```

Sidan uppdateras automatiskt var 30:e sekund, eller klicka på "Uppdatera"-knappen.

## Testning

1. Skapa en order
2. Uppdatera status i admin-panelen till "transport"
3. Vänta max 30 sekunder eller klicka "Uppdatera"
4. Verifiera att statusen visas som "Under transport" med blå färg

## Framtida Förbättringar

1. **WebSocket/Server-Sent Events**: För realtidsuppdateringar utan polling
2. **Push-notifikationer**: Meddela kunder när status ändras
3. **Detaljerad spårning**: Visa alla steg i leveransprocessen
4. **Karta**: Visa leveransens position på en karta
