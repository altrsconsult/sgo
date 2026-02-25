# Governança do projeto SGO

Este documento descreve de forma objetiva como o projeto é mantido e como decisões são tomadas, para transparência e para critérios de avaliação (ex.: OpenSSF Best Practices).

## Quem mantém

- **Mantenedor principal:** ALTRS Consultoria. O repositório é público em [github.com/altrsconsult/sgo](https://github.com/altrsconsult/sgo).
- **Contribuidores:** qualquer pessoa pode contribuir via pull requests; não há processo de “adoção” formal. Ver [CONTRIBUTING.md](../../CONTRIBUTING.md).
- O projeto está aberto a mais mantenedores e contribuidores ativos; interessados podem manifestar-se via issues ou contato (contato@altrs.com.br).

## Papéis e responsabilidades

- **Mantenedor:** revisa e mergeia PRs, mantém documentação, releases e políticas (segurança, contribuição). Não há comitê formal; as decisões técnicas são tomadas com base em revisão de código e discussão em issues/PRs.
- **Contribuidor:** envia patches, documentação ou sugestões via PRs e issues. Segue as convenções em [AGENTS.md](../AGENTS.md) e [CONTRIBUTING.md](../../CONTRIBUTING.md).
- Não existem roles organizacionais formais além de “mantenedor” (quem tem permissão de merge no repositório) e “contribuidor” (quem envia contribuições).

## Como decisões são tomadas

- **Código e documentação:** via pull requests. Mudanças são discutidas no PR; após revisão e CI verde, um mantenedor faz o merge.
- **Direção do produto e prioridades:** definidas pela ALTRS com base em uso interno, feedback de clientes e contribuições. Roadmap e planos estão em documentos do repositório (ex.: [PLAN-SGO-4.0-REWRITE.md](../../PLAN-SGO-4.0-REWRITE.md) quando existir).
- Não há comitê de governança ou votação formal; o modelo é de repositório aberto mantido por uma organização.

## Continuidade de acesso

- O código e a documentação estão no GitHub em repositório público. Qualquer pessoa pode fazer fork e dar continuidade ao código sob os termos da licença MIT.
- Não há dependência de serviços proprietários para acesso ao código; releases (tags, imagens Docker) são publicadas no GitHub e em ghcr.io. Ver [docs/processes/DEVELOPMENT-AND-RELEASE.md](../processes/DEVELOPMENT-AND-RELEASE.md) e [docs/security/BUILD-AND-PROVENANCE.md](../security/BUILD-AND-PROVENANCE.md).

## Documentos relacionados

| Tema | Documento |
|------|-----------|
| Como contribuir | [CONTRIBUTING.md](../../CONTRIBUTING.md) |
| Política de segurança | [docs/security/SECURITY.md](../security/SECURITY.md) |
| Processos de desenvolvimento e release | [docs/processes/README.md](../processes/README.md) |
| Política de testes | [docs/governance/TESTING-POLICY.md](TESTING-POLICY.md) |
