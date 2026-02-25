# Processo de segurança e privacidade

## Segurança

### Reporte de vulnerabilidades

- **Política:** [docs/security/SECURITY.md](../security/SECURITY.md). Vulnerabilidades devem ser reportadas por e-mail (contato@altrs.com.br) ou via GitHub Security Advisories, e não em issues públicas.
- **Compromisso:** confirmação em até 5 dias úteis e acompanhamento até correção/divulgação responsável.

### Desenvolvimento seguro

- **Processo técnico:** [docs/security/DEVELOPMENT-SECURITY.md](../security/DEVELOPMENT-SECURITY.md). Descreve as checagens que todo PR ou push deve passar: lint, testes, auditoria de dependências (críticos bloqueiam), scan de secrets, scan de imagem Docker (Trivy). Inclui referência a attestation de build e SBOM.
- **Evidências:** resultados no GitHub Actions; attestations verificáveis com `gh attestation verify`; SBOM como artefato do workflow Security.
- **Proveniência:** [docs/security/BUILD-AND-PROVENANCE.md](../security/BUILD-AND-PROVENANCE.md) explica como os artefatos são attestados e como verificar.

### Atualização de dependências

- Dependabot (ou equivalente) pode estar configurado para abrir PRs de atualização. A equipe revisa e mergeia após CI verde. Vulnerabilidades críticas em `pnpm audit` fazem o job de audit falhar no CI.

## Privacidade (LGPD / GDPR)

- **Checklist e adequação:** [docs/compliance/LGPD-GDPR-CHECKLIST.md](../compliance/LGPD-GDPR-CHECKLIST.md) e [docs/compliance/ADEQUACAO-PRIVACIDADE.md](../compliance/ADEQUACAO-PRIVACIDADE.md).
- O SGO fornece as funcionalidades que suportam os direitos do titular (acesso, correção, exclusão, registro de atividades). A conformidade legal é responsabilidade do **controlador** (quem implanta e trata os dados).
- Nenhum dado é enviado para serviços externos pelo chassi; a instância é self-hosted. O Nexus (opcional) é usado para gestão centralizada e sob controle do mesmo ecossistema.

## Resumo

Os processos de segurança e privacidade estão documentados nas pastas `docs/security/` e `docs/compliance/`. As evidências (CI, attestations, SBOM, checklists) permitem que um auditor verifique que há processo definido e onde estão as provas.
