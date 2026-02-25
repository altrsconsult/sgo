import { Hono } from 'hono';
import { eq, inArray } from 'drizzle-orm';
import fs from 'fs/promises';
import path from 'path';
import { db } from '../db/index.js';
import { systemSettings, storageFiles } from '../db/schema.js';

// Endpoints públicos sem autenticação
export const publicRoutes = new Hono();

const PUBLIC_SETTINGS_KEYS = [
  'app.name',
  'app.logo_url',
  'app.logo_dark_url',
  'app.logo_file_id',
  'app.logo_dark_file_id',
  'app.logo_format',
  'app.primary_color',
  'app.favicon_url',
  'app.custom_css',
  'ui_theme',
  'ui_layout',
];

// GET /api/public/settings — retorna configurações de whitelabel + tema + layout
publicRoutes.get('/settings', async (c) => {
  const settings = await db.query.systemSettings.findMany({
    where: inArray(systemSettings.key, PUBLIC_SETTINGS_KEYS),
  });

  const result: Record<string, string | null> = Object.fromEntries(
    settings.map((s) => [s.key, s.value])
  );

  const defaults: Record<string, string | null> = {
    'app.name': 'SGO',
    'app.logo_url': null,
    'app.logo_dark_url': null,
    'app.logo_format': 'icon',
    'app.primary_color': '#6366f1',
    'app.favicon_url': null,
    'app.custom_css': null,
    'ui_theme': 'default',
    'ui_layout': 'gallery',
  };

  const out = { ...defaults, ...result };
  if (out['app.logo_file_id']) out['app.logo_url'] = '/api/public/logo/light';
  if (out['app.logo_dark_file_id']) out['app.logo_dark_url'] = '/api/public/logo/dark';
  return c.json(out);
});

// GET /api/public/logo/light e /dark — serve o logo enviado (sem auth) para uso no header
async function serveLogo(c: any, key: 'app.logo_file_id' | 'app.logo_dark_file_id') {
  const row = await db.query.systemSettings.findFirst({
    where: eq(systemSettings.key, key),
  });
  const fileId = row?.value;
  if (!fileId) return c.json({ error: 'Logo não configurado' }, 404);
  const record = await db.query.storageFiles.findFirst({ where: eq(storageFiles.id, fileId) });
  if (!record || record.deletedAt) return c.json({ error: 'Arquivo não encontrado' }, 404);
  const fullPath = path.isAbsolute(record.storagePath) ? record.storagePath : path.join(process.cwd(), record.storagePath);
  const buffer = await fs.readFile(fullPath);
  return new Response(buffer, {
    headers: {
      'Content-Type': record.mimeType || 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
publicRoutes.get('/logo/light', (c) => serveLogo(c, 'app.logo_file_id'));
publicRoutes.get('/logo/dark', (c) => serveLogo(c, 'app.logo_dark_file_id'));

// GET /api/public/form-fill-base-url — URL base para preenchimento de formulários
publicRoutes.get('/form-fill-base-url', async (c) => {
  const setting = await db.query.systemSettings.findFirst({
    // @ts-ignore
    where: (s, { eq }) => eq(s.key, 'app.base_url'),
  });
  return c.json({ url: setting?.value || null });
});
