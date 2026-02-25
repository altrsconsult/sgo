# Política de testes

Este documento define a **política de testes** do projeto SGO para regressão e qualidade, e como ela é aplicada no CI.

## Objetivo

- **Regressão:** alterações de código não devem quebrar comportamento já validado. Testes automatizados são a principal ferramenta.
- **Cobertura:** o projeto tem como meta evoluir a cobertura de testes (unitários e, quando aplicável, integração). Metas numéricas (ex.: 80% de cobertura) serão definidas por pacote conforme a maturidade dos testes.
- **CI:** todo PR ou push na branch principal deve executar a suite de testes existente. O pipeline falha se algum teste falhar. Pacotes que possuem script `test` (ex.: `@sgo/ui`) são executados no workflow de Security.

## O que existe hoje

- **packages/ui:** suite de testes com Vitest e Testing Library; script `pnpm test` (e `test:watch`). O CI executa testes dos pacotes do workspace que definem o script.
- **chassi (frontend/backend) e modules:** testes podem ser adicionados gradualmente; quando existirem, o mesmo job de CI os executará.

## Regras

1. **Novo código que altere comportamento crítico** deve incluir ou atualizar testes quando fizer sentido (ex.: componentes de UI, funções de negócio reutilizáveis).
2. **Nenhum merge** deve deixar a suite de testes em estado falho no CI.
3. **Cobertura:** não bloqueamos merge por meta de cobertura ainda; a política é “testes existentes devem passar” e “novos comportamentos devem ser cobertos quando possível”.

## Onde os testes rodam

- **Workflow:** [.github/workflows/security.yml](../../.github/workflows/security.yml), job que executa `pnpm run test` nos pacotes do monorepo que possuem o script.

Este documento é a referência para critérios de qualidade relacionados a testes (ex.: OpenSSF Best Practices). Será atualizado quando metas de cobertura ou testes de integração forem formalizadas.
