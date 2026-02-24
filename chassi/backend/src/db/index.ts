import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from './schema.js';

// Pool configuration using environment variables
// DATABASE_URL is preferred, but fallbacks are provided
const connectionString = process.env.DATABASE_URL || 'postgresql://sgo:sgodev@localhost:5432/sgo';

const pool = new Pool({
  connectionString,
});

export const db = drizzle(pool, { schema });
