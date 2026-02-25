import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pkg from 'pg';
const { Pool } = pkg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Script de migration — rodar com: pnpm db:migrate (dev) ou node dist/db/migrate.js (produção)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://sgo:sgodev@localhost:5432/sgo',
});

const db = drizzle(pool);

async function runMigrations() {
  const migrationsFolder = path.join(__dirname, 'migrations');
  console.log('Executando migrations em', migrationsFolder, '...');
  await migrate(db, { migrationsFolder });
  console.log('Migrations concluídas.');
  await pool.end();
}

runMigrations().catch((err) => {
  console.error('Erro ao executar migrations:', err);
  process.exit(1);
});
