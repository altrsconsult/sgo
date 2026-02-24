import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { storageFiles } from '../db/schema.js';
import { authenticate } from '../middleware/authenticate.js';
import path from 'path';
import fs from 'fs/promises';
import { randomUUID } from 'crypto';
import { createHash } from 'crypto';

export const storageRoutes = new Hono();

storageRoutes.use('*', authenticate);

const UPLOADS_PATH = process.env.UPLOADS_PATH || './uploads';

// POST /api/storage/files — upload de arquivo
storageRoutes.post('/files', async (c) => {
  const formData = await c.req.formData();
  const file = formData.get('file') as File;
  if (!file) return c.json({ error: 'Arquivo não fornecido' }, 400);

  await fs.mkdir(UPLOADS_PATH, { recursive: true });

  const id = randomUUID();
  const ext = path.extname(file.name);
  const storedName = `${id}${ext}`;
  const storagePath = path.join(UPLOADS_PATH, storedName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(storagePath, buffer);

  const sha256 = createHash('sha256').update(buffer).digest('hex');

  const ownerType = formData.get('ownerType') as string || null;
  const ownerId = formData.get('ownerId') as string || null;
  const expiresAt = formData.get('expiresAt') as string || null;

  const [record] = await db.insert(storageFiles).values({
    id,
    ownerType,
    ownerId,
    originalName: file.name,
    storedName,
    mimeType: file.type,
    sizeBytes: buffer.length,
    sha256,
    storagePath,
    expiresAt: expiresAt ? new Date(expiresAt) : null,
  }).returning();

  return c.json(record, 201);
});

// GET /api/storage/files/:id
storageRoutes.get('/files/:id', async (c) => {
  const id = c.req.param('id');
  const record = await db.query.storageFiles.findFirst({ where: eq(storageFiles.id, id) });
  if (!record || record.deletedAt) return c.json({ error: 'Arquivo não encontrado' }, 404);
  return c.json(record);
});

// GET /api/storage/files/:id/download
storageRoutes.get('/files/:id/download', async (c) => {
  const id = c.req.param('id');
  const record = await db.query.storageFiles.findFirst({ where: eq(storageFiles.id, id) });
  if (!record || record.deletedAt) return c.json({ error: 'Arquivo não encontrado' }, 404);

  const buffer = await fs.readFile(record.storagePath);
  return new Response(buffer, {
    headers: {
      'Content-Type': record.mimeType || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${record.originalName}"`,
    },
  });
});

// PATCH /api/storage/files/:id/expires-at
storageRoutes.patch('/files/:id/expires-at', async (c) => {
  const id = c.req.param('id');
  const { expiresAt } = await c.req.json();
  await db.update(storageFiles).set({ expiresAt: expiresAt ? new Date(expiresAt) : null }).where(eq(storageFiles.id, id));
  return c.json({ message: 'Data de expiração atualizada' });
});

// DELETE /api/storage/files/:id — soft delete
storageRoutes.delete('/files/:id', async (c) => {
  const id = c.req.param('id');
  await db.update(storageFiles).set({ deletedAt: new Date() }).where(eq(storageFiles.id, id));
  return c.json({ message: 'Arquivo removido' });
});
