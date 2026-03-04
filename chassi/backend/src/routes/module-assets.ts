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
      // Fallback SPA: quando rota amigável não existe fisicamente (ex.: /dist/config),
      // tenta subir diretórios até achar um index.html (normalmente /dist/index.html).
      if (rest && path.extname(rest) === '') {
        let currentDir = path.dirname(resolved);
        while (currentDir.startsWith(baseDir)) {
          const spaIndexPath = path.join(currentDir, 'index.html');
          try {
            const buf = await fs.readFile(spaIndexPath);
            return new Response(buf, {
              headers: { 'Content-Type': 'text/html' },
            });
          } catch {
            // Continua subindo até a raiz do módulo.
          }
          if (currentDir === baseDir) break;
          currentDir = path.dirname(currentDir);
        }
      }

      // Fallback: extração antiga (Windows) criou 1 arquivo com barra invertida no nome (ex.: dist\assets\remoteEntry.js)
      const fallbackRelative = rest.replace(/\//g, '\\');
      const fallbackPath = path.join(baseDir, fallbackRelative);
      const fallbackResolved = path.resolve(fallbackPath);
      if (fallbackResolved.startsWith(baseDir) && !rest.includes('..')) {
        try {
          const buf = await fs.readFile(fallbackPath);
          const ext = path.extname(fallbackPath);
          const contentType = MIME[ext] ?? 'application/octet-stream';
          return new Response(buf, {
            headers: { 'Content-Type': contentType },
          });
        } catch {
          // mantém 404
        }
      }
      return c.json({ error: 'Não encontrado' }, 404);
    }
    throw err;
  }
});
