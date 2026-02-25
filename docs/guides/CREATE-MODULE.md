# Criando um Novo Módulo SGO

> Tempo estimado: 5-15 minutos para o boilerplate rodando.
> Um agente de IA seguindo este guia deve conseguir criar um módulo funcional sem intervenção humana.

---

## Pré-requisitos

- Docker Desktop instalado e rodando
- Chassi rodando: `docker compose up -d` (a partir da raiz do monorepo)
- pnpm instalado: `npm install -g pnpm`

---

## Passo 1: Copiar o Boilerplate

```bash
# A partir da raiz do monorepo
cp -r modules/boilerplate modules/meu-modulo
```

---

## Passo 2: Configurar o Módulo

### 2a. `modules/meu-modulo/manifest.json`

```json
{
  "slug": "meu-modulo",
  "name": "Meu Módulo",
  "description": "Descrição do módulo",
  "version": "1.0.0",
  "icon": "LayoutDashboard",
  "color": "#10b981",
  "permissions": [],
  "hasWidget": true,
  "serverPort": 5001
}
```

**Ícones disponíveis:** qualquer ícone do [Lucide React](https://lucide.dev/icons/).

### 2b. `modules/meu-modulo/package.json`

Altere apenas o `name`:
```json
{
  "name": "@sgo/module-meu-modulo",
  ...
}
```

### 2c. `modules/meu-modulo/vite.config.ts`

- `federation({ name: 'meu-modulo', ... })` — mesmo valor que `slug`.
- `server: { port: 5001, host: true, allowedHosts: true, cors: true }` (dev com Docker: ver docs/DEV-DOCKER-LOCAL.md).

Se a porta estiver em uso, use 5002, 5003, etc.

---

## Passo 3: Instalar Dependências

```bash
pnpm install
```

---

## Passo 4: Desenvolver

```bash
pnpm --filter @sgo/module-meu-modulo dev
```

O módulo estará disponível em `http://localhost:5001`.

---

## Passo 5: Ver no Chassi

Fluxo completo: **docs/DEV-DOCKER-LOCAL.md**. Chassi em 5173 (`pnpm dev`) ou 3000 (Docker); backend descobre módulos em 5001–5099 a cada ~5 s.

---

## Estrutura de Arquivos Recomendada

```
modules/meu-modulo/
├── src/
│   ├── App.tsx           # Componente principal (rota /)
│   ├── Widget.tsx        # Card do dashboard
│   ├── main.tsx          # Entry point (standalone dev)
│   ├── components/       # Componentes internos do módulo
│   ├── hooks/            # React hooks customizados
│   ├── pages/            # Sub-rotas do módulo
│   └── lib/
│       └── api.ts        # Funções de fetch para /api/module-data/meu-modulo/...
├── server/
│   └── index.ts          # Servidor Hono (opcional — apenas se precisar de lógica server)
├── manifest.json
├── package.json
└── vite.config.ts
```

---

## Padrões de Código

### Importações

```typescript
// Design System
import { Button, Card, Input } from '@sgo/ui/components';

// Tipos
import type { ModuleContext, User } from '@sgo/sdk';

// Ícones
import { LayoutDashboard, Plus, Trash2 } from 'lucide-react';
```

### Consumindo a API do Chassi

O módulo não tem banco próprio — usa a API do chassi para persistir dados:

```typescript
// lib/api.ts
const API = '/api/module-data/meu-modulo';

export const tarefasApi = {
  list: () => fetch(`${API}/tarefas`).then(r => r.json()),
  create: (data: unknown) => fetch(`${API}/tarefas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json()),
};
```

### Recebendo Contexto do Chassi

```typescript
interface AppProps {
  context?: ModuleContext;
}

export default function App({ context }: AppProps) {
  const { user, moduleSlug } = context || {};
  // user.role pode ser 'admin' ou 'user'
  // use para mostrar/ocultar controles de admin
}
```

---

## Empacotando para Distribuição

Use o script `build:zip` — ele faz o build e gera o ZIP automaticamente:

```bash
pnpm --filter @sgo/module-meu-modulo build:zip
```

O ZIP gerado (`meu-modulo-v1.0.0.zip`) inclui:
- `dist/` — frontend buildado
- `manifest.json` — contrato do módulo
- `migrations/` — migrations SQL por dialeto (se existir)

> **Windows sem `zip` nativo:** o script usa PowerShell como fallback. Para melhor compatibilidade, use Git Bash ou WSL.

Para instalar em uma instância de chassi:
- Via UI: Admin → Módulos → Upload ZIP
- Via API: `POST /api/upload-module` com o arquivo em `multipart/form-data`
- Via link: `POST /api/install-from-link` com a URL pública do ZIP
- Via Nexus: instala remotamente em N instâncias simultaneamente

### Migrations no módulo (opcional)

Se o módulo precisar de tabelas próprias no banco do chassi, crie a pasta `migrations/` com SQL por dialeto:

```
meu-modulo/
  migrations/
    pg/
      0001_create_tabela.sql
    mysql/
      0001_create_tabela.sql
```

O chassi aplica as migrations automaticamente ao instalar o módulo. Ver [MODULE-MANIFEST-SCHEMA.md](../standards/MODULE-MANIFEST-SCHEMA.md) para detalhes.
