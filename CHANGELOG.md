# Changelog

Alterações notáveis do projeto SGO são documentadas neste arquivo. O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

## [4.0.0] — 2025

### Adicionado

- Chassi 4.0: backend Hono + Drizzle (PostgreSQL/MySQL), frontend React 19 + Vite 6 + Module Federation.
- Documentação de segurança (SECURITY.md, DEVELOPMENT-SECURITY.md, BUILD-AND-PROVENANCE.md).
- Documentação de compliance (LGPD/GDPR checklist e adequação).
- Processos documentados (desenvolvimento, release, segurança e privacidade).
- Checklist de acessibilidade (WCAG) e de sustentabilidade.
- CI: Security workflow (audit, secrets, SBOM), attestation de build e Trivy nas imagens Docker.
- Licença MIT e tradução em português (docs/legal/LICENSE-pt-BR.md).

### Alterado

- Estrutura do monorepo (chassi, packages, modules) e guias de deploy e criação de módulos.

[4.0.0]: https://github.com/altrsconsult/sgo/releases/tag/v4.0.0
