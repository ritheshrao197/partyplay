import pg from 'pg';
import { config } from '../config.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.database.url,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error:', err);
});

export async function query(text: string, params?: unknown[]) {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  if (config.nodeEnv === 'development') {
    console.log(`[DB] ${text.substring(0, 60)}... (${duration}ms, ${result.rowCount} rows)`);
  }
  return result;
}

export async function getClient() {
  const client = await pool.connect();
  return client;
}

export default pool;
