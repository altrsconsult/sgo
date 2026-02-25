import { Hono } from 'hono';
import { eq, and, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import { userGroups, userGroupMembers, users } from '../db/schema.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

export const groupsRoutes = new Hono();

groupsRoutes.use('*', authenticate, requireAdmin);

// GET /api/groups — lista grupos com contagem de membros (sem relations no schema)
groupsRoutes.get('/', async (c) => {
  const groups = await db.query.userGroups.findMany({
    orderBy: (g, { asc }) => [asc(g.name)],
  });
  const withCount = await Promise.all(
    groups.map(async (g) => {
      const count = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(userGroupMembers)
        .where(eq(userGroupMembers.groupId, g.id));
      return { ...g, member_count: count[0]?.count ?? 0 };
    })
  );
  return c.json(withCount);
});

// GET /api/groups/:id
groupsRoutes.get('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const group = await db.query.userGroups.findFirst({
    where: eq(userGroups.id, id),
  });
  if (!group) return c.json({ error: 'Grupo não encontrado' }, 404);
  const count = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(userGroupMembers)
    .where(eq(userGroupMembers.groupId, id));
  return c.json({ ...group, member_count: count[0]?.count ?? 0 });
});

// GET /api/groups/:id/members — lista usuários do grupo (frontend usa no painel Membros)
groupsRoutes.get('/:id/members', async (c) => {
  const groupId = Number(c.req.param('id'));
  const members = await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
    })
    .from(userGroupMembers)
    .innerJoin(users, eq(userGroupMembers.userId, users.id))
    .where(eq(userGroupMembers.groupId, groupId));
  return c.json(members);
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
  await db
    .delete(userGroupMembers)
    .where(and(eq(userGroupMembers.groupId, groupId), eq(userGroupMembers.userId, userId)));
  return c.json({ message: 'Membro removido' });
});
