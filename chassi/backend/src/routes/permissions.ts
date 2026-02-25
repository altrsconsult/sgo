import { Hono } from 'hono';
import { eq, and } from 'drizzle-orm';
import { db } from '../db/index.js';
import { modulePermissions, modules, userGroups, users } from '../db/schema.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

export const permissionsRoutes = new Hono();

permissionsRoutes.use('*', authenticate, requireAdmin);

// GET /api/permissions/user/:userId — permissões de um usuário (schema sem relations)
permissionsRoutes.get('/user/:userId', async (c) => {
  const userId = Number(c.req.param('userId'));
  const perms = await db.query.modulePermissions.findMany({
    where: eq(modulePermissions.userId, userId),
  });
  return c.json(perms);
});

// GET /api/permissions/group/:groupId
permissionsRoutes.get('/group/:groupId', async (c) => {
  const groupId = Number(c.req.param('groupId'));
  const perms = await db.query.modulePermissions.findMany({
    where: eq(modulePermissions.groupId, groupId),
  });
  return c.json(perms);
});

// GET /api/permissions/module/:moduleId
permissionsRoutes.get('/module/:moduleId', async (c) => {
  const moduleId = Number(c.req.param('moduleId'));
  const perms = await db.query.modulePermissions.findMany({
    where: eq(modulePermissions.moduleId, moduleId),
  });
  return c.json(perms);
});

// GET /api/permissions/matrix — matriz completa usuário × módulo e grupo × módulo (frontend espera permissions como Record)
permissionsRoutes.get('/matrix', async (c) => {
  const allModules = await db.query.modules.findMany({ where: eq(modules.active, true) });
  const allUsers = await db.query.users.findMany({ columns: { password: false } });
  const allGroups = await db.query.userGroups.findMany({ orderBy: (g, { asc }) => [asc(g.name)] });
  const allPerms = await db.query.modulePermissions.findMany();
  const permissions: Record<string, number> = {};
  for (const p of allPerms) {
    if (p.allowed) {
      if (p.userId != null) permissions[`user_${p.userId}_${p.moduleId}`] = 1;
      if (p.groupId != null) permissions[`group_${p.groupId}_${p.moduleId}`] = 1;
    }
  }
  return c.json({ modules: allModules, users: allUsers, groups: allGroups, permissions });
});

// GET /api/permissions/check/:userId/:moduleSlug
permissionsRoutes.get('/check/:userId/:moduleSlug', async (c) => {
  const userId = Number(c.req.param('userId'));
  const moduleSlug = c.req.param('moduleSlug');

  const mod = await db.query.modules.findFirst({ where: eq(modules.slug, moduleSlug) });
  if (!mod) return c.json({ allowed: false });

  const perm = await db.query.modulePermissions.findFirst({
    where: and(eq(modulePermissions.moduleId, mod.id), eq(modulePermissions.userId, userId)),
  });
  return c.json({ allowed: perm?.allowed ?? false });
});

// GET /api/permissions/allowed-modules/:userId — módulos permitidos para o usuário (join manual)
// Módulos type='dev' são sempre incluídos (não exigem permissão explícita nem admin).
permissionsRoutes.get('/allowed-modules/:userId', async (c) => {
  const userId = Number(c.req.param('userId'));
  const perms = await db.query.modulePermissions.findMany({
    where: and(eq(modulePermissions.userId, userId), eq(modulePermissions.allowed, true)),
  });
  const mods = await db.query.modules.findMany({
    where: eq(modules.active, true),
  });
  const allowedIds = new Set(perms.map((p) => p.moduleId));
  // Incluir sempre os módulos em dev (sem depender de regra de permissão/superadmin)
  const withDev = mods.filter((m) => allowedIds.has(m.id) || m.type === 'dev');
  return c.json(withDev);
});

// POST /api/permissions — upsert: se já existir (moduleId+userId ou moduleId+groupId), atualiza allowed
permissionsRoutes.post('/', async (c) => {
  const body = await c.req.json() as { moduleId: number; userId?: number; groupId?: number; allowed: boolean };
  const { moduleId, userId, groupId, allowed } = body;
  if (moduleId == null || (userId == null && groupId == null)) {
    return c.json({ error: 'moduleId e (userId ou groupId) obrigatórios' }, 400);
  }
  const existing = userId != null
    ? await db.query.modulePermissions.findFirst({
        where: and(eq(modulePermissions.moduleId, moduleId), eq(modulePermissions.userId, userId)),
      })
    : await db.query.modulePermissions.findFirst({
        where: and(eq(modulePermissions.moduleId, moduleId), eq(modulePermissions.groupId, groupId!)),
      });
  if (existing) {
    await db.update(modulePermissions).set({ allowed }).where(eq(modulePermissions.id, existing.id));
    return c.json({ ...existing, allowed }, 200);
  }
  const [perm] = await db.insert(modulePermissions).values({
    moduleId,
    userId: userId ?? null,
    groupId: groupId ?? null,
    allowed,
  }).returning();
  return c.json(perm, 201);
});

// DELETE /api/permissions
permissionsRoutes.delete('/', async (c) => {
  const { id } = await c.req.json();
  await db.delete(modulePermissions).where(eq(modulePermissions.id, id));
  return c.json({ message: 'Permissão removida' });
});

// POST /api/permissions/bulk
permissionsRoutes.post('/bulk', async (c) => {
  const { permissions } = await c.req.json();
  await db.insert(modulePermissions).values(permissions).onConflictDoNothing();
  return c.json({ message: 'Permissões salvas' });
});
