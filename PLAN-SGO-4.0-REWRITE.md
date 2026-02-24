---
name: SGO Core 4.0 — Rewrite
overview: Reescrita completa do backend (Hono + TypeScript + Drizzle + Postgres), separação frontend/backend em containers independentes, separação de roles (superadmin apenas no Nexus, chassi com admin+user), whitelabel por instância, stack Portainer/Swarm, e documentação rica para desenvolvimento de módulos assistido por IA.
todos:
  - id: repo-structure
    content: "Criar C:\\develop\\sgo: git init, pnpm-workspace.yaml, tsconfig raiz, package.json raiz, estrutura completa de pastas (chassi/frontend, chassi/backend, nexus esqueleto, modules/boilerplate, packages/ui, packages/sdk, docs/)"
    status: completed
  - id: packages-sdk
    content: "Criar packages/sdk com todos os tipos TypeScript: UserRole, User, Module, ModuleManifest, ModuleContext, Permission, SystemSetting, e Zod schemas"
    status: completed
  - id: packages-ui
    content: Migrar packages/ui do sgo-core para este repo packages/ui — componentes Shadcn + Tailwind já prontos
    status: completed
  - id: backend-setup
    content: "Criar chassi/backend/ com estrutura base: package.json (@sgo/chassi-backend), tsconfig.json, src/index.ts (Hono app), src/db/index.ts (Drizzle client Postgres), src/db/schema.ts (15 tabelas)"
    status: completed
  - id: backend-drizzle
    content: Criar Drizzle schema completo (15 tabelas com colunas exatas documentadas no plano) + migration inicial via drizzle-kit + seed.ts (admin padrão dev)
    status: completed
  - id: backend-middleware
    content: "Criar middleware Hono: authenticate.ts (JWT verificação + busca user DB), requireAdmin.ts, nexusAuth.ts (M2M X-SGO-MASTER-KEY), rateLimiter.ts"
    status: completed
  - id: backend-routes
    content: Criar todas as 19 rotas Hono TypeScript (ver lista completa no plano) preservando endpoints exatos do sgo-core/chassis/server/routes/
    status: completed
  - id: backend-services
    content: "Criar services: moduleLoader.ts, devModulesSync.ts (host.docker.internal quando DOCKER_ENV=true), nexusPulse.ts, nexusReport.ts"
    status: completed
  - id: roles-separation
    content: "Implementar role model admin+user apenas (sem superadmin no chassi): schema.ts role enum, middleware, setup wizard dual-mode (standalone vs Nexus-managed)"
    status: completed
  - id: whitelabel
    content: "Implementar whitelabel: 6 chaves em system_settings (app.name, app.logo_url, app.logo_dark_url, app.primary_color, app.favicon_url, app.custom_css), frontend lê via /api/public/settings"
    status: completed
  - id: frontend-migration
    content: Migrar chassi/frontend/ do sgo-core para chassi/frontend/src/ — código React existente, atualizar imports e remover refs superadmin
    status: completed
  - id: dockerfile-frontend
    content: "Criar chassi/Dockerfile.frontend: node:20-alpine builder (pnpm build) + nginx:alpine produção (serve dist/)"
    status: completed
  - id: dockerfile-backend
    content: "Criar chassi/Dockerfile.backend: node:20-alpine builder (pnpm build tsc) + node:20-alpine produção (dist/ + node_modules prod)"
    status: completed
  - id: docker-compose
    content: "Criar docker-compose.yml (3 serviços: chassi-frontend porta 3000, chassi-backend porta 3001, postgres:alpine porta 5432) + docker-compose.dev.yml (extra_hosts host-gateway para módulo dev)"
    status: completed
  - id: stack-yml
    content: "Criar stack.yml Portainer/Swarm: 3 serviços + rede traefik-public externa + labels Traefik (/* frontend, /api/* backend) + volumes persistentes"
    status: completed
  - id: github-actions
    content: "Criar .github/workflows/docker.yml com 4 jobs independentes com path filters: chassi-frontend, chassi-backend, nexus-frontend, nexus-backend — build amd64 + push ghcr.io/altrsconsult/"
    status: completed
  - id: boilerplate-ts
    content: "Criar modules/boilerplate/ completo em TypeScript: src/App.tsx, src/Widget.tsx, src/main.tsx (bridge chassi), server/index.ts (ModuleContext), manifest.json, vite.config.ts"
    status: completed
  - id: nexus-skeleton
    content: "Criar nexus/ esqueleto: frontend/package.json + src/App.tsx placeholder, backend/package.json + src/index.ts Hono vazio, Dockerfiles, README indicando sprint futuro"
    status: pending
  - id: docs-agents
    content: Criar docs/AGENTS.md (hub IA master) + docs/architecture/SYSTEM-OVERVIEW.md + docs/guides/CREATE-MODULE.md + docs/standards/MODULE-MANIFEST-SCHEMA.md
    status: completed
