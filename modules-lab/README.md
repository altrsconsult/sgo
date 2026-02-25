# modules-lab — Lab de Módulos (repositório privado)

Esta pasta é o **laboratório de desenvolvimento de módulos** do SGO. Contém cópias de módulos de clientes (ex.: Edukaead) e **não deve ser commitada no repositório público**.

## Por quê?

- A pasta **`modules/`** do monorepo é pública e recebe apenas módulos genéricos (ex.: boilerplate).
- Módulos específicos de clientes ficam aqui em **`modules-lab/`**, com repositório Git **privado** próprio ou apenas local.

## Como usar

1. **Repositório privado (recomendado):** clone o repo privado de módulos-lab neste caminho:
   ```bash
   # a partir da raiz do sgo
   git clone <url-repo-privado-modules-lab> modules-lab
   ```

2. **Apenas local:** a pasta já pode ser usada localmente; ela está no `.gitignore` do repo público (apenas este README e o `.gitignore` do lab são versionados).

3. **Workspace:** `modules-lab/*` está no `pnpm-workspace.yaml`. Depois de `pnpm install` na raiz, você pode rodar:
   ```bash
   pnpm --filter @sgo/module-edukaead-leads-intake dev
   pnpm --filter @sgo/module-edukaead-enroll-manage dev
   pnpm --filter @sgo/module-edukaead-gestao-repasses dev
   ```

## Estrutura atual (cópias do sgo-core)

- **edukaead-leads-intake** — Pre-Matrículas (porta 5002)
- **edukaead-enroll-manage** — Gestão de Matrícula (porta 5003)
- **edukaead-gestao-repasses** — Gestão de Repasses (porta 5005)

Os **slugs** no `manifest.json` continuam `leads-intake`, `enroll-manage`, `gestao-repasses`; apenas o nome da pasta e do pacote têm o prefixo `edukaead-` para identificação no lab.

**Validar os 3 módulos no chassi 4.0:** veja no repo sgo o guia [docs/guides/MODULES-LAB-MVP-VALIDACAO.md](../docs/guides/MODULES-LAB-MVP-VALIDACAO.md) (conversão já feita; roteiro de validação em dev e via ZIP).
