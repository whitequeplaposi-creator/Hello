# 📦 Order Tracking - Quick Reference

## 🚀 Quick Commands

### Update Single Order
```bash
npx tsx scripts/update-order-status.ts <order_id> <status>
```

**Status options:** `confirmed` | `packing` | `transport` | `delivered`

### Examples
```bash
# Confirm order
npx tsx scripts/update-order-status.ts order_abc123 confirmed

# Mark as packing
npx tsx scripts/update-order-status.ts order_abc123 packing

# Mark as in transit
npx tsx scripts/update-order-status.ts order_abc123 transport

# Mark as delivered
npx tsx scripts/update-order-status.ts order_abc123 delivered
```

### Batch Update
```bash
# Edit scripts/batch-update-orders.ts first, then run:
npx tsx scripts/batch-update-orders.ts
```

## 📊 Status Flow

```
Confirmed → Packing → In Transit → Delivered
    ✓         📦          🚚           🏠
```

## 🎯 SQL Quick Commands

### Update to Confirmed
```sql
UPDATE order_tracking 
SET confirmed = 1, confirmed_date = datetime('now'), updated_at = datetime('now')
WHERE order_id = 'order_abc123';
```

### Update to Packing
```sql
UPDATE order_tracking 
SET confirmed = 1, confirmed_date = COALESCE(confirmed_date, datetime('now')),
    packing = 1, packing_date = datetime('now'), updated_at = datetime('now')
WHERE order_id = 'order_abc123';
```

### Update to Transport
```sql
UPDATE order_tracking 
SET confirmed = 1, confirmed_date = COALESCE(confirmed_date, datetime('now')),
    packing = 1, packing_date = COALESCE(packing_date, datetime('now')),
    transport = 1, transport_date = datetime('now'), updated_at = datetime('now')
WHERE order_id = 'order_abc123';
```

### Update to Delivered
```sql
UPDATE order_tracking 
SET confirmed = 1, confirmed_date = COALESCE(confirmed_date, datetime('now')),
    packing = 1, packing_date = COALESCE(packing_date, datetime('now')),
    transport = 1, transport_date = COALESCE(transport_date, datetime('now')),
    delivered = 1, delivered_date = datetime('now'), updated_at = datetime('now')
WHERE order_id = 'order_abc123';
```

### View Order Status
```sql
SELECT * FROM order_tracking WHERE order_id = 'order_abc123';
```

### View All Orders
```sql
SELECT order_id, order_number,
  CASE 
    WHEN delivered = 1 THEN 'Delivered'
    WHEN transport = 1 THEN 'In Transit'
    WHEN packing = 1 THEN 'Packing'
    WHEN confirmed = 1 THEN 'Confirmed'
    ELSE 'Pending'
  END as status
FROM order_tracking
ORDER BY updated_at DESC;
```

## 🌐 Access Tracking Page

```
https://your-domain.com/spara-order/[order_id]
```

Example:
```
https://your-domain.com/spara-order/order_abc123
```

## 📋 Key Features

✅ **Professional Design** - Clean, modern interface  
✅ **Real-time Updates** - Auto-refresh every 30 seconds  
✅ **English Interface** - All text in English  
✅ **SVG Icons** - Professional icons for each status  
✅ **Mobile Responsive** - Works on all devices  
✅ **Order History** - Complete timeline of changes  
✅ **Customer Support** - Quick access to help  

## 🔧 Files

| File | Purpose |
|------|---------|
| `app/spara-order/[id]/page.tsx` | Tracking page UI |
| `scripts/update-order-status.ts` | CLI update tool |
| `scripts/batch-update-orders.ts` | Batch updates |
| `scripts/sql/update-tracking-status.sql` | SQL commands |
| `docs/ORDER_TRACKING_UPDATE.md` | Full documentation |

## 💡 Tips

1. **Status progression** - Always update in order (confirmed → packing → transport → delivered)
2. **Preserve dates** - Use `COALESCE()` to keep existing dates
3. **Batch updates** - Use batch script for multiple orders
4. **Testing** - Test on staging before production
5. **Monitoring** - Check logs for any errors

## 🆘 Help

```bash
# Show help for update script
npx tsx scripts/update-order-status.ts --help
```

## 📞 Support

- Documentation: `docs/ORDER_TRACKING_UPDATE.md`
- SQL Reference: `scripts/sql/update-tracking-status.sql`
- API Endpoint: `/api/order-tracking/[id]`