isProject: false
---

# SGO Core 4.0 — Rewrite + Docker + Módulos

## Contexto e repositórios

Este plano é **auto-suficiente** — contém tudo que um agente de IA precisa para executar sem contexto adicional.

- **Repo origem** (referência, NÃO modificar): `C:\GIT 2\sgo-core` — repo privado existente com histórico, módulos de cliente, código Express atual
- **Repo destino (este repositório):** `C:\develop\sgo` — monorepo público https://github.com/altrsconsult/sgo (antes “new-sgo”)
- Este repo foi inicializado com `git init` + pnpm workspaces. Nenhum arquivo do `sgo-core` é commitado diretamente — código é migrado/reescrito seletivamente

---

## Visão de produto (validada pelo PO)

```mermaid
graph TB
    subgraph nexus_stack [Stack Nexus - 1x por técnico]
        NF["nexus-frontend"]
        NB["nexus-backend\n(superadmin)"]
        NDB[("nexus-db")]
    end

    subgraph chassis_a [Stack Chassi - Cliente A]
        FA["chassi-frontend\n(whitelabel: Empresa A)"]
        BA["chassi-backend\n(admin + user apenas)"]
        DBA[("db-a")]
    end

    subgraph chassis_b [Stack Chassi - Cliente B]
        FB["chassi-frontend\n(whitelabel: Empresa B)"]
        BB["chassi-backend\n(admin + user apenas)"]
        DBB[("db-b")]
    end

    NB -->|"M2M master key"| BA
    NB -->|"M2M master key"| BB
    BA -.->|"auto-register pulse"| NB
    BB -.->|"auto-register pulse"| NB
```



**Persona central: Técnico Parceiro** — integrador que já opera Chatwoot/n8n/agentes de IA. Instala Nexus 1x, cria N stacks de chassi (uma por cliente), entrega módulos verticais como produto. Não reescreve infraestrutura — só cria módulos.

**Camadas de suporte:**

- N1: Técnico → seus clientes
- N2: ALTRS Consultoria → técnicos parceiros
- Comunidade: módulos comunitários, parcerias

---

## Repositório e imagens Docker

Monorepo único. Separação ocorre nas imagens ghcr.io e nos path filters do GitHub Actions.


| Serviço           | Imagem ghcr.io                             | Path filter CI                           |
| ----------------- | ------------------------------------------ | ---------------------------------------- |
| `chassi/frontend` | `ghcr.io/altrsconsult/sgo-chassi-frontend` | `chassi/frontend/`** ou `packages/ui/`** |
| `chassi/backend`  | `ghcr.io/altrsconsult/sgo-chassi-backend`  | `chassi/backend/`** ou `packages/sdk/`** |
| `nexus/frontend`  | `ghcr.io/altrsconsult/sgo-nexus-frontend`  | `nexus/frontend/`**                      |
| `nexus/backend`   | `ghcr.io/altrsconsult/sgo-nexus-backend`   | `nexus/backend/**`                       |


---

## Estrutura completa do monorepo (este repo: develop/sgo)

