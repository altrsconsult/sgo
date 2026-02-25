# Deploy em produção — SGO Chassi

Guia para colocar o **chassi SGO em produção** com máxima compatibilidade: Docker Compose (Coolify, Hostinger, VPS) ou Portainer (com ou sem Traefik). **Desenvolvimento local** continua em [DEV-DOCKER-LOCAL.md](../DEV-DOCKER-LOCAL.md).

---

## Visão geral

O SGO foi pensado para **sem lock-in**: você escolhe onde rodar (VPS, Coolify, Hostinger, Portainer, etc.) e como expor (uma porta só, ou atrás de Traefik/Caddy). As imagens ficam em `ghcr.io/altrsconsult/`; não há provedor obrigatório.

- **Com Traefik:** o proxy roteia por host/path; frontend e backend são expostos ao Traefik; HTTPS automático (Let's Encrypt) via labels.
- **Sem Traefik:** um único ponto de entrada (porta 80 do frontend); o **Nginx dentro do container do frontend** faz proxy de `/api` e `/modules-assets` para o backend.

```mermaid
flowchart LR
  subgraph sem_traefik [Deploy sem Traefik]
    User1[Usuário] --> Front1[chassi-frontend:80]
    Front1 --> Nginx[Nginx proxy]
    Nginx --> Back1[chassi-backend:3001]
  end

  subgraph com_traefik [Deploy com Traefik]
    User2[Usuário] --> Traefik[Traefik]
    Traefik --> Front2[chassi-frontend]
    Traefik --> Back2[chassi-backend]
  end
```

---

## Cenários de produção

| Cenário | Arquivo | Observação |
| ------- | ------- | ---------- |
| **VPS / Coolify / terminal** (uma porta) | `docker-compose.prod.yml` + `docker-compose.yml` | Uma porta (80); Nginx no frontend faz proxy para o backend. |
| **Portainer com Traefik** | `stack.yml` | Rede `traefik-public`, variáveis `DOMAIN`, `JWT_SECRET`, `POSTGRES_PASSWORD`. |
| **Portainer sem Traefik** | `docker-compose.prod.yml` + `docker-compose.yml` como stack tipo Compose | No Portainer: adicionar stack → Compose → colar conteúdo e usar apenas a porta 80. |
| **Node.js single-process** (Hostinger, Railway, etc.) | `pnpm build:node` + `node dist/index.js` | Um único processo Node.js serve API + frontend estático; MySQL ou Postgres externo. |

### 1. Produção “uma porta só” (Compose)

Ideal para: Coolify, Hostinger, VPS com Docker, ou Portainer **sem** Traefik.

1. Na raiz do repositório, copie o exemplo de variáveis:

   ```bash
   cp .env.example .env
   ```

2. Edite `.env` e defina no mínimo:
   - `POSTGRES_PASSWORD` (senha do PostgreSQL)
   - `JWT_SECRET` (string longa e aleatória para JWTs)
3. Suba os serviços (único ponto de entrada: porta 80):

   ```bash
   docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

4. Acesse `http://<IP-do-servidor>` ou `http://<dominio>` se já houver proxy no host. No primeiro acesso, conclua o wizard de instalação (veja abaixo).

### 2. Portainer com Traefik

Pré-requisitos no servidor:

- Rede overlay: `docker network create --driver overlay traefik-public`
- Traefik rodando com entrypoints `web` (80) e `websecure` (443)

No Portainer:

1. **Stacks** → **Add stack**
2. Cole o conteúdo de [stack.yml](../../stack.yml) (ou importe o arquivo).
3. Defina as variáveis de ambiente (obrigatórias):
   - `DOMAIN` — domínio para esta instância (ex.: `sgo.seudominio.com.br`)
   - `JWT_SECRET` — secret para JWTs
   - `POSTGRES_PASSWORD` — senha do PostgreSQL
4. Opcional: `STACK_NAME` (para várias instâncias no mesmo Swarm), `NEXUS_URL` (modo gerenciado).
5. Deploy. Acesse `https://<DOMAIN>`; no primeiro acesso, conclua o wizard.

### 3. Node.js single-process — Hostinger, Railway e similares

Ideal para hospedagens que oferecem **Node.js gerenciado** (sem Docker), como Hostinger Web App, Railway, Render free tier, etc. Um único processo serve a API e o frontend buildado.

**Banco de dados:** use MySQL ou Postgres externo fornecido pela hospedagem. O chassi detecta o dialeto pelo prefixo da `DATABASE_URL`.

**Passos:**

1. No repositório local, faça o build completo:

   ```bash
   pnpm build:node
   ```

   Isso gera `chassi/backend/dist/` (backend compilado) e `chassi/backend/public/` (frontend estático).

2. Suba a pasta `chassi/backend/` para a hospedagem (GitHub, ZIP, etc.).

3. Configure as variáveis de ambiente na plataforma:

   ```env
   DATABASE_URL=mysql://usuario:senha@host:3306/banco
   JWT_SECRET=string_longa_aleatoria
   SERVE_STATIC=true
   STATIC_PATH=./public
   NODE_ENV=production
   PORT=3000
   ```

4. Defina o comando de start: `node dist/index.js`

5. Execute as migrations antes (ou no start):

   ```bash
   node dist/db/migrate.js
   ```

6. Acesse a URL fornecida pela hospedagem; no primeiro acesso, conclua o wizard de setup.

> **Nota:** módulos instalados ficam em `modules_storage/` — configure um volume persistente ou armazenamento externo se a hospedagem reiniciar o container.

### 4. Portainer sem Traefik

Use o mesmo fluxo do cenário “uma porta só”, mas no Portainer:

- **Stacks** → **Add stack** → tipo **Compose**
- Web editor: use o conteúdo de `docker-compose.yml` + `docker-compose.prod.yml` (ou um único arquivo que combine os dois)
- Configure as variáveis no painel (`.env` não é lido automaticamente; defina no Portainer as env vars necessárias)
- Exposta apenas a porta 80 do frontend.

---

## Variáveis de ambiente

| Variável | Obrigatória (prod)? | Uso | Exemplo |
| -------- | ------------------- | --- | ------- |
| `DATABASE_URL` | Sim (Node single-process) | URL de conexão com o banco | `postgresql://sgo:senha@host:5432/sgo` ou `mysql://sgo:senha@host:3306/sgo` |
| `POSTGRES_PASSWORD` | Sim (Docker Compose) | Senha do PostgreSQL no compose | `senha_forte_123` |
| `JWT_SECRET` | Sim | Assinatura de tokens JWT | string longa aleatória |
| `POSTGRES_DB` | Não | Nome do banco (default: `sgo`) | `sgo` |
| `POSTGRES_USER` | Não | Usuário PostgreSQL (default: `sgo`) | `sgo` |
| `SERVE_STATIC` | Sim (Node single-process) | Serve frontend estático pelo backend | `true` |
| `STATIC_PATH` | Não | Caminho do frontend buildado | `./public` |
| `NEXUS_URL` | Não | Modo gerenciado; vazio = standalone | `https://nexus.seudominio.com.br` |
| `CHASSIS_URL` | Não | URL pública do chassi (links, e-mails) | `https://sgo.seudominio.com.br` |
| `DOMAIN` | Sim só com `stack.yml` | Domínio para Traefik | `sgo.seudominio.com.br` |
| `STACK_NAME` | Não | Nome da stack (múltiplas instâncias) | `sgo` |

Referência completa com comentários: [.env.example](../../.env.example) na raiz do repositório.

---

## Primeiro acesso e wizard

Após subir os containers:

1. Acesse `https://<dominio>` (com Traefik) ou `http://<ip>:80` (compose uma porta).
2. Se o sistema ainda não foi instalado, o frontend redireciona para a tela de **setup** (`/setup`).
3. O wizard usa:
   - `GET /api/setup/status` — verifica se já existe admin
   - `POST /api/setup/install` — cria o primeiro usuário admin e opcionalmente o nome da aplicação (whitelabel)
4. Preencha: usuário e senha do admin, e-mail, nome da aplicação (opcional).
5. **Modo standalone** (padrão): `NEXUS_URL` vazio; o sistema funciona sozinho. **Modo gerenciado:** defina `NEXUS_URL` e o chassi se registra no Nexus; o admin pode ser provisionado pelo Nexus.

---

## Auto-deploy e baixa fricção

- **One-shot (Compose):** copiar `.env.example` → `.env`, preencher `POSTGRES_PASSWORD` e `JWT_SECRET`, rodar:

  ```bash
  docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
  ```

- **Portainer (stack Traefik):** Stacks → Add stack → colar `stack.yml` → preencher `DOMAIN`, `JWT_SECRET`, `POSTGRES_PASSWORD` → Deploy.
- **Futuro:** script de instalação assistida (ex.: `install.sh` que cria `.env` e sobe o compose) pode ser adicionado como evolução; por ora o fluxo é manual com este guia.

---

## Compatibilidade e sem lock-in

- Nenhum provedor é obrigatório; imagens em **ghcr.io** (públicas).
- Qualquer host com Docker (Compose ou Swarm), com ou sem Traefik.
- Modo standalone ou gerenciado (Nexus) conforme configuração de `NEXUS_URL`.

### Escopo de opções de deploy (visão)

As opções documentadas e previstas são:

- **Docker Compose:** manual (terminal) ou via gerenciadores (Hostinger, Coolify, etc.).
- **Templates:** Coolify, Portainer (stack `stack.yml`).

PaaS serverless (Vercel, Netlify, Cloudflare Workers) **não estão no escopo**: exigiriam adaptação profunda (handler + abstração de armazenamento de arquivos para blob/S3), sem benefício proporcional face ao Docker já suportado.

Para **desenvolvimento local** (HMR, módulos em dev), use [DEV-DOCKER-LOCAL.md](../DEV-DOCKER-LOCAL.md) e `docker-compose.yml` (+ `docker-compose.dev.yml` para módulos).
