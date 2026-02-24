import { Hono } from 'hono';
import { eq, and } from 'drizzle-orm';
import { db } from '../db/index.js';
import { modulePermissions, modules, userGroups, users } from '../db/schema.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

export const permissionsRoutes = new Hono();

permissionsRoutes.use('*', authenticate, requireAdmin);

// GET /api/permissions/user/:userId — permissões de um usuário
permissionsRoutes.get('/user/:userId', async (c) => {
  const userId = Number(c.req.param('userId'));
  const perms = await db.query.modulePermissions.findMany({
    where: eq(modulePermissions.userId, userId),
    with: { module: true },
  });
  return c.json(perms);
});

// GET /api/permissions/group/:groupId
permissionsRoutes.get('/group/:groupId', async (c) => {
  const groupId = Number(c.req.param('groupId'));
  const perms = await db.query.modulePermissions.findMany({
    where: eq(modulePermissions.groupId, groupId),
    with: { module: true },
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

// GET /api/permissions/matrix — matriz completa usuário × módulo
permissionsRoutes.get('/matrix', async (c) => {
  const allModules = await db.query.modules.findMany({ where: eq(modules.active, true) });
  const allUsers = await db.query.users.findMany({ columns: { password: false } });
  const allPerms = await db.query.modulePermissions.findMany();
  return c.json({ modules: allModules, users: allUsers, permissions: allPerms });
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

// GET /api/permissions/allowed-modules/:userId
permissionsRoutes.get('/allowed-modules/:userId', async (c) => {
  const userId = Number(c.req.param('userId'));
  const perms = await db.query.modulePermissions.findMany({
    where: and(eq(modulePermissions.userId, userId), eq(modulePermissions.allowed, true)),
    with: { module: true },
  });
  return c.json(perms.map((p) => p.module).filter(Boolean));
});

// POST /api/permissions
permissionsRoutes.post('/', async (c) => {
  const body = await c.req.json();
  const [perm] = await db.insert(modulePermissions).values(body).returning();
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
