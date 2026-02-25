/**
 * Script de empacotamento do módulo SGO em ZIP para distribuição.
 * Gera: <slug>-v<version>.zip com dist/, manifest.json e migrations/ (se existir).
 *
 * Uso: node scripts/build-zip.mjs
 * Via pnpm: pnpm build:zip  (já roda o build antes)
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// Lê slug e version do manifest.json
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
const { slug, version } = manifest;

if (!slug || !version) {
  console.error('Erro: manifest.json precisa ter "slug" e "version".');
  process.exit(1);
}

// Verifica se o build existe
const distPath = path.join(root, 'dist');
if (!fs.existsSync(distPath)) {
  console.error('Erro: pasta dist/ não encontrada. Rode pnpm build antes.');
  process.exit(1);
}

const zipName = `${slug}-v${version}.zip`;

// Itens a incluir no ZIP
const items = ['dist', 'manifest.json'];

// Inclui migrations se existir (convenção: migrations/pg/ e migrations/mysql/)
if (fs.existsSync(path.join(root, 'migrations'))) {
  items.push('migrations');
}

// Remove ZIP anterior se existir
const zipPath = path.join(root, zipName);
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

// Gera o ZIP (usa zip nativo no Linux/Mac; no Windows requer zip via Git Bash ou WSL)
try {
  execSync(`zip -r "${zipName}" ${items.join(' ')}`, { cwd: root, stdio: 'inherit' });
  console.log(`\n✓ ZIP gerado: ${zipName}`);
  console.log(`  Instale em: Admin → Módulos → Upload ZIP`);
  console.log(`  Ou via API: POST /api/upload-module\n`);
} catch {
  // Fallback: tenta via PowerShell (Windows sem zip nativo)
  try {
    const itemsAbs = items.map((i) => path.join(root, i));
    const psCmd = `Compress-Archive -Path ${itemsAbs.map((i) => `"${i}"`).join(',')} -DestinationPath "${zipPath}" -Force`;
    execSync(`powershell -Command "${psCmd}"`, { cwd: root, stdio: 'inherit' });
    console.log(`\n✓ ZIP gerado: ${zipName}`);
    console.log(`  Instale em: Admin → Módulos → Upload ZIP\n`);
  } catch (err2) {
    console.error('Erro ao gerar ZIP. Instale "zip" ou use Git Bash/WSL no Windows.');
    console.error(err2.message);
    process.exit(1);
  }
}
