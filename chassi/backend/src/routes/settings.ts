import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { systemSettings, auditLogs, type User } from '../db/schema.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

type AuthVariables = { Variables: { user: User } };
export const settingsRoutes = new Hono<AuthVariables>();

settingsRoutes.use('*', authenticate, requireAdmin);

// GET /api/settings
settingsRoutes.get('/', async (c) => {
  const all = await db.query.systemSettings.findMany({
    orderBy: (s, { asc }) => [asc(s.category), asc(s.key)],
  });
  return c.json(all);
});

// GET /api/settings/general — nome/email, tema, layout, logo (para Admin > Configurações)
settingsRoutes.get('/general', async (c) => {
  const all = await db.query.systemSettings.findMany({
    where: eq(systemSettings.category, 'whitelabel'),
  });
  const byKey: Record<string, string> = {};
  for (const s of all) byKey[s.key] = s.value ?? '';
  return c.json({
    orgName: byKey['app.name'] ?? '',
    orgEmail: byKey['app.org_email'] ?? byKey['app.email'] ?? '',
    ui_theme: byKey['ui_theme'] ?? 'default',
    ui_layout: byKey['ui_layout'] ?? 'gallery',
    logo_format: byKey['app.logo_format'] ?? 'icon',
    logoFileId: byKey['app.logo_file_id'] ?? null,
    logoDarkFileId: byKey['app.logo_dark_file_id'] ?? null,
  });
});

// GET /api/settings/:category
settingsRoutes.get('/:category', async (c) => {
  const category = c.req.param('category');
  const settings = await db.query.systemSettings.findMany({
    where: eq(systemSettings.category, category),
  });
  return c.json(settings);
});

// POST /api/settings — upsert de uma ou mais configurações; aceita { category, settings: { orgName, orgEmail } }
settingsRoutes.post('/', async (c) => {
  const body = await c.req.json();
  let items: { key: string; value: string | null; category: string; description?: string }[];

  if (body.settings && typeof body.settings === 'object' && body.category === 'general') {
    const s = body.settings;
    items = [
      { key: 'app.name', value: s.orgName ?? null, category: 'whitelabel', description: 'Nome da aplicação' },
      { key: 'app.org_email', value: s.orgEmail ?? null, category: 'whitelabel', description: 'E-mail da organização' },
      { key: 'ui_theme', value: s.ui_theme ?? null, category: 'whitelabel', description: 'Tema da interface' },
      { key: 'ui_layout', value: s.ui_layout ?? null, category: 'whitelabel', description: 'Layout (galeria/sidebar)' },
      { key: 'app.logo_format', value: s.logo_format ?? null, category: 'whitelabel', description: 'Formato do logo (icon/horizontal)' },
      { key: 'app.logo_file_id', value: s.logoFileId ?? null, category: 'whitelabel', description: 'ID do arquivo do logo tema claro' },
      { key: 'app.logo_dark_file_id', value: s.logoDarkFileId ?? null, category: 'whitelabel', description: 'ID do arquivo do logo tema escuro' },
    ];
  } else if (Array.isArray(body)) {
    items = body;
  } else {
    items = [body];
  }

  const user = c.get('user');
  for (const item of items) {
    await db.insert(systemSettings).values({
      key: item.key,
      value: item.value,
      category: item.category,
      description: item.description,
    }).onConflictDoUpdate({
      target: systemSettings.key,
      set: { value: item.value, updatedAt: new Date() },
    });
  }
  await db.insert(auditLogs).values({
    userId: user.id,
    userName: user.name,
    action: 'settings.update',
    entityType: 'system_settings',
    details: { keys: items.map((i) => i.key) },
    ipAddress: c.req.header('x-forwarded-for') ?? c.req.header('x-real-ip') ?? null,
    userAgent: c.req.header('user-agent') ?? null,
  });
  return c.json({ message: 'Configurações salvas' });
});
