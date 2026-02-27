import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import path from 'path';
import fs from 'fs/promises';
import { db } from '../db/index.js';
import { modules } from '../db/schema.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

export const modulesRoutes = new Hono();

modulesRoutes.use('*', authenticate);

/** Enriquece módulo com remoteUrl quando instalado (standalone iframe) e sem remoteEntry. */
function withRemoteUrl(m: { type: string | null; path: string | null; remoteEntry: string | null; slug: string } & Record<string, unknown>): Record<string, unknown> {
  const row = { ...m };
  if (m.type === 'installed' && m.path && !m.remoteEntry) {
    (row as Record<string, string>).remoteUrl = `/modules-assets/${m.slug}/dist/index.html`;
  }
  return row;
}

// GET /api/modules — lista todos os módulos (qualquer usuário autenticado)
// Módulos type='dev' não exigem admin nem permissão explícita; aparecem para todos.
modulesRoutes.get('/', async (c) => {
  const all = await db.query.modules.findMany({
    orderBy: (m, { asc }) => [asc(m.sortOrder), asc(m.name)],
  });
  return c.json(all.map(withRemoteUrl));
});

// GET /api/modules/:id
modulesRoutes.get('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const mod = await db.query.modules.findFirst({ where: eq(modules.id, id) });
  if (!mod) return c.json({ error: 'Módulo não encontrado' }, 404);
  return c.json(withRemoteUrl(mod));
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
  
  // Buscar módulo antes de excluir para pegar o slug e type
  const mod = await db.query.modules.findFirst({ where: eq(modules.id, id) });
  if (!mod) return c.json({ error: 'Módulo não encontrado' }, 404);

  // Excluir do banco
  await db.delete(modules).where(eq(modules.id, id));

  // Se for um módulo instalado (zip), limpar a pasta de arquivos
  if (mod.type === 'installed') {
    try {
      const MODULES_STORAGE_PATH = process.env.MODULES_STORAGE_PATH || './modules_storage';
      const modulePath = path.join(MODULES_STORAGE_PATH, mod.slug);
      await fs.rm(modulePath, { recursive: true, force: true });
    } catch (err) {
      console.error(`Erro ao remover arquivos do módulo ${mod.slug}:`, err);
    }
  }

  return c.json({ message: 'Módulo removido' });
});
