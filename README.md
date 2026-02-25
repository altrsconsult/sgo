# SGO — Sistema de Gestão Operacional

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker Build](https://github.com/altrsconsult/sgo/actions/workflows/docker.yml/badge.svg)](https://github.com/altrsconsult/sgo/actions/workflows/docker.yml)
[![Security](https://github.com/altrsconsult/sgo/actions/workflows/security.yml/badge.svg)](https://github.com/altrsconsult/sgo/actions/workflows/security.yml)
[![Release](https://img.shields.io/github/v/release/altrsconsult/sgo)](https://github.com/altrsconsult/sgo/releases)
[![Language](https://img.shields.io/github/languages/top/altrsconsult/sgo)](https://github.com/altrsconsult/sgo)
[![OpenSSF Scorecard](https://img.shields.io/ossf-scorecard/github.com/altrsconsult/sgo)](https://securityscorecards.dev/viewer/?uri=github.com/altrsconsult/sgo)

[![Stars](https://img.shields.io/github/stars/altrsconsult/sgo)](https://github.com/altrsconsult/sgo/stargazers)
[![Forks](https://img.shields.io/github/forks/altrsconsult/sgo)](https://github.com/altrsconsult/sgo/forks)
[![Issues](https://img.shields.io/github/issues/altrsconsult/sgo)](https://github.com/altrsconsult/sgo/issues)
[![Last commit](https://img.shields.io/github/last-commit/altrsconsult/sgo)](https://github.com/altrsconsult/sgo/commits)
[![Contributors](https://img.shields.io/github/contributors/altrsconsult/sgo)](https://github.com/altrsconsult/sgo/graphs/contributors)

Plataforma open-source de gestão para micro empresas. **Chassi pronto** (autenticação, usuários, permissões, whitelabel) + **módulos** de negócio que você adiciona no seu ritmo. Sem lock-in: o sistema pode ficar no seu servidor, sob sua marca.

- **Para quem implanta:** sistema profissional, validado, que fica com o cliente após a implantação.
- **Para integradores e devs:** base documentada, Module Federation, guias para criar módulos (incluindo uso com IA).

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
| Sustentabilidade e eficiência | [docs/sustainability/SUSTAINABILITY.md](docs/sustainability/SUSTAINABILITY.md) |
| OpenSSF Best Practices (mapeamento) | [docs/standards/OPENSSF-BEST-PRACTICES.md](docs/standards/OPENSSF-BEST-PRACTICES.md) |
| Textos para LP / marketing (claims e links) | [docs/marketing/TEXTOS-LP-CLAIMS.md](docs/marketing/TEXTOS-LP-CLAIMS.md) |

## Stack

- **Frontend:** React 19, Vite 6, Module Federation, Tailwind + Shadcn via `@sgo/ui`
- **Backend:** Hono, Drizzle ORM, PostgreSQL (ou MySQL)
- **Infra:** Docker; imagens em `ghcr.io/altrsconsult/`

## Contribuições

Contribuições são bem-vindas. Correções de bugs, melhorias de documentação, novos módulos ou sugestões de evolução do chassi — tudo isso faz diferença. Se você adaptou o SGO para o seu contexto e uma melhoria puder ajudar outros, considere enviar um pull request. Valorizamos um ambiente inclusivo e respeitoso: toda pessoa que queira contribuir de boa fé é aceita. Veja [CONTRIBUTING.md](CONTRIBUTING.md) para como começar.

## Licença

Este projeto está sob a **Licença MIT**. Uso comercial é permitido; é necessário manter o aviso de copyright e o texto da licença. Para uma tradução em português (apenas informacional), veja [docs/legal/LICENSE-pt-BR.md](docs/legal/LICENSE-pt-BR.md).

- **Texto oficial (inglês):** [LICENSE](LICENSE)

---

**ALTRS Consultoria** — [sgo.altrs.net](https://sgo.altrs.net) · [GitHub](https://github.com/altrsconsult/sgo)
