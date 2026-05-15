# Korrekt SQL-syntax för orderstatusuppdateringar

## Problemet

Det ursprungliga SQL-kommandot har syntaxfel:
```sql
UPDATE orders
SET status = 'Packning'
WHERE id = Order #ORD-20394480;
```

## Felaktig syntax
1. `Order #ORD-20394480` - inte giltig SQL-syntax (saknar citattecken och har fel format)
2. `'Packning'` - databasen använder engelska statusvärden
3. `id` - ska vara `order_number` för order-nummer

## Korrekt SQL-syntax

### För Packning
```sql
UPDATE orders
SET status = 'processing'
WHERE order_number = 'ORD-20394480';
```

### För Transport
```sql
UPDATE orders
SET status = 'shipped'
WHERE order_number = 'ORD-20394480';
```

### För Levererad
```sql
UPDATE orders
SET status = 'delivered'
WHERE order_number = 'ORD-20394480';
```

## Status-mappning

| Svensk term | Databasvärde |
|-------------|---------------|
| Packning | processing |
| Transport | shipped |
| Levererad | delivered |

## Viktigt
- Använd alltid enkla citattecken `'` runt strängvärden
- Kolumnen för order-nummer är `order_number`, inte `id`
- Statusvärden måste vara på engelska enligt ovan tabell
- Triggers i databasen kommer automatiskt att synkronisera till `order_tracking`-tabellen
- Frontend kommer att visa uppdateringen inom 5 sekunder via polling
