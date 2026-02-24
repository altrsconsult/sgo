import { Hono } from 'hono';
import { db } from '../db/index.js';
import { users, systemSettings } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { seedDevData } from '../db/seed.js';
import { env } from '../lib/env.js';

export const setupRoutes = new Hono();

// GET /api/setup/status — verifica se o sistema já foi instalado
setupRoutes.get('/status', async (c) => {
  const adminCount = await db.query.users.findMany({
    where: eq(users.role, 'admin'),
  });

  const isInstalled = adminCount.length > 0;
  const mode = env.nexusUrl ? 'managed' : 'standalone';

  return c.json({ installed: isInstalled, mode });
});

// POST /api/setup/install — instalação inicial (modo standalone)
// Em modo gerenciado, o Nexus provisiona o admin via M2M
setupRoutes.post('/install', async (c) => {
  // Verifica se já existe admin
  const existing = await db.query.users.findMany({ where: eq(users.role, 'admin') });
  if (existing.length > 0) {
    return c.json({ error: 'Sistema já instalado' }, 400);
  }

  const { adminUsername, adminPassword, adminEmail, adminName, appName } = await c.req.json();

  if (!adminUsername || !adminPassword) {
    return c.json({ error: 'Username e senha do admin são obrigatórios' }, 400);
  }

  const hashed = await bcrypt.hash(adminPassword, 10);
  await db.insert(users).values({
    username: adminUsername,
    password: hashed,
    name: adminName || 'Administrador',
    email: adminEmail || `${adminUsername}@example.com`,
    role: 'admin',
  });

  // Salva nome da aplicação se fornecido
  if (appName) {
    await db.insert(systemSettings).values({
      key: 'app.name',
      value: appName,
      category: 'whitelabel',
      description: 'Nome da aplicação',
    }).onConflictDoUpdate({
      target: systemSettings.key,
      set: { value: appName },
    });
  }

  return c.json({ message: 'Instalação concluída com sucesso' }, 201);
});

// POST /api/setup/reinstall — reseta o sistema (apenas desenvolvimento)
setupRoutes.post('/reinstall', async (c) => {
  if (env.nodeEnv === 'production') {
    return c.json({ error: 'Reinstalação não permitida em produção' }, 403);
  }

  await db.delete(users);
  await db.delete(systemSettings);
  await seedDevData();

  return c.json({ message: 'Sistema reinstalado' });
});
