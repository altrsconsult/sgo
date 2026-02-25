# Checklist de acessibilidade (WCAG 2.1 AA)

Critérios WCAG 2.1 Nível AA relevantes para o SGO (chassi e `@sgo/ui`). A coluna **Atendido** reflete o estado atual; **Onde** indica componente, página ou padrão; **Observação** para exceções ou pendências.

| Critério | Descrição resumida | Atendido | Onde | Observação |
|----------|--------------------|----------|------|------------|
| 1.1.1 Conteúdo não textual | Alternativa textual para imagens/ícones | Sim | @sgo/ui: componentes com labels/aria; ícones decorativos podem usar aria-hidden | Verificar ícones puramente decorativos no chassi |
| 1.3.1 Info e relações | Estrutura semântica (headings, listas, tabelas) | Sim | @sgo/ui: Table, Card, Label; HTML semântico | — |
| 1.4.3 Contraste (mínimo) | Contraste 4.5:1 texto normal; 3:1 texto grande | Sim | Design tokens e temas @sgo/ui; documentado em DESIGN-PATTERNS.md | — |
| 2.1.1 Teclado | Toda funcionalidade via teclado | Sim | @sgo/ui: navegação por Tab, Enter, Escape em modais/menus | — |
| 2.1.2 Sem armadilha de teclado | Foco pode sair de componentes com teclado | Sim | Modais e sheets com foco trap e Escape | — |
| 2.4.3 Ordem do foco | Ordem de foco lógica | Parcial | Depende da ordem no DOM e do fluxo das páginas do chassi | Revisar fluxos de login e configuração |
| 2.4.7 Foco visível | Indicador de foco visível | Sim | @sgo/ui: focus-visible e anéis de foco | — |
| 3.2.1 Em foco | Foco não dispara mudança de contexto sozinho | Sim | Botões e links não mudam contexto apenas ao receber foco | — |
| 4.1.2 Nome, função, valor | Nome e função acessíveis (ARIA/roles quando necessário) | Sim | Componentes com labels e roles adequados (Radix/Shadcn base) | — |
| Formulários | Labels associados a inputs | Sim | Label + id em @sgo/ui; ver guias de uso | — |

**Referência:** [packages/ui/README.md](../../packages/ui/README.md) — seção Accessibility; componentes baseados em Radix UI (primitivos acessíveis).

**CI:** o workflow [.github/workflows/security.yml](../../.github/workflows/security.yml) inclui o job "Acessibilidade (axe)", que faz build do frontend, sobe um servidor local e executa `@axe-core/cli` contra a aplicação. Violações no Actions (job com continue-on-error até tratar todas). “O CI executa checagem automática de acessibilidade (axe).”

**Uso comercial:** para o claim “Acessibilidade documentada” ou “Preparado para WCAG”, este checklist e a documentação do @sgo/ui servem de evidência. Certificação formal (selo) exige auditoria por terceiro (ex.: WebAIM, wcag2.com).
