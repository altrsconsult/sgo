# Dev local com Docker em paralelo

Para ajustar o frontend do chassi com **HMR** (Hot Module Replacement) sem rebuildar a imagem Docker:

1. **Deixe o Docker rodando** como está:
   ```powershell
   docker compose up -d
   ```
   - Frontend buildado: http://localhost:3000  
   - Backend: http://localhost:3001  
   - PostgreSQL: 5432  

2. **Suba o dev server do frontend** (porta 5173, sem conflito com o 3000 do Docker):
   ```powershell
   cd chassi/frontend
   pnpm dev
   ```
   Ou da raiz: `pnpm --filter @sgo/chassi-frontend dev`

3. **Use no navegador:** http://localhost:5173  
   - Vite com HMR; alterações no código refletem na hora.  
   - O dev server faz proxy de `/api` e `/modules-assets` para o backend no Docker (porta 3001).

Resumo: **Docker** = banco + backend + front (build); **local** = apenas front em modo dev na 5173.
