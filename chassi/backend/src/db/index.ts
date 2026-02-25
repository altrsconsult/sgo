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

// Tipo unificado para compilação (evita "This expression is not callable" na união Pg|MySQL)
export type Db = ReturnType<typeof drizzlePg<typeof schemaPg>>;

// Instância do banco; em runtime é Pg ou MySQL conforme dialect; tipamos como Db para o restante do código
let dbInstance: Db;

if (dialect === 'mysql') {
  const pool = mysql.createPool(url);
  dbInstance = drizzleMysql(pool, { schema: schemaMysql, mode: 'default' }) as unknown as Db;
} else {
  const pool = new Pool({ connectionString: url });
  dbInstance = drizzlePg(pool, { schema: schemaPg });
}

export const db = dbInstance;

// Schema ativo — usado por helpers e services
export const schema = dialect === 'mysql' ? schemaMysql : schemaPg;
