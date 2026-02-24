import { Hono } from 'hono';
import { eq, and } from 'drizzle-orm';
import { db } from '../db/index.js';
import { moduleConfig, modules } from '../db/schema.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

export const moduleConfigRoutes = new Hono();

moduleConfigRoutes.use('*', authenticate);

// GET /api/module-config/:slug
moduleConfigRoutes.get('/:slug', async (c) => {
  const slug = c.req.param('slug');
  const mod = await db.query.modules.findFirst({ where: eq(modules.slug, slug) });
  if (!mod) return c.json({ error: 'Módulo não encontrado' }, 404);

  const configs = await db.query.moduleConfig.findMany({
    where: eq(moduleConfig.moduleId, mod.id),
  });
  return c.json(configs);
});

// GET /api/module-config/:slug/:key
moduleConfigRoutes.get('/:slug/:key', async (c) => {
  const slug = c.req.param('slug');
  const key = c.req.param('key');
  const mod = await db.query.modules.findFirst({ where: eq(modules.slug, slug) });
  if (!mod) return c.json({ error: 'Módulo não encontrado' }, 404);

  const config = await db.query.moduleConfig.findFirst({
    where: and(eq(moduleConfig.moduleId, mod.id), eq(moduleConfig.key, key)),
  });
  return c.json(config || null);
});

// GET /api/module-config/public/:slug/:key — sem auth
moduleConfigRoutes.get('/public/:slug/:key', async (c) => {
  const slug = c.req.param('slug');
  const key = c.req.param('key');
  const mod = await db.query.modules.findFirst({ where: eq(modules.slug, slug) });
  if (!mod) return c.json({ error: 'Módulo não encontrado' }, 404);

  const config = await db.query.moduleConfig.findFirst({
    where: and(eq(moduleConfig.moduleId, mod.id), eq(moduleConfig.key, key)),
  });
  return c.json(config || null);
});

// POST /api/module-config/:slug
moduleConfigRoutes.post('/:slug', requireAdmin, async (c) => {
  const slug = c.req.param('slug');
  const mod = await db.query.modules.findFirst({ where: eq(modules.slug, slug) });
  if (!mod) return c.json({ error: 'Módulo não encontrado' }, 404);

  const body = await c.req.json();
  const [saved] = await db.insert(moduleConfig).values({
    moduleId: mod.id,
    key: body.key,
    value: body.value,
    type: body.type || 'string',
  }).onConflictDoUpdate({
    target: [moduleConfig.moduleId, moduleConfig.key],
    set: { value: body.value, type: body.type || 'string', updatedAt: new Date() },
  }).returning();
  return c.json(saved);
});

// POST /api/module-config/:slug/bulk
moduleConfigRoutes.post('/:slug/bulk', requireAdmin, async (c) => {
  const slug = c.req.param('slug');
  const mod = await db.query.modules.findFirst({ where: eq(modules.slug, slug) });
  if (!mod) return c.json({ error: 'Módulo não encontrado' }, 404);

  const { configs } = await c.req.json();
  for (const item of configs) {
    await db.insert(moduleConfig).values({
      moduleId: mod.id,
      key: item.key,
      value: item.value,
      type: item.type || 'string',
    }).onConflictDoUpdate({
      target: [moduleConfig.moduleId, moduleConfig.key],
      set: { value: item.value, updatedAt: new Date() },
    });
  }
  return c.json({ message: 'Configurações salvas' });
});

// DELETE /api/module-config/:slug/:key
moduleConfigRoutes.delete('/:slug/:key', requireAdmin, async (c) => {
  const slug = c.req.param('slug');
  const key = c.req.param('key');
  const mod = await db.query.modules.findFirst({ where: eq(modules.slug, slug) });
  if (!mod) return c.json({ error: 'Módulo não encontrado' }, 404);

  await db.delete(moduleConfig).where(
    and(eq(moduleConfig.moduleId, mod.id), eq(moduleConfig.key, key))
  );
  return c.json({ message: 'Configuração removida' });
});
