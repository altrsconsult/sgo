import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { modules } from '../db/schema.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

export const modulesRoutes = new Hono();

modulesRoutes.use('*', authenticate);

// GET /api/modules
modulesRoutes.get('/', async (c) => {
  const all = await db.query.modules.findMany({
    orderBy: (m, { asc }) => [asc(m.sortOrder), asc(m.name)],
  });
  return c.json(all);
});

// GET /api/modules/:id
modulesRoutes.get('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const mod = await db.query.modules.findFirst({ where: eq(modules.id, id) });
  if (!mod) return c.json({ error: 'Módulo não encontrado' }, 404);
  return c.json(mod);
});

// POST /api/modules
modulesRoutes.post('/', requireAdmin, async (c) => {
  const body = await c.req.json();
  const [created] = await db.insert(modules).values(body).returning();
  return c.json(created, 201);
});

// PATCH /api/modules/:id
modulesRoutes.patch('/:id', requireAdmin, async (c) => {
  const id = Number(c.req.param('id'));
  const body = await c.req.json();
  await db.update(modules).set({ ...body, updatedAt: new Date() }).where(eq(modules.id, id));
  const updated = await db.query.modules.findFirst({ where: eq(modules.id, id) });
  return c.json(updated);
});

// PATCH /api/modules/:id/toggle-active
modulesRoutes.patch('/:id/toggle-active', requireAdmin, async (c) => {
  const id = Number(c.req.param('id'));
  const mod = await db.query.modules.findFirst({ where: eq(modules.id, id) });
  if (!mod) return c.json({ error: 'Módulo não encontrado' }, 404);
  await db.update(modules).set({ active: !mod.active, updatedAt: new Date() }).where(eq(modules.id, id));
  return c.json({ active: !mod.active });
});

// DELETE /api/modules/:id
modulesRoutes.delete('/:id', requireAdmin, async (c) => {
  const id = Number(c.req.param('id'));
  await db.delete(modules).where(eq(modules.id, id));
  return c.json({ message: 'Módulo removido' });
});