```
sgo/
├── chassi/
│   ├── frontend/                     ← MIGRADO de sgo-core/chassis/src/
│   │   ├── src/
│   │   │   ├── pages/                (telas principais)
│   │   │   ├── components/           (componentes reutilizáveis)
│   │   │   ├── layouts/              (MainLayout com sidebar/topbar)
│   │   │   ├── stores/               (zustand stores)
│   │   │   └── App.tsx
│   │   ├── public/
│   │   ├── index.html
│   │   ├── vite.config.ts            (Module Federation host)
│   │   └── package.json              (@sgo/chassi-frontend)
│   ├── backend/                      ← REESCRITO do zero (Hono + TS + Drizzle)
│   │   ├── src/
│   │   │   ├── index.ts              (entry point Hono)
│   │   │   ├── routes/               (19 rotas TS)
│   │   │   ├── middleware/           (authenticate, requireAdmin, nexusAuth, rateLimiter)
│   │   │   ├── db/
│   │   │   │   ├── schema.ts         (Drizzle schema — 15 tabelas)
│   │   │   │   ├── migrations/       (gerado por drizzle-kit)
│   │   │   │   └── index.ts          (Drizzle client Postgres)
│   │   │   ├── services/
│   │   │   │   ├── moduleLoader.ts
│   │   │   │   ├── devModulesSync.ts
│   │   │   │   ├── nexusPulse.ts
│   │   │   │   └── nexusReport.ts
│   │   │   └── lib/
│   │   │       ├── schemas.ts        (Zod schemas de validação)
│   │   │       └── jwt.ts            (helpers JWT)
│   │   ├── package.json              (@sgo/chassi-backend)
│   │   └── tsconfig.json
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── .dockerignore
│
├── nexus/                            ← ESQUELETO (sprint futuro)
│   ├── frontend/
│   │   ├── src/
│   │   │   └── App.tsx               (placeholder "Nexus em desenvolvimento")
│   │   ├── vite.config.ts
│   │   └── package.json              (@sgo/nexus-frontend)
│   ├── backend/
│   │   ├── src/
│   │   │   └── index.ts              (Hono app mínima com /api/health)
│   │   ├── package.json              (@sgo/nexus-backend)
│   │   └── tsconfig.json
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── README.md                     (indica sprint futuro)
│
├── modules/
│   └── boilerplate/                  ← REESCRITO em TypeScript
│       ├── src/
│       │   ├── App.tsx               (tela principal do módulo)
│       │   ├── Widget.tsx            (widget do dashboard)
│       │   └── main.tsx              (bridge com chassi via postMessage)
│       ├── server/
│       │   └── index.ts              (register(app, ctx: ModuleContext))
│       ├── manifest.json
│       ├── vite.config.ts            (Module Federation remote)
│       └── package.json              (@sgo/module-boilerplate)
│
├── packages/
│   ├── ui/                           ← MIGRADO de sgo-core/packages/ui/
│   │   ├── src/
│   │   │   ├── components/           (Shadcn + componentes customizados SGO)
│   │   │   └── index.ts
│   │   └── package.json              (@sgo/ui)
│   └── sdk/                          ← EXPANDIDO com novos tipos
│       ├── src/
│       │   ├── types.ts              (interfaces TypeScript)
│       │   └── schemas.ts            (Zod schemas exportados)
│       └── package.json              (@sgo/sdk)
│
├── docs/
│   ├── AGENTS.md                     (hub IA master)
│   ├── architecture/
│   │   ├── SYSTEM-OVERVIEW.md
│   │   ├── MODULE-CONTRACT.md
│   │   ├── API-REFERENCE.md
│   │   └── DOCKER-SETUP.md
│   ├── guides/
│   │   ├── CREATE-MODULE.md
│   │   ├── MODULE-BACKEND.md
│   │   └── DEPLOY-MODULE.md
│   └── standards/
│       ├── MANIFEST-SCHEMA.md
│       └── CODING-STANDARDS.md
│
├── docker-compose.yml                (chassi dev local — 3 serviços)
├── docker-compose.dev.yml            (módulo dev — host-gateway)
├── stack.yml                         (Portainer/Swarm + Traefik)
├── .github/
│   └── workflows/
│       └── docker.yml                (4 jobs com path filters)
├── pnpm-workspace.yaml
├── package.json                      (scripts raiz)
├── tsconfig.json                     (base tsconfig)
├── plan.md                           (visão geral e onde está o quê)
├── PLAN-SGO-4.0-REWRITE.md           (este arquivo — plano completo)
└── README.md
```

---

## Fase 0 — Estrutura do monorepo

### `pnpm-workspace.yaml`

```yaml
packages:
  - "chassi/frontend"
  - "chassi/backend"
  - "nexus/frontend"
  - "nexus/backend"
  - "modules/*"
  - "packages/*"
```

### `tsconfig.json` (raiz)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true
  }
}
```

### `package.json` (raiz — scripts utilitários)

```json
{
  "name": "sgo",
  "private": true,
  "scripts": {
    "dev": "pnpm --filter @sgo/chassi-backend dev & pnpm --filter @sgo/chassi-frontend dev",
    "build:chassi": "pnpm --filter @sgo/chassi-frontend build && pnpm --filter @sgo/chassi-backend build",
    "docker:up": "docker compose up",
    "docker:dev": "docker compose -f docker-compose.yml -f docker-compose.dev.yml up"
  }
}
```

---

## Fase 1 — `@sgo/sdk` (tipos e contratos)

O SDK é a base. Deve ser criado antes do backend e do boilerplate.

### `packages/sdk/src/types.ts`

```typescript
// Roles do chassi — superadmin NÃO existe no chassi, apenas no Nexus
export type UserRole = 'admin' | 'user'

