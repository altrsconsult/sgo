# Instruções para gerar tema SGO (JSON)

Use este documento em ferramentas como ChatGPT, Claude ou Gemini. Envie o documento inteiro no início da conversa e use o **Prompt inicial** abaixo (ou adapte) para o assistente guiar o usuário até o JSON final.

---

## Prompt inicial (copie e cole ao abrir o chat)

```
Olá. Este é um documento de referência para criar temas visuais. Preciso da sua ajuda para guiar um usuário a construir o próprio tema, que será usado em um sistema externo chamado SGO (Sistema de Gestão Operacional — plataforma modular open source para gestão e integração de aplicações).

Siga estas orientações:

1. **Inquira o usuário** sobre as preferências: cores da marca, tipografia (fonte), se prefere tema claro, escuro ou ambos, identidade visual e setor de atuação (se relevante).

2. **Use as melhores práticas atuais de conforto ocular**: contraste adequado (WCAG), evitar branco/preto puros em grandes superfícies, tons suaves para fundos, saturação moderada para elementos de destaque. Para tema escuro: fundos não totalmente pretos, contraste legível sem cansar a vista.

3. **Capture a essência da marca**: a partir das respostas (e de referências que o usuário eventualmente citar), infira uma paleta coerente e sugira um tema que reflita a identidade visual desejada.

4. **Entregável final**: após alinhar com o usuário, produza um único arquivo JSON no formato descrito neste documento (variáveis HSL, light/dark, font opcional). No último passo, responda apenas com o JSON puro, sem texto extra, para que possa ser copiado e salvo como .json e importado no SGO.

O restante deste documento contém o schema exato do JSON e exemplos. Use-o como referência técnica.
```

---

## Formato da resposta

A resposta deve ser **somente** um objeto JSON, sem texto antes ou depois, sem bloco markdown (sem ```json). Exemplo de resposta esperada:

```json
{
  "name": "Nome do tema",
  "font": "Inter",
  "light": { ... },
  "dark": { ... }
}
```

---

## Schema do JSON

- **name** (opcional): string, nome do tema.
- **font** (opcional): string, nome de uma fonte do Google Fonts (ex: "Inter", "Roboto").
- **light** (opcional): objeto com variáveis de cor para modo claro. Pelo menos um de `light` ou `dark` é obrigatório.
- **dark** (opcional): objeto com variáveis de cor para modo escuro.

Cada variável de cor deve ser uma **string no formato HSL sem a função hsl()**: três valores separados por espaço. Exemplo: `"220 70% 50%"` (matiz 0-360, saturação %, luminosidade %).

### Chaves aceitas (camelCase) em `light` e `dark`

| Chave | Uso |
|-------|-----|
| background | Fundo principal |
| foreground | Texto principal |
| card | Fundo de cards |
| cardForeground | Texto em cards |
| popover | Fundo de popovers |
| popoverForeground | Texto em popovers |
| primary | Cor primária (botões, links) |
| primaryForeground | Texto sobre primary |
| secondary | Cor secundária |
| secondaryForeground | Texto sobre secondary |
| muted | Áreas discretas |
| mutedForeground | Texto secundário |
| accent | Hover, seleção (sidebar) |
| accentForeground | Texto sobre accent |
| destructive | Ações destrutivas |
| destructiveForeground | Texto sobre destructive |
| border | Bordas |
| input | Bordas de inputs |
| ring | Anel de foco |
| radius | Border radius (ex: "0.5rem") |

---

## Exemplo completo

```json
{
  "name": "Tema Corporativo",
  "font": "Inter",
  "light": {
    "background": "0 0% 98%",
    "foreground": "0 0% 15%",
    "primary": "220 70% 50%",
    "primaryForeground": "210 20% 98%",
    "accent": "220 20% 92%",
    "accentForeground": "220 13% 18%",
    "border": "220 14% 90%",
    "input": "220 14% 90%",
    "ring": "220 70% 50%",
    "radius": "0.5rem"
  },
  "dark": {
    "background": "220 15% 10%",
    "foreground": "210 20% 98%",
    "primary": "220 70% 50%",
    "primaryForeground": "210 20% 98%",
    "accent": "220 30% 18%",
    "accentForeground": "210 20% 98%",
    "border": "220 20% 18%",
    "input": "220 20% 18%",
    "ring": "220 70% 50%",
    "radius": "0.5rem"
  }
}
```

---

## Regra para o assistente

Quando o usuário descrever um tema (cores, marca, estilo, referência visual), responda **apenas** com um único objeto JSON válido no formato acima. Não inclua explicações, nem blocos de código markdown (```), nem texto antes ou depois do JSON. Apenas o JSON puro, para que possa ser copiado e colado diretamente em um arquivo .json e enviado no sistema SGO.
