# Como contribuir com o SGO

Obrigado por considerar contribuir. Sua participação — seja com código, documentação, ideias ou feedback — é valorizada e ajuda a tornar o SGO útil para mais pessoas.

**Gostou do projeto?** [Deixe uma estrela ⭐](https://github.com/altrsconsult/sgo/stargazers) no GitHub — ajuda outros devs e integradores a descobrirem o SGO. Não é obrigatório contribuir com código: estrelas, issues e sugestões também contam.

## Por onde começar

- **Bugs e sugestões:** abra uma [issue](https://github.com/altrsconsult/sgo/issues) descrevendo o problema ou a ideia.
- **Vulnerabilidades de segurança:** não abra issue pública; siga a [política de segurança](docs/security/SECURITY.md).
- **Código e documentação:** faça um fork, crie um branch, altere e envie um **pull request**. Pull requests que melhorem o chassi, a documentação ou os guias são muito bem-vindos.
- **Módulos:** você pode desenvolver módulos próprios sem alterar o core; se achar que algo do chassi ou do SDK facilitaria a vida de outros, um PR é a melhor forma de compartilhar.

Não é obrigatório enviar PRs — a licença é MIT e você pode usar e adaptar à vontade. Quando você envia uma contribuição, está ajudando a comunidade e a ALTRS a evoluir o projeto de forma aberta.

## Sensibilização e ambiente

Queremos um ambiente **inclusivo e respeitoso**. Ao participar (issues, PRs, discussões), procure:

- Ser claro e construtivo.
- Respeitar opiniões e contextos diferentes.
- Dar crédito quando usar ideias ou trechos de outros (no código, com autoria; na doc, com referência).

Não toleramos assédio, discriminação ou comportamento que deixe alguém desconfortável. Dúvidas sobre conduta podem ser enviadas para contato@altrs.com.br.

## Signed-off-by (DCO)

Aceitamos contribuições sob **Developer Certificate of Origin (DCO)** implícito. Ao commitar, use `git commit -s` para adicionar a linha `Signed-off-by: Seu Nome <seu@email.com>` na mensagem. Isso atesta que você tem o direito de submeter a contribuição nos termos da licença do projeto. Não exigimos CLA (Contributor License Agreement) separado.

## Convenções técnicas

- **Antes de codar:** leia o [docs/AGENTS.md](docs/AGENTS.md) — ele descreve a arquitetura, a estrutura do monorepo e as convenções (TypeScript, Drizzle, Zod, comentários em PT-BR, etc.).
- **Módulos:** siga o [docs/standards/MODULE-MANIFEST-SCHEMA.md](docs/standards/MODULE-MANIFEST-SCHEMA.md) e o guia [docs/guides/CREATE-MODULE.md](docs/guides/CREATE-MODULE.md).
- **Commits:** mensagens claras ajudam; prefira descrições objetivas (ex.: "Corrige validação do login" em vez de "fix"). Use `git commit -s` para Signed-off-by quando possível.

Não é necessário ser expert: correções pequenas, melhorias de texto e testes são tão válidos quanto mudanças maiores. Se tiver dúvida, pergunte na issue ou no PR.

## Resumo

1. Abra uma issue ou envie um PR.
2. Siga as convenções do [AGENTS.md](docs/AGENTS.md) quando for código.
3. Mantenha um tom respeitoso e inclusivo.
4. Dê crédito quando fizer sentido.

Obrigado por contribuir.
