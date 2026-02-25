# Dev local — estado atual

Backend e banco no **Docker**. Frontend e módulos no host com **pnpm dev** (Vite). Módulos aparecem no chassi com HMR (iframe no dev server).

## Portas

| Onde   | Serviço   | Porta |
|--------|-----------|-------|
| Docker | Backend   | 3001  |
| Docker | Frontend  | 3000 (opcional) |
| Docker | Postgres  | 5432  |
| Host   | Chassi (Vite) | 5173  |
| Host   | Módulos (Vite) | 5001–5099 |

## Fluxo para rodar (ordem)

1. **Backend + banco**
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d chassi-db chassi-backend
   ```

2. **Chassi (frontend)** — na raiz: `pnpm dev` → Vite em 5173 (proxy `/api` e `/modules-assets` para 3001).

3. **Módulos** — um terminal por módulo: `cd <pasta-do-modulo>` e `pnpm dev`. O backend descobre em ~5 s (varredura 5001–5099 via `host.docker.internal`).

## Requisitos no módulo (dev)

- **`public/manifest.json`** (cópia do manifest) para GET /manifest.json.
- **vite.config.ts** — `server: { host: true, allowedHosts: true, cors: true }`.
- **Standalone vs Federation:** o backend só registra como Federation se o manifest tiver campo **`exposes`** e existir `/assets/remoteEntry.js`. Sem `exposes` → iframe (standalone).

## Comportamento

- **DEV_MODULES_ACCEPT_ALL=true** (override de dev): qualquer módulo que responda na varredura é registrado (sem restrição por pasta).
- **3000 (frontend Docker):** mesmo backend 3001; se o sync de dev estiver ativo, mostra instalados + dev. Para “só instalados”, use backend sem override de dev ou NODE_ENV=production.
- **Instalado (ZIP) + mesmo slug em dev:** um único registro por slug (upsert). Enquanto o dev estiver rodando, o registro aponta para o dev server; ao parar o dev, o módulo fica inativo.

## Resumo

Docker = backend (3001) + banco. `pnpm dev` na raiz = só frontend (5173). `pnpm dev` na pasta do módulo = descoberta automática e iframe com HMR.