export interface User {
  id: number
  username: string
  name: string
  email: string
  role: UserRole
  avatar: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface Module {
  id: number
  slug: string
  name: string
  description: string
  version: string
  path: string
  active: boolean
  icon: string
  color: string
  sortOrder: number
  remoteEntry: string | null
  type: 'installed' | 'dev'
  createdAt: string
}

export interface ModuleManifest {
  slug: string
  name: string
  title: string
  version: string
  description: string
  icon: string          // nome do ícone Lucide
  color: string         // hex color, ex: "#f59e0b"
  author: string
  webhooks: string[]
  permissions: string[]
  config: Record<string, unknown>
}

// Contexto passado ao backend de cada módulo
export interface ModuleContext {
  db: unknown           // instância Drizzle (tipagem específica no backend)
  moduleSlug: string
  uploadsPath: string
  modulesStoragePath: string
}

export interface SystemSetting {
  key: string
  value: string
  category: string
  description: string
}

export interface Permission {
  id: number
  moduleId: number
  userId: number | null
  groupId: number | null
  allowed: boolean
}
```

### `packages/sdk/src/schemas.ts` (Zod)

```typescript
import { z } from 'zod'

export const LoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

export const CreateUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['admin', 'user']),
})

export const ModuleManifestSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  title: z.string(),
  version: z.string(),
  description: z.string(),
  icon: z.string(),
  color: z.string(),
  author: z.string(),
  webhooks: z.array(z.string()).default([]),
  permissions: z.array(z.string()).default([]),
  config: z.record(z.unknown()).default({}),
})
```

---

## Fase 2 — `chassi/backend` (Hono + Drizzle + Postgres)

### Stack e dependências

```json
{
  "dependencies": {
    "hono": "^4",
    "@hono/node-server": "^1",
    "drizzle-orm": "^0.39",
    "pg": "^8",
    "bcryptjs": "^2",
    "jsonwebtoken": "^9",
    "zod": "^3",
    "adm-zip": "^0.5",
    "multer": "^1",
    "node-fetch": "^3"
  },
  "devDependencies": {
    "drizzle-kit": "^0.30",
    "typescript": "^5",
    "@types/node": "^20",
    "@types/pg": "^8",
    "@types/bcryptjs": "^2",
    "@types/jsonwebtoken": "^9"
  }
}
```

### `src/db/schema.ts` — Schema Drizzle completo (15 tabelas)

```typescript
import { pgTable, serial, text, integer, boolean, timestamp, jsonb, uuid, bigint, unique } from 'drizzle-orm/pg-core'

