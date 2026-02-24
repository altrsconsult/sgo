import { db } from '../db/index.js';
import { nexusInstallations, systemSettings } from '../db/schema.js';
import { randomUUID } from 'crypto';
import { env } from '../lib/env.js';

const PULSE_INTERVAL_MS = 60 * 1000; // envia pulse a cada 1 minuto

// Obtém ou cria installation ID único persistido no banco
async function getOrCreateInstallationId(): Promise<string> {
  const existing = await db.query.nexusInstallations.findFirst();
  if (existing) return existing.installationId;

  const id = randomUUID();
  await db.insert(nexusInstallations).values({
    installationId: id,
    version: process.env.npm_package_version || '4.0.0',
    hostname: new URL(env.nexusUrl || 'http://localhost').hostname,
  }).onConflictDoNothing();

  return id;
}

// Obtém URL da instância das configurações
async function getInstanceUrl(): Promise<string | null> {
  const setting = await db.query.systemSettings.findFirst({
    // @ts-ignore
    where: (s, { eq }) => eq(s.key, 'app.base_url'),
  });
  return setting?.value || null;
}

// Envia pulse periódico para o Nexus Central
export async function startNexusPulse() {
  if (!env.nexusUrl) return; // Apenas em modo gerenciado

  const sendPulse = async () => {
    try {
      const installationId = await getOrCreateInstallationId();
      const url = await getInstanceUrl();

      await fetch(`${env.nexusUrl}/api/pulse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          installationId,
          version: process.env.npm_package_version || '4.0.0',
          url,
          hostname: process.env.HOSTNAME || 'unknown',
          timestamp: new Date().toISOString(),
        }),
      });
    } catch {
      // Falha silenciosa — Nexus pode estar temporariamente indisponível
    }
  };

  // Envia imediatamente na inicialização, depois em intervalos
  await sendPulse();
  setInterval(sendPulse, PULSE_INTERVAL_MS);
}
