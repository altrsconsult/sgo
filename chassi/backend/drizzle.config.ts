import { defineConfig } from 'drizzle-kit';

// Configuração do drizzle-kit para PostgreSQL
// Usar: pnpm db:generate:pg
export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations/pg',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://sgo:sgodev@localhost:5432/sgo',
  },
  verbose: true,
  strict: true,
});
