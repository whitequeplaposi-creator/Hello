/**
 * Check Orders Table Schema
 * Shows the current schema and constraints for the orders table
 */

import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function checkSchema() {
  try {
    console.log('\n📊 Checking Orders Table Schema');
    console.log('═══════════════════════════════════════════════════════════\n');

    // Get table schema
    const schemaResult = await client.execute({
      sql: "SELECT sql FROM sqlite_master WHERE type='table' AND name='orders'",
      args: []
    });

    if (schemaResult.rows.length > 0) {
      console.log('Orders Table Schema:');
      console.log('───────────────────────────────────────────────────────────');
      console.log(schemaResult.rows[0].sql);
      console.log('───────────────────────────────────────────────────────────\n');
    }

    // Check current status values in use
    const statusResult = await client.execute({
      sql: "SELECT DISTINCT status, COUNT(*) as count FROM orders GROUP BY status ORDER BY count DESC",
      args: []
    });

    console.log('Current Status Values in Database:');
    console.log('───────────────────────────────────────────────────────────');
    for (const row of statusResult.rows) {
      console.log(`  ${row.status}: ${row.count} orders`);
    }
    console.log('───────────────────────────────────────────────────────────\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    client.close();
  }
}

checkSchema();
