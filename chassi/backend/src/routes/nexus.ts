import { Hono } from 'hono';
import { nexusAuth } from '../middleware/nexusAuth.js';
import { db } from '../db/index.js';
import { users, modules, systemSettings, modulePermissions, userGroups, auditLogs, tickets, ticketMessages } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { loadModuleFromZip } from '../services/moduleLoader.js';

export const nexusRoutes = new Hono();

// Todas as rotas /api/nexus/* exigem autenticação M2M via master key
nexusRoutes.use('*', nexusAuth);

// POST /api/nexus/send-pulse — Nexus registra/atualiza este chassi
nexusRoutes.post('/send-pulse', async (c) => {
  return c.json({ received: true, timestamp: new Date().toISOString() });
});

// GET /api/nexus/health
nexusRoutes.get('/health', async (c) => {
  return c.json({ status: 'ok', service: 'chassi', timestamp: new Date().toISOString() });
});

// GET /api/nexus/stats — estatísticas da instância
nexusRoutes.get('/stats', async (c) => {
  const userCount = await db.query.users.findMany({ columns: { id: true } });
  const moduleCount = await db.query.modules.findMany({ columns: { id: true } });
  return c.json({
    users: userCount.length,
    modules: moduleCount.length,
    timestamp: new Date().toISOString(),
  });
});

// POST /api/nexus/modules/install — instala módulo remotamente
nexusRoutes.post('/modules/install', async (c) => {
  const body = await c.req.json();
  const { zipUrl } = body;
  if (!zipUrl) return c.json({ error: 'zipUrl é obrigatório' }, 400);

  try {
    const result = await loadModuleFromZip(zipUrl);
    return c.json(result);
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : String(err);
    return c.json({ error }, 500);
  }
});

// GET /api/nexus/modules
nexusRoutes.get('/modules', async (c) => {
  const all = await db.query.modules.findMany();
  return c.json(all);
});

// POST /api/nexus/modules/:slug/toggle
nexusRoutes.post('/modules/:slug/toggle', async (c) => {
  const slug = c.req.param('slug');
  const mod = await db.query.modules.findFirst({ where: eq(modules.slug, slug) });
  if (!mod) return c.json({ error: 'Módulo não encontrado' }, 404);
  await db.update(modules).set({ active: !mod.active, updatedAt: new Date() }).where(eq(modules.slug, slug));
  return c.json({ active: !mod.active });
});

// GET /api/nexus/users
nexusRoutes.get('/users', async (c) => {
  const all = await db.query.users.findMany({ columns: { password: false } });
  return c.json(all);
});

// POST /api/nexus/users — Nexus provisiona admin na instalação gerenciada
nexusRoutes.post('/users', async (c) => {
  const body = await c.req.json();
  const hashed = await bcrypt.hash(body.password, 10);
  const [user] = await db.insert(users).values({
    username: body.username,
    password: hashed,
    name: body.name,
    email: body.email,
    role: body.role || 'admin',
  }).returning({ id: users.id, username: users.username, name: users.name, role: users.role });
  return c.json(user, 201);
});

// PUT /api/nexus/users/:id
nexusRoutes.put('/users/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const body = await c.req.json();
  await db.update(users).set({ ...body, updatedAt: new Date() }).where(eq(users.id, id));
  const updated = await db.query.users.findFirst({ where: eq(users.id, id), columns: { password: false } });
  return c.json(updated);
});

// DELETE /api/nexus/users/:id
nexusRoutes.delete('/users/:id', async (c) => {
  const id = Number(c.req.param('id'));
  await db.delete(users).where(eq(users.id, id));
  return c.json({ message: 'Usuário removido' });
});

// GET /api/nexus/groups
nexusRoutes.get('/groups', async (c) => {
  const groups = await db.query.userGroups.findMany();
  return c.json(groups);
});

// POST /api/nexus/groups
nexusRoutes.post('/groups', async (c) => {
  const body = await c.req.json();
  const [group] = await db.insert(userGroups).values(body).returning();
  return c.json(group, 201);
});

// POST /api/nexus/groups/:id/members
nexusRoutes.post('/groups/:id/members', async (c) => {
  return c.json({ message: 'Não implementado' }, 501);
});

// DELETE /api/nexus/groups/:id/members/:userId
nexusRoutes.delete('/groups/:id/members/:userId', async (c) => {
  return c.json({ message: 'Não implementado' }, 501);
});

// GET /api/nexus/audit
nexusRoutes.get('/audit', async (c) => {
  const logs = await db.query.auditLogs.findMany({
    orderBy: (l, { desc }) => [desc(l.createdAt)],
    limit: 200,
  });
  return c.json(logs);
});

// GET /api/nexus/tickets
nexusRoutes.get('/tickets', async (c) => {
  const all = await db.query.tickets.findMany({
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });
  return c.json(all);
});

// GET /api/nexus/tickets/:id
nexusRoutes.get('/tickets/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const ticket = await db.query.tickets.findFirst({
    where: eq(tickets.id, id),
    with: { messages: true },
  });
  return c.json(ticket);
});

// POST /api/nexus/tickets/:id/messages
nexusRoutes.post('/tickets/:id/messages', async (c) => {
  const id = Number(c.req.param('id'));
  const { message, userId } = await c.req.json();
  const [msg] = await db.insert(ticketMessages).values({ ticketId: id, userId, message }).returning();
  return c.json(msg, 201);
});

// PATCH /api/nexus/tickets/:id/status
nexusRoutes.patch('/tickets/:id/status', async (c) => {
  const id = Number(c.req.param('id'));
  const { status } = await c.req.json();
  await db.update(tickets).set({ status, updatedAt: new Date() }).where(eq(tickets.id, id));
  return c.json({ status });
});

// GET /api/nexus/permissions
nexusRoutes.get('/permissions', async (c) => {
  const perms = await db.query.modulePermissions.findMany();
  return c.json(perms);
});

// POST /api/nexus/permissions
nexusRoutes.post('/permissions', async (c) => {
  const body = await c.req.json();
  const [perm] = await db.insert(modulePermissions).values(body).returning();
  return c.json(perm, 201);
});

// POST /api/nexus/settings — push de settings pelo Nexus (ex: whitelabel)
nexusRoutes.post('/settings', async (c) => {
  const body = await c.req.json();
  const items = Array.isArray(body) ? body : [body];
  for (const item of items) {
    await db.insert(systemSettings).values(item).onConflictDoUpdate({
      target: systemSettings.key,
      set: { value: item.value, updatedAt: new Date() },
    });
  }
  return c.json({ message: 'Settings atualizados' });
});

// GET /api/nexus/config
nexusRoutes.get('/config', async (c) => {
  const settings = await db.query.systemSettings.findMany();
  return c.json(settings);
});

// POST /api/nexus/config
nexusRoutes.post('/config', async (c) => {
  const body = await c.req.json();
  await db.insert(systemSettings).values(body).onConflictDoUpdate({
    target: systemSettings.key,
    set: { value: body.value, updatedAt: new Date() },
  });
  return c.json({ message: 'Config atualizada' });
});
