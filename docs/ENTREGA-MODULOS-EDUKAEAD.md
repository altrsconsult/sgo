# Entrega — Módulos Edukaead (modules-lab)

**Status:** Crítico | **Chassi:** 4.0.14

---

## Checklist de entrega

### Chassi
- [x] Backend 4.0.14 — fallback de assets (path com `\`) para módulos já extraídos com bug
- [x] Frontend 4.0.14 — versão alinhada
- [x] Tag Git: `v4.0.13` já em uso; após commit: criar `v4.0.14`

### Módulos (modules-lab)

| Módulo | Slug | Versão | Manifest | Federation | SDK / API | Observação |
|--------|------|--------|----------|-------------|-----------|------------|
| **Pre-Matrículas** | leads-intake | 1.2.0 | OK (hasWidget, serverPort 5002) | OK (App + Widget) | leadClient, configClient, storageClient; useConfig | Pronto para produção |
| **Gestão de Matrícula** | enroll-manage | 1.2.0 | OK (hasWidget, serverPort 5003) | OK (App + Widget) | enrollmentClient, configClient, storageClient; useConfig | Pronto para produção |
| **Gestão de Repasses** | gestao-repasses | 1.0.0 | OK (hasWidget, serverPort 5005); nome "Gestão de Repasses" | OK (App + Widget) | installmentClient, batchClient, configClient; useConfig | UI e config prontos; **Desktop ainda usa dados mock** — definir com cliente se entrega assim (demo) ou se conecta API antes |

---

## Ajustes feitos nesta revisão

1. **Manifests**
   - `hasWidget: true` e `serverPort` (5002, 5003, 5005) nos três módulos (conformidade com schema e sync dev).
   - gestao-repasses: "Gestao" → "Gestão de Repasses" no manifest e no Widget.

2. **Chassi**
   - Backend 4.0.14: rota de assets tenta fallback com path em `\` quando o arquivo não existe com `/` (módulos extraídos com extração antiga).
   - Frontend 4.0.14: versão alinhada.

---

## Como entregar

1. **Build e ZIP dos módulos** (na raiz do monorepo ou na pasta do módulo):
   ```bash
   pnpm --filter @sgo/module-edukaead-leads-intake build:zip
   pnpm --filter @sgo/module-edukaead-enroll-manage build:zip
   pnpm --filter @sgo/module-edukaead-gestao-repasses build:zip
   ```
   Arquivos gerados: `leads-intake-v1.2.0.zip`, `enroll-manage-v1.2.0.zip`, `gestao-repasses-v1.0.0.zip` (nas respectivas pastas).

2. **Chassi em produção**
   - Garantir imagem **4.0.14** (ou superior) no Portainer.
   - Manter `SGO_JWT_SECRET` (ou `JWT_SECRET`) **fixo** nas env da stack.

3. **Instalação no chassi**
   - Admin → Módulos: remover versões antigas dos três módulos (se ainda derem 404).
   - Upload dos três ZIPs. A extração 4.0.14 grava `dist/assets/remoteEntry.js` corretamente.

4. **Gestão de Repasses**
   - Se o cliente exigir dados reais na primeira entrega: conectar `Desktop.tsx` a `installmentClient.list()` e `batchClient.list()` (e eventualmente webhooks para popular dados), com fallback para mock em dev/vazio.

---

## Referências

- `docs/standards/MODULE-MANIFEST-SCHEMA.md`
- `chassi/backend/src/services/moduleLoader.ts` (extração ZIP)
- `chassi/backend/src/routes/module-assets.ts` (serve assets + fallback)
