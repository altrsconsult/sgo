# Plano SGO — Repositório develop/sgo

Este documento é a referência de contexto e plano quando você abre a IDE no repositório **develop/sgo**. A LP do SGO (sgo.altrs.net) foi migrada para repo próprio; o monorepo principal continua em **sgo-core** (GIT 2). Este repo é o **projeto new-sgo** (SGO Core 4.0 — rewrite) movido para `C:\develop\sgo` e renomeado para **altrsconsult/sgo**.

---

## Plano do projeto (new-sgo / SGO 4.0 Rewrite)

O plano quase concluído do projeto de criar o **new-sgo** (reescrita Hono + TypeScript + Drizzle + Docker) está exportado neste repositório:

- **→ [PLAN-SGO-4.0-REWRITE.md](./PLAN-SGO-4.0-REWRITE.md)** — plano completo: contexto, fases, todos (quase todos completed), estrutura de pastas, schema Drizzle, rotas, Docker, Nexus esqueleto, docs para IA.

Ao abrir a IDE aqui, use esse arquivo como referência principal do projeto. O único todo ainda **pending** é `nexus-skeleton` (esqueleto Nexus front/back).

---

## Onde está o quê

| O quê | Onde |
|------|------|
| **Monorepo SGO completo** (chassis, modules, nexus, packages) | `c:\GIT 2\sgo-core` |
| **Repositório de trabalho / espelho** | `c:\develop\sgo` (este) |
| **LP SGO (fonte em dev)** | `c:\develop\sgo\lp-sgo` |
| **LP SGO (deploy)** | `c:\develop\lp-sgo` → GitHub **altrsadmin/lp-sgo** → branch **online** → Hostinger sgo.altrs.net |

---

## Este repositório (develop/sgo)

- **chassi/** — Frontend + Backend (estrutura nova se houver migração)
- **modules/boilerplate/** — Boilerplate de módulo
- **packages/ui**, **packages/sdk** — Design system e tipos
- **lp-sgo/** — Landing page (fonte; conteúdo revisado, página /devs completa)
- **docs/** — Documentação (AGENTS, architecture, guides)

A LP em produção é publicada a partir de **develop/lp-sgo** (repo altrsadmin/lp-sgo). O conteúdo é sincronizado de **develop/sgo/lp-sgo** para **develop/lp-sgo** quando for preciso (robocopy ou merge).

---

## LP SGO — Deploy e versão

- **Build:** GitHub Actions (push de tag `v*`) → build → push na branch **online**.
- **Hostinger:** puxa a branch **online** (webhook ou Pull). Uma vez alinhado com `git fetch origin && git reset --hard origin/online`, os próximos deploys fazem fast-forward.
- **Tags:** `v1.0.8`, `v1.0.9`, … controle de versão. Arquivo **VERSION** no site indica a tag em produção.

---

## Plano de trabalho (checklist geral)

- [ ] Manter **develop/sgo** alinhado com **sgo-core** quando fizer sentido (chassis, modules, packages).
- [ ] Editar LP em **develop/sgo/lp-sgo**; para subir no ar: sincronizar para **develop/lp-sgo**, commit, push, nova tag.
- [ ] Regras e agentes: pasta **.cursor** (copiada do sgo-core) para a IDE ter referência neste repo.
- [ ] Planos específicos (Forms Studio, Enroll Manage, UI/UX, etc.) estão em **sgo-core** em `PLAN-*.md` e `docs/`; usar como referência ao trabalhar em módulos ou no chassis.

---

## Comandos úteis

```bash
# LP em dev (dentro de develop/sgo)
cd lp-sgo && pnpm dev    # http://localhost:3003

# Sincronizar LP para o repo de deploy (quando necessário)
robocopy "c:\develop\sgo\lp-sgo\src" "c:\develop\lp-sgo\src" /E /IS /IT
# Depois: em develop/lp-sgo corrigir index.css (@tailwind em vez de @sgo/ui) e fazer commit + tag
```

---

## Referências

- **Plano SGO 4.0 (este repo):** [PLAN-SGO-4.0-REWRITE.md](./PLAN-SGO-4.0-REWRITE.md) — plano completo do projeto new-sgo
- **sgo-core:** `c:\GIT 2\sgo-core` — CLAUDE.md, README.md, pnpm-workspace.yaml, PLAN-*.md
- **LP deploy:** repo **altrsadmin/lp-sgo**, branch **online**, Hostinger sgo.altrs.net
- **.cursor:** regras e agentes AIOS (dev, qa, architect, etc.) nesta pasta para contexto na IDE