// Role enum — SEM superadmin no chassi
export const userRoleEnum = pgEnum('user_role', ['admin', 'user'])

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),          // bcrypt hash
  name: text('name').notNull(),
  email: text('email').notNull(),
  role: userRoleEnum('role').notNull().default('user'),
  avatar: text('avatar'),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const modules = pgTable('modules', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  version: text('version'),
  path: text('path'),
  active: boolean('active').notNull().default(true),
  config: jsonb('config'),
  icon: text('icon'),
  color: text('color'),
  sortOrder: integer('sort_order').default(0),
  remoteEntry: text('remote_entry'),
  type: text('type').default('installed'),        // 'installed' | 'dev'
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const userGroups = pgTable('user_groups', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const userGroupMembers = pgTable('user_group_members', {
  id: serial('id').primaryKey(),
  groupId: integer('group_id').notNull().references(() => userGroups.id),
  userId: integer('user_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({ uniq: unique().on(t.groupId, t.userId) }))

export const modulePermissions = pgTable('module_permissions', {
  id: serial('id').primaryKey(),
  moduleId: integer('module_id').notNull().references(() => modules.id),
  userId: integer('user_id').references(() => users.id),
  groupId: integer('group_id').references(() => userGroups.id),
  allowed: boolean('allowed').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
})

export const systemSettings = pgTable('system_settings', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value'),
  category: text('category'),
  description: text('description'),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const moduleConfig = pgTable('module_config', {
  id: serial('id').primaryKey(),
  moduleId: integer('module_id').notNull().references(() => modules.id),
  key: text('key').notNull(),
  value: text('value'),
  type: text('type').default('string'),           // string | number | boolean | json
  updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({ uniq: unique().on(t.moduleId, t.key) }))

export const moduleData = pgTable('module_data', {
  id: serial('id').primaryKey(),
  moduleId: integer('module_id').notNull().references(() => modules.id),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id'),
  data: jsonb('data'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const nexusInstallations = pgTable('nexus_installations', {
  id: serial('id').primaryKey(),
  installationId: text('installation_id').notNull().unique(),
  masterKeyHash: text('master_key_hash'),
  version: text('version'),
  url: text('url'),
  hostname: text('hostname'),
  lastPulseAt: timestamp('last_pulse_at'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const storageFiles = pgTable('storage_files', {
  id: uuid('id').defaultRandom().primaryKey(),
  ownerType: text('owner_type'),
  ownerId: text('owner_id'),
  originalName: text('original_name').notNull(),
  storedName: text('stored_name').notNull(),
  mimeType: text('mime_type'),
  sizeBytes: bigint('size_bytes', { mode: 'number' }),
  sha256: text('sha256'),
  storagePath: text('storage_path').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  expiresAt: timestamp('expires_at'),
  deletedAt: timestamp('deleted_at'),
})

export const tickets = pgTable('tickets', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  subject: text('subject').notNull(),
  description: text('description'),
  status: text('status').default('open'),         // open | in_progress | closed
  priority: text('priority').default('normal'),   // low | normal | high
  lastResponse: text('last_response'),
  lastResponseAt: timestamp('last_response_at'),
  lastResponseByUserId: integer('last_response_by_user_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const ticketMessages = pgTable('ticket_messages', {
  id: serial('id').primaryKey(),
  ticketId: integer('ticket_id').notNull().references(() => tickets.id),
  userId: integer('user_id').references(() => users.id),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const webhookDefinitions = pgTable('webhook_definitions', {
  id: uuid('id').defaultRandom().primaryKey(),
  moduleId: integer('module_id').references(() => modules.id),
  name: text('name').notNull(),
  url: text('url').notNull(),
  secret: text('secret'),
  events: jsonb('events').default([]),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const webhookLogs = pgTable('webhook_logs', {
  id: serial('id').primaryKey(),
  webhookId: uuid('webhook_id').references(() => webhookDefinitions.id),
  event: text('event'),
  payload: jsonb('payload'),
  responseStatus: integer('response_status'),
  responseBody: text('response_body'),
  success: boolean('success'),
  durationMs: integer('duration_ms'),
  error: text('error'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id'),
  userName: text('user_name'),
  action: text('action').notNull(),
  entityType: text('entity_type'),
  entityId: text('entity_id'),
  details: jsonb('details'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow(),
})
```

### `src/index.ts` — Entry point Hono

```typescript
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { db } from './db/index.js'
import { authRoutes } from './routes/auth.js'
// ... demais imports de rotas

const app = new Hono()

app.use('*', cors())
app.use('*', logger())

app.route('/api/auth', authRoutes)
// ... demais rotas

const port = Number(process.env.PORT) || 3001
serve({ fetch: app.fetch, port }, () => {
  console.log(`Chassi backend rodando na porta ${port}`)
})
```

### Rotas a implementar (19 arquivos em `src/routes/`)

Todos os endpoints abaixo devem ser preservados exatamente como no `sgo-core/chassis/server/routes/`:


| Arquivo                | Endpoints principais                                                                                                                               |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `auth.ts`              | POST `/api/auth/login`, GET `/api/auth/verify`, POST `/api/auth/logout`, POST `/api/auth/impersonate/:userId`, POST `/api/auth/stop-impersonation` |
| `users.ts`             | GET/POST `/api/users`, GET/PUT/PATCH/DELETE `/api/users/:id`, POST `/api/users/:id/reset-password`                                                 |
| `groups.ts`            | CRUD `/api/groups`, POST/DELETE `/api/groups/:id/members`                                                                                          |
| `modules.ts`           | GET/POST `/api/modules`, PATCH `/api/modules/:id`, PATCH `/api/modules/:id/toggle-active`, DELETE `/api/modules/:id`                               |
| `permissions.ts`       | GET `/api/permissions/user/:userId`, GET `/api/permissions/matrix`, POST `/api/permissions`, POST `/api/permissions/bulk`                          |
| `module-config.ts`     | GET/POST `/api/module-config/:slug`, GET `/api/module-config/:slug/:key`                                                                           |
| `module-data.ts`       | CRUD `/api/module-data/:slug/:entityType`, POST `/api/module-data/:slug/:entityType/search`                                                        |
| `storage.ts`           | POST `/api/storage/files`, GET `/api/storage/files/:id/download`, DELETE `/api/storage/files/:id`                                                  |
| `tickets.ts`           | CRUD `/api/tickets`, POST `/api/tickets/:id/messages`, PATCH `/api/tickets/:id/status`                                                             |
| `audit.ts`             | GET `/api/audit`, GET `/api/audit/actions`                                                                                                         |
| `webhooks.ts`          | CRUD `/api/webhooks`, GET `/api/webhooks/:id/logs`, POST `/api/webhooks/trigger`                                                                   |
| `settings.ts`          | GET/POST `/api/settings`, GET `/api/settings/:category`                                                                                            |
| `setup.ts`             | GET `/api/setup/status`, POST `/api/setup/install`, POST `/api/setup/reinstall`                                                                    |
| `public.ts`            | GET `/api/public/settings` (sem auth — retorna whitelabel settings)                                                                                |
| `pulse.ts`             | POST `/api/pulse`                                                                                                                                  |
| `nexus.ts`             | Todos endpoints `/api/nexus/*` para controle remoto pelo Nexus                                                                                     |
| `upload-module.ts`     | POST `/api/upload-module` (multipart ZIP)                                                                                                          |
| `install-from-link.ts` | POST `/api/install-from-link`                                                                                                                      |
| `health.ts`            | GET `/api/health`, GET `/api/health/detail`                                                                                                        |


### Middleware

```typescript
// src/middleware/authenticate.ts
// Valida JWT no header Authorization: Bearer <token>
// Busca usuário no DB, rejeita se inativo
// Adiciona user ao contexto: c.set('user', user)

// src/middleware/requireAdmin.ts
// Verifica c.get('user').role === 'admin'
// Retorna 403 se não for admin

// src/middleware/nexusAuth.ts
// Verifica header X-SGO-MASTER-KEY
// Valida contra master_key_hash na tabela nexus_installations
// Usado em todas as rotas /api/nexus/*

// src/middleware/rateLimiter.ts
// Limite geral: 100 req/15min por IP
// Limite login: 10 req/15min por IP
```

---

## Separação de roles — superadmin APENAS no Nexus

### O que muda no chassi

- Tabela `users`: enum `role` tem apenas `'admin' | 'user'` (sem `'superadmin'`)
- Middleware `requireAdmin` verifica `role === 'admin'` (antes verificava `admin` ou `superadmin`)
- Setup wizard cria apenas usuário `admin` (não `superadmin`)
- Seed dev cria: `admin/admin123` (admin) + `usuario/usuario123` (user)
- Impersonation: `admin` pode impersonar qualquer `user`; Nexus via M2M pode impersonar qualquer usuário
- Rotas que antes exigiam `superadmin` passam a exigir apenas `admin`

### Setup wizard dual-mode

Detecção automática via variável de ambiente:

```
NEXUS_URL definida → Modo Gerenciado
NEXUS_URL não definida → Modo Standalone
```

**Modo Standalone** (padrão):

- Wizard `POST /api/setup/install` cria admin local (username/password fornecidos no form)
- Sistema funciona de forma totalmente independente
- Ideal para: devs locais, clientes que querem independência total

**Modo Gerenciado** (quando `NEXUS_URL` está configurada):

- Chassi auto-registra no Nexus via pulse na inicialização
- Nexus provisiona o admin inicial via M2M após registro
- Técnico gerencia tudo pelo painel do Nexus

---

## Whitelabel

Configuração via `system_settings`. Chaves reservadas:


| Chave               | Descrição                 | Default     |
| ------------------- | ------------------------- | ----------- |
| `app.name`          | Nome da aplicação         | `"SGO"`     |
| `app.logo_url`      | URL do logo (modo claro)  | null        |
| `app.logo_dark_url` | URL do logo (modo escuro) | null        |
| `app.primary_color` | Cor primária hex          | `"#6366f1"` |
| `app.favicon_url`   | URL do favicon            | null        |
| `app.custom_css`    | CSS customizado injetado  | null        |


Endpoint público (sem auth): `GET /api/public/settings` retorna essas 6 chaves.
Frontend lê esse endpoint na inicialização e aplica as configurações antes de renderizar qualquer tela.
Nenhuma referência hardcoded a "SGO" na UI — tudo vem das settings.

---

## Fase 3 — Frontend (`chassi/frontend`)

### Estratégia: migração, não reescrita

O frontend React existente em `sgo-core/chassis/src/` está funcional e homologado. Será **migrado** (não reescrito) para `chassi/frontend/src/` neste repo.

**O que mudar durante a migração:**

- Remover qualquer menção a role `superadmin` nas guards e UI
- Atualizar imports de `@sgo/ui` e `@sgo/sdk` (paths podem mudar)
- Substituir referências hardcoded ao nome "SGO" por `useAppSettings()` hook que lê `/api/public/settings`
- Atualizar `vite.config.ts` para refletir novo path da estrutura

**O que NÃO mudar:**

- Lógica de negócio das telas
- Componentes de UI (migrar integralmente de `packages/ui`)
- Module Federation configuration (apenas ajustar paths)
- Stores Zustand

### `vite.config.ts` (Module Federation host)

```typescript
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    federation({
      name: 'host',
      remotes: {},           // populado dinamicamente pelo chassi em runtime
      shared: ['react', 'react-dom', 'react-router-dom', 'zustand', '@tanstack/react-query'],
    }),
  ],
})
```

---

## Fase 4 — Docker

### `chassi/Dockerfile.frontend`

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/ packages/
COPY chassi/frontend/ chassi/frontend/
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @sgo/chassi-frontend build

FROM nginx:alpine
COPY --from=builder /app/chassi/frontend/dist /usr/share/nginx/html
COPY chassi/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

`nginx.conf` deve ter `try_files $uri /index.html` para SPA routing.

### `chassi/Dockerfile.backend`

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/ packages/
COPY chassi/backend/ chassi/backend/
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @sgo/chassi-backend build

FROM node:20-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY --from=builder /app/chassi/backend/dist ./dist
COPY --from=builder /app/chassi/backend/package.json ./
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

### `docker-compose.yml` (chassi local — 3 serviços)

```yaml
services:
  chassi-frontend:
    image: ghcr.io/altrsconsult/sgo-chassi-frontend:latest
    ports:
      - "3000:80"

  chassi-backend:
    image: ghcr.io/altrsconsult/sgo-chassi-backend:latest
    ports:
      - "3001:3001"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://sgo:${POSTGRES_PASSWORD:-sgodev}@chassi-db:5432/sgo
      JWT_SECRET: ${JWT_SECRET:-dev-secret-change-in-production}
      PORT: 3001
    volumes:
      - sgo_modules:/app/modules_storage
      - sgo_uploads:/app/uploads
    depends_on:
      - chassi-db

  chassi-db:
    image: postgres:alpine
    environment:
      POSTGRES_USER: sgo
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-sgodev}
      POSTGRES_DB: sgo
    ports:
      - "5432:5432"
    volumes:
      - sgo_data:/var/lib/postgresql/data

volumes:
  sgo_data:
  sgo_modules:
  sgo_uploads:
```

### `docker-compose.dev.yml` (módulo em desenvolvimento)

Sobrescreve o compose base adicionando `host.docker.internal` para que o backend Docker alcance o módulo rodando no host:

```yaml
services:
  chassi-backend:
    environment:
      DOCKER_ENV: "true"    # ativa host.docker.internal no devModulesSync
    extra_hosts:
      - "host.docker.internal:host-gateway"
```

Uso: `docker compose -f docker-compose.yml -f docker-compose.dev.yml up`

### `stack.yml` (Portainer/Swarm + Traefik)

```yaml
version: "3.8"
services:
  chassi-frontend:
    image: ghcr.io/altrsconsult/sgo-chassi-frontend:latest
    networks:
      - traefik-public
    deploy:
      replicas: 1
      labels:
        - traefik.enable=true
        - traefik.http.routers.${STACK_NAME:-sgo}-fe.rule=Host(`${DOMAIN}`) && !PathPrefix(`/api`)
        - traefik.http.routers.${STACK_NAME:-sgo}-fe.entrypoints=websecure
        - traefik.http.routers.${STACK_NAME:-sgo}-fe.tls.certresolver=letsencrypt
        - traefik.http.services.${STACK_NAME:-sgo}-fe.loadbalancer.server.port=80

  chassi-backend:
    image: ghcr.io/altrsconsult/sgo-chassi-backend:latest
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://sgo:${POSTGRES_PASSWORD}@chassi-db:5432/sgo
      JWT_SECRET: ${JWT_SECRET}
      PORT: 3001
    volumes:
      - sgo_modules:/app/modules_storage
      - sgo_uploads:/app/uploads
    networks:
      - traefik-public
      - internal
    deploy:
      replicas: 1
      labels:
        - traefik.enable=true
        - traefik.http.routers.${STACK_NAME:-sgo}-be.rule=Host(`${DOMAIN}`) && PathPrefix(`/api`)
        - traefik.http.routers.${STACK_NAME:-sgo}-be.entrypoints=websecure
        - traefik.http.routers.${STACK_NAME:-sgo}-be.tls.certresolver=letsencrypt
        - traefik.http.services.${STACK_NAME:-sgo}-be.loadbalancer.server.port=3001

  chassi-db:
    image: postgres:alpine
    environment:
      POSTGRES_USER: sgo
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: sgo
    volumes:
      - sgo_data:/var/lib/postgresql/data
    networks:
      - internal

networks:
  traefik-public:
    external: true
  internal:
    driver: overlay

volumes:
  sgo_data:
  sgo_modules:
  sgo_uploads:
```

**Variáveis obrigatórias no Portainer:** `DOMAIN`, `JWT_SECRET`, `POSTGRES_PASSWORD`.
**Opcional:** `STACK_NAME` (permite múltiplas instâncias no mesmo Swarm com nomes distintos).

### `.github/workflows/docker.yml` (4 jobs com path filters)

```yaml
name: Build and Push Docker Images

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  chassi-backend:
    if: |
      contains(github.event.head_commit.modified, 'chassi/backend/') ||
      contains(github.event.head_commit.modified, 'packages/sdk/')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v5
        with:
          context: .
          file: chassi/Dockerfile.backend
          push: true
          tags: ghcr.io/altrsconsult/sgo-chassi-backend:latest

  chassi-frontend:
    # similar ao chassi-backend, com paths chassi/frontend/** e packages/ui/**
    ...

  nexus-backend:
    # paths nexus/backend/** — para sprint futuro
    ...

  nexus-frontend:
    # paths nexus/frontend/** — para sprint futuro
    ...
```

---

## Fase 5 — `modules/boilerplate` (TypeScript completo)

### `manifest.json`

```json
{
  "slug": "boilerplate",
  "name": "Boilerplate",
  "title": "Módulo Boilerplate",
  "version": "1.0.0",
  "description": "Template base para criar novos módulos SGO",
  "icon": "Code",
  "color": "#f59e0b",
  "author": "altrsconsult",
  "webhooks": [],
  "permissions": ["read"],
  "config": {}
}
```

### `src/main.tsx` (bridge com o chassi)

```typescript
// Recebe token e tema via postMessage do chassi
// Inicializa React com o token disponível no contexto
```

### `server/index.ts` (backend opcional do módulo)

```typescript
import type { Hono } from 'hono'
import type { ModuleContext } from '@sgo/sdk'

// Chassi chama: register(app, { db, moduleSlug, uploadsPath, modulesStoragePath })
// Rotas ficam em: /api/modules/boilerplate/*
export default function register(app: Hono, ctx: ModuleContext) {
  app.get('/hello', (c) => c.json({ message: `Olá do módulo ${ctx.moduleSlug}!` }))
}
```

### `vite.config.ts` (Module Federation remote)

```typescript
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    federation({
      name: 'boilerplate',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App',
        './Widget': './src/Widget',
      },
      shared: ['react', 'react-dom', 'react-router-dom', 'zustand', '@tanstack/react-query'],
    }),
  ],
  server: { port: 5001 },
})
```

---

## Fase 6 — Documentação para IA (`docs/AGENTS.md`)

### Conteúdo do `AGENTS.md` (documento mestre)

Estrutura do documento:

1. **O que é o SGO** — plataforma Micro-SaaS modular, chassi + módulos, modelo de negócio
2. **Arquitetura em 30 segundos** — diagrama, 3 containers, Module Federation
3. **Como criar um módulo do zero** — checklist de 8 passos com comandos exatos
4. **Contrato do módulo** — o que o chassi fornece, o que o módulo precisa expor
5. **API do chassi** — endpoints disponíveis para módulos chamarem (autenticados pelo token do usuário)
6. **Componentes disponíveis** — `@sgo/ui` com exemplos de uso
7. **Tipos disponíveis** — `@sgo/sdk` com interfaces principais
8. **O que NÃO fazer** — arquivos que não devem ser modificados, padrões a evitar
9. **Deploy do módulo** — como empacotar em ZIP e instalar no chassi

---

## Serviço `devModulesSync`

Roda apenas quando `NODE_ENV !== 'production'` OU quando `DOCKER_ENV === 'true'`.

Lógica:

1. Varre portas 5001 a 5099 fazendo `GET http://{host}:{port}/manifest.json`
2. `host` = `host.docker.internal` quando `DOCKER_ENV=true`, senão `localhost`
3. Para cada porta que responde com um manifest válido (schema `ModuleManifestSchema`):
  - Upsert na tabela `modules` com `type = 'dev'` e `remoteEntry = http://localhost:{port}/assets/remoteEntry.js`
  - Nota: o `remoteEntry` usa `localhost` (não `host.docker.internal`) porque é o browser que carrega, não o backend
4. Remove do DB módulos `type = 'dev'` cujas portas não respondem mais

---

## Nexus — esqueleto (sprint futuro)

O `nexus/` é criado na fase 0 mas implementado em sprint separado. O esqueleto contém:

- `nexus/frontend/src/App.tsx` — tela com mensagem "Nexus Central — em desenvolvimento"
- `nexus/backend/src/index.ts` — Hono app com apenas `GET /api/health` respondendo `{ status: 'ok', service: 'nexus' }`
- `nexus/README.md` — descreve responsabilidades futuras: gerenciar N instâncias chassi, superadmin, whitelabel remoto, provisioning de admins

---

## Referência: código fonte no repo atual

Para consultar a implementação Express existente (referência durante a reescrita):

- Rotas: `C:\GIT 2\sgo-core\chassis\server\routes\`
- Middleware: `C:\GIT 2\sgo-core\chassis\server\middleware\`
- Services: `C:\GIT 2\sgo-core\chassis\server\services\`
- Frontend: `C:\GIT 2\sgo-core\chassis\src\`
- UI package: `C:\GIT 2\sgo-core\packages\ui\`
- SDK package: `C:\GIT 2\sgo-core\packages\sdk\`
