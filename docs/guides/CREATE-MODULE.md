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

```typescript
federation({
  name: 'meu-modulo',  // ← mesmo valor que slug no manifest
  ...
})
```

Se outro módulo já estiver na porta 5001, use 5002, 5003, etc.

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

Com o chassi rodando via Docker e `DOCKER_ENV=true`, o backend detecta automaticamente
módulos em desenvolvimento nas portas 5001-5099 a cada 5 segundos.

Acesse `http://localhost:3000` e o módulo aparecerá no menu lateral.

> **Como funciona:** `devModulesSync.ts` no backend varre as portas e busca `/manifest.json`.
> Ao encontrar, registra/atualiza o módulo no banco com `type: 'dev'`.
> O `remoteEntry.js` é sempre carregado de `localhost:{porta}` (não de `host.docker.internal`)
> pois é o **browser** quem carrega — não o container.

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

```bash
pnpm --filter @sgo/module-meu-modulo build
```

O build gera `modules/meu-modulo/dist/`.

Para criar o ZIP de instalação:
```bash
cd modules/meu-modulo
zip -r meu-modulo-v1.0.0.zip dist/ manifest.json
```

Para instalar em uma instância de chassi:
- Via UI: Configurações → Módulos → Upload ZIP
- Via API: `POST /api/upload-module` com o arquivo em `multipart/form-data`
- Via Nexus: instala remotamente em N instâncias simultaneamente
