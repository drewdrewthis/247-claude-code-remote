import * as schema from './schema';

// In LOCAL_MODE (or with a non-Neon DATABASE_URL) a standard TCP Postgres
// driver is used so no traffic leaves the machine. Otherwise the Neon HTTP
// driver is kept.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDb = any;

let _db: AnyDb = null;

function createDb(): AnyDb {
  const url = process.env.DATABASE_URL!;
  const isLocal = process.env.LOCAL_MODE === 'true' || !url.includes('neon.tech');
  if (isLocal) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { drizzle } = require('drizzle-orm/node-postgres');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Pool } = require('pg');
    return drizzle(new Pool({ connectionString: url }), { schema });
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { neon } = require('@neondatabase/serverless');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { drizzle } = require('drizzle-orm/neon-http');
  return drizzle(neon(url), { schema });
}

export function getDb(): AnyDb {
  if (!_db) {
    _db = createDb();
  }
  return _db;
}

// For backwards compatibility - will throw at runtime if env vars missing
export const db = new Proxy({} as AnyDb, {
  get(_target, prop) {
    return getDb()[prop];
  },
});

export * from './schema';
