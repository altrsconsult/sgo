import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { tickets, ticketMessages } from '../db/schema.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

export const ticketsRoutes = new Hono();

ticketsRoutes.use('*', authenticate);

// GET /api/tickets
ticketsRoutes.get('/', async (c) => {
  const user = c.get('user');
  const all = user.role === 'admin'
    ? await db.query.tickets.findMany({ orderBy: (t, { desc }) => [desc(t.createdAt)] })
    : await db.query.tickets.findMany({ where: eq(tickets.userId, user.id), orderBy: (t, { desc }) => [desc(t.createdAt)] });
  return c.json(all);
});

// GET /api/tickets/:id
ticketsRoutes.get('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const ticket = await db.query.tickets.findFirst({
    where: eq(tickets.id, id),
    with: { messages: { orderBy: (m, { asc }) => [asc(m.createdAt)] } },
  });
  if (!ticket) return c.json({ error: 'Ticket não encontrado' }, 404);
  return c.json(ticket);
});

// POST /api/tickets
ticketsRoutes.post('/', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const [ticket] = await db.insert(tickets).values({
    userId: user.id,
    subject: body.subject,
    description: body.description,
    priority: body.priority || 'normal',
  }).returning();
  return c.json(ticket, 201);
});

// POST /api/tickets/:id/messages
ticketsRoutes.post('/:id/messages', async (c) => {
  const id = Number(c.req.param('id'));
  const user = c.get('user');
  const { message } = await c.req.json();

  const [msg] = await db.insert(ticketMessages).values({
    ticketId: id,
    userId: user.id,
    message,
  }).returning();

  await db.update(tickets).set({
    lastResponse: message,
    lastResponseAt: new Date(),
    lastResponseByUserId: user.id,
    updatedAt: new Date(),
  }).where(eq(tickets.id, id));

  return c.json(msg, 201);
});

// PATCH /api/tickets/:id/status
ticketsRoutes.patch('/:id/status', requireAdmin, async (c) => {
  const id = Number(c.req.param('id'));
  const { status } = await c.req.json();
  await db.update(tickets).set({ status, updatedAt: new Date() }).where(eq(tickets.id, id));
  return c.json({ status });
});
