# Uppdatera Orderstatus

## Översikt
Detta dokument beskriver hur du uppdaterar orderstatus direkt i databasen och hur ändringarna visas på "Mina beställningar"-sidan.

## Tillgängliga Statusar

| Status | Svensk Text | Färg | Beskrivning |
|--------|-------------|------|-------------|
| `pending` | Väntar | Orange | Ordern väntar på behandling |
| `processing` | Behandlas | Gul | Ordern behandlas |
| `packing` | Packas | Lila | Ordern packas för leverans |
| `shipped` | Skickad | Blå | Ordern har skickats |
| `delivered` | Levererad | Grön | Ordern har levererats |
| `cancelled` | Avbruten | Röd | Ordern har avbrutits |
| `returned` | Returnerad | Grå | Ordern har returnerats |

## Uppdatera Status via SQL

### Grundläggande Uppdatering

```sql
UPDATE orders 
SET status = 'packing', updated_at = CURRENT_TIMESTAMP 
WHERE order_number = 'ORD-17438574';
```

### Verifiera Ändringen

```sql
SELECT order_number, status, updated_at 
FROM orders 
WHERE order_number = 'ORD-17438574';
```

### Uppdatera Flera Ordrar

```sql
UPDATE orders 
SET status = 'packing', updated_at = CURRENT_TIMESTAMP 
WHERE order_number IN ('ORD-17438574', 'ORD-12345678', 'ORD-87654321');
```

## Uppdatera Status via TypeScript Script

Du kan också använda det medföljande TypeScript-scriptet:

```bash
npx tsx scripts/update-order-status.ts ORD-17438574 packing
```

### Script-funktioner:
- ✅ Validerar att statusen är giltig
- ✅ Kontrollerar att ordern finns
- ✅ Uppdaterar automatiskt `updated_at` timestamp
- ✅ Uppdaterar även leveransstatus om status är `shipped` eller `delivered`
- ✅ Skapar leveranshändelser automatiskt

## Hur Uppdateringen Visas på Webbplatsen

### 1. Automatisk Uppdatering
När du uppdaterar status i databasen:
1. Ändringen sparas omedelbart i `orders`-tabellen
2. Nästa gång användaren laddar "Mina beställningar"-sidan hämtas den nya statusen
3. Statusen visas med rätt färg och text

### 2. Manuell Uppdatering
Om användaren redan är på sidan:
- Användaren behöver ladda om sidan (F5) för att se ändringen
- Alternativt kan de navigera bort och tillbaka till sidan

### 3. Statusvisning på Sidan

Statusen visas som en färgad badge:

```tsx
<span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
  Packas
</span>
```

## API-flöde

```
Databas (orders table)
    ↓
GET /api/customers/[id]/orders
    ↓
getCustomerOrders() i customerDb.ts
    ↓
Mina beställningar-sidan
    ↓
Visar status med färg och text
```

## Exempel på Användning

### Scenario 1: Order Packas
```sql
-- Uppdatera status till "packas"
UPDATE orders 
SET status = 'packing', updated_at = CURRENT_TIMESTAMP 
WHERE order_number = 'ORD-17438574';
```

**Resultat på webbplatsen:**
- Badge: Lila bakgrund med texten "Packas"

### Scenario 2: Order Skickas
```sql
-- Uppdatera status till "skickad"
UPDATE orders 
SET status = 'shipped', updated_at = CURRENT_TIMESTAMP 
WHERE order_number = 'ORD-17438574';
```

**Resultat på webbplatsen:**
- Badge: Blå bakgrund med texten "Skickad"
- Om du använder scriptet uppdateras även leveransstatus automatiskt

### Scenario 3: Order Levereras
```sql
-- Uppdatera status till "levererad"
UPDATE orders 
SET status = 'delivered', updated_at = CURRENT_TIMESTAMP 
WHERE order_number = 'ORD-17438574';
```

**Resultat på webbplatsen:**
- Badge: Grön bakgrund med texten "Levererad"
- Om du använder scriptet sätts även `actual_delivery_date`

## Felsökning

### Problem: Status uppdateras inte på sidan

**Lösning 1:** Ladda om sidan
```
Tryck F5 eller Ctrl+R
```

**Lösning 2:** Kontrollera att ordern finns
```sql
SELECT * FROM orders WHERE order_number = 'ORD-17438574';
```

**Lösning 3:** Kontrollera att användaren är inloggad
- Användaren måste vara inloggad för att se sina beställningar
- Kontrollera att `customer_id` matchar den inloggade användaren

### Problem: Fel ordernummer

**Lösning:** Hitta rätt ordernummer
```sql
-- Visa alla ordrar
SELECT order_number, status, created_at 
FROM orders 
ORDER BY created_at DESC 
LIMIT 10;

-- Sök efter order baserat på kundens email
SELECT o.order_number, o.status, c.email
FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE c.email = 'kund@example.com';
```

## Bästa Praxis

1. **Använd alltid `updated_at`**
   ```sql
   UPDATE orders 
   SET status = 'packing', updated_at = CURRENT_TIMESTAMP 
   WHERE order_number = 'ORD-17438574';
   ```

2. **Verifiera alltid ändringen**
   ```sql
   SELECT order_number, status, updated_at 
   FROM orders 
   WHERE order_number = 'ORD-17438574';
   ```

3. **Använd transaktioner för flera uppdateringar**
   ```sql
   BEGIN TRANSACTION;
   
   UPDATE orders SET status = 'packing' WHERE order_number = 'ORD-17438574';
   UPDATE orders SET status = 'packing' WHERE order_number = 'ORD-12345678';
   
   COMMIT;
   ```

4. **Logga viktiga ändringar**
   - Överväg att skapa en `order_status_history`-tabell för att spåra statusändringar
   - Spara vem som gjorde ändringen och när

## Relaterade Filer

- **Frontend:** `app/mina-sidor/bestallningar/page.tsx`
- **API:** `app/api/customers/[id]/orders/route.ts`
- **Databas:** `lib/customerDb.ts`
- **Script:** `scripts/update-order-status.ts`
- **SQL:** `scripts/sql/update-order-status.sql`

## Framtida Förbättringar

1. **Real-time uppdateringar**
   - Implementera WebSocket eller Server-Sent Events
   - Automatisk uppdatering utan att ladda om sidan

2. **Status-historik**
   - Spara alla statusändringar i en separat tabell
   - Visa tidslinje för ordern

3. **Notifikationer**
   - Skicka email när status ändras
   - Push-notifikationer till mobilapp

4. **Admin-gränssnitt**
   - Skapa admin-sida för att uppdatera orderstatus
   - Bulk-uppdatering av flera ordrar samtidigt
