import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import { env } from './lib/env.js';
import { authRoutes } from './routes/auth.js';
import { usersRoutes } from './routes/users.js';
import { groupsRoutes } from './routes/groups.js';
import { modulesRoutes } from './routes/modules.js';
import { permissionsRoutes } from './routes/permissions.js';
import { moduleConfigRoutes } from './routes/module-config.js';
import { moduleDataRoutes } from './routes/module-data.js';
import { storageRoutes } from './routes/storage.js';
import { ticketsRoutes } from './routes/tickets.js';
import { auditRoutes } from './routes/audit.js';
import { webhooksRoutes } from './routes/webhooks.js';
import { settingsRoutes } from './routes/settings.js';
import { setupRoutes } from './routes/setup.js';
import { publicRoutes } from './routes/public.js';
import { pulseRoutes } from './routes/pulse.js';
import { nexusRoutes } from './routes/nexus.js';
import { uploadModuleRoutes } from './routes/upload-module.js';
import { installFromLinkRoutes } from './routes/install-from-link.js';
import { healthRoutes } from './routes/health.js';
import { moduleAssetsRoutes } from './routes/module-assets.js';

import { loadInstalledModules } from './services/moduleLoader.js';
import { devModulesSync } from './services/devModulesSync.js';
import { startNexusPulse } from './services/nexusPulse.js';
import { reportToNexusCentral } from './services/nexusReport.js';
import { seedDevData } from './db/seed.js';
import { db } from './db/index.js';

const app = new Hono();

// Middlewares globais
app.use('*', cors({ origin: '*', allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'] }));
app.use('*', logger());

// Health check sem autenticação (Traefik/Docker usam este endpoint)
app.route('/api/health', healthRoutes);

// Assets de módulos instalados (ZIP) — iframe standalone; sem auth para o browser carregar
app.route('/modules-assets', moduleAssetsRoutes);

// Rotas públicas (sem auth)
app.route('/api/public', publicRoutes);
app.route('/api/setup', setupRoutes);
app.route('/api/pulse', pulseRoutes);

// Rotas autenticadas
app.route('/api/auth', authRoutes);
app.route('/api/users', usersRoutes);
app.route('/api/groups', groupsRoutes);
app.route('/api/modules', modulesRoutes);
app.route('/api/permissions', permissionsRoutes);
app.route('/api/module-config', moduleConfigRoutes);
app.route('/api/module-data', moduleDataRoutes);
app.route('/api/storage', storageRoutes);
app.route('/api/tickets', ticketsRoutes);
app.route('/api/audit', auditRoutes);
app.route('/api/webhooks', webhooksRoutes);
app.route('/api/settings', settingsRoutes);
app.route('/api/upload-module', uploadModuleRoutes);
app.route('/api/install-from-link', installFromLinkRoutes);

// Rotas M2M para o Nexus Central
app.route('/api/nexus', nexusRoutes);

// Modo Node.js single-process: serve frontend buildado como estáticos (ex.: Hostinger)
// Ativado pela variável SERVE_STATIC=true no .env
if (env.serveStatic) {
  // Assets com hash (cache longo)
  app.use('/assets/*', serveStatic({ root: env.staticPath }));
  // SPA fallback: rotas não-API retornam index.html
  app.use('*', async (c, next) => {
    if (c.req.path.startsWith('/api') || c.req.path.startsWith('/modules-assets')) {
      return next();
    }
    return serveStatic({ path: `${env.staticPath}/index.html` })(c, next);
  });
}

// Em dev: garante seed antes de aceitar conexões para /api/setup/status retornar installed
async function ensureDevSeed() {
  if (env.nodeEnv === 'production') return;
  const adminCount = await db.query.users.findMany({ where: (u, { eq }) => eq(u.role, 'admin') });
  if (adminCount.length === 0) {
    await seedDevData();
    console.log('Dados de desenvolvimento criados (admin/admin123).');
  }
}

async function initializeAsync() {
  try {
    // Carrega módulos instalados
    await loadInstalledModules();
    console.log('Módulos instalados carregados.');

    // Sincronização de módulos em desenvolvimento
    devModulesSync();

    // Modo gerenciado: registra no Nexus e inicia pulse
    await reportToNexusCentral();
    await startNexusPulse();
  } catch (err) {
    console.error('Erro durante inicialização:', err);
  }
}

async function main() {
  await ensureDevSeed();
  serve({ fetch: app.fetch, port: env.port }, () => {
    console.log(`Chassi backend rodando na porta ${env.port} [${env.nodeEnv}]`);
    initializeAsync();
  });
}
main().catch((err) => {
  console.error('Falha ao iniciar:', err);
  process.exit(1);
});
