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

As **stacks** (stack.yml, stack2.yml, stack-postgres-shared.yml, stack-chassi-only.yml) e o exemplo de variáveis (**stack-env.example.txt**) ficam na **raiz** do repositório (não em `deploy/`).

| Cenário | Arquivo | Observação |
| ------- | ------- | ---------- |
| **VPS / Coolify / terminal** (uma porta) | `docker-compose.prod.yml` + `docker-compose.yml` | Uma porta (80); Nginx no frontend faz proxy para o backend. |
| **Portainer com Traefik** (versão única) | `stack.yml` | 1 stack = 1 Postgres + 1 chassi; rede por variável; variáveis em `stack-env.example.txt` (raiz). |
| **Portainer com Traefik** (Postgres compartilhado) | `stack-postgres-shared.yml` + `stack-chassi-only.yml` | 1 Postgres com N bancos; N stacks só de chassi (um por cliente); ver [Dois modelos de deploy (Portainer)](#dois-modelos-de-deploy-portainer). |
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

- Rede interna do cliente já criada (ex.: `docker network create --driver overlay altrs_net`). O nome é configurável por variável.
- Traefik na mesma rede, com entrypoints `web` (80) e `websecure` (443) e certresolver (ex.: `letsencryptresolver`).

No Portainer:

1. **Stacks** → **Add stack**
2. Cole o conteúdo de [stack.yml](../../stack.yml) (ou importe o arquivo).
3. Defina as variáveis de ambiente. Use como base [stack-env.example.txt](../../stack-env.example.txt) (raiz do repo); para valores reais (não comitados), use `stack-env.txt` na raiz.
   - Obrigatórias: `SGO_NETWORK` (nome da rede overlay do cliente), `SGO_DOMAIN`, `SGO_JWT_SECRET`, `SGO_POSTGRES_PASSWORD`.
   - Opcionais: `SGO_IMAGE_TAG` (ex.: `latest` ou `v4.0.0`), `SGO_STACK_NAME`, `SGO_NEXUS_URL`, `SGO_TLS_RESOLVER`.
4. Deploy. Acesse `https://<SGO_DOMAIN>`; no primeiro acesso, conclua o wizard.

**Imagens:** vêm do GitHub Container Registry (`ghcr.io/altrsconsult/chassi-backend`, `chassi-frontend`). Para publicar uma nova versão, crie uma tag no Git (ex.: `v4.0.0`); o workflow [release-chassi.yml](../../.github/workflows/release-chassi.yml) faz o build e push com essa tag e `latest`.

#### Dois modelos de deploy (Portainer)

- **Versão única (`stack.yml`):** cada instalação = uma stack com Postgres + backend + frontend. Três clientes = três stacks = três Postgres (sem conflito; isolamento total). Ideal quando cada cliente pode ter seu próprio banco.
- **Postgres compartilhado:** um único Postgres para todas as instalações SGO do técnico, com um banco por cliente. Deploy **uma vez** de [stack-postgres-shared.yml](../../stack-postgres-shared.yml) (ex.: nome da stack `sgo-pg`), criar os bancos (ex.: `CREATE DATABASE sgo_cliente_a;`) e **por cliente** deploy de [stack-chassi-only.yml](../../stack-chassi-only.yml) com `SGO_DATABASE_URL=postgresql://sgo:senha@sgo-pg_postgres:5432/sgo_cliente_a`. No Swarm o hostname do serviço de outra stack é `<nome_da_stack>_<nome_do_servico>`. Variáveis para os dois cenários em [stack-env.example.txt](../../stack-env.example.txt) (raiz).

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
| `SGO_ADMIN_USERNAME` | Não (recomendado instalação limpa) | Usuário do primeiro admin; na primeira subida sem admins, cria esse usuário | `admin` |
| `SGO_ADMIN_PASSWORD` | Não (recomendado com USERNAME) | Senha do primeiro admin | senha forte |
| `SGO_ADMIN_EMAIL` | Não | E-mail do admin | `admin@empresa.com` |
| `SGO_ADMIN_NAME` | Não | Nome do admin | `Administrador` |

Referência completa com comentários: [.env.example](../../.env.example) na raiz do repositório.

---

## Primeiro acesso e instalação

### Instalação limpa (recomendado): admin por variáveis de ambiente

Se for uma **instalação do zero** (sem dados a preservar), defina o admin nas variáveis da stack antes do primeiro deploy:

| Variável | Obrigatória | Uso |
| -------- | ----------- | --- |
| `SGO_ADMIN_USERNAME` | Sim* | Usuário do primeiro admin |
| `SGO_ADMIN_PASSWORD` | Sim* | Senha do primeiro admin |
| `SGO_ADMIN_EMAIL` | Não | E-mail (default: `{username}@example.com`) |
| `SGO_ADMIN_NAME` | Não | Nome (default: Administrador) |

\* Se ambas estiverem definidas, o backend cria esse admin na **primeira subida** (quando ainda não existe nenhum admin no banco). Não é necessário passar pelo wizard; acesse a URL e faça login com esse usuário e senha.

Exemplo no Portainer (stack): adicione `SGO_ADMIN_USERNAME` e `SGO_ADMIN_PASSWORD` junto com `SGO_JWT_SECRET`, `SGO_POSTGRES_PASSWORD`, etc. A credencial fica documentada na própria stack.

### Alternativa: wizard de setup

Se **não** definir `SGO_ADMIN_*`, após subir os containers:

1. Acesse `https://<dominio>` (com Traefik) ou `http://<ip>:80` (compose uma porta).
2. O frontend redireciona para a tela de **setup** (`/setup`).
3. O wizard usa `GET /api/setup/status` e `POST /api/setup/install` para criar o primeiro admin manualmente.
4. Preencha usuário, senha, e-mail e nome da aplicação (opcional).

**Modo standalone** (padrão): `NEXUS_URL` vazio. **Modo gerenciado:** defina `NEXUS_URL` e o chassi se registra no Nexus.

---

## Credenciais do admin e reset de senha

- **Onde ficam:** usuário e senha (hash bcrypt) ficam na tabela `users` do banco. O primeiro admin pode ser criado por: **(1)** variáveis de ambiente (`SGO_ADMIN_USERNAME` + `SGO_ADMIN_PASSWORD`) na primeira subida; **(2)** wizard (`POST /api/setup/install`); ou **(3)** em desenvolvimento, pelo seed (`admin` / `admin123`) quando não existe admin.
- **Instalação limpa:** defina `SGO_ADMIN_*` na stack e o admin é criado no primeiro start; a credencial fica nas env. Se a senha foi perdida ou o login não funciona (ex.: JWT_SECRET mudou e o token antigo invalida), use o **reset por segredo**:

### Reset de senha do admin (ambiente online)

1. No Portainer (ou onde as variáveis do backend estão), adicione temporariamente:
   ```env
   SGO_RESET_ADMIN_SECRET=uma_string_secreta_forte_que_voce_escolher
   ```
2. Reinicie o container do backend para carregar a variável.
3. Chame a API (Postman, curl ou no navegador via console):
   ```bash
   curl -X POST https://<seu-dominio>/api/setup/reset-admin-password \
     -H "Content-Type: application/json" \
     -d '{"secret":"uma_string_secreta_forte_que_voce_escolher","newPassword":"SuaNovaSenha123"}'
   ```
   Se tiver mais de um admin e quiser alterar um em específico:
   ```json
   {"secret":"...","newPassword":"...","username":"admin"}
   ```
4. Remova a variável `SGO_RESET_ADMIN_SECRET` das env do backend e reinicie de novo (recomendado por segurança).
5. Entre com o usuário admin e a nova senha.

| Variável | Uso |
| -------- | --- |
| `SGO_RESET_ADMIN_SECRET` | Quando definida, habilita `POST /api/setup/reset-admin-password`. Use só para reset; depois remova. |

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
