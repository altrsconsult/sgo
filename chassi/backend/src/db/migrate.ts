import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pkg from 'pg';
const { Pool } = pkg;

// Script de migration — rodar com: pnpm db:migrate
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://sgo:sgodev@localhost:5432/sgo',
});

const db = drizzle(pool);

async function runMigrations() {
  console.log('Executando migrations...');
  await migrate(db, { migrationsFolder: './src/db/migrations' });
  console.log('Migrations concluídas.');
  await pool.end();
}

runMigrations().catch((err) => {
  console.error('Erro ao executar migrations:', err);
  process.exit(1);
});
