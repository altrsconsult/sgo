# OpenSSF Best Practices — Mapeamento de critérios

O [OpenSSF Best Practices Badge](https://bestpractices.dev) reconhece projetos que seguem boas práticas de segurança e desenvolvimento. Este documento mapeia os critérios relevantes ao SGO e indica se estão atendidos e onde está a evidência.

**Como usar:** preencha o projeto em [bestpractices.dev](https://bestpractices.dev) e use este arquivo como referência para as respostas. O badge oficial é obtido após aprovação no site.

## Categorias e critérios (resumo)

### Basics

| Critério | Atendido | Evidência |
|----------|----------|-----------|
| Licença FLOSS em local padrão | Sim | [LICENSE](../../LICENSE) (MIT) na raiz; [docs/legal/LICENSE-pt-BR.md](../../docs/legal/LICENSE-pt-BR.md) (tradução) |
| README com descrição do projeto | Sim | [README.md](../../README.md) |
| Documentação (uso, contribuição) | Sim | [CONTRIBUTING.md](../../CONTRIBUTING.md), [docs/AGENTS.md](../AGENTS.md), [docs/guides/](../guides/) |
| Política de segurança (reporte de vulnerabilidades) | Sim | [docs/security/SECURITY.md](../security/SECURITY.md) |
| Projeto ativo / mantido | Sim | Commits e releases; documentação atualizada |
| Suporte a HTTPS em uso do projeto | N/A (aplicação self-hosted) | Deploy com HTTPS recomendado em [docs/guides/DEPLOY.md](../guides/DEPLOY.md) |

### Change Control

| Critério | Atendido | Evidência |
|----------|----------|-----------|
| Repositório público e versionado | Sim | GitHub, Git |
| Histórico de mudanças (quem, quando) | Sim | Git history |
| Versões intermediárias para revisão | Sim | Branches e pull requests |
| Numeração de versão | Sim | Tags (ex.: v4.0.0); package.json com version nos pacotes |
| Changelog | Sim | [CHANGELOG.md](../../CHANGELOG.md) |

### Security

| Critério | Atendido | Evidência |
|----------|----------|-----------|
| Práticas de desenvolvimento seguro | Sim | [docs/security/DEVELOPMENT-SECURITY.md](../security/DEVELOPMENT-SECURITY.md); CI com audit, secrets, Trivy |
| Build reproduzível / proveniência | Sim | Attestation no [.github/workflows/docker.yml](../../.github/workflows/docker.yml); [docs/security/BUILD-AND-PROVENANCE.md](../security/BUILD-AND-PROVENANCE.md) |
| SBOM disponível | Sim | Workflow Security gera SBOM (Syft); artefato no Actions |

### Outros (dependem do preenchimento no site)

- **Fuzz testing, testes automatizados:** o projeto pode ter testes; indicar no bestpractices.dev conforme existência.
- **Análise estática (SAST):** opcional; quando implementado, atualizar [DEVELOPMENT-SECURITY.md](../security/DEVELOPMENT-SECURITY.md) e este mapeamento.

## Próximos passos

1. Acessar [bestpractices.dev](https://bestpractices.dev) e registrar o repositório (URL do GitHub).
2. Responder a cada critério com base neste mapeamento e nos links de evidência.
3. Após aprovação, adicionar o badge no [README.md](../../README.md) conforme instruções do site.
