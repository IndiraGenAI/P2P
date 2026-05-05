/**
 * Applies backend/db/database/migrations/20260505_rate_contract_entity_addresses.sql
 * using DB_* vars from main-service/.env (same as Nest APP_ENV.db).
 */
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

loadEnvFile(path.join(__dirname, '..', '.env'));

const migrationFile = path.join(
  __dirname,
  '..',
  '..',
  'db',
  'database',
  'migrations',
  '20260505_rate_contract_entity_addresses.sql',
);

async function main() {
  if (!fs.existsSync(migrationFile)) {
    console.error('[migrate] File not found:', migrationFile);
    process.exit(1);
  }

  let sql = fs.readFileSync(migrationFile, 'utf8');
  sql = sql
    .split(/\r?\n/)
    .filter((line) => !/^\s*--/.test(line))
    .join('\n');

  const host = process.env.DB_HOST || 'localhost';
  const port = Number(process.env.DB_PORT || 5432);
  const user = process.env.DB_USERNAME || 'postgres';
  const password = process.env.DB_PASSWORD || 'postgres';
  const database = process.env.DB_DATABASE || 'p2p_org';
  const useSsl = String(process.env.DB_SSL || '').toLowerCase() === 'true';

  const client = new Client({
    host,
    port,
    user,
    password,
    database,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
  });

  await client.connect();
  try {
    const statements = sql
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean);
    for (const stmt of statements) {
      await client.query(stmt);
      console.log('[migrate] OK:', stmt.slice(0, 100));
    }
    console.log('[migrate] rate_contracts shipping_address / billing_address columns applied.');
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('[migrate] Failed:', err.message || err);
  process.exit(1);
});
