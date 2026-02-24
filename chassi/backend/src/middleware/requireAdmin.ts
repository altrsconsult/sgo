import { createMiddleware } from 'hono/factory';

// Middleware de autorização — exige role admin
// Deve ser usado após authenticate
export const requireAdmin = createMiddleware(async (c, next) => {
  const user = c.get('user');

  if (!user || user.role !== 'admin') {
    return c.json({ error: 'Acesso negado. Requer permissão de administrador.' }, 403);
  }

  await next();
});
