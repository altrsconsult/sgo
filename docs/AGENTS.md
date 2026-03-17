---
description: 
alwaysApply: false
---

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
│   ├── frontend/          # React + Vite (host iframe-first para módulos)
│   └── backend/           # Hono + Drizzle + PostgreSQL (TypeScript)
├── nexus/
│   ├── frontend/          # React (placeholder)
│   └── backend/           # Hono (placeholder)
├── modules/
│   ├── boilerplate/       # Template base para novos módulos (mínimo + tela de estado vazio)
│   └── demo/              # Showcase completo de componentes @sgo/ui (slug: sgo-demo, porta 5010)
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
| Deploy em produção (Compose, Portainer, Traefik) | [docs/guides/DEPLOY.md](./guides/DEPLOY.md) |
| Criar um novo módulo | [docs/guides/CREATE-MODULE.md](./guides/CREATE-MODULE.md) |
| MVP: validar módulos Edukaead (modules-lab) | [docs/guides/MODULES-LAB-MVP-VALIDACAO.md](./guides/MODULES-LAB-MVP-VALIDACAO.md) |
| Schema do manifest.json | [docs/standards/MODULE-MANIFEST-SCHEMA.md](./standards/MODULE-MANIFEST-SCHEMA.md) |
| Lab de módulos (fora do repo) e visão N2/Pro | [docs/architecture/MODULES-LAB-VISAO.md](./architecture/MODULES-LAB-VISAO.md) |

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
- **Build:** Vite 6
- **Routing:** React Router DOM v7
- **Estado:** Zustand + TanStack Query
- **UI:** Tailwind CSS + Shadcn/ui via `@sgo/ui`

### Infra
- **Containers:** Docker multi-stage (amd64)
- **Orquestração:** Docker Compose (dev e prod sem proxy) / Docker Swarm + Portainer (prod com Traefik). Proxy opcional (Traefik) ou único ponto de entrada (Nginx no frontend). Ver [docs/guides/DEPLOY.md](./guides/DEPLOY.md).
- **Proxy:** Traefik (HTTPS automático via Let's Encrypt) quando usado; ou apenas frontend:80 com Nginx interno.
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
Frontend do chassi abre o módulo em iframe (URL de `/api/modules` -> `remoteUrl`)
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

## Learned from usage

- Header fixo com logo deve reservar espaço (ex.: padding-top no container) para o conteúdo não passar por baixo do logo
- Versão exibida no app (login, badge do usuário) vem do package.json do frontend em tempo de build; alterar a versão exige novo build e deploy para aparecer
- Webhooks que esperam um único objeto: se o cliente envia array, enviar o primeiro elemento (ex.: $json[0]) ou normalizar antes
- Chassi em Docker Swarm: mesma stack com nomes de stack diferentes não conflitam; cada stack tem seu próprio Postgres e volumes
- Boilerplate de módulo deve ter ao menos uma página de estado vazio (não tela em branco), tema escuro por padrão
- modules-lab: edukaead-leads-intake (Pre-Matrículas, galeria/enrichment) e edukaead-form-intake (formulário mobile de captura) são módulos distintos; melhorias e builds de “leads-intake” devem ser feitos em edukaead-leads-intake, não em form-intake
- `modules-lab/edukaead-form-intake` aceita tags de URL `rep`, `ori`, `session` e `modo=2`; se a URL não trouxer `modo`, `VITE_FORM_MODE=2` força o módulo a operar só no fluxo manual/digitação
- Deploy Node estilo Hostinger para `modules-lab/edukaead-form-intake`: o zip precisa sair com `server.js`, `dist/`, `public/`, `package.json`, `.env.example` e dependências de runtime; faltar lib como `dotenv`, `pdf-parse`, `tesseract.js` ou `@napi-rs/canvas` derruba a app com 503; incluir `express` no `package.deploy.json` para o painel reconhecer o framework
- Node.js na Hostinger: a plataforma usa `lsnode.js` com `require(server.js)`. Entrada CommonJS em `server.js` (sem `"type":"module"`) que só faz `import("./dist/index.js")`; não definir `PORT` no painel; definir `NODE_ENV=production`; em 503 ver `nodejs/stderr.log`. Skill `node-hostinger-deploy` para outros projetos
- Payload do form-intake: não incluir `data_expedicao` em documentos; apenas `data_validade_documento` e `data_nascimento`
- form-intake `build:zip`: gera `deploy-vX.Y.Z.zip` e arquivo `VERSION` no release; versão lida do `package.json` do módulo
- `modules-lab/edukaead-form-intake/VISION.md`: visão do produto (pluga/forms); ao clonar para repo limpo, copiar para retomar contexto
- **UI/design Edukaead (leads-intake e enroll-manage):** identidade LP Eduka — paleta #00C8D4 / #0891B2 (teal), Outfit + Plus Jakarta Sans; abas da galeria com classes dedicadas `list-tabs` / `list-tab` / `list-tab--active` em `module.css` para contraste garantido (aba ativa: fundo teal, texto branco); badges (pendentes/processados) e botão Novo na mesma paleta; galeria de cards com bordas e hover teal; header/títulos com hierarquia e botão voltar com hover teal. Estilos em `src/styles/module.css`; evitar depender só de classes Tailwind para abas (usar ganchos próprios).
- **Docker/Portainer e módulos:** em ambiente com Docker via Portainer, builds/arquivos novos do módulo às vezes não refletem (possível cache ou volume não montando os artefatos atuais). Tratar no sprint técnico: verificar como o Portainer monta o `modules_storage` e se o ZIP instalado é o que está sendo servido; amanhã focar na parte técnica.

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
