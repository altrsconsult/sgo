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

// POST /api/setup/reset-admin-password — reset de senha do admin em produção
// Requer SGO_RESET_ADMIN_SECRET nas variáveis de ambiente e body: { secret, newPassword [, username ] }
// Uso: defina SGO_RESET_ADMIN_SECRET no Portainer, chame esta rota, depois remova a variável.
setupRoutes.post('/reset-admin-password', async (c) => {
  if (!env.resetAdminSecret) {
    return c.json({ error: 'Reset de admin não configurado (defina SGO_RESET_ADMIN_SECRET)' }, 503);
  }

  let body: { secret?: string; newPassword?: string; username?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Body JSON inválido' }, 400);
  }

  const { secret, newPassword, username } = body;
  if (secret !== env.resetAdminSecret) {
    return c.json({ error: 'Segredo inválido' }, 403);
  }
  if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
    return c.json({ error: 'newPassword é obrigatório e deve ter no mínimo 6 caracteres' }, 400);
  }

  const admins = await db.query.users.findMany({
    where: eq(users.role, 'admin'),
    columns: { id: true, username: true },
  });
  if (admins.length === 0) {
    return c.json({ error: 'Nenhum usuário admin encontrado' }, 404);
  }

  const target = username
    ? admins.find((a) => a.username === username)
    : admins[0];
  if (!target) {
    return c.json({ error: `Admin com username "${username}" não encontrado` }, 404);
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await db.update(users).set({ password: hashed, updatedAt: new Date() }).where(eq(users.id, target.id));

  return c.json({ message: 'Senha do admin atualizada com sucesso', username: target.username });
});
