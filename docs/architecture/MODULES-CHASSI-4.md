# Módulos no Chassi 4.0 — Análise e Compatibilidade

> **Contexto:** Módulos prontos e homologados do chassi antigo (sgo-core) precisam funcionar no chassi 4.0 sem alteração de frontend (leads-intake, enroll-manage). Este doc descreve o estado atual e o que foi ajustado no chassi para suportá-los.

---

## Visão geral

- **Chassi antigo (sgo-core):** Node.js/Express, módulos em `modules/` com build **standalone** (iframe) ou Module Federation.
- **Chassi 4.0:** Hono + Drizzle, mesmo conceito: módulos podem ser
  1. **Instalados via ZIP** → extraídos em `modules_storage/<slug>/` e servidos pelo backend em `/modules-assets/<slug>/...`
  2. **Dev (pnpm dev na pasta do módulo)** → backend descobre pela varredura de portas 5001–5099 e registra; frontend carrega via iframe (standalone) ou Module Federation (remoteEntry.js).

---

## Formas de rodar um módulo no 4.0

| Forma | Como | Onde aparece |
|-------|------|--------------|
| **ZIP** | Upload em Admin → Módulos ou `POST /api/upload-module` | `type: 'installed'`, assets em `modules_storage/<slug>/dist/` |
| **Dev (HMR)** | `pnpm dev` na pasta do módulo (ex.: `modules/leads-intake`) | `type: 'dev'`, URL do dev server (iframe ou remoteEntry) |

Em ambos os casos o módulo deve aparecer no menu lateral e abrir em `/app/<slug>` (iframe para standalone, Module Federation quando houver `remoteEntry.js`).

---

## Módulos standalone vs Federation

- **Standalone:** build gera `dist/index.html` + assets; o chassi exibe em **iframe** (URL = dev server ou `/modules-assets/<slug>/dist/index.html`).
- **Federation:** módulo expõe `remoteEntry.js`; o chassi carrega o componente via `useRemoteModule` (sem iframe).

Os módulos **leads-intake** e **enroll-manage** são **standalone** (sem Module Federation). Nenhuma alteração neles é necessária: apenas garantir que o chassi (backend + sync) trate standalone corretamente.

---

## Contrato do manifest.json

O backend valida com `ModuleManifestSchema` (@sgo/sdk). Campos usados no registro:

- `slug`, `name`, `description` (opcional), `version`, `icon`, `color`, `permissions` (opcional), `hasWidget` (opcional), `serverPort` (opcional).

Campos extras (ex.: `title`, `author`, `webhooks`, `config`) são **ignorados** pelo Zod na parse (não quebram). Os manifests atuais de leads-intake e enroll-manage são compatíveis.

---

## Ajustes feitos no chassi (sem tocar nos módulos)

1. **Backend — servir assets de módulos instalados**  
   Rota `GET /modules-assets/:slug/*` que sirve arquivos estáticos de `modules_storage/<slug>/`, permitindo abrir `/modules-assets/<slug>/dist/index.html` no iframe.

2. **Backend — URL usável para instalados**  
   Em `GET /api/modules` (e quando aplicável em respostas por id/slug), para módulos com `type: 'installed'` é preenchido `remoteUrl: '/modules-assets/<slug>/dist/index.html'`, para o frontend usar no iframe sem depender de `path` (filesystem).

3. **devModulesSync — módulos standalone em dev**  
   Ao descobrir um módulo na porta N, o sync tenta `GET http://localhost:N/assets/remoteEntry.js`. Se retornar 404 (módulo standalone), registra `remoteEntry = 'http://localhost:N/'` para o frontend usar iframe no dev server; caso contrário, mantém `remoteEntry = 'http://localhost:N/assets/remoteEntry.js'` (Federation).

---

## Fluxo resumido

```
Módulo instalado (ZIP):
  Backend extrai em modules_storage/<slug>/
  → GET /api/modules retorna remoteUrl = '/modules-assets/<slug>/dist/index.html'
  → Frontend abre iframe com origin + remoteUrl
  → Backend atende GET /modules-assets/<slug>/dist/index.html (e demais assets)

Módulo em dev (pnpm dev):
  Backend a cada 5s varre 5001–5099, lê manifest.json
  → Se /assets/remoteEntry.js 404: remoteEntry = 'http://localhost:N/' (iframe)
  → Se 200: remoteEntry = 'http://localhost:N/assets/remoteEntry.js' (Federation)
  → Frontend usa remoteEntry para iframe ou useRemoteModule
```

---

## Dev: expor manifest.json

Para o `devModulesSync` descobrir o módulo, o servidor de dev do módulo precisa responder em **GET /manifest.json**. No Vite, coloque `manifest.json` em **public/** (ou um symlink) para que seja servido na raiz. Caso contrário a varredura de portas não registrará o módulo.

---

## Lab de módulos (módulos de clientes)

A pasta **`modules-lab/`** existe para módulos que **não devem ir ao repositório público** (ex.: clientes como Edukaead). Ela está no `pnpm-workspace.yaml` e no `.gitignore` do repo público: só `modules-lab/.gitignore` e `modules-lab/README.md` são versionados. O conteúdo (cópias edukaead-leads-intake, edukaead-enroll-manage, edukaead-gestao-repasses) fica apenas local ou em um **repositório Git privado** clonado nesse caminho. Veja `modules-lab/README.md`.

## Referência do sistema antigo

Para comparar ou copiar módulos do chassi antigo: **c:/git 2/sgo-core** (não modificar; usar só como referência).
