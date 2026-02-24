# LP SGO — sgo.altrs.net

Landing page de apresentação do **SGO ALTRS** (Sistema de Gestão Operacional).  
Destino: CNAME **sgo.altrs.net**.

- **Conteúdo:** o que é o SGO, proposta de valor, chassi + módulos, autonomia, devs, documentação, privacidade, termos.
- **Header:** botão "Portal do cliente" → portal.altrs.net (login).
- **Rodapé:** dados da empresa, contato, link altrs.com.br.

## Desenvolvimento

```bash
pnpm dev      # http://localhost:3003
pnpm build
pnpm preview
```

## Estrutura

- `src/App.tsx` — rotas e páginas (home, devs, docs, privacidade, termos)
- Conteúdo e componentes a serem implementados na fase de copy/design
