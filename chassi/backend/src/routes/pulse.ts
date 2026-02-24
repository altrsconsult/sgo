import { Hono } from 'hono';
import { db } from '../db/index.js';
import { nexusInstallations } from '../db/schema.js';

export const pulseRoutes = new Hono();

// POST /api/pulse — recebe pulso de outras instalações (usado pelo Nexus)
pulseRoutes.post('/', async (c) => {
  const body = await c.req.json();

  if (!body.installationId) {
    return c.json({ error: 'installationId obrigatório' }, 400);
  }

  await db.insert(nexusInstallations).values({
    installationId: body.installationId,
    version: body.version,
    url: body.url,
    hostname: body.hostname,
    lastPulseAt: new Date(),
  }).onConflictDoUpdate({
    target: nexusInstallations.installationId,
    set: { lastPulseAt: new Date(), version: body.version, url: body.url },
  });

  return c.json({ received: true });
});
