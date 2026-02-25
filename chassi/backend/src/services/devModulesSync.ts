import { db } from '../db/index.js';
import { modules } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { ModuleManifestSchema } from '@sgo/sdk';
import { env } from '../lib/env.js';

const SCAN_INTERVAL_MS = 5000; // varre portas a cada 5 segundos
const PORT_START = 5001;
const PORT_END = 5099;

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

// Sincroniza módulos em desenvolvimento — roda apenas fora de produção
export async function devModulesSync() {
  if (env.nodeEnv === 'production') return;

  setInterval(async () => {
    const foundSlugs: string[] = [];

    for (let port = PORT_START; port <= PORT_END; port++) {
      const manifest = await tryFetchManifest(port);
      if (!manifest) continue;

      try {
        const parsed = ModuleManifestSchema.parse(manifest);
        foundSlugs.push(parsed.slug);

        // URL sempre localhost pois é o browser que carrega; standalone = iframe na base do dev server
        const hasFederation = await hasRemoteEntry(port);
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
      } catch {
        // Manifest inválido, ignorar esta porta
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
  }, SCAN_INTERVAL_MS);
}
