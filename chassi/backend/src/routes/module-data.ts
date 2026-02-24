import { Hono } from 'hono';
import { eq, and, like, ilike } from 'drizzle-orm';
import { db } from '../db/index.js';
import { moduleData, modules } from '../db/schema.js';
import { authenticate } from '../middleware/authenticate.js';

export const moduleDataRoutes = new Hono();

moduleDataRoutes.use('*', authenticate);

// GET /api/module-data/:slug/:entityType
moduleDataRoutes.get('/:slug/:entityType', async (c) => {
  const { slug, entityType } = c.req.param();
  const mod = await db.query.modules.findFirst({ where: eq(modules.slug, slug) });
  if (!mod) return c.json({ error: 'Módulo não encontrado' }, 404);

  const records = await db.query.moduleData.findMany({
    where: and(eq(moduleData.moduleId, mod.id), eq(moduleData.entityType, entityType)),
    orderBy: (d, { desc }) => [desc(d.createdAt)],
  });
  return c.json(records);
});

// GET /api/module-data/:slug/:entityType/:entityId
moduleDataRoutes.get('/:slug/:entityType/:entityId', async (c) => {
  const { slug, entityType, entityId } = c.req.param();
  const mod = await db.query.modules.findFirst({ where: eq(modules.slug, slug) });
  if (!mod) return c.json({ error: 'Módulo não encontrado' }, 404);

  const record = await db.query.moduleData.findFirst({
    where: and(
      eq(moduleData.moduleId, mod.id),
      eq(moduleData.entityType, entityType),
      eq(moduleData.entityId, entityId)
    ),
  });
  if (!record) return c.json({ error: 'Registro não encontrado' }, 404);
  return c.json(record);
});

// POST /api/module-data/:slug/:entityType
moduleDataRoutes.post('/:slug/:entityType', async (c) => {
  const { slug, entityType } = c.req.param();
  const mod = await db.query.modules.findFirst({ where: eq(modules.slug, slug) });
  if (!mod) return c.json({ error: 'Módulo não encontrado' }, 404);

  const body = await c.req.json();
  const [record] = await db.insert(moduleData).values({
    moduleId: mod.id,
    entityType,
    entityId: body.entityId || String(Date.now()),
    data: body.data || body,
  }).returning();
  return c.json(record, 201);
});

// PUT /api/module-data/:slug/:entityType/:entityId
moduleDataRoutes.put('/:slug/:entityType/:entityId', async (c) => {
  const { slug, entityType, entityId } = c.req.param();
  const mod = await db.query.modules.findFirst({ where: eq(modules.slug, slug) });
  if (!mod) return c.json({ error: 'Módulo não encontrado' }, 404);

  const body = await c.req.json();
  await db.update(moduleData).set({ data: body, updatedAt: new Date() }).where(
    and(eq(moduleData.moduleId, mod.id), eq(moduleData.entityType, entityType), eq(moduleData.entityId, entityId))
  );
  const updated = await db.query.moduleData.findFirst({
    where: and(eq(moduleData.moduleId, mod.id), eq(moduleData.entityType, entityType), eq(moduleData.entityId, entityId)),
  });
  return c.json(updated);
});

// PATCH /api/module-data/:slug/:entityType/:entityId
moduleDataRoutes.patch('/:slug/:entityType/:entityId', async (c) => {
  const { slug, entityType, entityId } = c.req.param();
  const mod = await db.query.modules.findFirst({ where: eq(modules.slug, slug) });
  if (!mod) return c.json({ error: 'Módulo não encontrado' }, 404);

  const body = await c.req.json();
  const existing = await db.query.moduleData.findFirst({
    where: and(eq(moduleData.moduleId, mod.id), eq(moduleData.entityType, entityType), eq(moduleData.entityId, entityId)),
  });
  if (!existing) return c.json({ error: 'Registro não encontrado' }, 404);

  const mergedData = { ...(existing.data as object), ...body };
  await db.update(moduleData).set({ data: mergedData, updatedAt: new Date() }).where(
    and(eq(moduleData.moduleId, mod.id), eq(moduleData.entityType, entityType), eq(moduleData.entityId, entityId))
  );
  return c.json({ ...existing, data: mergedData });
});

// DELETE /api/module-data/:slug/:entityType/:entityId
moduleDataRoutes.delete('/:slug/:entityType/:entityId', async (c) => {
  const { slug, entityType, entityId } = c.req.param();
  const mod = await db.query.modules.findFirst({ where: eq(modules.slug, slug) });
  if (!mod) return c.json({ error: 'Módulo não encontrado' }, 404);

  await db.delete(moduleData).where(
    and(eq(moduleData.moduleId, mod.id), eq(moduleData.entityType, entityType), eq(moduleData.entityId, entityId))
  );
  return c.json({ message: 'Registro excluído' });
});

// POST /api/module-data/:slug/:entityType/search — busca server-side
moduleDataRoutes.post('/:slug/:entityType/search', async (c) => {
  const { slug, entityType } = c.req.param();
  const mod = await db.query.modules.findFirst({ where: eq(modules.slug, slug) });
  if (!mod) return c.json({ error: 'Módulo não encontrado' }, 404);

  const { query } = await c.req.json();
  const records = await db.query.moduleData.findMany({
    where: and(eq(moduleData.moduleId, mod.id), eq(moduleData.entityType, entityType)),
  });

  // Filtro simples em memória — para queries complexas o módulo deve implementar sua própria rota
  const filtered = query
    ? records.filter((r) => JSON.stringify(r.data).toLowerCase().includes(String(query).toLowerCase()))
    : records;

  return c.json(filtered);
});
