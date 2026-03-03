import 'dotenv/config';
import { config } from 'dotenv';
config();

/** Remove aspas duplas/simples ao redor do valor (ex.: Infisical/export .env com "valor") */
function stripQuotes(s: string | undefined): string | undefined {
  if (s == null || s === '') return s;
  const t = s.trim();
  if (t.length >= 2 && ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))))
    return t.slice(1, -1);
  return s;
}

function envStr(key: string, fallback: string | undefined): string | undefined {
  const v = process.env[key] ?? fallback;
  return v !== undefined ? stripQuotes(v) ?? undefined : undefined;
}

const databaseUrl = envStr('DATABASE_URL', undefined) || 'postgresql://sgo:sgodev@localhost:5432/sgo';

// Configurações de ambiente do chassi backend (no Docker usa PORT=3001)
export const env = {
  port: Number(envStr('PORT', undefined) ?? '') || 3001,
  nodeEnv: envStr('NODE_ENV', undefined) || 'development',
  databaseUrl,
  // Dialeto detectado pelo prefixo da DATABASE_URL: 'mysql' ou 'pg'
  dbDialect: databaseUrl.startsWith('mysql') ? 'mysql' : 'pg',
  jwtSecret: envStr('JWT_SECRET', undefined) || 'dev-secret-change-in-production',
  // Nexus Central — quando configurado, chassi opera em modo gerenciado
  nexusUrl: envStr('NEXUS_URL', undefined) || null,
  // Ativa host.docker.internal no devModulesSync
  dockerEnv: envStr('DOCKER_ENV', undefined) === 'true',
  // Pastas de módulos do repo (só descoberta dev aceita slugs dessas pastas). Docker: montar ./modules e ./modules-lab.
  modulesDevDir: envStr('MODULES_DEV_DIR', undefined) || null,
  modulesLabDevDir: envStr('MODULES_LAB_DEV_DIR', undefined) || null,
  // Em dev: se true, aceita qualquer módulo que responda na varredura (ignora restrição de pasta).
  devModulesAcceptAll: envStr('DEV_MODULES_ACCEPT_ALL', undefined) === 'true',
  // Modo Node.js single-process: serve frontend estático pelo backend (ex.: Hostinger)
  serveStatic: envStr('SERVE_STATIC', undefined) === 'true',
  staticPath: envStr('STATIC_PATH', undefined) || './public',
  // URL base da aplicação (para montar link de ativação; fallback: origem da requisição)
  publicAppUrl: envStr('PUBLIC_APP_URL', undefined) || null,
  // Segredo para reset de senha do admin em produção (POST /api/setup/reset-admin-password)
  resetAdminSecret: envStr('SGO_RESET_ADMIN_SECRET', undefined) || null,
  // Admin inicial a partir de env (dev e produção); aspas vindas de Infisical/export .env são removidas
  adminUsername: envStr('SGO_ADMIN_USERNAME', undefined) || envStr('ADMIN_USERNAME', undefined) || null,
  adminPassword: envStr('SGO_ADMIN_PASSWORD', undefined) || envStr('ADMIN_PASSWORD', undefined) || null,
  adminEmail: envStr('SGO_ADMIN_EMAIL', undefined) || envStr('ADMIN_EMAIL', undefined) || null,
  adminName: envStr('SGO_ADMIN_NAME', undefined) || envStr('ADMIN_NAME', undefined) || null,
};
