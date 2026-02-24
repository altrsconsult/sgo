import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { webhookDefinitions, webhookLogs } from '../db/schema.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

export const webhooksRoutes = new Hono();

webhooksRoutes.use('*', authenticate, requireAdmin);

// GET /api/webhooks
webhooksRoutes.get('/', async (c) => {
  const all = await db.query.webhookDefinitions.findMany({
    orderBy: (w, { desc }) => [desc(w.createdAt)],
  });
  return c.json(all);
});

// GET /api/webhooks/:id
webhooksRoutes.get('/:id', async (c) => {
  const id = c.req.param('id');
  const webhook = await db.query.webhookDefinitions.findFirst({ where: eq(webhookDefinitions.id, id) });
  if (!webhook) return c.json({ error: 'Webhook não encontrado' }, 404);
  return c.json(webhook);
});

// POST /api/webhooks
webhooksRoutes.post('/', async (c) => {
  const body = await c.req.json();
  const [webhook] = await db.insert(webhookDefinitions).values(body).returning();
  return c.json(webhook, 201);
});

// PUT /api/webhooks/:id
webhooksRoutes.put('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  await db.update(webhookDefinitions).set({ ...body, updatedAt: new Date() }).where(eq(webhookDefinitions.id, id));
  const updated = await db.query.webhookDefinitions.findFirst({ where: eq(webhookDefinitions.id, id) });
  return c.json(updated);
});

// DELETE /api/webhooks/:id
webhooksRoutes.delete('/:id', async (c) => {
  const id = c.req.param('id');
  await db.delete(webhookDefinitions).where(eq(webhookDefinitions.id, id));
  return c.json({ message: 'Webhook excluído' });
});

// GET /api/webhooks/:id/logs
webhooksRoutes.get('/:id/logs', async (c) => {
  const id = c.req.param('id');
  const logs = await db.query.webhookLogs.findMany({
    where: eq(webhookLogs.webhookId, id),
    orderBy: (l, { desc }) => [desc(l.createdAt)],
    limit: 100,
  });
  return c.json(logs);
});

// POST /api/webhooks/:id/test — disparo manual de teste
webhooksRoutes.post('/:id/test', async (c) => {
  const id = c.req.param('id');
  const webhook = await db.query.webhookDefinitions.findFirst({ where: eq(webhookDefinitions.id, id) });
  if (!webhook) return c.json({ error: 'Webhook não encontrado' }, 404);

  const start = Date.now();
  try {
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(webhook.secret ? { 'X-SGO-Secret': webhook.secret } : {}),
      },
      body: JSON.stringify({ event: 'test', timestamp: new Date().toISOString() }),
    });
    const duration = Date.now() - start;

    await db.insert(webhookLogs).values({
      webhookId: id,
      event: 'test',
      payload: { test: true },
      responseStatus: response.status,
      responseBody: await response.text().catch(() => ''),
      success: response.ok,
      durationMs: duration,
    });

    return c.json({ success: response.ok, status: response.status, duration });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : String(err);
    await db.insert(webhookLogs).values({
      webhookId: id,
      event: 'test',
      payload: { test: true },
      success: false,
      durationMs: Date.now() - start,
      error,
    });
    return c.json({ success: false, error }, 500);
  }
});

// POST /api/webhooks/trigger — dispara evento para webhooks registrados
webhooksRoutes.post('/trigger', async (c) => {
  const { event, payload } = await c.req.json();
  const activeWebhooks = await db.query.webhookDefinitions.findMany({
    where: eq(webhookDefinitions.active, true),
  });

  const results = await Promise.allSettled(
    activeWebhooks
      .filter((w) => (w.events as string[])?.includes(event))
      .map(async (webhook) => {
        const start = Date.now();
        try {
          const response = await fetch(webhook.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event, payload }),
          });
          await db.insert(webhookLogs).values({
            webhookId: webhook.id,
            event,
            payload,
            responseStatus: response.status,
            success: response.ok,
            durationMs: Date.now() - start,
          });
        } catch (err: unknown) {
          const error = err instanceof Error ? err.message : String(err);
          await db.insert(webhookLogs).values({
            webhookId: webhook.id,
            event,
            payload,
            success: false,
            durationMs: Date.now() - start,
            error,
          });
        }
      })
  );

  return c.json({ triggered: results.length });
});
