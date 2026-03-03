# build-node-zip.ps1 — Gera o ZIP do chassi Node para deploy (Hostinger etc.)
# Executar na raiz do repo: .\scripts\build-node-zip.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path "$root\package.json")) { $root = (Get-Location).Path }
Set-Location $root

Write-Host "[1/5] Build Node (SDK + Frontend + Backend + public)..." -ForegroundColor Cyan
pnpm build:node
if ($LASTEXITCODE -ne 0) { exit 1 }

$backend = "$root\chassi\backend"
$packagesSdk = "$root\packages\sdk"

Write-Host "[2/5] Ajustando package.json do backend (file:./sdk)..." -ForegroundColor Cyan
$pkgPath = "$backend\package.json"
$pkg = Get-Content $pkgPath -Raw | ConvertFrom-Json
$pkg.dependencies.'@sgo/sdk' = "file:./sdk"
$pkg | ConvertTo-Json -Depth 10 | Set-Content $pkgPath -Encoding UTF8

Write-Host "[3/5] Copiando SDK e instalando deps de produção..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path "$backend\sdk" | Out-Null
Copy-Item -Path "$packagesSdk\dist" -Destination "$backend\sdk\dist" -Recurse -Force
Copy-Item -Path "$packagesSdk\package.json" -Destination "$backend\sdk\package.json" -Force
Set-Location $backend
npm install --omit=dev --ignore-scripts
if ($LASTEXITCODE -ne 0) { exit 1 }
Set-Location $root

$deployDir = "$root\deploy"
$releaseDir = "$deployDir\sgo-node-release"
$tag = "local-" + (Get-Date -Format "yyyyMMdd-HHmm")
$zipName = "sgo-node-$tag.zip"
$zipPath = "$deployDir\$zipName"

Write-Host "[4/5] Montando estrutura em deploy\sgo-node-release\..." -ForegroundColor Cyan
Remove-Item -Path $releaseDir -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path $releaseDir | Out-Null

Copy-Item -Path "$backend\dist" -Destination "$releaseDir\dist" -Recurse -Force
Copy-Item -Path "$backend\public" -Destination "$releaseDir\public" -Recurse -Force
Copy-Item -Path "$backend\sdk" -Destination "$releaseDir\sdk" -Recurse -Force
Copy-Item -Path "$backend\node_modules" -Destination "$releaseDir\node_modules" -Recurse -Force
Copy-Item -Path "$backend\package.json" -Destination "$releaseDir\package.json" -Force
Copy-Item -Path "$root\.env.example" -Destination "$releaseDir\.env.example" -Force
if (Test-Path "$root\docs\guides\README-HOSTINGER.md") {
  Copy-Item -Path "$root\docs\guides\README-HOSTINGER.md" -Destination "$releaseDir\README.md" -Force
}

Write-Host "[5/5] Criando ZIP em deploy\$zipName..." -ForegroundColor Cyan
Remove-Item -Path $zipPath -Force -ErrorAction SilentlyContinue
Compress-Archive -Path "$releaseDir\*" -DestinationPath $zipPath -CompressionLevel Optimal

# Restaura package.json do backend para não quebrar pnpm no repo
Write-Host "Restaurando package.json do backend (workspace:*)..." -ForegroundColor Cyan
$pkg = Get-Content $pkgPath -Raw | ConvertFrom-Json
$pkg.dependencies.'@sgo/sdk' = "workspace:*"
$pkg | ConvertTo-Json -Depth 10 | Set-Content $pkgPath -Encoding UTF8

Write-Host ""
Write-Host "Concluído. ZIP: deploy\$zipName" -ForegroundColor Green
Write-Host "Faça upload desse arquivo na Hostinger (Upload de arquivo ZIP)." -ForegroundColor Green
