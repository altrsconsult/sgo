# Script: setup-modules-lab.ps1
# Copia a pasta modules/ para fora do repo (ex.: c:/develop/sgo-modules-lab)
# para servir como laboratorio de desenvolvimento de modulos (repo privado opcional).
# Executar a partir da raiz do repo: .\scripts\setup-modules-lab.ps1

$ErrorActionPreference = "Stop"
$repoRoot = $PSScriptRoot | Split-Path -Parent
$modulesSrc = Join-Path $repoRoot "modules"
$developRoot = $repoRoot | Split-Path -Parent   # ex.: c:/develop quando repo esta em c:/develop/sgo
$labDest = Join-Path $developRoot "sgo-modules-lab"

if (-not (Test-Path $modulesSrc)) {
    Write-Error "Pasta modules/ nao encontrada em: $modulesSrc"
}

if (Test-Path $labDest) {
    Write-Host "A pasta sgo-modules-lab ja existe em: $labDest"
    $r = Read-Host "Sobrescrever? (s/N)"
    if ($r -ne "s" -and $r -ne "S") {
        Write-Host "Nada foi alterado."
        exit 0
    }
    Remove-Item $labDest -Recurse -Force
}

Write-Host "Copiando modules/ para $labDest (excluindo node_modules, dist, .vite)..."
# Robocopy: /E subdirs, /XD exclude dirs, /XF exclude files (opcional)
robocopy $modulesSrc $labDest /E /XD node_modules dist .vite .git /NFL /NDL /NJH /NJS /NC /NS | Out-Null
if ($LASTEXITCODE -gt 7) {
    Write-Error "Erro ao copiar (robocopy exit $LASTEXITCODE)"
}

$readme = @"
# sgo-modules-lab

Laboratorio de desenvolvimento de modulos SGO (fora do repo publico).

- Copiado a partir de \`modules/\` do repo sgo por \`scripts/setup-modules-lab.ps1\`.
- Este folder e independente do repo: rode \`pnpm install\` aqui dentro para instalar dependencias dos modulos.
- Rode \`pnpm dev\` em cada modulo (ou use o workspace: \`pnpm --filter @sgo/module-boilerplate dev\`) em paralelo com o chassi no repo; o chassi descobre modulos pelas portas (5001+).
- Docker do backend/banco: use o repo sgo (\`docker compose up\` na raiz do sgo).
- Para versionar este lab em repo privado: \`git init\` e \`git remote add origin <url-privado>\`.

Documentacao da visao do lab: no repo sgo, \`docs/architecture/MODULES-LAB-VISAO.md\`.
"@
Set-Content -Path (Join-Path $labDest "README.md") -Value $readme -Encoding UTF8

# Workspace pnpm no proprio lab (independente do repo)
$workspaceYaml = @"
packages:
  - "*"
"@
Set-Content -Path (Join-Path $labDest "pnpm-workspace.yaml") -Value $workspaceYaml -Encoding UTF8

Write-Host "Pronto. Lab criado em: $labDest"
Write-Host "No lab, execute: cd $labDest ; pnpm install"
Write-Host "No repo sgo: chassi (pnpm dev) e/ou Docker. Os modulos do lab serao descobertos pelas portas."
exit 0
