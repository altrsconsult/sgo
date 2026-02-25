# SGO — Sistema de Gestão Operacional

**Tags:** `open-source` `self-hosted` `typescript` `react` `nodejs` `micro-empresas` `gestão` `whitelabel` `module-federation` `lgpd` `docker`

Plataforma **open-source** de gestão para micro empresas: **chassi pronto** (autenticação, usuários, permissões, whitelabel) e **módulos de negócio** que você adiciona no seu ritmo. Self-hosted, sem lock-in — o sistema fica no seu servidor, sob sua marca. Ideal para integradores que entregam solução completa ao cliente e para empresas que não querem depender de assinatura para manter o sistema.

- **Para quem implanta:** sistema profissional e validado, que passa a ser do cliente após a implantação; documentação de conformidade (LGPD/GDPR, acessibilidade, processos) para apoiar vendas e auditorias.
- **Para devs e integradores:** base documentada, Module Federation, guias para criar módulos (incluindo uso com IA). Contribuições e **⭐ estrelas** são bem-vindas — cada uma ajuda outros a descobrirem o projeto.

Projeto sólido: build attestado, SBOM, processos documentados, preparado para LGPD/GDPR e acessibilidade; **ESG** (sustentabilidade, stack enxuta, self-hosted) e **conforto ocular** (temas claro/escuro, contraste WCAG, temas custom).

