import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { systemSettings } from '../db/schema.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

export const settingsRoutes = new Hono();

settingsRoutes.use('*', authenticate, requireAdmin);

// GET /api/settings
settingsRoutes.get('/', async (c) => {
  const all = await db.query.systemSettings.findMany({
    orderBy: (s, { asc }) => [asc(s.category), asc(s.key)],
  });
  return c.json(all);
});

// GET /api/settings/:category
settingsRoutes.get('/:category', async (c) => {
  const category = c.req.param('category');
  const settings = await db.query.systemSettings.findMany({
    where: eq(systemSettings.category, category),
  });
  return c.json(settings);
});

// POST /api/settings — upsert de uma ou mais configurações
settingsRoutes.post('/', async (c) => {
  const body = await c.req.json();
  const items = Array.isArray(body) ? body : [body];

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
  return c.json({ message: 'Configurações salvas' });
});
