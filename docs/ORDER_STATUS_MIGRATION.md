# Migrering av Orderstatus

## Översikt
Systemet har uppdaterats för att använda ett enhetligt statusflöde för både orders och order_tracking.

## Nya Statusvärden

### Orders (orders.status)
Tidigare: `pending`, `processing`, `shipped`, `delivered`, `cancelled`, `returned`

**Nya värden:**
- `confirmed` - Beställning bekräftad
- `packing` - Packas
- `transport` - Under transport
- `delivered` - Levererad

### Shipments (shipments.status)
Tidigare: `pending`, `picked_up`, `in_transit`, `out_for_delivery`, `delivered`, `failed`, `returned`

**Nya värden:**
- `confirmed` - Bekräftad
- `packing` - Packas
- `transport` - Under transport
- `delivered` - Levererad

## Mappning från Gamla till Nya Värden

### Orders
| Gammalt värde | Nytt värde |
|--------------|-----------|
| pending | confirmed |
| processing | packing |
| shipped | transport |
| delivered | delivered |
| cancelled | confirmed |
| returned | confirmed |

### Shipments
| Gammalt värde | Nytt värde |
|--------------|-----------|
| pending | confirmed |
| picked_up | packing |
| in_transit | transport |
| out_for_delivery | transport |
| delivered | delivered |
| failed | confirmed |
| returned | confirmed |

## Hur man Kör Migrationen

### Steg 1: Kör Migrationsskriptet
```bash
npx tsx scripts/migrate-order-status.ts
```

Detta skript kommer att:
1. Visa nuvarande statusfördelning
2. Uppdatera alla orders och shipments till nya värden
3. Visa den nya statusfördelningen

### Steg 2: Verifiera Ändringarna
Kontrollera att alla orders har korrekta statusvärden:
```sql
SELECT status, COUNT(*) as count FROM orders GROUP BY status;
SELECT status, COUNT(*) as count FROM shipments GROUP BY status;
```

## Uppdaterade Filer

### Databas
- `lib/migrations/001_create_customer_tables.sql` - Uppdaterade CHECK constraints
- `lib/migrations/002_update_order_status_values.sql` - Ny migrering för att uppdatera befintliga data

### TypeScript Types
- `lib/types/customer.ts` - Uppdaterade Order och Shipment interfaces

### API
- `app/api/orders/route.ts` - Uppdaterade statusvärden vid skapande av orders och shipments

### Databas-funktioner
- `lib/customerDb.ts` - Uppdaterade statusvärden och mappningar

### UI-komponenter
- `app/mina-sidor/logistik/page.tsx` - Uppdaterade statusvisningar
- `app/mina-sidor/bestallningar/page.tsx` - Uppdaterade statusvisningar

### SQL-skript
- `sql/update-order-status.sql` - Uppdaterade exempel
- `sql/simple-updates.sql` - Uppdaterade exempel

## Statusflöde

```
confirmed → packing → transport → delivered
```

### Beskrivning av varje steg:
1. **confirmed** - Beställningen är bekräftad och betalning har mottagits
2. **packing** - Produkterna packas i lagret
3. **transport** - Paketet är skickat och under transport
4. **delivered** - Paketet har levererats till kunden

## Order Tracking Synkronisering

Systemet synkroniserar automatiskt `orders.status` till `order_tracking` tabellen:

| Order Status | confirmed | packing | transport | delivered |
|-------------|-----------|---------|-----------|-----------|
| confirmed | 1 | 0 | 0 | 0 |
| packing | 1 | 1 | 0 | 0 |
| transport | 1 | 1 | 1 | 0 |
| delivered | 1 | 1 | 1 | 1 |

## Viktiga Noteringar

1. **Betalningsstatus** (`payment_status`) är separat från orderstatus och påverkas inte av denna ändring
2. **Gamla statusvärden** som `cancelled` och `returned` mappas till `confirmed` - om ni behöver dessa funktioner måste ni lägga till dem separat
3. **Shipment events** behåller sina egna statusvärden och påverkas inte direkt

## Framtida Förbättringar

Om ni behöver hantera:
- **Avbokningar** - Lägg till `cancelled` status
- **Returer** - Lägg till `returned` status
- **Misslyckade leveranser** - Lägg till `failed` status

Då behöver ni:
1. Uppdatera CHECK constraints i migrations
2. Uppdatera TypeScript types
3. Uppdatera UI-komponenter för att visa dessa statusar
4. Lägga till logik för att hantera dessa specialfall
