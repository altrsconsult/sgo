import { createMiddleware } from 'hono/factory';
import { db } from '../db/index.js';
import { nexusInstallations } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// Middleware de autenticação M2M para rotas /api/nexus/*
// Valida header X-SGO-MASTER-KEY contra hash armazenado no DB
export const nexusAuth = createMiddleware(async (c, next) => {
  const masterKey = c.req.header('X-SGO-MASTER-KEY');

  if (!masterKey) {
    return c.json({ error: 'Master key não fornecida' }, 401);
  }

  // Busca a primeira instalação Nexus registrada
  const installation = await db.query.nexusInstallations.findFirst();

  if (!installation?.masterKeyHash) {
    return c.json({ error: 'Nenhuma instalação Nexus registrada' }, 401);
  }

  const valid = await bcrypt.compare(masterKey, installation.masterKeyHash);

  if (!valid) {
    return c.json({ error: 'Master key inválida' }, 401);
  }

  await next();
});
