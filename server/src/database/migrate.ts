// Migration runner
import { pool } from './index.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function migrate() {
  console.log('[Migrate] Running migrations...');

  // Create migrations tracking table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const { rows } = await pool.query('SELECT id FROM _migrations WHERE name = $1', [file]);
    if (rows.length > 0) {
      console.log(`[Migrate] Skipping ${file} (already executed)`);
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    console.log(`[Migrate] Executing ${file}...`);

    try {
      await pool.query(sql);
      await pool.query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
      console.log(`[Migrate] ${file} executed successfully`);
    } catch (err) {
      console.error(`[Migrate] Error executing ${file}:`, err);
      process.exit(1);
    }
  }

  console.log('[Migrate] All migrations complete');
  await pool.end();
}

migrate().catch((err) => {
  console.error('[Migrate] Fatal error:', err);
  process.exit(1);
});
