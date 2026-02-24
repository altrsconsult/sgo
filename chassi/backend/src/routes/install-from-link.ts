import { Hono } from 'hono';
import { authenticate } from '../middleware/authenticate.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { loadModuleFromZip } from '../services/moduleLoader.js';
import path from 'path';
import fs from 'fs/promises';
import { randomUUID } from 'crypto';

export const installFromLinkRoutes = new Hono();

installFromLinkRoutes.use('*', authenticate, requireAdmin);

const MODULES_STORAGE_PATH = process.env.MODULES_STORAGE_PATH || './modules_storage';

// POST /api/install-from-link — instala módulo via URL de download (Nexus)
installFromLinkRoutes.post('/', async (c) => {
  const { url, authToken } = await c.req.json();

  if (!url) return c.json({ error: 'URL é obrigatória' }, 400);

  // Baixa o ZIP do link fornecido (protegido por token opcional)
  const headers: Record<string, string> = {};
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

  const response = await fetch(url, { headers });
  if (!response.ok) {
    return c.json({ error: `Erro ao baixar módulo: ${response.status} ${response.statusText}` }, 400);
  }

  await fs.mkdir(MODULES_STORAGE_PATH, { recursive: true });

  const tempPath = path.join(MODULES_STORAGE_PATH, `temp-${randomUUID()}.zip`);
  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(tempPath, buffer);

  try {
    const result = await loadModuleFromZip(tempPath);
    return c.json(result, 201);
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : String(err);
    return c.json({ error }, 400);
  } finally {
    await fs.unlink(tempPath).catch(() => {});
  }
});
