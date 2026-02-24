# System Overview — Arquitetura SGO

## Diagrama de Alto Nível

```
┌─────────────────────────────────────────────────────────────────┐
│  Stack Nexus (1x por técnico/provedor)                          │
│  ┌──────────────────┐  ┌──────────────────────────────────────┐ │
│  │  nexus-frontend  │  │  nexus-backend (superadmin)          │ │
│  │  React/Nginx     │  │  Hono + PostgreSQL                   │ │
│  └──────────────────┘  └──────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
              │ M2M: X-SGO-MASTER-KEY              │
              ▼                                    ▼
┌─────────────────────────┐     ┌─────────────────────────────┐
│  Stack Chassi — Cliente A│     │  Stack Chassi — Cliente B   │
│  ┌──────────────────┐   │     │  ┌──────────────────┐       │
│  │ chassi-frontend  │   │     │  │ chassi-frontend  │       │
│  │ Nginx/React      │   │     │  │ (whitelabel B)   │       │
│  └──────────────────┘   │     │  └──────────────────┘       │
│  ┌──────────────────┐   │     │  ┌──────────────────┐       │
│  │ chassi-backend   │◄──┼─────┼──│ chassi-backend   │       │
│  │ Hono + Drizzle   │   │     │  │ (admin+user only)│       │
│  └──────────────────┘   │     │  └──────────────────┘       │
│  ┌──────────────────┐   │     │  ┌──────────────────┐       │
│  │ PostgreSQL Alpine│   │     │  │ PostgreSQL Alpine│       │
│  └──────────────────┘   │     │  └──────────────────┘       │
└─────────────────────────┘     └─────────────────────────────┘
```

## Ciclo de Vida de uma Requisição

1. **Browser** acessa `https://cliente-a.com`
2. **Traefik** roteia:
   - `/api/*` → `chassi-backend:3001`
   - `/*` → `chassi-frontend:80` (Nginx)
3. **Nginx** serve `index.html` (SPA)
4. **React** carrega, chama `/api/public/settings` (whitelabel)
5. **React** chama `/api/auth/verify` para checar sessão
6. **React** chama `/api/modules` para listar módulos ativos
7. **Module Federation** carrega `remoteEntry.js` de cada módulo instalado

## Banco de Dados

15 tabelas no PostgreSQL:

| Tabela | Descrição |
|--------|-----------|
| `users` | Usuários (admin/user) |
| `modules` | Módulos instalados + dev |
| `user_groups` | Grupos de usuários |
| `user_group_members` | Membros de grupos |
| `module_permissions` | Permissões usuário×módulo |
| `system_settings` | Configurações do sistema (whitelabel, etc) |
| `module_config` | Configurações específicas por módulo |
| `module_data` | Dados genéricos armazenados por módulos |
| `nexus_installations` | Registro da conexão com Nexus |
| `storage_files` | Metadados de arquivos enviados |
| `tickets` | Tickets de suporte |
| `ticket_messages` | Mensagens de tickets |
| `webhook_definitions` | Webhooks configurados |
| `webhook_logs` | Histórico de disparos de webhooks |
| `audit_logs` | Log de auditoria de ações |

## Segmentação de Responsabilidade

| Serviço | Responsabilidade |
|---------|-----------------|
| `chassi-frontend` | UI React, zero lógica de negócio, apenas renderização |
| `chassi-backend` | API REST, autenticação JWT, gestão de módulos |
| `chassi-db` | Persistência de dados (PostgreSQL) |
| Nexus backend | Gestão central, provisionamento M2M, painel multi-instância |

## Whitelabel

Cada instância de chassi pode ter branding próprio via `system_settings`:

| Chave | Exemplo |
|-------|---------|
| `app.name` | "CRM da Empresa X" |
| `app.logo_url` | URL do logo modo claro |
| `app.logo_dark_url` | URL do logo modo escuro |
| `app.primary_color` | `#e11d48` |
| `app.favicon_url` | URL do favicon |
| `app.custom_css` | CSS injetado no `<head>` |

O frontend busca `/api/public/settings` na inicialização (sem auth) e aplica dinamicamente.
