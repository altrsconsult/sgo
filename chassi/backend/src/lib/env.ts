import 'dotenv/config';
import { config } from 'dotenv';
config();

const databaseUrl = process.env.DATABASE_URL || 'postgresql://sgo:sgodev@localhost:5432/sgo';

// Configurações de ambiente do chassi backend (no Docker usa PORT=3001)
export const env = {
  port: Number(process.env.PORT) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl,
  // Dialeto detectado pelo prefixo da DATABASE_URL: 'mysql' ou 'pg'
  dbDialect: databaseUrl.startsWith('mysql') ? 'mysql' : 'pg',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  // Nexus Central — quando configurado, chassi opera em modo gerenciado
  nexusUrl: process.env.NEXUS_URL || null,
  // Ativa host.docker.internal no devModulesSync
  dockerEnv: process.env.DOCKER_ENV === 'true',
  // Pastas de módulos do repo (só descoberta dev aceita slugs dessas pastas). Docker: montar ./modules e ./modules-lab.
  modulesDevDir: process.env.MODULES_DEV_DIR || null,
  modulesLabDevDir: process.env.MODULES_LAB_DEV_DIR || null,
  // Em dev: se true, aceita qualquer módulo que responda na varredura (ignora restrição de pasta).
  devModulesAcceptAll: process.env.DEV_MODULES_ACCEPT_ALL === 'true',
  // Modo Node.js single-process: serve frontend estático pelo backend (ex.: Hostinger)
  serveStatic: process.env.SERVE_STATIC === 'true',
  staticPath: process.env.STATIC_PATH || './public',
  // URL base da aplicação (para montar link de ativação; fallback: origem da requisição)
  publicAppUrl: process.env.PUBLIC_APP_URL || null,
};
