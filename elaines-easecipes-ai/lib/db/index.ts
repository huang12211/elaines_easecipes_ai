import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from './schema';
import path from 'path';
import fs from 'fs';

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'recipes.db');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, { schema });

// Only run migrations at server runtime, not during `next build`
if (process.env.NEXT_PHASE !== 'phase-production-build') {
  // Disable FK enforcement during migration — SQLite ignores PRAGMA foreign_keys inside
  // a transaction, so migrations that drop/recreate tables would fail otherwise.
  sqlite.pragma('foreign_keys = OFF');
  migrate(db, { migrationsFolder: path.join(process.cwd(), 'drizzle') });
  sqlite.pragma('foreign_keys = ON');
}
