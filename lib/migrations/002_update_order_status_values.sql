-- Migration: Uppdatera orderstatus från gamla till nya värden
-- Datum: 2026-05-13
-- Beskrivning: Ändrar orderstatus från pending/processing/shipped/delivered till confirmed/packing/transport/delivered

-- Steg 1: Uppdatera orders tabell
-- Mappa gamla statusar till nya:
-- pending -> confirmed
-- processing -> packing
-- shipped -> transport
-- delivered -> delivered (ingen ändring)
-- cancelled -> delivered (eller ta bort om det inte ska finnas)
-- returned -> delivered (eller ta bort om det inte ska finnas)

UPDATE orders SET status = 'confirmed' WHERE status = 'pending';
UPDATE orders SET status = 'packing' WHERE status = 'processing';
UPDATE orders SET status = 'transport' WHERE status = 'shipped';
-- delivered förblir delivered
-- cancelled och returned sätts till confirmed (eller ta bort dessa rader om de inte ska finnas)
UPDATE orders SET status = 'confirmed' WHERE status IN ('cancelled', 'returned');

-- Steg 2: Uppdatera shipments tabell
-- Mappa gamla statusar till nya:
-- pending -> confirmed
-- picked_up -> packing
-- in_transit -> transport
-- out_for_delivery -> transport
-- delivered -> delivered
-- failed -> confirmed
-- returned -> confirmed

UPDATE shipments SET status = 'confirmed' WHERE status IN ('pending', 'failed', 'returned');
UPDATE shipments SET status = 'packing' WHERE status = 'picked_up';
UPDATE shipments SET status = 'transport' WHERE status IN ('in_transit', 'out_for_delivery');
-- delivered förblir delivered

-- Steg 3: Verifiera ändringarna
SELECT 'Orders status distribution:' as info;
SELECT status, COUNT(*) as count FROM orders GROUP BY status;

SELECT 'Shipments status distribution:' as info;
SELECT status, COUNT(*) as count FROM shipments GROUP BY status;
