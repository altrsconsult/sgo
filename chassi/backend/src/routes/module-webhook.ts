import { Hono } from 'hono';
import { and, eq } from 'drizzle-orm';
import fs from 'fs/promises';
import path from 'path';
import { db } from '../db/index.js';
import { moduleData, modules } from '../db/schema.js';

type ManifestWebhook = {
  slug?: string;
  path?: string;
  method?: string;
  entityType?: string;
};

const MODULES_STORAGE_PATH = process.env.MODULES_STORAGE_PATH || './modules_storage';

/**
 * Lê o webhook no manifest do módulo para descobrir regras
 * como entityType e método esperado.
 */
async function getManifestWebhook(slug: string, hookSlug: string): Promise<ManifestWebhook | null> {
  const manifestPath = path.join(MODULES_STORAGE_PATH, slug, 'manifest.json');
  try {
    const raw = await fs.readFile(manifestPath, 'utf8');
    const parsed = JSON.parse(raw) as { webhooks?: ManifestWebhook[] };
    const list = Array.isArray(parsed.webhooks) ? parsed.webhooks : [];
    return (
      list.find((w) => w.slug === hookSlug) ??
      list.find((w) => typeof w.path === 'string' && w.path.endsWith(`/${hookSlug}`)) ??
      null
    );
  } catch {
    return null;
  }
}

/**
 * Rota pública de ingestão de webhook de módulo.
 * Exemplo: POST /api/webhook/leads-intake/capture
 */
export const moduleWebhookRoutes = new Hono();

moduleWebhookRoutes.post('/:moduleSlug/:hookSlug', async (c) => {
  const { moduleSlug, hookSlug } = c.req.param();

  const mod = await db.query.modules.findFirst({
    where: and(eq(modules.slug, moduleSlug), eq(modules.active, true)),
  });
  if (!mod) return c.json({ error: 'Módulo não encontrado' }, 404);

  const manifestWebhook = await getManifestWebhook(moduleSlug, hookSlug);
  if (!manifestWebhook) {
    return c.json({ error: `Webhook '${hookSlug}' não declarado no manifest do módulo` }, 404);
  }
  if (manifestWebhook?.method && manifestWebhook.method.toUpperCase() !== 'POST') {
    return c.json({ error: `Webhook '${hookSlug}' não aceita POST` }, 405);
  }

  const contentType = (c.req.header('content-type') || '').toLowerCase();
  let payload: unknown = {};
  try {
    if (contentType.includes('application/json')) {
      payload = await c.req.json();
    } else {
      const text = await c.req.text();
      payload = text ? { raw: text } : {};
    }
  } catch {
    payload = {};
  }

  // Usa entityType declarado no manifest; fallback para nome do hook.
  const entityType = manifestWebhook.entityType?.trim() || hookSlug;

  // Tenta preservar um identificador externo para idempotência básica.
  const extId =
    typeof payload === 'object' && payload !== null
      ? (payload as Record<string, unknown>).id ??
        (payload as Record<string, unknown>).lead_id ??
        (payload as Record<string, unknown>).external_id
      : undefined;
  const entityId = extId ? String(extId) : String(Date.now());

  const [record] = await db
    .insert(moduleData)
    .values({
      moduleId: mod.id,
      entityType,
      entityId,
      data: payload as Record<string, unknown>,
    })
    .returning();

  return c.json(
    {
      success: true,
      module: moduleSlug,
      webhook: hookSlug,
      entityType,
      id: record.id,
    },
    201
  );
});

