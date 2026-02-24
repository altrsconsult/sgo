import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { userGroups, userGroupMembers } from '../db/schema.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

export const groupsRoutes = new Hono();

groupsRoutes.use('*', authenticate, requireAdmin);

// GET /api/groups
groupsRoutes.get('/', async (c) => {
  const groups = await db.query.userGroups.findMany({
    with: { members: { with: { user: { columns: { password: false } } } } },
    orderBy: (g, { asc }) => [asc(g.name)],
  });
  return c.json(groups);
});

// GET /api/groups/:id
groupsRoutes.get('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const group = await db.query.userGroups.findFirst({
    where: eq(userGroups.id, id),
    with: { members: { with: { user: { columns: { password: false } } } } },
  });
  if (!group) return c.json({ error: 'Grupo não encontrado' }, 404);
  return c.json(group);
});

// POST /api/groups
groupsRoutes.post('/', async (c) => {
  const body = await c.req.json();
  const [group] = await db.insert(userGroups).values({
    name: body.name,
    description: body.description,
  }).returning();
  return c.json(group, 201);
});

// PUT /api/groups/:id
groupsRoutes.put('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const body = await c.req.json();
  await db.update(userGroups).set({ name: body.name, description: body.description }).where(eq(userGroups.id, id));
  const updated = await db.query.userGroups.findFirst({ where: eq(userGroups.id, id) });
  return c.json(updated);
});

// DELETE /api/groups/:id
groupsRoutes.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  await db.delete(userGroups).where(eq(userGroups.id, id));
  return c.json({ message: 'Grupo excluído' });
});

// POST /api/groups/:id/members
groupsRoutes.post('/:id/members', async (c) => {
  const groupId = Number(c.req.param('id'));
  const { userId } = await c.req.json();
  await db.insert(userGroupMembers).values({ groupId, userId }).onConflictDoNothing();
  return c.json({ message: 'Membro adicionado' }, 201);
});

// DELETE /api/groups/:id/members/:userId
groupsRoutes.delete('/:id/members/:userId', async (c) => {
  const groupId = Number(c.req.param('id'));
  const userId = Number(c.req.param('userId'));
  await db.delete(userGroupMembers)
    .where(eq(userGroupMembers.groupId, groupId) && eq(userGroupMembers.userId, userId));
  return c.json({ message: 'Membro removido' });
});
