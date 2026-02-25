import path from 'path';
import fs from 'fs/promises';
import AdmZip from 'adm-zip';
import { db, dialect } from '../db/index.js';
import { modules, moduleMigrations } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { ModuleManifestSchema } from '@sgo/sdk';
import { upsert } from '../db/helpers.js';

const MODULES_STORAGE_PATH = process.env.MODULES_STORAGE_PATH || './modules_storage';

/**
 * Roda as migrations SQL de um módulo instalado.
 * Verifica a pasta migrations/{dialect}/ dentro do módulo extraído
 * e aplica apenas as pendentes (não registradas em module_migrations).
 */
async function runModuleMigrations(slug: string, modulePath: string) {
  const migrationsDir = path.join(modulePath, 'migrations', dialect);

  try {
    await fs.access(migrationsDir);
  } catch {
    // Módulo não tem migrations para este dialeto — ok
    return;
  }

  const files = (await fs.readdir(migrationsDir))
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    // Verifica se migration já foi aplicada
    const applied = await db.query.moduleMigrations.findFirst({
      where: and(
        eq(moduleMigrations.moduleSlug, slug),
        eq(moduleMigrations.migrationName, file)
      ),
    });

    if (applied) continue;

    const sql = await fs.readFile(path.join(migrationsDir, file), 'utf8');

    // Executa cada statement separado por ";"
    const statements = sql.split(';').map((s) => s.trim()).filter(Boolean);
    for (const statement of statements) {
      await db.execute(statement as never);
    }

    // Registra migration como aplicada
    await db.insert(moduleMigrations).values({
      moduleSlug: slug,
      migrationName: file,
    });

    console.log(`Migration do módulo "${slug}" aplicada: ${file}`);
  }
}

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
    } as never).where(eq(modules.slug, slug));
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
    } as never);
  }

  // Roda migrations do módulo (se houver)
  await runModuleMigrations(slug, modulePath);

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

        const row = {
          slug: manifest.slug,
          name: manifest.name,
          description: manifest.description,
          version: manifest.version,
          path: path.join(MODULES_STORAGE_PATH, slug),
          icon: manifest.icon,
          color: manifest.color,
          active: true,
          type: 'installed',
        };
        await upsert(modules, row, modules.slug, {
          name: manifest.name,
          version: manifest.version,
          updatedAt: new Date(),
        });

        // Roda migrations pendentes do módulo ao iniciar
        await runModuleMigrations(slug, path.join(MODULES_STORAGE_PATH, slug));
      } catch {
        console.warn(`Aviso: não foi possível carregar módulo "${slug}"`);
      }
    }
  } catch {
    // Pasta modules_storage ainda não existe, ignorar
  }
}
