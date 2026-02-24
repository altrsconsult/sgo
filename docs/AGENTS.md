# AGENTS.md — Hub de Documentação para Agentes de IA

> **Para agentes de IA:** Este arquivo é o ponto de entrada principal.
> Leia este documento inteiro antes de qualquer ação no repositório.

---

## O que é o SGO?

**SGO (Sistema de Gestão Operacional)** é uma plataforma Micro-SaaS open-source para micro empresas.
Arquitetura baseada em **Chassi + Módulos** onde:

- **Chassi** = plataforma base (autenticação, layout, gestão de módulos, whitelabel)
- **Módulos** = funcionalidades de negócio isoladas (CRM, tarefas, formulários, etc.)
- **Nexus** = torre de controle central para gerenciar N instâncias de chassi

---

## Estrutura do Monorepo

```
new-sgo/
├── chassi/
│   ├── frontend/          # React + Vite + Module Federation (HOST)
│   └── backend/           # Hono + Drizzle + PostgreSQL (TypeScript)
├── nexus/
│   ├── frontend/          # React (placeholder)
│   └── backend/           # Hono (placeholder)
├── modules/
│   └── boilerplate/       # Template base para novos módulos
├── packages/
│   ├── ui/                # Design System (@sgo/ui — Shadcn/Tailwind)
│   └── sdk/               # Tipos TypeScript + Zod schemas (@sgo/sdk)
└── docs/
    ├── AGENTS.md           # Este arquivo
    ├── architecture/
    │   └── SYSTEM-OVERVIEW.md
    ├── guides/
    │   └── CREATE-MODULE.md
    └── standards/
        └── MODULE-MANIFEST-SCHEMA.md
```

---

## Documentação por Área

| Área | Arquivo |
|------|---------|
| Arquitetura geral do sistema | [docs/architecture/SYSTEM-OVERVIEW.md](./architecture/SYSTEM-OVERVIEW.md) |
| Criar um novo módulo | [docs/guides/CREATE-MODULE.md](./guides/CREATE-MODULE.md) |
| Schema do manifest.json | [docs/standards/MODULE-MANIFEST-SCHEMA.md](./standards/MODULE-MANIFEST-SCHEMA.md) |

---

## Stack Tecnológica

### Backend (Chassi)
- **Runtime:** Node.js 20 (Alpine)
- **Framework:** [Hono](https://hono.dev/) — TypeScript nativo, ultra-leve
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/) — PostgreSQL via node-postgres
- **Validação:** [Zod](https://zod.dev/) via `@sgo/sdk`
- **Auth:** JWT (jsonwebtoken) + bcryptjs
- **DB:** PostgreSQL 16 Alpine

### Frontend (Chassi)
- **Framework:** React 19 + TypeScript
- **Build:** Vite 6 + `@originjs/vite-plugin-federation`
- **Routing:** React Router DOM v7
- **Estado:** Zustand + TanStack Query
- **UI:** Tailwind CSS + Shadcn/ui via `@sgo/ui`

### Infra
- **Containers:** Docker multi-stage (amd64)
- **Orquestração:** Docker Compose (dev) / Docker Swarm + Portainer (produção)
- **Proxy:** Traefik (HTTPS automático via Let's Encrypt)
- **Registry:** `ghcr.io/altrsconsult/`
- **CI/CD:** GitHub Actions com path filters

---

## Roles e Segurança

| Role | Onde existe | Descrição |
|------|-------------|-----------|
| `superadmin` | Nexus apenas | Gestão central de N instâncias |
| `admin` | Chassi | Gerencia módulos, usuários, configurações |
| `user` | Chassi | Acessa módulos com base em permissões |

- **JWT** valido por 7 dias
- **M2M:** Nexus autentica no chassi via `X-SGO-MASTER-KEY`
- **Sem superadmin no chassi** — design intencional para segurança e whitelabel

---

## Variáveis de Ambiente Críticas

### Chassi Backend
```env
PORT=3001
DATABASE_URL=postgresql://sgo:sgodev@localhost:5432/sgo
JWT_SECRET=seu-secret-seguro
DOCKER_ENV=true              # Ativa host.docker.internal para dev de módulos
NEXUS_URL=                   # Vazio = modo standalone
CHASSIS_URL=https://dominio  # URL pública desta instância
```

---

## Fluxo de Módulos

```
Dev clona repo → pnpm install → docker compose up -d (chassi local)
                                      ↓
Dev: cd modules/novo-modulo → pnpm dev (porta 5001+)
                                      ↓
chassi-backend (DOCKER_ENV=true) detecta módulo via host.docker.internal:5001/manifest.json
                                      ↓
Frontend do chassi carrega remoteEntry.js do módulo via Module Federation
                                      ↓
Módulo aparece no menu lateral, rodando com o layout do chassi
```

---

## Convenções para Agentes

1. **Nunca adicionar `superadmin`** ao chassi — role não existe no schema
2. **TypeScript em todo lugar** — sem JavaScript puro nos pacotes novos
3. **Sem inline styles** — sempre Tailwind via className
4. **Sem dados mock inline** — separar em arquivos JSON dedicados
5. **Comentários em PT-BR** — para facilitar entendimento da equipe
6. **`@sgo/sdk`** para tipos compartilhados — nunca duplicar tipos
7. **Drizzle + Zod** para validação — não usar outros ORMs ou validators

---

## Guia Rápido para Criar um Módulo (TL;DR)

```bash
# 1. Copiar boilerplate
cp -r modules/boilerplate modules/meu-modulo

# 2. Ajustar slug no manifest.json e package.json

# 3. Ajustar porta no vite.config.ts (5001, 5002, 5003...)

# 4. Desenvolver
pnpm --filter @sgo/module-meu-modulo dev

# 5. Chassi detecta automaticamente (com Docker rodando)
# Acesse http://localhost:3000 e o módulo aparece no menu
```

Veja o guia completo: [docs/guides/CREATE-MODULE.md](./guides/CREATE-MODULE.md)
