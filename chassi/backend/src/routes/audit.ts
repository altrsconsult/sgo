import { Hono } from 'hono';
import { eq, desc, and, gte, lte } from 'drizzle-orm';
import { db } from '../db/index.js';
import { auditLogs } from '../db/schema.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

export const auditRoutes = new Hono();

auditRoutes.use('*', authenticate, requireAdmin);

// GET /api/audit
auditRoutes.get('/', async (c) => {
  const { userId, action, entityType, from, to, limit = '100', offset = '0' } = c.req.query();

  const conditions = [];
  if (userId) conditions.push(eq(auditLogs.userId, Number(userId)));
  if (action) conditions.push(eq(auditLogs.action, action));
  if (entityType) conditions.push(eq(auditLogs.entityType, entityType));
  if (from) conditions.push(gte(auditLogs.createdAt, new Date(from)));
  if (to) conditions.push(lte(auditLogs.createdAt, new Date(to)));

  const logs = await db.query.auditLogs.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    orderBy: [desc(auditLogs.createdAt)],
    limit: Number(limit),
    offset: Number(offset),
  });
  return c.json(logs);
});

// GET /api/audit/actions — lista de ações únicas para filtro
auditRoutes.get('/actions', async (c) => {
  const logs = await db.query.auditLogs.findMany({
    columns: { action: true },
  });
  const actions = [...new Set(logs.map((l) => l.action))].sort();
  return c.json(actions);
});

// GET /api/audit/entity-types
auditRoutes.get('/entity-types', async (c) => {
  const logs = await db.query.auditLogs.findMany({
    columns: { entityType: true },
  });
  const types = [...new Set(logs.map((l) => l.entityType).filter(Boolean))].sort();
  return c.json(types);
});
