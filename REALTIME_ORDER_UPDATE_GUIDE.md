# 🚀 Real-time Order Status Update Guide

## Overview

This system allows you to update order status directly in the database, and the tracking page will automatically reflect the changes within 30 seconds.

## 🎯 Quick Start

### Method 1: SQL Command (Simplest)

```sql
UPDATE orders SET status = 'Transport' WHERE order_number = 'ORD-17438574';
```

That's it! The trigger automatically updates the tracking table.

### Method 2: TypeScript Script

```bash
npx tsx scripts/update-by-order-number.ts ORD-17438574 Transport
```

### Method 3: Direct Order ID

```bash
npx tsx scripts/update-order-status.ts order_abc123 transport
```

## 📊 Status Values

| Status | Description | Tracking Display |
|--------|-------------|------------------|
| `Confirmed` | Order received and confirmed | ✅ Confirmed |
| `Packing` | Order being prepared | ✅ Packing |
| `Transport` | Order in transit | ✅ Transport |
| `Delivered` | Order delivered | ✅ Delivered |

## 🔧 Setup (One-time)

### Step 1: Apply the Updated Trigger

```bash
npx tsx scripts/apply-updated-trigger.ts
```

This creates database triggers that automatically sync `orders.status` with `order_tracking`.

### Step 2: Verify Trigger is Working

The script will automatically test the trigger and show results.

## 💻 Usage Examples

### Example 1: Update Single Order

**Using SQL:**
```sql
UPDATE orders SET status = 'Transport' WHERE order_number = 'ORD-17438574';
```

**Using Script:**
```bash
npx tsx scripts/update-by-order-number.ts ORD-17438574 Transport
```

### Example 2: Update Multiple Orders

**SQL:**
```sql
UPDATE orders 
SET status = 'Transport' 
WHERE order_number IN ('ORD-001', 'ORD-002', 'ORD-003');
```

### Example 3: Update All Orders in Packing

**SQL:**
```sql
UPDATE orders 
SET status = 'Transport' 
WHERE status = 'Packing';
```

### Example 4: View Order Status

**SQL:**
```sql
-- View order
SELECT order_number, status, updated_at 
FROM orders 
WHERE order_number = 'ORD-17438574';

-- View tracking
SELECT * FROM order_tracking 
WHERE order_id = (SELECT id FROM orders WHERE order_number = 'ORD-17438574');
```

## 🔄 How It Works

```
┌─────────────────────────────────────────────────────────┐
│  1. You update orders.status                            │
│     UPDATE orders SET status = 'Transport' ...          │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│  2. Database trigger fires automatically                │
│     - Updates order_tracking table                      │
│     - Sets appropriate status flags                     │
│     - Adds timestamps                                   │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│  3. Tracking page auto-refreshes (every 30 seconds)     │
│     - Fetches updated tracking data                     │
│     - Displays new status                               │
│     - Shows updated timeline                            │
└─────────────────────────────────────────────────────────┘
```

## 📋 Status Progression

The trigger automatically sets all previous statuses when you update:

```
Confirmed → Packing → Transport → Delivered
```

**Example:**
- Set status to `Transport`
- Trigger automatically sets:
  - ✅ Confirmed = 1
  - ✅ Packing = 1
  - ✅ Transport = 1
  - ⬜ Delivered = 0

## 🎯 Common Workflows

### Workflow 1: New Order Received

```sql
-- Order is automatically created with status 'Confirmed'
-- Trigger creates tracking record automatically
```

### Workflow 2: Order Ready to Ship

```sql
UPDATE orders SET status = 'Packing' WHERE order_number = 'ORD-17438574';
```

### Workflow 3: Order Shipped

```sql
UPDATE orders SET status = 'Transport' WHERE order_number = 'ORD-17438574';
```

### Workflow 4: Order Delivered

```sql
UPDATE orders SET status = 'Delivered' WHERE order_number = 'ORD-17438574';
```

## 🔍 Monitoring & Debugging

### Check if Trigger Exists

```sql
SELECT name, sql FROM sqlite_master 
WHERE type = 'trigger' 
AND name LIKE '%sync%order%';
```

### View All Orders with Tracking Status

```sql
SELECT 
  o.order_number,
  o.status as order_status,
  CASE 
    WHEN t.delivered = 1 THEN 'Delivered'
    WHEN t.transport = 1 THEN 'Transport'
    WHEN t.packing = 1 THEN 'Packing'
    WHEN t.confirmed = 1 THEN 'Confirmed'
    ELSE 'Pending'
  END as tracking_status,
  t.updated_at
FROM orders o
LEFT JOIN order_tracking t ON o.id = t.order_id
ORDER BY o.created_at DESC
LIMIT 20;
```

### Find Orders Without Tracking

```sql
SELECT o.order_number, o.status 
FROM orders o
LEFT JOIN order_tracking t ON o.id = t.order_id
WHERE t.id IS NULL;
```

## 🛠️ Troubleshooting

### Issue: Tracking not updating

**Solution 1: Check if trigger exists**
```bash
npx tsx scripts/apply-updated-trigger.ts
```

**Solution 2: Manually sync tracking**
```bash
npx tsx scripts/update-order-status.ts <order_id> <status>
```

### Issue: Old status names not working

**Solution:** Use new status names:
- ❌ `processing` → ✅ `Packing`
- ❌ `shipped` → ✅ `Transport`
- ❌ `in_transit` → ✅ `Transport`

### Issue: Tracking page not refreshing

**Solution:** The page auto-refreshes every 30 seconds. Wait or manually refresh the browser.

## 📁 Related Files

| File | Purpose |
|------|---------|
| `lib/migrations/005_update_order_status_trigger.sql` | Trigger definition |
| `scripts/apply-updated-trigger.ts` | Apply trigger script |
| `scripts/update-by-order-number.ts` | Update by order number |
| `scripts/sql/update-order-status-simple.sql` | SQL commands |
| `app/spara-order/[id]/page.tsx` | Tracking page |

## 🎉 Benefits

✅ **Simple** - Just update orders.status  
✅ **Automatic** - Trigger handles tracking sync  
✅ **Real-time** - Page updates within 30 seconds  
✅ **Reliable** - Database-level consistency  
✅ **Flexible** - Works with SQL or scripts  

## 📞 Quick Reference

```bash
# Apply trigger (one-time setup)
npx tsx scripts/apply-updated-trigger.ts

# Update order status
npx tsx scripts/update-by-order-number.ts ORD-17438574 Transport

# Or use SQL directly
# UPDATE orders SET status = 'Transport' WHERE order_number = 'ORD-17438574';

# View tracking page
# http://localhost:3000/spara-order/[order_id]
```

## 🔐 Security Notes

- Only authorized users should have database access
- Use prepared statements to prevent SQL injection
- Validate order numbers before updating
- Log all status changes for audit trail

## 🚀 Production Deployment

1. ✅ Apply trigger in production database
2. ✅ Test with a sample order
3. ✅ Monitor for any errors
4. ✅ Set up automated status updates (optional)
5. ✅ Configure alerts for failed updates

---

**Status:** ✅ Production Ready  
**Last Updated:** 2024  
**Version:** 2.0
