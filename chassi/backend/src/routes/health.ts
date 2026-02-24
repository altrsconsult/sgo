import { Hono } from 'hono';
import { db } from '../db/index.js';

export const healthRoutes = new Hono();

// GET /api/health — health check básico (sem auth, para Traefik/Docker)
healthRoutes.get('/', (c) => {
  return c.json({ status: 'ok', service: 'chassi-backend' });
});

// GET /api/health/detail — health check detalhado com verificação de DB
healthRoutes.get('/detail', async (c) => {
  try {
    await db.execute('SELECT 1' as unknown as Parameters<typeof db.execute>[0]);
    return c.json({
      status: 'ok',
      service: 'chassi-backend',
      db: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : String(err);
    return c.json({
      status: 'degraded',
      service: 'chassi-backend',
      db: 'disconnected',
      error,
      timestamp: new Date().toISOString(),
    }, 503);
  }
});
