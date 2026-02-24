import { createMiddleware } from 'hono/factory';

// Contador simples por IP em memória
// Para produção considere usar Redis, mas para MVP é suficiente
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function getRateLimitMiddleware(maxRequests: number, windowMs: number) {
  return createMiddleware(async (c, next) => {
    const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
    const now = Date.now();
    const record = requestCounts.get(ip);

    if (!record || now > record.resetAt) {
      requestCounts.set(ip, { count: 1, resetAt: now + windowMs });
      return await next();
    }

    if (record.count >= maxRequests) {
      return c.json({ error: 'Muitas requisições. Tente novamente mais tarde.' }, 429);
    }

    record.count++;
    return await next();
  });
}

// Limite geral: 100 req / 15 minutos
export const generalLimiter = getRateLimitMiddleware(100, 15 * 60 * 1000);

// Limite de login: 10 req / 15 minutos
export const loginLimiter = getRateLimitMiddleware(10, 15 * 60 * 1000);
