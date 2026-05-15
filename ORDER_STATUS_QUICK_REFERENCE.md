# Orderstatus - Snabbreferens

## Status Ordning

```
confirmed → packing → transport → delivered
```

## API Användning

### Uppdatera Status

```bash
curl -X PUT http://localhost:3000/api/order-tracking/[ORDER_ID] \
  -H "Content-Type: application/json" \
  -d '{"status": "packing"}'
```

**Giltiga värden:** `confirmed`, `packing`, `transport`, `delivered`

### Synkronisera Status

```bash
curl -X POST http://localhost:3000/api/sync-order-status \
  -H "Content-Type: application/json" \
  -d '{"order_id": "[ORDER_ID]"}'
```

## Status Mappning

| Status    | confirmed | packing | transport | delivered |
|-----------|-----------|---------|-----------|-----------|
| confirmed | ✅ 1      | ❌ 0    | ❌ 0      | ❌ 0      |
| packing   | ✅ 1      | ✅ 1    | ❌ 0      | ❌ 0      |
| transport | ✅ 1      | ✅ 1    | ✅ 1      | ❌ 0      |
| delivered | ✅ 1      | ✅ 1    | ✅ 1      | ✅ 1      |

## Regler

1. ✅ Status följer ordningen: confirmed → packing → transport → delivered
2. ✅ Alla tidigare steg sätts automatiskt till 1
3. ✅ Alla framtida steg sätts automatiskt till 0
4. ✅ Datum sätts automatiskt för nya steg
5. ✅ Befintliga datum bevaras

## Test

```bash
# Starta servern
npm run dev

# Kör test (i ny terminal)
npx tsx scripts/test-order-status-progression.ts
```

## Dokumentation

- **Detaljerad:** [docs/ORDER_STATUS_PROGRESSION.md](./docs/ORDER_STATUS_PROGRESSION.md)
- **System:** [docs/ORDER_TRACKING_SYSTEM.md](./docs/ORDER_TRACKING_SYSTEM.md)
- **Sammanfattning:** [docs/ORDER_STATUS_FIX_SUMMARY.md](./docs/ORDER_STATUS_FIX_SUMMARY.md)

## Exempel

### Scenario: Normal Progression

```bash
# 1. Order skapas (automatiskt confirmed)
# Status: confirmed (1,0,0,0)

# 2. Börja packa
curl -X PUT .../order-tracking/[ID] -d '{"status": "packing"}'
# Status: packing (1,1,0,0)

# 3. Skicka
curl -X PUT .../order-tracking/[ID] -d '{"status": "transport"}'
# Status: transport (1,1,1,0)

# 4. Leverera
curl -X PUT .../order-tracking/[ID] -d '{"status": "delivered"}'
# Status: delivered (1,1,1,1)
```

### Scenario: Gå Tillbaka

```bash
# Order är i transport (1,1,1,0)

# Gå tillbaka till packing
curl -X PUT .../order-tracking/[ID] -d '{"status": "packing"}'
# Status: packing (1,1,0,0)
# Notera: transport nollställs
```

## Felsökning

| Problem | Lösning |
|---------|---------|
| Flera statusar samtidigt | Kör sync-order-status |
| Steg hoppas över | Använd API:et, inte direkt SQL |
| Datum saknas | Uppdatera via API:et |

## Varningar

⚠️ **Använd INTE direkt SQL** - Använd API:et för att säkerställa korrekt logik

⚠️ **Breaking Change** - Gamla API-format fungerar inte längre

⚠️ **Migration Required** - Synkronisera befintliga ordrar med sync-order-status
