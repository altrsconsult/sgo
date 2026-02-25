import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { db } from '../db/index.js';
import { users, type User } from '../db/schema.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

type AuthVariables = { Variables: { user: User } };
export const usersRoutes = new Hono<AuthVariables>();

usersRoutes.use('*', authenticate);

// GET /api/users
usersRoutes.get('/', requireAdmin, async (c) => {
  const all = await db.query.users.findMany({
    columns: { password: false },
    orderBy: (u, { asc }) => [asc(u.name)],
  });
  return c.json(all);
});

// GET /api/users/:id
usersRoutes.get('/:id', requireAdmin, async (c) => {
  const id = Number(c.req.param('id'));
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
    columns: { password: false },
  });
  if (!user) return c.json({ error: 'Usuário não encontrado' }, 404);
  return c.json(user);
});

// POST /api/users
usersRoutes.post('/', requireAdmin, async (c) => {
  const body = await c.req.json();
  const hashed = await bcrypt.hash(body.password, 10);

  const [created] = await db.insert(users).values({
    username: body.username,
    password: hashed,
    name: body.name,
    email: body.email,
    role: body.role || 'user',
  }).returning({ id: users.id, username: users.username, name: users.name, email: users.email, role: users.role });

  return c.json(created, 201);
});

// PUT /api/users/:id
usersRoutes.put('/:id', requireAdmin, async (c) => {
  const id = Number(c.req.param('id'));
  const body = await c.req.json();

  const updateData: Record<string, unknown> = {
    name: body.name,
    email: body.email,
    role: body.role,
    avatar: body.avatar,
    updatedAt: new Date(),
  };

  if (body.password) {
    updateData.password = await bcrypt.hash(body.password, 10);
  }

  await db.update(users).set(updateData).where(eq(users.id, id));
  const updated = await db.query.users.findFirst({
    where: eq(users.id, id),
    columns: { password: false },
  });
  return c.json(updated);
});

// PATCH /api/users/:id — atualização parcial
usersRoutes.patch('/:id', requireAdmin, async (c) => {
  const id = Number(c.req.param('id'));
  const body = await c.req.json();
  await db.update(users).set({ ...body, updatedAt: new Date() }).where(eq(users.id, id));
  const updated = await db.query.users.findFirst({
    where: eq(users.id, id),
    columns: { password: false },
  });
  return c.json(updated);
});

// PATCH /api/users/:id/toggle-active
usersRoutes.patch('/:id/toggle-active', requireAdmin, async (c) => {
  const id = Number(c.req.param('id'));
  const user = await db.query.users.findFirst({ where: eq(users.id, id) });
  if (!user) return c.json({ error: 'Usuário não encontrado' }, 404);

  await db.update(users).set({ active: !user.active, updatedAt: new Date() }).where(eq(users.id, id));
  return c.json({ active: !user.active });
});

// POST /api/users/:id/reset-password
usersRoutes.post('/:id/reset-password', requireAdmin, async (c) => {
  const id = Number(c.req.param('id'));
  const { password } = await c.req.json();
  const hashed = await bcrypt.hash(password, 10);
  await db.update(users).set({ password: hashed, updatedAt: new Date() }).where(eq(users.id, id));
  return c.json({ message: 'Senha redefinida com sucesso' });
});

// DELETE /api/users/:id
usersRoutes.delete('/:id', requireAdmin, async (c) => {
  const id = Number(c.req.param('id'));
  const currentUser = c.get('user');
  if (currentUser.id === id) return c.json({ error: 'Não é possível excluir seu próprio usuário' }, 400);
  await db.delete(users).where(eq(users.id, id));
  return c.json({ message: 'Usuário excluído' });
});
