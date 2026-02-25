import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { db, schema } from '../db/index.js';
import { users, type User } from '../db/schema.js';

const userActivationTokens = schema.userActivationTokens as typeof import('../db/schema.js').userActivationTokens;
import { authenticate } from '../middleware/authenticate.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { env } from '../lib/env.js';

type AuthVariables = { Variables: { user: User } };
export const usersRoutes = new Hono<AuthVariables>();

usersRoutes.use('*', authenticate);

/** Gera token seguro e retorna a URL base para montar o link de ativação */
function baseUrl(c: { req: { header: (n: string) => string | undefined } }): string {
  if (env.publicAppUrl) return env.publicAppUrl.replace(/\/$/, '');
  const origin = c.req.header('origin') || c.req.header('referer');
  if (origin) return new URL(origin).origin;
  return 'http://localhost:5173'; // fallback dev frontend
}

/** Cria token de ativação para o usuário (validade 7 dias) */
async function createActivationToken(userId: number): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await db.insert(userActivationTokens).values({ userId, token, expiresAt });
  return token;
}

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

// POST /api/users — com opção invite: true gera link de ativação (admin copia e envia; sem SMTP)
usersRoutes.post('/', requireAdmin, async (c) => {
  const body = await c.req.json();
  const invite = body.invite === true;
  const password = body.password;

  if (!invite && !password) {
    return c.json({ error: 'Informe a senha ou marque "Convite (usuário define senha)"' }, 400);
  }

  const hashed = invite
    ? await bcrypt.hash(crypto.randomBytes(24).toString('hex'), 10) // senha temporária impossível
    : await bcrypt.hash(password, 10);

  const [created] = await db.insert(users).values({
    username: body.username,
    password: hashed,
    name: body.name,
    email: body.email,
    role: body.role || 'user',
  }).returning({ id: users.id, username: users.username, name: users.name, email: users.email, role: users.role });

  if (invite) {
    const token = await createActivationToken(created.id);
    const url = baseUrl(c);
    const activationLink = `${url}/activate?token=${token}`;
    return c.json({ ...created, activationLink }, 201);
  }

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

// POST /api/users/:id/activation-link — gera novo link de ativação (ex.: link expirado)
usersRoutes.post('/:id/activation-link', requireAdmin, async (c) => {
  const id = Number(c.req.param('id'));
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
    columns: { id: true },
  });
  if (!user) return c.json({ error: 'Usuário não encontrado' }, 404);
  await db.delete(userActivationTokens).where(eq(userActivationTokens.userId, id));
  const token = await createActivationToken(id);
  const url = baseUrl(c);
  return c.json({ activationLink: `${url}/activate?token=${token}` });
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
