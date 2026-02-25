import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { drizzle as drizzleMysql } from 'drizzle-orm/mysql2';
import pkg from 'pg';
import mysql from 'mysql2/promise';
const { Pool } = pkg;

import * as schemaPg from './schema.js';
import * as schemaMysql from './schema.mysql.js';

const url = process.env.DATABASE_URL || 'postgresql://sgo:sgodev@localhost:5432/sgo';

// Detecta dialeto pelo prefixo da DATABASE_URL
export const dialect = url.startsWith('mysql') ? 'mysql' : 'pg';

// Instância do banco exportada conforme dialeto detectado
let dbInstance: ReturnType<typeof drizzlePg<typeof schemaPg>> | ReturnType<typeof drizzleMysql<typeof schemaMysql>>;

if (dialect === 'mysql') {
  const pool = mysql.createPool(url);
  dbInstance = drizzleMysql(pool, { schema: schemaMysql, mode: 'default' });
} else {
  const pool = new Pool({ connectionString: url });
  dbInstance = drizzlePg(pool, { schema: schemaPg });
}

export const db = dbInstance;

// Schema ativo — usado por helpers e services
export const schema = dialect === 'mysql' ? schemaMysql : schemaPg;
