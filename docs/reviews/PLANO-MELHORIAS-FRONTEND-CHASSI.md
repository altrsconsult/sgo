# Plano de melhorias — Frontend design (Chassi)

**Revisão:** critérios da skill *frontend-design* aplicados ao frontend do **chassi** (shell, launcher, login, admin).  
**Escopo:** [chassi/frontend](chassi/frontend) — layout, tokens, tipografia, movimento e fundos da interface que envolve os módulos.  
**Objetivo:** melhorar a base visual do chassi para que os **módulos** (autocontidos) precisem de menos ajustes próprios; a identidade do chassi fica mais marcante e os módulos focam só no que é específico deles (ex. tokens Edukaead).

---

## 1. Resumo executivo

O chassi já tem **design tokens** próprios ([design-tokens.css](chassi/frontend/src/styles/design-tokens.css)), **theme** (light/dark/system e tema custom injetável), e algumas **animações** (page-enter, hover em cards do launcher, fade-in na Home). A tipografia vem do `@sgo/ui` (Inter) e não há override no chassi. Melhorar aqui — tipografia, movimento de entrada, fundos sutis e coerência dos tokens com o globals do @sgo/ui — deixa a “casca” mais polida; os módulos que rodam em iframe herdam apenas o tema light/dark (postMessage) e continuam autocontidos, mas a experiência global (launcher, login, shell) fica mais alinhada à skill frontend-design e mais leve de replicar nos módulos.

---

## 2. Checklist por critério (skill frontend-design)

| Critério | Chassi | Observação |
|----------|--------|------------|
| **Tipografia** | Parcial | Inter via @sgo/ui; design-tokens define --font-family-base mas não fonte display. Sem par display/body. |
| **Cor e tema** | Ok | Tokens semânticos em design-tokens.css; ThemeContext com light/dark/custom. Coerência com @sgo/ui a verificar (dois sistemas de vars). |
| **Movimento** | Parcial | page-enter, hover em module-card, animate-in fade-in na Home. Sem staggered reveals nem scroll-triggered. |
| **Composição espacial** | Parcial | Shell convencional (header + sidebar + main); launcher em grid; login com card central + gradiente. Funcional, previsível. |
| **Fundos e detalhes** | Parcial | Login tem radial gradient; resto sólido. Sem textura ou profundidade na shell. |
| **Anti-genérico** | Fraco | Inter; padrões de cards/sidebar genéricos. |

---

## 3. Arquivos relevantes do chassi

- **Tokens e tema:**  
  - [chassi/frontend/src/styles/design-tokens.css](chassi/frontend/src/styles/design-tokens.css) — cores, espaçamento, tipografia, raios, sombras, duração de transição.  
  - [chassi/frontend/src/styles/globals.css](chassi/frontend/src/styles/globals.css) — importa tokens; page-enter; launcher-grid; module-card; dropzone; etc.  
  - [packages/ui/src/globals.css](packages/ui/src/globals.css) — fonte Inter e vars do design system (--background, --primary, etc.). O chassi importa isto primeiro.
- **Tema e skins:**  
  - [chassi/frontend/src/contexts/ThemeContext.tsx](chassi/frontend/src/contexts/ThemeContext.tsx) — light/dark/system; tema custom com fonte e CSS injetados.
- **Layout e páginas:**  
  - [chassi/frontend/src/layouts/ShellLayout.tsx](chassi/frontend/src/layouts/ShellLayout.tsx) — header, sidebar, área de conteúdo.  
  - [chassi/frontend/src/pages/HomePage.tsx](chassi/frontend/src/pages/HomePage.tsx) — launcher (grid de módulos).  
  - [chassi/frontend/src/pages/auth/LoginPage.tsx](chassi/frontend/src/pages/auth/LoginPage.tsx) — login com gradiente de fundo.
- **Entrada:**  
  - [chassi/frontend/src/main.tsx](chassi/frontend/src/main.tsx), [chassi/frontend/index.html](chassi/frontend/index.html).

---

## 4. Recomendações priorizadas (chassi)

### 4.1 Curto prazo

