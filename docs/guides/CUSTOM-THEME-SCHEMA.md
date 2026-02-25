# Schema do Tema Personalizado (JSON)

O SGO permite upload de um tema customizado em Admin > Configurações > Aparência, via arquivo **.json**. O arquivo define paletas para modo claro e escuro e, opcionalmente, tipografia (Google Fonts).

## Estrutura

```json
{
  "name": "Nome do tema",
  "light": { ... },
  "dark": { ... },
  "font": "Inter"
}
```

- **name** (opcional): Nome exibido na interface.
- **light** (opcional): Variáveis CSS para modo claro. Pelo menos um de `light` ou `dark` é obrigatório.
- **dark** (opcional): Variáveis CSS para modo escuro.
- **font** (opcional): Nome da fonte no Google Fonts (ex: "Inter", "Roboto"). Será usada em --font-sans.

## Variáveis aceitas (paletas)

Valores devem ser HSL sem o prefixo hsl(), apenas os três números separados por espaço (ex: "220 70% 50%").

| Chave (camelCase) | CSS (--kebab-case) |
|-------------------|--------------------|
| background | --background |
| foreground | --foreground |
| primary | --primary |
| primaryForeground | --primary-foreground |
| accent | --accent |
| ... | (ver globals.css do @sgo/ui) |

Variáveis completas: background, foreground, card, cardForeground, popover, popoverForeground, primary, primaryForeground, secondary, secondaryForeground, muted, mutedForeground, accent, accentForeground, destructive, destructiveForeground, border, input, ring, radius.

## Exemplo mínimo

```json
{
  "name": "Meu Tema",
  "light": {
    "background": "55 25% 97%",
    "foreground": "220 13% 18%",
    "primary": "220 70% 50%",
    "primaryForeground": "210 20% 98%"
  },
  "dark": {
    "background": "213 22% 8%",
    "foreground": "210 20% 98%",
    "primary": "220 70% 50%",
    "primaryForeground": "210 20% 98%"
  }
}
```

Arquivo de exemplo para download: `/example-custom-theme.json` na raiz do frontend.

## Persistência (MVP)

O tema é salvo no localStorage (sgo-custom-theme); a escolha "Tema personalizado" é persistida no servidor (ui_theme: "custom"). Persistência do JSON no servidor está prevista para evolução futura.
