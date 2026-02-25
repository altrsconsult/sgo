import { Hono } from 'hono';
import path from 'path';
import fs from 'fs/promises';

/**
 * Serve assets de módulos instalados (ZIP) em modules_storage/<slug>/.
 * Frontend usa /modules-assets/<slug>/dist/index.html para iframe standalone.
 */
const MODULES_STORAGE_PATH = process.env.MODULES_STORAGE_PATH || './modules_storage';

// MIME types comuns para assets de módulos
const MIME: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

export const moduleAssetsRoutes = new Hono();

// Rota que captura tudo após /modules-assets/ para servir arquivos de modules_storage/<slug>/...
moduleAssetsRoutes.get('*', async (c) => {
  const pathAfterPrefix = c.req.path.replace(/^\/modules-assets\/?/, '').replace(/^\//, '');
  const firstSlash = pathAfterPrefix.indexOf('/');
  const slug = firstSlash === -1 ? pathAfterPrefix : pathAfterPrefix.slice(0, firstSlash);
  const rest = firstSlash === -1 ? '' : pathAfterPrefix.slice(firstSlash + 1);

  // Slug só permite kebab-case (evita path traversal)
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return c.json({ error: 'Slug inválido' }, 400);
  }
  if (rest.includes('..')) {
    return c.json({ error: 'Path inválido' }, 400);
  }

  const fullPath = path.join(MODULES_STORAGE_PATH, slug, rest || 'index.html');
  const resolved = path.resolve(fullPath);
  const baseDir = path.resolve(MODULES_STORAGE_PATH, slug);
  if (!resolved.startsWith(baseDir)) {
    return c.json({ error: 'Path inválido' }, 400);
  }

  try {
    const stat = await fs.stat(resolved);
    if (stat.isDirectory()) {
      const indexHtml = path.join(resolved, 'index.html');
      try {
        await fs.access(indexHtml);
        const buf = await fs.readFile(indexHtml);
        return new Response(buf, {
          headers: { 'Content-Type': 'text/html' },
        });
      } catch {
        return c.json({ error: 'Não encontrado' }, 404);
      }
    }
    const buf = await fs.readFile(resolved);
    const ext = path.extname(resolved);
    const contentType = MIME[ext] ?? 'application/octet-stream';
    return new Response(buf, {
      headers: { 'Content-Type': contentType },
    });
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException)?.code === 'ENOENT') {
      return c.json({ error: 'Não encontrado' }, 404);
    }
    throw err;
  }
});
