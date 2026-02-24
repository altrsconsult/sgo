import { Hono } from 'hono';
import { authenticate } from '../middleware/authenticate.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { loadModuleFromZip } from '../services/moduleLoader.js';
import path from 'path';
import fs from 'fs/promises';
import { randomUUID } from 'crypto';

export const uploadModuleRoutes = new Hono();

uploadModuleRoutes.use('*', authenticate, requireAdmin);

const MODULES_STORAGE_PATH = process.env.MODULES_STORAGE_PATH || './modules_storage';

// POST /api/upload-module — instala módulo via upload de ZIP
uploadModuleRoutes.post('/', async (c) => {
  const formData = await c.req.formData();
  const file = formData.get('file') as File;

  if (!file) return c.json({ error: 'Arquivo ZIP não fornecido' }, 400);
  if (!file.name.endsWith('.zip')) return c.json({ error: 'Apenas arquivos ZIP são aceitos' }, 400);

  await fs.mkdir(MODULES_STORAGE_PATH, { recursive: true });

  // Salva ZIP temporariamente
  const tempPath = path.join(MODULES_STORAGE_PATH, `temp-${randomUUID()}.zip`);
  const buffer = Buffer.from(await file.arrayBuffer());
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
