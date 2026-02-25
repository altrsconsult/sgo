# Deploy SGO — Node.js (Hostinger e similares)

Guia rápido para instalar o SGO em hospedagens Node.js gerenciadas (Hostinger Web App, Railway, Render, etc.).

---

## Pré-requisitos

- Banco de dados **MySQL** ou **PostgreSQL** externo (a Hostinger inclui MySQL no plano)
- Acesso ao painel da hospedagem para configurar variáveis de ambiente

---

## Passo a passo

### 1. Faça upload do ZIP

No painel da Hostinger:

- **Hospedagem de Aplicações Web** → **Criar aplicação**
- Escolha **Upload de arquivo ZIP** e envie o arquivo `sgo-node-vX.X.X.zip`

Ou conecte o repositório GitHub e defina:

- **Build command:** `pnpm build:node`
- **Start command:** `node dist/index.js`

---

### 2. Configure as variáveis de ambiente

No painel da hospedagem, adicione as seguintes variáveis:

| Variável | Obrigatória | Exemplo |
| -------- | ----------- | ------- |
| `DATABASE_URL` | Sim | `mysql://usuario:senha@host:3306/banco` |
| `JWT_SECRET` | Sim | string longa e aleatória |
| `SERVE_STATIC` | Sim | `true` |
| `NODE_ENV` | Sim | `production` |
| `PORT` | Não | `3000` (a Hostinger define automaticamente) |
| `STATIC_PATH` | Não | `./public` (padrão) |
| `NEXUS_URL` | Não | URL do Nexus Central (modo gerenciado) |
| `CHASSIS_URL` | Não | URL pública da sua instalação |

> **MySQL (Hostinger):** use a URL de conexão fornecida no painel do banco de dados.
> **Postgres externo:** substitua o prefixo por `postgresql://`.

---

### 3. Defina o comando de start

```
node dist/index.js
```

O backend roda as migrations automaticamente na inicialização e depois sobe o servidor.

---

### 4. Primeiro acesso

1. Acesse a URL fornecida pela hospedagem
2. O sistema redireciona para `/setup` no primeiro acesso
3. Crie o usuário administrador e defina o nome da aplicação
4. Pronto — o SGO está instalado

---

## Estrutura do ZIP

```
sgo-node-vX.X.X.zip
  dist/           ← backend compilado (Node.js)
  public/         ← frontend React buildado (servido como estático)
  sdk/            ← SDK interno (@sgo/sdk)
  node_modules/   ← dependências de produção (já instaladas)
  package.json
  .env.example    ← referência de variáveis
  README.md       ← este arquivo
```

---

## Atualizações

Para atualizar para uma nova versão:

1. Baixe o novo ZIP do [GitHub Releases](https://github.com/altrsconsult/sgo/releases)
2. Faça upload no painel da hospedagem (substitui os arquivos anteriores)
3. As migrations novas são aplicadas automaticamente na próxima inicialização

---

## Suporte a módulos

Módulos instalados ficam na pasta `modules_storage/`. Configure um **volume persistente** ou armazenamento externo se a hospedagem reiniciar a aplicação periodicamente — caso contrário os módulos precisarão ser reinstalados.
