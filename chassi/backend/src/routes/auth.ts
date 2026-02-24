import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { signToken } from '../lib/jwt.js';
import { LoginSchema } from '@sgo/sdk';
import { authenticate } from '../middleware/authenticate.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

export const authRoutes = new Hono();

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
