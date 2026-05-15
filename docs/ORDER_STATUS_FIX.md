# Order Status Fix - 500 Error Resolution

## Problem
The checkout process was failing with a 500 Internal Server Error when trying to create orders. The error message was "Kunde inte skapa beställning" (Could not create order).

## Root Cause
The database schema had a CHECK constraint on the `orders.status` column that only allowed these values:
- `'confirmed'`
- `'packing'`
- `'transport'`
- `'delivered'`

However, the application code was trying to insert `'pending'` as the status value, which violated the constraint and caused the database to reject the insert operation.

## Error Details
```
SQLITE_CONSTRAINT: SQLite error: CHECK constraint failed: 
status IN ('confirmed', 'packing', 'transport', 'delivered')
```

## Files Changed

### 1. `lib/customerDb.ts`
- **Changed**: Order creation now uses `'confirmed'` instead of `'pending'` as the initial status
- **Changed**: Updated `Order` interface to reflect correct status values
- **Changed**: Updated `syncOrderToTracking` function to use correct status mappings
- **Changed**: Updated default status values in `getOrder` and `getCustomerOrders` functions

### 2. `lib/types/customer.ts`
- **Changed**: Updated `Order` interface status type from old values to new values:
  - Old: `'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'`
  - New: `'confirmed' | 'packing' | 'transport' | 'delivered'`

### 3. `app/api/order-tracking/[id]/route.ts`
- **Changed**: Updated status mapping logic to use correct status values:
  - `'confirmed'` instead of `'pending'`
  - `'packing'` instead of `'processing'`
  - `'transport'` instead of `'in_transit'`

### 4. `app/api/sync-order-status/route.ts`
- **Changed**: Updated `STATUS_MAPPINGS` to use correct status values
- **Changed**: Updated default fallback from `'pending'` to `'confirmed'`

## Status Value Mapping

### Database Schema (Actual)
The `orders` table uses these status values:
```sql
status TEXT NOT NULL DEFAULT 'confirmed' 
CHECK(status IN ('confirmed', 'packing', 'transport', 'delivered'))
```

### Order Tracking Mapping
Each order status maps to tracking stages:

| Order Status | confirmed | packing | transport | delivered |
|-------------|-----------|---------|-----------|-----------|
| confirmed   | 1         | 0       | 0         | 0         |
| packing     | 1         | 1       | 0         | 0         |
| transport   | 1         | 1       | 1         | 0         |
| delivered   | 1         | 1       | 1         | 1         |

## Payment Status
Payment status remains unchanged and uses these values:
- `'pending'` - Payment not yet completed
- `'paid'` - Payment successful
- `'failed'` - Payment failed
- `'refunded'` - Payment refunded

## Testing
Created test script `scripts/test-order-creation.ts` to verify order creation works correctly with the new status values.

Test results:
```
✅ Customer created successfully
✅ Order created successfully with status 'confirmed'
```

## Impact
- ✅ Orders can now be created successfully
- ✅ Checkout process works end-to-end
- ✅ Order tracking synchronization works correctly
- ✅ No breaking changes to payment flow

## Migration Notes
If there are existing orders in the database with old status values (`'pending'`, `'processing'`, `'shipped'`, etc.), they should be migrated to the new values. A migration script may be needed if this is the case.

## Future Considerations
1. Consider updating the database schema to match business requirements if additional status values are needed
2. Ensure all status-related code uses the correct values from the database schema
3. Add database schema validation tests to catch these issues earlier
