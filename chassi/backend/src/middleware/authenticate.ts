import { createMiddleware } from 'hono/factory';
import { verifyToken } from '../lib/jwt.js';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

// Middleware de autenticação JWT
// Valida Bearer token, busca usuário no DB e rejeita se inativo
export const authenticate = createMiddleware(async (c, next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Token não fornecido' }, 401);
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyToken(token);
    const user = await db.query.users.findFirst({
      where: eq(users.id, payload.userId),
    });

    if (!user) {
      return c.json({ error: 'Usuário não encontrado' }, 401);
    }

    if (!user.active) {
      return c.json({ error: 'Conta inativa' }, 401);
    }

    c.set('user', user);
    await next();
  } catch {
    return c.json({ error: 'Token inválido ou expirado' }, 401);
  }
});
