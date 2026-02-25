# Processo de segurança no desenvolvimento

Este documento descreve as práticas e checagens que sustentam o claim de que o SGO segue um **processo de segurança no desenvolvimento** e que o código passa por verificações antes de ser integrado.

## O que todo PR ou push deve passar

1. **Lint e formatação** — Código segue os padrões do projeto (TypeScript, ESLint/Prettier quando configurados).
2. **Testes** — Suite de testes existente deve permanecer verde (quando houver testes automatizados).
3. **Auditoria de dependências** — `pnpm audit` (ou equivalente) é executado no CI; vulnerabilidades **críticas** em dependências fazem o pipeline falhar.
4. **Scan de secrets** — Ferramenta (ex.: Gitleaks) roda no CI para evitar commit de credenciais, API keys ou tokens. Findings fazem o pipeline falhar.
5. **Imagem Docker** — As imagens buildadas são escaneadas (ex.: Trivy) em busca de vulnerabilidades críticas em camadas base e dependências; críticos bloqueiam.

(Opcional, quando implementado: SAST — análise estática de código para padrões inseguros.)

## Branch protection e merge

- Merges para a branch principal exigem **status verde no CI** (todos os jobs de segurança e build devem passar).
- Recomenda-se **revisão de código** (pull request review) antes do merge.
- As regras exatas (número de aprovações, branch protection) estão configuradas no repositório (GitHub: Settings → Branches).

## Proveniência e integridade

- **Attestation de build:** artefatos (imagens Docker) gerados no GitHub Actions possuem attestation de proveniência (quem buildou, com qual commit, em qual workflow). Ver [BUILD-AND-PROVENANCE.md](BUILD-AND-PROVENANCE.md).
- **SBOM:** lista de componentes (dependências) é gerada no CI e publicada como artefato ou anexada à attestation, para transparência e auditoria da cadeia de suprimentos.

## Onde estão as evidências

| Evidência | Onde |
|-----------|------|
| Resultado do CI (build, audit, secrets, Trivy) | GitHub Actions do repositório |
| Attestations de build | Geradas pelo workflow de Docker; verificáveis com `gh attestation verify` |
| SBOM | Artefato do workflow de security (ou anexo à attestation) |
| Política de reporte de vulnerabilidades | [SECURITY.md](SECURITY.md) |

Este documento é mantido alinhado com o que o CI realmente executa. Alterações nos workflows devem ser refletidas aqui para que a descrição continue auditável.
