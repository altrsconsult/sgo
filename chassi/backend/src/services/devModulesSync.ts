import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { db } from '../db/index.js';
import { modules } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { ModuleManifestSchema } from '@sgo/sdk';
import { env } from '../lib/env.js';

const SCAN_INTERVAL_MS = 5000; // varre portas a cada 5 segundos
const PORT_START = 5001;
const PORT_END = 5099;

/** Slugs permitidos para descoberta: só módulos em modules/ e modules-lab/. Retorna null = aceitar qualquer (fallback). */
function getAllowedSlugs(): Set<string> | null {
  if (env.devModulesAcceptAll) return null; // aceitar qualquer em dev
  const dirs: string[] = [env.modulesDevDir, env.modulesLabDevDir].filter(Boolean) as string[];
  if (dirs.length === 0) return null;
  const slugs = new Set<string>();
  for (const dir of dirs) {
    if (!existsSync(dir)) continue;
    try {
      const subdirs = readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory());
      for (const sub of subdirs) {
        const manifestPath = join(dir, sub.name, 'manifest.json');
        const publicManifestPath = join(dir, sub.name, 'public', 'manifest.json');
        const pathToRead = existsSync(publicManifestPath) ? publicManifestPath : existsSync(manifestPath) ? manifestPath : null;
        if (!pathToRead) continue;
        try {
          const raw = readFileSync(pathToRead, 'utf-8');
          const data = JSON.parse(raw) as { slug?: string };
          if (data.slug) slugs.add(data.slug);
        } catch {
          // ignorar manifest inválido
        }
      }
    } catch {
      // pasta inacessível
    }
  }
  return slugs.size > 0 ? slugs : null;
}

// Determina o host a usar para descoberta de módulos
// Em Docker (DOCKER_ENV=true), usa host.docker.internal para alcançar o host
// No browser, Module Federation sempre usa localhost (transparente para o dev)
function getDiscoveryHost(): string {
  return env.dockerEnv ? 'host.docker.internal' : 'localhost';
}

// Tenta buscar manifest de um módulo em desenvolvimento
async function tryFetchManifest(port: number): Promise<Record<string, unknown> | null> {
  const host = getDiscoveryHost();
  try {
    const response = await fetch(`http://${host}:${port}/manifest.json`, {
      signal: AbortSignal.timeout(1000),
    });
    if (!response.ok) return null;
    return (await response.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Verifica se o módulo expõe remoteEntry.js (Federation). Se 404, é standalone (iframe). */
async function hasRemoteEntry(port: number): Promise<boolean> {
  const host = getDiscoveryHost();
  try {
    const res = await fetch(`http://${host}:${port}/assets/remoteEntry.js`, {
      signal: AbortSignal.timeout(1000),
      method: 'HEAD',
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Roda uma varredura de portas e registra/atualiza módulos dev (só slugs em modules/ e modules-lab/ quando configurado)
async function runSync(): Promise<void> {
  const foundSlugs: string[] = [];
  const allowedSlugs = getAllowedSlugs();

  for (let port = PORT_START; port <= PORT_END; port++) {
    const manifest = await tryFetchManifest(port);
    if (!manifest) continue;

    try {
      const parsed = ModuleManifestSchema.parse(manifest);
      if (allowedSlugs !== null && !allowedSlugs.has(parsed.slug)) continue; // só aceitar módulos do repo
      foundSlugs.push(parsed.slug);

      // Só trata como Federation se o manifest tiver "exposes" (Module Federation) e o entry existir
      const manifestHasExposes = !!(manifest as Record<string, unknown>).exposes;
      const hasFederation = manifestHasExposes && (await hasRemoteEntry(port));
      const remoteEntry = hasFederation
        ? `http://localhost:${port}/assets/remoteEntry.js`
        : `http://localhost:${port}/`;

      await db.insert(modules).values({
        slug: parsed.slug,
        name: parsed.name,
        description: parsed.description,
        version: parsed.version,
        icon: parsed.icon,
        color: parsed.color,
        active: true,
        type: 'dev',
        remoteEntry,
      } as never).onConflictDoUpdate({
        target: modules.slug,
        set: {
          name: parsed.name,
          version: parsed.version,
          remoteEntry,
          active: true,
          updatedAt: new Date(),
        } as never,
      });
      console.log(`[devModulesSync] Módulo dev registrado: ${parsed.slug} (porta ${port}, ${hasFederation ? 'Federation' : 'iframe'})`);
    } catch (err) {
      if (env.nodeEnv !== 'production') {
        console.warn(`[devModulesSync] Manifest inválido na porta ${port}:`, err instanceof Error ? err.message : err);
      }
    }
  }

  // Remove módulos dev que não estão mais respondendo
  const devModules = await db.query.modules.findMany({
    where: eq(modules.type, 'dev'),
  });

  for (const mod of devModules) {
    if (!foundSlugs.includes(mod.slug)) {
      await db.update(modules).set({ active: false } as never).where(
        and(eq(modules.slug, mod.slug), eq(modules.type, 'dev'))
      );
    }
  }
}

// Sincroniza módulos em desenvolvimento — roda apenas fora de produção
export function devModulesSync(): void {
  if (env.nodeEnv === 'production') return;

  // Primeira execução logo na subida (não esperar 5s)
  runSync().catch((err) => console.warn('[devModulesSync] Erro na varredura inicial:', err));

  // Depois a cada 5 segundos
  setInterval(() => runSync().catch(() => {}), SCAN_INTERVAL_MS);
}
