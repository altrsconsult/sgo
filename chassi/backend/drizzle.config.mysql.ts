import { defineConfig } from 'drizzle-kit';

// Configuração do drizzle-kit para MySQL
// Usar: pnpm db:generate:mysql
export default defineConfig({
  schema: './src/db/schema.mysql.ts',
  out: './src/db/migrations/mysql',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'mysql://sgo:sgodev@localhost:3306/sgo',
  },
  verbose: true,
  strict: true,
});
