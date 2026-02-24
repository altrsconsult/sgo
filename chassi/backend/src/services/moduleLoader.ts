import path from 'path';
import fs from 'fs/promises';
import AdmZip from 'adm-zip';
import { db } from '../db/index.js';
import { modules } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { ModuleManifestSchema } from '@sgo/sdk';

const MODULES_STORAGE_PATH = process.env.MODULES_STORAGE_PATH || './modules_storage';

// Carrega e registra um módulo a partir de um arquivo ZIP
export async function loadModuleFromZip(zipPath: string) {
  const zip = new AdmZip(zipPath);
  const entries = zip.getEntries();

  // Localiza manifest.json dentro do ZIP
  const manifestEntry = entries.find((e) => e.entryName === 'manifest.json' || e.entryName.endsWith('/manifest.json'));
  if (!manifestEntry) throw new Error('manifest.json não encontrado no ZIP');

  const manifestRaw = JSON.parse(manifestEntry.getData().toString('utf8'));
  const manifest = ModuleManifestSchema.parse(manifestRaw);

  const slug = manifest.slug;
  const modulePath = path.join(MODULES_STORAGE_PATH, slug);

  // Remove versão anterior se existir
  await fs.rm(modulePath, { recursive: true, force: true });
  await fs.mkdir(modulePath, { recursive: true });

  // Extrai conteúdo do ZIP
  zip.extractAllTo(modulePath, true);

  // Registra ou atualiza módulo no banco
  const existing = await db.query.modules.findFirst({ where: eq(modules.slug, slug) });

  if (existing) {
    await db.update(modules).set({
      name: manifest.name,
      description: manifest.description,
      version: manifest.version,
      path: modulePath,
      icon: manifest.icon,
      color: manifest.color,
      type: 'installed',
      updatedAt: new Date(),
    }).where(eq(modules.slug, slug));
  } else {
    await db.insert(modules).values({
      slug,
      name: manifest.name,
      description: manifest.description,
      version: manifest.version,
      path: modulePath,
      icon: manifest.icon,
      color: manifest.color,
      active: true,
      type: 'installed',
    });
  }

  return { slug, name: manifest.name, version: manifest.version, installed: true };
}

// Carrega todos os módulos instalados ao iniciar o servidor
export async function loadInstalledModules() {
  try {
    const dirs = await fs.readdir(MODULES_STORAGE_PATH);

    for (const slug of dirs) {
      const manifestPath = path.join(MODULES_STORAGE_PATH, slug, 'manifest.json');
      try {
        const raw = await fs.readFile(manifestPath, 'utf8');
        const manifest = ModuleManifestSchema.parse(JSON.parse(raw));

        await db.insert(modules).values({
          slug: manifest.slug,
          name: manifest.name,
          description: manifest.description,
          version: manifest.version,
          path: path.join(MODULES_STORAGE_PATH, slug),
          icon: manifest.icon,
          color: manifest.color,
          active: true,
          type: 'installed',
        }).onConflictDoUpdate({
          target: modules.slug,
          set: {
            name: manifest.name,
            version: manifest.version,
            updatedAt: new Date(),
          },
        });
      } catch {
        console.warn(`Aviso: não foi possível carregar módulo "${slug}"`);
      }
    }
  } catch {
    // Pasta modules_storage ainda não existe, ignorar
  }
}
