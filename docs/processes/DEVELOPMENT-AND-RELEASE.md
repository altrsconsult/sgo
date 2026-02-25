# Processo de desenvolvimento e release

## Fluxo de desenvolvimento

- **Branch principal:** `main`. Código em produção (ou em staging) segue esta branch.
- **Trabalho em features/correções:** em branches derivadas de `main` (ex.: `feature/nome` ou `fix/nome`). Cada alteração significativa é proposta via **pull request** para `main`.
- **Code review:** pull requests são revisados antes do merge. O repositório pode exigir um ou mais aprovações e status verde no CI (configuração em Settings → Branches).
- **Merge:** após aprovação e CI verde, o merge é feito (squash ou merge commit, conforme padrão do repositório).

## CI (integração contínua)

- **Security workflow** ([.github/workflows/security.yml](../../.github/workflows/security.yml)): roda em push e em pull_request para `main`. Executa auditoria de dependências (`pnpm audit --audit-level=critical`), scan de secrets (Gitleaks) e geração de SBOM (Syft). Artefato SBOM fica disponível nos runs do Actions.
- **Docker workflow** ([.github/workflows/docker.yml](../../.github/workflows/docker.yml)): roda em push para `main` quando há alterações em chassi/packages. Faz build e push das imagens (chassi-backend, chassi-frontend) para o GitHub Container Registry (`ghcr.io/altrsconsult/`), gera attestation de proveniência e executa scan Trivy nas imagens.

Todo PR deve deixar o CI em estado verde antes do merge.

## Release (versão e artefatos)

- **Imagens Docker:** a cada push em `main` que afete chassi ou packages, as imagens são buildadas e publicadas com tags `latest` e `sha-<commit>`. Não há tag de versão semântica (ex.: `v4.0.0`) automática no workflow atual; isso pode ser feito manualmente (tag no Git + build opcional) ou por workflow de release futuro.
- **Changelog:** o projeto mantém (ou passará a manter) um [CHANGELOG.md](../../CHANGELOG.md) na raiz com as mudanças por versão. Releases formais (GitHub Releases) podem ser criados a partir de tags e incluir o SBOM e notas de versão.
- **Deploy:** o uso das imagens em produção é documentado em [docs/guides/DEPLOY.md](../guides/DEPLOY.md) (Docker Compose, Portainer, Node single-process).

## Evidências

| Evidência | Onde |
|-----------|------|
| Histórico de commits e PRs | Repositório GitHub |
| Resultados de CI | GitHub Actions (Security, Docker) |
| Imagens e attestations | ghcr.io/altrsconsult/ e attestations do repositório |
| SBOM | Artefato do workflow Security |
| Guia de deploy | [docs/guides/DEPLOY.md](../guides/DEPLOY.md) |

Este processo está alinhado com as práticas descritas em [CONTRIBUTING.md](../../CONTRIBUTING.md) e [docs/security/DEVELOPMENT-SECURITY.md](../security/DEVELOPMENT-SECURITY.md).
