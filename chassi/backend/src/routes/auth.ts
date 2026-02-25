import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import bcrypt from 'bcryptjs';
import { eq, and, gt } from 'drizzle-orm';
import crypto from 'node:crypto';
import { z } from 'zod';
import { db, schema } from '../db/index.js';
import { users, auditLogs, type User } from '../db/schema.js';
import { signToken } from '../lib/jwt.js';

const userActivationTokens = schema.userActivationTokens as typeof import('../db/schema.js').userActivationTokens;
import { LoginSchema } from '@sgo/sdk';
import { authenticate } from '../middleware/authenticate.js';
import { loginLimiter } from '../middleware/rateLimiter.js';
import { env } from '../lib/env.js';

/** Contexto com usuário autenticado (middleware authenticate) */
type AuthVariables = { Variables: { user: User } };
export const authRoutes = new Hono<AuthVariables>();

// --- Rotas públicas: ativação (link de convite) ---

// GET /api/auth/activation/:token — dados para preencher o formulário de definir senha
authRoutes.get('/activation/:token', async (c) => {
  const token = c.req.param('token');
  const row = await db.query.userActivationTokens.findFirst({
    where: and(
      eq(userActivationTokens.token, token),
      gt(userActivationTokens.expiresAt, new Date())
    ),
  });
  if (!row) {
    return c.json({ error: 'Link inválido ou expirado' }, 404);
  }
  const user = await db.query.users.findFirst({
    where: eq(users.id, row.userId),
    columns: { id: true, username: true, name: true, email: true },
  });
  if (!user) return c.json({ error: 'Usuário não encontrado' }, 404);
  return c.json({ username: user.username, name: user.name, email: user.email });
});

// POST /api/auth/activate — define senha e ativa a conta; retorna JWT
const ActivateSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});
authRoutes.post('/activate', zValidator('json', ActivateSchema), async (c) => {
  const { token, password } = c.req.valid('json');
  const row = await db.query.userActivationTokens.findFirst({
    where: and(
      eq(userActivationTokens.token, token),
      gt(userActivationTokens.expiresAt, new Date())
    ),
  });
  if (!row) {
    return c.json({ error: 'Link inválido ou expirado' }, 400);
  }
  const user = await db.query.users.findFirst({
    where: eq(users.id, row.userId),
  });
  if (!user) return c.json({ error: 'Usuário não encontrado' }, 404);
  const hashed = await bcrypt.hash(password, 10);
  await db.update(users).set({ password: hashed, updatedAt: new Date() }).where(eq(users.id, user.id));
  await db.delete(userActivationTokens).where(eq(userActivationTokens.id, row.id));
  const jwt = signToken({ userId: user.id, username: user.username, role: user.role });
  const { password: _pw, ...userWithoutPassword } = user;
  return c.json({ token: jwt, user: userWithoutPassword });
});

// POST /api/auth/login
authRoutes.post('/login', loginLimiter, zValidator('json', LoginSchema), async (c) => {
  const { username, password } = c.req.valid('json');

  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (!user || !user.active) {
    return c.json({ error: 'Credenciais inválidas' }, 401);
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return c.json({ error: 'Credenciais inválidas' }, 401);
  }

  const token = signToken({ userId: user.id, username: user.username, role: user.role });

  await db.insert(auditLogs).values({
    userId: user.id,
    userName: user.name,
    action: 'login',
    entityType: 'user',
    entityId: String(user.id),
    ipAddress: c.req.header('x-forwarded-for') ?? c.req.header('x-real-ip') ?? null,
    userAgent: c.req.header('user-agent') ?? null,
  });

  const { password: _pw, ...userWithoutPassword } = user;
  return c.json({ token, user: userWithoutPassword });
});

// GET /api/auth/verify
authRoutes.get('/verify', authenticate, async (c) => {
  const user = c.get('user');
  const { password: _pw, ...userWithoutPassword } = user;
  return c.json({ user: userWithoutPassword });
});

// POST /api/auth/logout
authRoutes.post('/logout', authenticate, async (c) => {
  // JWT é stateless — o cliente descarta o token
  return c.json({ message: 'Logout realizado com sucesso' });
});

// POST /api/auth/impersonate/:userId — admin impersona um usuário
authRoutes.post('/impersonate/:userId', authenticate, async (c) => {
  const currentUser = c.get('user');

  if (currentUser.role !== 'admin') {
    return c.json({ error: 'Apenas admins podem impersonar usuários' }, 403);
  }

  const targetId = Number(c.req.param('userId'));
  const targetUser = await db.query.users.findFirst({
    where: eq(users.id, targetId),
  });

  if (!targetUser) {
    return c.json({ error: 'Usuário não encontrado' }, 404);
  }

  if (targetUser.role === 'admin') {
    return c.json({ error: 'Não é possível impersonar outro admin' }, 403);
  }

  const token = signToken({
    userId: targetUser.id,
    username: targetUser.username,
    role: targetUser.role,
  });

  const { password: _pw, ...userWithoutPassword } = targetUser;
  return c.json({ token, user: userWithoutPassword, impersonating: true });
});

// POST /api/auth/stop-impersonation
authRoutes.post('/stop-impersonation', authenticate, async (c) => {
  // Cliente deve armazenar o token original e restaurá-lo
  return c.json({ message: 'Impersonação encerrada' });
});