> **Gostou do projeto?** [Deixe uma estrela](https://github.com/altrsconsult/sgo/stargazers) no GitHub — ajuda outras pessoas a descobrirem o SGO. Contribuições são bem-vindas; veja [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Selos e status

As badges abaixo atestam segurança, conformidade e experiência de uso. **Certificado OpenSSF Best Practices (Baseline 3)** — [Ver certificação →](https://www.bestpractices.dev/projects/12038)

[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/12038/badge)](https://www.bestpractices.dev/projects/12038)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/altrsconsult/sgo/badge)](https://scorecard.dev/viewer/?uri=github.com/altrsconsult/sgo)

[![Maintained](https://img.shields.io/badge/Maintained-yes-green)](https://github.com/altrsconsult/sgo)
[![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker Build](https://github.com/altrsconsult/sgo/actions/workflows/docker.yml/badge.svg)](https://github.com/altrsconsult/sgo/actions/workflows/docker.yml)
[![Security](https://github.com/altrsconsult/sgo/actions/workflows/security.yml/badge.svg)](https://github.com/altrsconsult/sgo/actions/workflows/security.yml)
[![Release](https://img.shields.io/github/v/release/altrsconsult/sgo)](https://github.com/altrsconsult/sgo/releases)
[![Language](https://img.shields.io/github/languages/top/altrsconsult/sgo)](https://github.com/altrsconsult/sgo)
[![Issues](https://img.shields.io/github/issues/altrsconsult/sgo)](https://github.com/altrsconsult/sgo/issues)
[![Last commit](https://img.shields.io/github/last-commit/altrsconsult/sgo)](https://github.com/altrsconsult/sgo/commits)

[![LGPD | GDPR](https://img.shields.io/badge/LGPD%20%7C%20GDPR-ready-blue)](docs/compliance/ADEQUACAO-PRIVACIDADE.md)
[![WCAG 2.1](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-informational)](docs/ux/ACCESSIBILITY-CHECKLIST.md)
[![Self-hosted](https://img.shields.io/badge/Self--hosted-yes-green)](docs/sustainability/SUSTAINABILITY.md)
[![Build attestation](https://img.shields.io/badge/Build-attested-blue)](docs/security/BUILD-AND-PROVENANCE.md)
[![SBOM](https://img.shields.io/badge/SBOM-available-blue)](https://github.com/altrsconsult/sgo/actions/workflows/security.yml)
[![Processes](https://img.shields.io/badge/Processes-documented-blue)](docs/processes/README.md)
[![ESG](https://img.shields.io/badge/ESG-ready-informational)](docs/sustainability/SUSTAINABILITY.md)
[![Conforto ocular](https://img.shields.io/badge/Conforto%20ocular-temas%20light%20%7C%20dark-informational)](docs/ux/CONFORTO-VISUAL.md)

---

## Quick start

```bash
git clone https://github.com/altrsconsult/sgo.git
cd sgo
pnpm install
docker compose up -d
```

Acesse `http://localhost:3000`. O wizard de instalação aparece no primeiro acesso.

- **Desenvolvimento com módulos:** [docs/guides/CREATE-MODULE.md](docs/guides/CREATE-MODULE.md)
- **Deploy em produção:** [docs/guides/DEPLOY.md](docs/guides/DEPLOY.md)
- **Arquitetura:** [docs/architecture/SYSTEM-OVERVIEW.md](docs/architecture/SYSTEM-OVERVIEW.md)

## Documentação

| O quê | Onde |
|-------|------|
| Visão geral e convenções (incl. para agentes de IA) | [docs/AGENTS.md](docs/AGENTS.md) |
| Criar um módulo | [docs/guides/CREATE-MODULE.md](docs/guides/CREATE-MODULE.md) |
| Deploy (Docker, Portainer, Node) | [docs/guides/DEPLOY.md](docs/guides/DEPLOY.md) |
| Schema do manifest de módulos | [docs/standards/MODULE-MANIFEST-SCHEMA.md](docs/standards/MODULE-MANIFEST-SCHEMA.md) |
| Segurança e proveniência de build | [docs/security/SECURITY.md](docs/security/SECURITY.md) · [BUILD-AND-PROVENANCE.md](docs/security/BUILD-AND-PROVENANCE.md) |
| Adequação à privacidade (LGPD/GDPR) | [docs/compliance/ADEQUACAO-PRIVACIDADE.md](docs/compliance/ADEQUACAO-PRIVACIDADE.md) |
| Processos (desenvolvimento, release) | [docs/processes/README.md](docs/processes/README.md) |
| Governança e política de testes | [docs/governance/README.md](docs/governance/README.md) |
| Acessibilidade (WCAG) | [docs/ux/ACCESSIBILITY-CHECKLIST.md](docs/ux/ACCESSIBILITY-CHECKLIST.md) |
| Conforto visual / temas (conforto ocular) | [docs/ux/CONFORTO-VISUAL.md](docs/ux/CONFORTO-VISUAL.md) |
| Sustentabilidade e eficiência | [docs/sustainability/SUSTAINABILITY.md](docs/sustainability/SUSTAINABILITY.md) |
| OpenSSF Best Practices (mapeamento) | [docs/standards/OPENSSF-BEST-PRACTICES.md](docs/standards/OPENSSF-BEST-PRACTICES.md) |
| Textos para LP / marketing (claims e links) | [docs/marketing/TEXTOS-LP-CLAIMS.md](docs/marketing/TEXTOS-LP-CLAIMS.md) |

## Confiança e conformidade

- **Certificado OpenSSF Best Practices (Baseline 3)** — [Ver selo e critérios](https://www.bestpractices.dev/projects/12038); [mapeamento no repo](docs/standards/OPENSSF-BEST-PRACTICES.md).
- **Build verificável** — imagens Docker com attestation (Sigstore); [proveniência](docs/security/BUILD-AND-PROVENANCE.md).
- **Preparado para LGPD/GDPR** — [checklist](docs/compliance/LGPD-GDPR-CHECKLIST.md) e [adequação](docs/compliance/ADEQUACAO-PRIVACIDADE.md) documentadas.
- **Processos documentados** — [desenvolvimento, release, segurança](docs/processes/README.md) e [governança](docs/governance/README.md).
- **Acessibilidade** — critérios [WCAG 2.1 AA](docs/ux/ACCESSIBILITY-CHECKLIST.md); checagem axe no CI.
- **Conforto ocular** — [temas claro/escuro e personalizáveis](docs/ux/CONFORTO-VISUAL.md), contraste WCAG; menos fadiga visual em uso prolongado.
- **Sustentabilidade (ESG)** — [stack enxuto, self-hosted, SCI](docs/sustainability/SUSTAINABILITY.md).
- **Política de testes** — [TESTING-POLICY](docs/governance/TESTING-POLICY.md); testes no CI.

## Stack

- **Frontend:** React 19, Vite 6, Module Federation, Tailwind + Shadcn via `@sgo/ui`
- **Backend:** Hono, Drizzle ORM, PostgreSQL (ou MySQL)
- **Infra:** Docker; imagens em `ghcr.io/altrsconsult/`

## Contribuições

**Quer participar?** Correções de bugs, docs, novos módulos ou ideias para o chassi — tudo conta. Se o SGO te ajudou, considere [dar uma estrela ⭐](https://github.com/altrsconsult/sgo/stargazers) ou abrir um PR; cada contribuição ajuda outros devs e integradores a encontrarem e confiarem no projeto. Ambiente inclusivo e respeitoso; veja [CONTRIBUTING.md](CONTRIBUTING.md) para começar.

## Licença

Este projeto está sob a **Licença MIT**. Uso comercial é permitido; é necessário manter o aviso de copyright e o texto da licença. Para uma tradução em português (apenas informacional), veja [docs/legal/LICENSE-pt-BR.md](docs/legal/LICENSE-pt-BR.md).

- **Texto oficial (inglês):** [LICENSE](LICENSE)

---

**ALTRS Consultoria** — [sgo.altrs.net](https://sgo.altrs.net) · [GitHub](https://github.com/altrsconsult/sgo)
