# 🗄️ SQL-Guide för Order Tracking

## 📋 Snabbkommandon

### 1. Visa alla orders

```sql
SELECT order_number, status, created_at 
FROM orders 
ORDER BY created_at DESC;
```

### 2. Uppdatera order till "shipped"

```sql
-- Steg 1: Uppdatera orders-tabellen
UPDATE orders 
SET status = 'shipped', updated_at = datetime('now')
WHERE order_number = 'ORD-17438574';

-- Steg 2: Uppdatera tracking-tabellen
UPDATE order_tracking 
SET 
  confirmed = 1,
  confirmed_date = COALESCE(confirmed_date, datetime('now')),
  packing = 1,
  packing_date = COALESCE(packing_date, datetime('now')),
  transport = 1,
  transport_date = COALESCE(transport_date, datetime('now')),
  delivered = 0,
  updated_at = datetime('now')
WHERE order_number = 'ORD-17438574';
```

### 3. Uppdatera order till "delivered"

```sql
-- Steg 1: Uppdatera orders-tabellen
UPDATE orders 
SET status = 'delivered', updated_at = datetime('now')
WHERE order_number = 'ORD-17438574';

-- Steg 2: Uppdatera tracking-tabellen
UPDATE order_tracking 
SET 
  confirmed = 1,
  confirmed_date = COALESCE(confirmed_date, datetime('now')),
  packing = 1,
  packing_date = COALESCE(packing_date, datetime('now')),
  transport = 1,
  transport_date = COALESCE(transport_date, datetime('now')),
  delivered = 1,
  delivered_date = COALESCE(delivered_date, datetime('now')),
  updated_at = datetime('now')
WHERE order_number = 'ORD-17438574';
```

### 4. Kontrollera resultat

```sql
SELECT 
  o.order_number,
  o.status,
  t.confirmed,
  t.packing,
  t.transport,
  t.delivered
FROM orders o
LEFT JOIN order_tracking t ON o.id = t.order_id
WHERE o.order_number = 'ORD-17438574';
```

## 📊 Statusvärden och Tracking-mappning

| orders.status | confirmed | packing | transport | delivered |
|--------------|-----------|---------|-----------|-----------|
| pending      | 1         | 0       | 0         | 0         |
| processing   | 1         | 1       | 0         | 0         |
| shipped      | 1         | 1       | 1         | 0         |
| delivered    | 1         | 1       | 1         | 1         |

## 🔄 Komplett exempel: Order från start till slut

```sql
-- 1. Order bekräftas (pending)
UPDATE orders SET status = 'pending', updated_at = datetime('now') 
WHERE order_number = 'ORD-17438574';

UPDATE order_tracking 
SET confirmed = 1, confirmed_date = COALESCE(confirmed_date, datetime('now')),
    packing = 0, transport = 0, delivered = 0, updated_at = datetime('now')
WHERE order_number = 'ORD-17438574';

-- 2. Order packas (processing)
UPDATE orders SET status = 'processing', updated_at = datetime('now') 
WHERE order_number = 'ORD-17438574';

UPDATE order_tracking 
SET packing = 1, packing_date = COALESCE(packing_date, datetime('now')),
    updated_at = datetime('now')
WHERE order_number = 'ORD-17438574';

-- 3. Order skickas (shipped)
UPDATE orders SET status = 'shipped', updated_at = datetime('now') 
WHERE order_number = 'ORD-17438574';

UPDATE order_tracking 
SET transport = 1, transport_date = COALESCE(transport_date, datetime('now')),
    updated_at = datetime('now')
WHERE order_number = 'ORD-17438574';

-- 4. Order levereras (delivered)
UPDATE orders SET status = 'delivered', updated_at = datetime('now') 
WHERE order_number = 'ORD-17438574';

UPDATE order_tracking 
SET delivered = 1, delivered_date = COALESCE(delivered_date, datetime('now')),
    updated_at = datetime('now')
WHERE order_number = 'ORD-17438574';
```

## 🛠️ Användbara queries

### Hitta order_id från order_number

```sql
SELECT id, order_number, status 
FROM orders 
WHERE order_number = 'ORD-17438574';
```

### Visa alla orders med tracking-status

```sql
SELECT 
  o.order_number,
  o.status AS order_status,
  CASE 
    WHEN t.delivered = 1 THEN '🏠 Delivered'
    WHEN t.transport = 1 THEN '🚚 Transport'
    WHEN t.packing = 1 THEN '📦 Packing'
    WHEN t.confirmed = 1 THEN '✅ Confirmed'
    ELSE '⏳ Pending'
  END AS tracking_status,
  o.created_at
FROM orders o
LEFT JOIN order_tracking t ON o.id = t.order_id
ORDER BY o.created_at DESC;
```

### Hitta orders utan tracking

```sql
SELECT o.order_number, o.status 
FROM orders o
LEFT JOIN order_tracking t ON o.id = t.order_id
WHERE t.id IS NULL;
```

### Skapa tracking för order som saknar det

```sql
-- Ersätt värdena med din order
INSERT INTO order_tracking 
(id, order_id, order_number, confirmed, confirmed_date, packing, packing_date, transport, transport_date, delivered, delivered_date, created_at, updated_at)
VALUES (
  'track_' || (SELECT id FROM orders WHERE order_number = 'ORD-17438574') || '_' || strftime('%s', 'now'),
  (SELECT id FROM orders WHERE order_number = 'ORD-17438574'),
  'ORD-17438574',
  1,
  datetime('now'),
  0,
  NULL,
  0,
  NULL,
  0,
  NULL,
  datetime('now'),
  datetime('now')
);
```

## ⚠️ Viktigt att komma ihåg

1. **Använd COALESCE()** för datum - detta bevarar befintliga datum
2. **Uppdatera båda tabellerna** - både `orders` och `order_tracking`
3. **Tillåtna statusvärden:** `pending`, `processing`, `shipped`, `delivered`, `cancelled`, `returned`
4. **Tracking-sidan uppdateras** automatiskt var 10:e sekund

## 🚀 Enklare alternativ

Istället för att köra SQL manuellt, använd scriptet:

```bash
npx tsx scripts/update-order-status.ts ORD-17438574 shipped
```

Detta gör allt automatiskt! ✨
