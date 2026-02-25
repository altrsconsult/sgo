# MVP: Converter e validar os 3 módulos Edukaead (modules-lab)

Roteiro para garantir que **edukaead-leads-intake**, **edukaead-enroll-manage** e **edukaead-gestao-repasses** funcionem no chassi 4.0 em modo dev e (opcional) instalados via ZIP.

---

## Cenário do dia a dia (como funciona na prática)

1. **Entro na pasta do módulo**
   - `cd modules-lab/edukaead-leads-intake` (ou enroll-manage, gestao-repasses).

2. **Primeira vez: `pnpm install`**  
   Depois disso, só `pnpm dev`.
   - O módulo sobe na porta dele (ex.: 5002). Se eu abrir **http://localhost:5002** no browser, acesso o módulo **com HMR**, rodando **fora do chassi**, normalmente (standalone).

3. **Se eu abrir o chassi** (na raiz do repo)
   - O backend depende do **Postgres**. A forma mais fácil: subir só o banco com Docker (`docker compose up -d chassi-db`). Quem tiver Postgres local pode usar em vez disso.
   - Um comando: **`pnpm dev`** sobe **backend e frontend** em modo dev (portas 3001 e 3000).
   - A ordem não importa: pode subir o módulo antes ou depois do chassi. O backend descobre os módulos em dev na subida e a cada 5 s. No console: `[devModulesSync] Módulo dev registrado: leads-intake (porta 5002, iframe)`.
   - Os módulos aparecem no menu e ao clicar abrem em iframe (HMR). **Docker** nesse fluxo é só para o banco; backend e front rodam no host.

4. **Depois de concluir o desenvolvimento**
   - `pnpm build` no módulo → gera a pasta `dist/`.
   - Monto um ZIP com `dist/` + `manifest.json` (da raiz do módulo).
   - Instalo em **qualquer chassi** (Admin → Módulos → Upload, ou `POST /api/upload-module`).
   - O chassi **extrai o ZIP**, **registra o módulo** na base e passa a servir os arquivos em `/modules-assets/<slug>/`. O módulo aparece no menu e abre em iframe; **não há passo extra de “migrations”** do lado do chassi (o módulo é estático + manifest; se no futuro o módulo tiver backend com tabelas, isso seria outra feature).

Resumo: **módulo sozinho = dev com HMR na porta; chassi ligado = vê o módulo como instalado; build + ZIP = instala em qualquer chassi e funciona.**

---

## Estado da conversão

Os três módulos já estão em `modules-lab/` com prefixo **edukaead-** e nomes de pacote únicos (`@sgo/module-edukaead-*`). Nenhuma alteração de lógica ou UI foi feita; apenas o necessário para o chassi 4.0 descobrir e exibir em iframe (standalone).

| Item | Status |
|------|--------|
| Cópia integral do sgo-core para modules-lab | Feito |
| Pasta renomeada com sufixo edukaead- | Feito |
| package.json com nome único no workspace | Feito |
| manifest.json compatível com ModuleManifestSchema | OK (campos extras ignorados pelo Zod) |
| GET /manifest.json em dev | Feito: `public/manifest.json` em cada módulo |
| Portas distintas (5002, 5003, 5005) | Já configurado no vite.config de cada um |
| Chassi: devModulesSync para standalone | Feito (remoteEntry = base URL quando não há remoteEntry.js) |
| Chassi: rota /modules-assets para instalados | Feito |
| Chassi: remoteUrl para instalados no GET /api/modules | Feito |

**Manter em sync:** ao alterar `manifest.json` na raiz do módulo (versão, nome, etc.), copie o conteúdo para `public/manifest.json` para o dev server continuar servindo o manifest correto.

---

## Validação em modo dev (recomendado primeiro)

1. **Na raiz do repo**
   ```bash
   pnpm install
   ```

2. **Banco + chassi**  
   O backend precisa do Postgres. Opção mais simples: `docker compose up -d chassi-db` (sobe só o banco). Depois, na raiz: `pnpm dev` — sobe **backend** (3001) e **frontend** (3000) em modo dev. Docker aqui é só para o banco; backend e front rodam no host com HMR.

3. **Módulo (outro terminal)**  
   Na pasta do módulo: `cd modules-lab/edukaead-leads-intake` e `pnpm dev`. Ou da raiz: `pnpm --filter @sgo/module-edukaead-leads-intake dev`. A ordem não importa (módulo antes ou depois do chassi). O backend descobre na subida e a cada 5 s; no console: `[devModulesSync] Módulo dev registrado: leads-intake (porta 5002, iframe)`.

4. **No browser**
   - Acesse o front do chassi (ex.: http://localhost:3000).
   - Faça login (ex.: admin / admin123 em dev).
   - O módulo **Pre-Matrículas** deve aparecer no menu lateral.
   - Clique: a tela do módulo deve abrir em **iframe** (http://localhost:5002/).

5. **Repetir para os outros dois**
   - Terminal: `pnpm --filter @sgo/module-edukaead-enroll-manage dev` (porta 5003).
   - Terminal: `pnpm --filter @sgo/module-edukaead-gestao-repasses dev` (porta 5005).
   - Em cada um, aguardar alguns segundos e verificar no chassi: menu e iframe ao abrir o módulo.

**Critério de sucesso:** os três módulos aparecem no menu e abrem em iframe sem erro de carregamento; a UI de cada um carrega normalmente (sem alterar código/front dos módulos).

---

## Validação instalado via ZIP (opcional)

1. **Build de um módulo**
   ```bash
   pnpm --filter @sgo/module-edukaead-leads-intake build
   ```

2. **Montar o ZIP**
   - Inclua a pasta `dist/` e o `manifest.json` da **raiz** do módulo (não o de `public/`).
   - Exemplo (PowerShell na pasta do módulo):
     ```powershell
     Compress-Archive -Path dist, manifest.json -DestinationPath leads-intake-1.2.0.zip
     ```

3. **Instalar no chassi**
   - No admin do chassi: Configurações / Módulos → Upload do ZIP (ou use a API `POST /api/upload-module`).

4. **Abrir o módulo**
   - O módulo deve aparecer na lista e, ao clicar, carregar em iframe a partir de `/modules-assets/leads-intake/dist/index.html` (backend serve os arquivos estáticos da pasta instalada).

**Critério de sucesso:** módulo instalado via ZIP aparece no menu e abre em iframe usando assets servidos pelo chassi.

---

## Resumo dos 3 módulos

| Módulo | Slug (manifest) | Porta dev | Pacote |
|--------|------------------|-----------|--------|
| Pre-Matrículas | leads-intake | 5002 | @sgo/module-edukaead-leads-intake |
| Gestão de Matrícula | enroll-manage | 5003 | @sgo/module-edukaead-enroll-manage |
| Gestão de Repasses | gestao-repasses | 5005 | @sgo/module-edukaead-gestao-repasses |

Nenhuma alteração de negócio ou frontend nos módulos; apenas configuração e arquivos mínimos para descoberta e exibição no chassi 4.0.
