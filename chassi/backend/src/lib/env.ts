import 'dotenv/config';
import { config } from 'dotenv';
config();

// Configurações de ambiente do chassi backend (no Docker usa PORT=3001)
export const env = {
  port: Number(process.env.PORT) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://sgo:sgodev@localhost:5432/sgo',
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
};
