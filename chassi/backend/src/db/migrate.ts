import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const url = process.env.DATABASE_URL || 'postgresql://sgo:sgodev@localhost:5432/sgo';

// Detecta dialeto pelo prefixo da DATABASE_URL
const dialect = url.startsWith('mysql') ? 'mysql' : 'pg';

async function runMigrations() {
  if (dialect === 'mysql') {
    const { drizzle } = await import('drizzle-orm/mysql2');
    const { migrate } = await import('drizzle-orm/mysql2/migrator');
    const mysql = await import('mysql2/promise');

    const pool = mysql.createPool(url);
    const db = drizzle(pool);
    const migrationsFolder = path.join(__dirname, 'migrations/mysql');

    console.log('Executando migrations MySQL em', migrationsFolder, '...');
    await migrate(db, { migrationsFolder });
    console.log('Migrations MySQL concluídas.');
    await pool.end();
  } else {
    const { drizzle } = await import('drizzle-orm/node-postgres');
    const { migrate } = await import('drizzle-orm/node-postgres/migrator');
    const { default: pkg } = await import('pg');
    const { Pool } = pkg as unknown as { Pool: typeof import('pg').Pool };

    const pool = new Pool({ connectionString: url });
    const db = drizzle(pool);
    const migrationsFolder = path.join(__dirname, 'migrations/pg');

    console.log('Executando migrations PostgreSQL em', migrationsFolder, '...');
    await migrate(db, { migrationsFolder });
    console.log('Migrations PostgreSQL concluídas.');
    await pool.end();
  }
}

runMigrations().catch((err) => {
  console.error('Erro ao executar migrations:', err);
  process.exit(1);
});
