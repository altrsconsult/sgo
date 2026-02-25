# Plano de melhorias — Frontend design (módulos Edukaead)

**Revisão:** critérios da skill *frontend-design* + coerência entre módulos para o mesmo cliente (Edukaead).  
**Módulos:** `edukaead-leads-intake` (Pre-Matrículas), `edukaead-enroll-manage` (Gestão de Matrícula).  
**Objetivo:** documento para avaliação; priorização sugerida ao final.

> **Nota:** Existe um plano separado para o **chassi** ([PLANO-MELHORIAS-FRONTEND-CHASSI.md](PLANO-MELHORIAS-FRONTEND-CHASSI.md)). Melhorias feitas no chassi (tipografia, movimento, fundos da shell) reduzem o que cada módulo precisa fazer sozinho — os módulos ficam mais leves e focados na sua identidade específica (ex. tokens Edukaead).

---

## 1. Resumo executivo

Os dois módulos já compartilham a **mesma paleta de tokens** (variáveis CSS em `src/styles/module.css` idênticas: `--primary-pastel`, `--success-pastel`, etc.) e o mesmo design system base (`@sgo/ui`). Isso garante que cores e tema “conversem” entre si. O que falta é: (1) **identidade visual mais marcante** (tipografia, fundos, movimento) alinhada à skill frontend-design; (2) **documentação e reforço** da linha visual comum Edukaead para futuros módulos.

---

## 2. Checklist por critério (skill frontend-design)

| Critério | Leads-intake | Enroll-manage | Observação |
|----------|--------------|---------------|------------|
| **Tipografia** | Parcial | Parcial | Herdam Inter do `@sgo/ui`; sem par display/body nem fonte com carácter. |
| **Cor e tema** | Ok | Ok | Paleta pastel coerente e dark mode; falta um acento mais marcante. |
| **Movimento** | Parcial | Parcial | fadeInUp, transitions; sem staggered reveals nem scroll-triggered. |
| **Composição espacial** | Parcial | Parcial | Layouts funcionais (duas colunas, tabs, cards); previsíveis. |
| **Fundos e detalhes** | Fraco | Fraco | Fundos sólidos/suaves; sem textura, gradiente ou profundidade. |
| **Anti-genérico** | Fraco | Fraco | Inter, padrões de cards/tabs genéricos. |

---

## 3. Consistência entre os dois módulos (mesmo cliente)

**O que já está alinhado:**

- Mesmas variáveis CSS em `module.css` (blocos `:root` e `.dark` iguais).
- Mesmo `tailwind.config.ts` (preset `@sgo/ui`).
- Mesmo `index.html` (sem fontes extras; só estilo de caret).
- Mesmos padrões de transição (0.2s ease-in-out), animações (fadeInUp 0.3s), scroll suave e feedback em botões (scale 0.98).

**O que pode ser reforçado:**

- **Nomenclatura de componentes:** leads usa `.enrichment-tab`, `.lead-data-panel`, `.course-card`; enroll usa `.module-tab`, `.accordion-card`, `.enrolled-card`. Não é obrigatório unificar classes, mas um **guia de nomes** (ex.: “aba principal” = sempre mesmo padrão visual) ajuda a manter a conversa entre módulos.
- **Tipografia e movimento:** se no futuro for definida uma fonte display/body própria para Edukaead, aplicar nos dois módulos via ficheiros dentro da pasta de cada módulo (ou num ficheiro compartilhado referenciado por ambos). Os módulos são autocontidos — não dependem do chassi para tema.
- **Token único Edukaead:** extrair o bloco comum de variáveis (`:root` / `.dark`) para um único ficheiro (ex. `edukaead-tokens.css`) dentro de uma pasta partilhada (ex. `modules-lab/edukaead-shared/`) ou copiado em cada módulo, para evitar deriva.

---

## 4. Recomendações priorizadas

### 4.1 Curto prazo (quick wins)

