# Visão: Laboratório de Módulos SGO (sgo-modules-lab)

> Documento de produto: laboratório de desenvolvimento de módulos fora do repo, convenção para técnicos e base para oferta N2/Pro e futuro ecossistema de skills/agentes.

---

## Entendimento em uma frase

O técnico clona o repo público (sgo), roda um script que **copia a pasta `modules/` para fora do repo** (ex.: `c:/develop/sgo-modules-lab`), renomeada. Esse diretório vira o **lab privado** dele: tem boilerplate, instruções e ferramentas para desenvolver módulos; pode rodar `pnpm dev` em paralelo com o chassi (ou só os módulos), usar Docker do backend/banco, e manter um repo Git privado só para o lab. O repo público continua com `modules/` só com boilerplate; o lab fica **fora** e é opcional, seguindo uma convenção clara.

---

## Objetivos

1. **Repo público limpo:** `modules/` no GitHub = apenas boilerplate + documentação para qualquer um clonar e começar.
2. **Lab fora do repo:** pasta em `c:/develop/sgo-modules-lab` (ou equivalente) = cópia de `modules/` com tudo que um agente de IA ou técnico precisa para criar e testar módulos, sem subir código de cliente ao público.
3. **Convenção única:** todo desenvolvedor que quiser “lab privado” segue o mesmo fluxo: script → pasta renomeada na mesma raiz (develop) → workspace aponta para ela; quem quiser versionar o lab usa um repo privado só para `sgo-modules-lab`.
4. **Experiência de uso:** no lab dá para rodar módulos com `pnpm dev` em paralelo com o chassi, ou só os módulos; Docker do backend e do banco do chassi continua igual; vira um **laboratório real** de desenvolvimento de módulos.
5. **Produto (N2 / Pro):** vender acesso/suporte a esse lab como oferta N2 ou plano Pro (não público), para técnicos que queiram se especializar em módulos SGO.
6. **Futuro – Skills e agentes:** evoluir para um sistema de **skills e agentes** no estilo BMAD / AIOS-core, personalizado para módulos SGO, compatível com Cursor e Claude Code (prompts, roles, ferramentas, fluxos de criação de módulos assistidos por IA).

---

## Fluxo prático (técnico)

1. Clonar o repo: `git clone <sgo-public> c:/develop/sgo`
2. Na raiz do repo: `pnpm run setup:modules-lab` (ou script equivalente)
3. O script copia `modules/` → `c:/develop/sgo-modules-lab` (ou `../sgo-modules-lab` em relação ao repo)
4. O lab tem seu próprio `pnpm-workspace.yaml` (criado pelo script); o técnico roda `pnpm install` **dentro do lab**; não é necessário que o repo sgo inclua o lab no workspace (o lab fica fora do repo).
5. No lab: criar módulos, copiar boilerplate, rodar `pnpm dev` por módulo; no repo sgo, rodar chassi (`pnpm dev`) e/ou Docker (backend/banco). O chassi descobre os módulos do lab pelas portas (5001+), então tudo funciona em paralelo.
6. (Opcional) Inicializar repo Git privado em `sgo-modules-lab` e versionar só o lab

---

## O que o script garante

- Cópia integral da pasta `modules/` (boilerplate + estrutura) para o destino renomeado (ex.: `c:/develop/sgo-modules-lab`).
- Destino **fora** da árvore do repo (mesma “raiz” develop), para que o lab nunca suba no repo público.
- Um `pnpm-workspace.yaml` e um README no lab, para o técnico rodar `pnpm install` e `pnpm dev` dentro do lab; o chassi no repo descobre os módulos por porta.
- Documentação mínima no lab (README) explicando a convenção e o link para a visão (este doc).

---

## Relação com BMAD / AIOS-core (visão futura)

- **BMAD:** agentes como código (Markdown/YAML), roles especializados (Analyst, PM, Architect, Developer), workflows e slash commands; skills por fase (análise, planejamento, solução, implementação).
- **AIOS-core:** estrutura padrão de agente (entry, config, tools), integração com Tool Hub, orquestração.
- **SGO módulos:** skills e agentes adaptados ao domínio “módulo SGO”: criar módulo a partir do boilerplate, cumprir manifest e contrato do chassi, testar com chassi local, empacotar e publicar. Tudo compatível com Cursor e Claude Code (regras, skills, prompts versionados no lab ou em repo privado).

Essa visão é nova e importante: transforma o lab não só em “pasta de código”, mas na base do **ecossistema de desenvolvimento assistido por IA** para módulos SGO (N2/Pro + skills/agentes no futuro).
