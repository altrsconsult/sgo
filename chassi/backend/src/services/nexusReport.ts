import { env } from '../lib/env.js';
import { db } from '../db/index.js';
import { nexusInstallations } from '../db/schema.js';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

// Registra esta instalação no Nexus Central ao iniciar
// Usado no modo gerenciado (NEXUS_URL definida)
export async function reportToNexusCentral() {
  if (!env.nexusUrl) return;

  try {
    // Garante que existe uma master key para este chassi
    let installation = await db.query.nexusInstallations.findFirst();

    if (!installation) {
      const masterKey = randomUUID();
      const masterKeyHash = await bcrypt.hash(masterKey, 10);

      await db.insert(nexusInstallations).values({
        installationId: randomUUID(),
        masterKeyHash,
        version: process.env.npm_package_version || '4.0.0',
        hostname: process.env.HOSTNAME || 'unknown',
      } as never);

      // Reporta ao Nexus com a master key em texto puro (apenas no primeiro registro)
      await fetch(`${env.nexusUrl}/api/instances/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          masterKey,
          url: process.env.CHASSIS_URL || `http://${process.env.HOSTNAME}:${env.port}`,
          hostname: process.env.HOSTNAME || 'unknown',
          version: process.env.npm_package_version || '4.0.0',
        }),
      });

      console.log('Chassi registrado no Nexus Central.');
    }
  } catch {
    console.warn('Aviso: não foi possível registrar no Nexus Central. Continuando no modo standalone.');
  }
}