- **Tipografia (Edukaead):** Definir uma fonte display + body distinta de Inter (ex.: uma fonte editorial ou geométrica para títulos e uma serifada/neutra para corpo), e aplicá-la nos dois módulos (override de `--font-sans` ou classe no `index.html` / wrapper do módulo). Manter a mesma escolha nos dois para consistência.
- **Acento de cor:** Escolher um acento forte (ex.: cor de destaque para CTAs ou estados “concluído”) usado da mesma forma nos dois módulos (variável CSS compartilhada).
- **Um momento de movimento:** Introduzir uma única animação de entrada em destaque (ex.: primeira tela ou primeiro card) com `animation-delay` em sequência (staggered) em ambos os módulos, para dar sensação de polish sem alterar fluxo.

### 4.2 Médio prazo

- **Fundos e profundidade:** Em uma tela principal de cada módulo (ex.: lista de leads e lista de matrículas), acrescentar um fundo com mais atmosfera (gradiente sutil, noise muito leve ou padrão geométrico discreto) usando CSS global do módulo, mantendo contraste e acessibilidade.
- **Composição:** Testar um layout com um elemento “quebrando” o grid (ex.: card em destaque maior ou overlap leve) em uma única vista por módulo, mantendo o restante como está.
- **Documento “Edukaead – linha visual”:** Criar um doc (ex. em `docs/` ou na pasta dos módulos) com: tokens de cor, tipografia, ritmo de animação e exemplos de uso nos dois módulos, para que novos módulos do mesmo cliente sigam a mesma conversa.

### 4.3 Longo prazo (módulos autocontidos)

- **Tema Edukaead dentro do módulo:** Como não há acesso ao chassi para injetar tema global, o tema Edukaead (tipografia, paleta, tokens) deve viver **dentro da pasta de cada módulo**. Opções: (1) ficheiro `edukaead-tokens.css` (ou `theme.css`) em cada módulo, importado no `main.tsx` do módulo; (2) pasta partilhada no repo (ex. `modules-lab/edukaead-shared/styles/`) da qual ambos os módulos importam o mesmo CSS. Assim os módulos continuam autocontidos e instaláveis em qualquer chassi.
- **Motion library:** Se for adotada uma lib (ex. Motion for React), usar nos dois módulos para entradas e micro-interações, com os mesmos presets de duração e easing.

---

## 5. Arquivos relevantes (para implementação)

- **Tokens e tema:**  
  - [modules-lab/edukaead-leads-intake/src/styles/module.css](modules-lab/edukaead-leads-intake/src/styles/module.css) (linhas 1–35)  
  - [modules-lab/edukaead-enroll-manage/src/styles/module.css](modules-lab/edukaead-enroll-manage/src/styles/module.css) (linhas 1–32)
- **Fonte base (hoje Inter):**  
  - [packages/ui/src/globals.css](packages/ui/src/globals.css) (import da fonte e `--font-sans`)
- **Entrada e layout:**  
  - [modules-lab/edukaead-leads-intake/src/main.tsx](modules-lab/edukaead-leads-intake/src/main.tsx), [modules-lab/edukaead-enroll-manage/src/main.tsx](modules-lab/edukaead-enroll-manage/src/main.tsx)  
  - [modules-lab/edukaead-leads-intake/index.html](modules-lab/edukaead-leads-intake/index.html), [modules-lab/edukaead-enroll-manage/index.html](modules-lab/edukaead-enroll-manage/index.html)
- **Views principais:**  
  - [modules-lab/edukaead-leads-intake/src/views/Desktop.tsx](modules-lab/edukaead-leads-intake/src/views/Desktop.tsx), [modules-lab/edukaead-enroll-manage/src/views/Desktop.tsx](modules-lab/edukaead-enroll-manage/src/views/Desktop.tsx)

---

## 6. Próximos passos sugeridos

1. Avaliar este plano (prioridades e escopo).
2. Decidir se os tokens Edukaead ficam em ficheiro por módulo ou numa pasta partilhada (ex. `modules-lab/edukaead-shared/`) importada por ambos.
3. Implementar primeiro os itens de curto prazo nos dois módulos em paralelo, mantendo sempre os mesmos tokens e a mesma “voz” visual.
4. Opcional: criar `docs/edukaead-linha-visual.md` (ou em `modules-lab/`) com tokens, fontes e boas práticas para os módulos do cliente.
