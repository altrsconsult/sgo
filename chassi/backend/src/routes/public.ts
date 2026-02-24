import { Hono } from 'hono';
import { db } from '../db/index.js';
import { systemSettings } from '../db/schema.js';
import { inArray } from 'drizzle-orm';

// Endpoints públicos sem autenticação
export const publicRoutes = new Hono();

// GET /api/public/settings — retorna configurações de whitelabel
// Lido pelo frontend na inicialização para aplicar branding
publicRoutes.get('/settings', async (c) => {
  const whitelabelKeys = [
    'app.name',
    'app.logo_url',
    'app.logo_dark_url',
    'app.primary_color',
    'app.favicon_url',
    'app.custom_css',
  ];

  const settings = await db.query.systemSettings.findMany({
    where: inArray(systemSettings.key, whitelabelKeys),
  });

  // Converte array de settings em objeto chave/valor
  const result = Object.fromEntries(
    settings.map((s) => [s.key, s.value])
  );

  // Garante que todas as chaves existem com defaults
  const defaults: Record<string, string | null> = {
    'app.name': 'SGO',
    'app.logo_url': null,
    'app.logo_dark_url': null,
    'app.primary_color': '#6366f1',
    'app.favicon_url': null,
    'app.custom_css': null,
  };

  return c.json({ ...defaults, ...result });
});

// GET /api/public/form-fill-base-url — URL base para preenchimento de formulários
publicRoutes.get('/form-fill-base-url', async (c) => {
  const setting = await db.query.systemSettings.findFirst({
    // @ts-ignore
    where: (s, { eq }) => eq(s.key, 'app.base_url'),
  });
  return c.json({ url: setting?.value || null });
});