- **Tipografia (chassi):** Definir uma fonte display (títulos) e manter ou suavizar a body (ex. continuar Inter ou trocar por uma neutra com carácter). Aplicar no chassi via override de `--font-sans` em [design-tokens.css](chassi/frontend/src/styles/design-tokens.css) ou em [globals.css](chassi/frontend/src/styles/globals.css) do chassi, e garantir que [index.html](chassi/frontend/index.html) ou o ThemeProvider carregam o link da fonte. Assim a shell (launcher, header, login) ganha identidade; os módulos em iframe não herdam a fonte do documento do chassi (cada um tem o seu HTML), então continuam autocontidos e podem definir a deles (ex. Edukaead).
- **Movimento de entrada (launcher):** Na [HomePage](chassi/frontend/src/pages/HomePage.tsx), além do `animate-in fade-in` do container, aplicar uma animação em sequência (staggered) nos cards do grid (ex. `animation-delay` por índice) para uma entrada mais polida. Usar as variáveis já existentes (`--transition-duration-standard`, `--transition-easing-easeOut`).
- **Coerência tokens vs @sgo/ui:** Revisar se as variáveis de [design-tokens.css](chassi/frontend/src/styles/design-tokens.css) (--color-primary, --color-background, etc.) estão alinhadas ou duplicam o que o [@sgo/ui/globals.css](packages/ui/src/globals.css) já define (--primary, --background em HSL). Se houver dois sistemas, documentar quando usar cada um ou unificar para evitar conflito (ex. dark mode: design-tokens usa `prefers-color-scheme`, ThemeContext usa classe `.dark` no root).

### 4.2 Médio prazo

- **Fundos da shell:** No [ShellLayout](chassi/frontend/src/layouts/ShellLayout.tsx) ou em [globals.css](chassi/frontend/src/styles/globals.css), acrescentar um fundo sutil para a área principal (ex. gradiente muito leve ou padrão geométrico discreto) sem prejudicar legibilidade. O login já tem radial gradient; manter a mesma linha de “atmosfera leve”.
- **Composição (launcher):** Testar um destaque visual no primeiro card ou na saudação (ex. card maior, ou overlap leve) para quebrar um pouco o grid e dar um ponto focal, sem alterar a estrutura de navegação.
- **Page transition:** Garantir que a transição de página (page-enter) está aplicada nas trocas de rota (ex. React Router) onde fizer sentido, para consistência de movimento em todo o chassi.

### 4.3 Longo prazo

- **Motion library (chassi):** Se for adotada uma lib (ex. Motion for React) no chassi, usar para entradas de página e micro-interações (sidebar, dropdowns), com presets de duração/easing alinhados aos tokens. Os módulos podem continuar com CSS puro ou adotar a mesma lib nos seus projetos.
- **Documentação “Chassi – linha visual”:** Documentar em `docs/` ou no próprio chassi: tokens usados, tipografia, ritmo de animação e boas práticas para novas páginas do chassi. Isso ajuda a manter consistência e reduz trabalho duplicado nos módulos que queiram “conversar” com o chassi (ex. mesmo ritmo de transição).

---

## 5. Efeito nos módulos

- Melhorias de **tipografia e movimento no chassi** não alteram o conteúdo dos iframes (módulos); cada módulo continua a definir a sua própria fonte e animações.
- O que o chassi pode fazer é: (1) oferecer uma **shell** mais marcante (launcher, login, header), reduzindo a necessidade de os módulos “compensarem” a sensação genérica; (2) documentar **ritmo e tokens** para quem quiser alinhar módulos ao chassi; (3) manter **tema light/dark** e eventual tema custom (já existe) para que a casca seja consistente. Assim, as melhorias **exclusivas dos módulos** (ex. tokens Edukaead, paleta pastel) ficam mais leves e focadas na identidade do cliente.

---

## 6. Próximos passos sugeridos

1. Avaliar este plano e o [PLANO-MELHORIAS-FRONTEND-EDUKAEAD.md](PLANO-MELHORIAS-FRONTEND-EDUKAEAD.md) em conjunto.
2. Priorizar primeiro as melhorias do chassi (curto prazo) para estabelecer a base; em seguida aplicar as melhorias dos módulos Edukaead (tema dentro da pasta do módulo, tokens partilhados entre leads-intake e enroll-manage).
3. Alinhar dark mode: garantir que design-tokens e ThemeContext (classe `.dark`) não entram em conflito e que o postMessage `sgo-theme` para os iframes continua a refletir o tema resolvido do chassi.
