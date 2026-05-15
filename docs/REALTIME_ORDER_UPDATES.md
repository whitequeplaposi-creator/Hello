# Realtidsuppdateringar för Orderstatus

## Översikt

Systemet har nu stöd för realtidsuppdateringar av orderstatus. När du uppdaterar en orderstatus i databasen via SQL, kommer ändringen automatiskt att synas i "Mina sidor" under "Mina beställningar" för kunden inom max 5 sekunder.

## Hur det fungerar

1. **Databas-triggers**: Automatiska triggers i databasen synkroniserar ändringar i `orders.status` till `order_tracking`-tabellen
2. **Frontend-polling**: Sidan "Mina beställningar" hämtar uppdaterad data var 5:e sekund
3. **API-synkronisering**: Manuell synkronisering kan göras via API om needed

## Användning

### Uppdatera orderstatus via SQL

När du kör SQL-kommandon direkt i databasen, använd följande statusvärden:

```sql
-- För Packning
UPDATE orders
SET status = 'processing'
WHERE order_number = 'ORD-20394480';

-- För Transport
UPDATE orders
SET status = 'shipped'
WHERE order_number = 'ORD-20394480';

-- För Levererad
UPDATE orders
SET status = 'delivered'
WHERE order_number = 'ORD-20394480';
```

### Status-mappning

| Svensk term | Databasvärde | order_tracking-kolumner |
|-------------|---------------|------------------------|
| Orderbekräftad | pending | confirmed = 1 |
| Packning | processing | packing = 1 |
| Transport | shipped / in_transit / out_for_delivery | transport = 1 |
| Levererad | delivered | delivered = 1 |
| Avbruten | cancelled | Alla = 0 |
| Returnerad | returned | Alla = 0 |

### Manuell synkronisering via API

Om du behöver synkronisera status manuellt, kan du anropa API-endpoint:

```bash
POST /api/sync-order-status
{
  "order_number": "ORD-20394480"
}
```

## Teknisk implementation

### Databas-triggers

Följande triggers har skapats i databasen:

1. **sync_order_status_to_tracking**: Uppdaterar order_tracking när orders.status ändras
2. **sync_new_order_to_tracking**: Skapar order_tracking-post för nya ordrar

### Frontend-polling

Sidan `app/mina-sidor/bestallningar/page.tsx` har implementerat polling som hämtar uppdaterad data var 5:e sekund via `setInterval`.

### API-endpoints

- `GET /api/order-tracking/[id]` - Hämta tracking-data för en order
- `PUT /api/order-tracking/[id]` - Uppdatera tracking-data
- `POST /api/sync-order-status` - Synkronisera orders.status till order_tracking

## Testning

För att testa realtidsuppdateringar:

1. Öppna "Mina sidor" > "Mina beställningar" i webbläsaren
2. Kör SQL-kommando i databasen för att uppdatera orderstatus
3. Vänta max 5 sekunder - ändringen ska nu synas i webbläsaren

## Felsökning

Om uppdateringar inte visas:

1. Kontrollera att triggers är aktiva i databasen
2. Kontrollera att order_number är korrekt
3. Kontrollera webbläsarkonsolen för fel
4. Verifiera att API-endpoint svarar korrekt
