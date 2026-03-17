# Módulos no Chassi 4.x — Iframe-first

> Estado atual: o chassi opera com módulos instaláveis em **iframe standalone**. Este documento descreve o contrato em produção e desenvolvimento.

---

## Visão geral

- **Instalado (ZIP):** módulo é extraído em `modules_storage/<slug>/` e servido em `/modules-assets/<slug>/...`.
- **Dev (HMR):** backend descobre módulos em `5001–5099` e registra URL de dev server para abrir no iframe.
- **Renderização no frontend:** rota `/app/<slug>` abre iframe com subrota preservada (`/config`, etc.).

---

## Contrato operacional do módulo

1. Build gera `dist/index.html` + `dist/assets/*`.
2. `vite.config.ts` deve usar `base: "./"` para assets relativos.
3. `manifest.json` define metadados e webhooks de entrada.
4. Módulo deve suportar roteamento interno SPA (o chassi faz fallback para `index.html` em subrotas).

Campos principais de `manifest.json`:

- `slug`, `name`, `version`, `description`, `icon`, `color`
- `permissions`, `hasWidget`, `serverPort` (opcionais)
- `webhooks` (opcional) com `slug`, `path`, `method`, `entityType`

---

## Rotas críticas do chassi para módulos

- `GET /modules-assets/:slug/*`  
  Serve frontend do módulo e assets.

- `GET /api/modules`  
  Retorna `remoteUrl` para módulos instalados (ex.: `/modules-assets/<slug>/dist/index.html`).

- `POST /api/webhook/:moduleSlug/:hookSlug`  
  Ingestão pública de webhook por módulo (valida declaração no manifest do módulo ativo).

---

## Fluxo resumido

```text
Módulo instalado (ZIP):
  Upload -> extração em modules_storage/<slug>
  -> /api/modules informa remoteUrl
  -> frontend abre iframe em /modules-assets/<slug>/dist/
  -> subrotas (/config etc.) caem no fallback SPA do backend

Módulo em dev:
  pnpm dev no módulo (porta 5001+)
  -> backend descobre /manifest.json
  -> registra URL de dev server
  -> frontend abre iframe com HMR
```

---

## modules-lab (privado)

A pasta `modules-lab/` é intencionalmente privada (não publicada no repo principal).  
Ela é usada para módulos de cliente e pode ter versionamento separado.

---

Referências de operação:

- `docs/DEV-DOCKER-LOCAL.md`
- `docs/guides/CREATE-MODULE.md`
- `docs/guides/DEPLOY.md`
