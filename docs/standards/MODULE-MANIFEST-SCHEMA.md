# Module Manifest Schema

O `manifest.json` é o contrato de identidade de um módulo SGO.
É lido pelo chassi para registrar o módulo no banco e pelo Nexus para distribuição.

---

## Schema Completo

```typescript
interface ModuleManifest {
  // Identificador único, kebab-case, sem espaços (obrigatório)
  slug: string;
  
  // Nome legível exibido no menu e dashboard (obrigatório)
  name: string;
  
  // Descrição curta do módulo (opcional)
  description?: string;
  
  // Versão semântica (obrigatório)
  version: string;
  
  // Nome do ícone Lucide React (opcional, padrão: "Package")
  icon?: string;
  
  // Cor hex do módulo para UI (opcional, padrão: "#6366f1")
  color?: string;
  
  // Lista de permissões necessárias (opcional, para uso futuro)
  permissions?: string[];
  
  // Se o módulo expõe um Widget para o dashboard (opcional, padrão: false)
  hasWidget?: boolean;
  
  // Porta do servidor de desenvolvimento (opcional, padrão: 5001)
  serverPort?: number;
}
```

---

## Exemplo Mínimo

```json
{
  "slug": "tasks",
  "name": "Tarefas",
  "version": "1.0.0"
}
```

---

## Exemplo Completo

```json
{
  "slug": "crm-basico",
  "name": "CRM Básico",
  "description": "Gestão de contatos e oportunidades de vendas",
  "version": "2.1.0",
  "icon": "Users",
  "color": "#0ea5e9",
  "permissions": ["contacts:read", "contacts:write"],
  "hasWidget": true,
  "serverPort": 5002
}
```

---

## Regras de Validação (Zod)

```typescript
// packages/sdk/src/schemas.ts
const ModuleManifestSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  description: z.string().optional(),
  version: z.string().regex(/^\d+\.\d+\.\d+/),
  icon: z.string().optional().default('Package'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().default('#6366f1'),
  permissions: z.array(z.string()).optional().default([]),
  hasWidget: z.boolean().optional().default(false),
  serverPort: z.number().int().optional().default(5001),
});
```

---

## Migrations por Módulo

Módulos podem incluir migrations SQL para criar ou alterar tabelas no banco do chassi. O chassi aplica as migrations automaticamente ao instalar ou atualizar o módulo, e ao iniciar o servidor.

### Convenção de pastas no ZIP

```
meu-modulo.zip
  manifest.json
  dist/           ← assets do frontend
  server/         ← backend do módulo (opcional)
  migrations/
    pg/
      0001_create_leads.sql
      0002_add_status_column.sql
    mysql/
      0001_create_leads.sql
      0002_add_status_column.sql
```

- A pasta `migrations/pg/` contém SQL para PostgreSQL.
- A pasta `migrations/mysql/` contém SQL para MySQL.
- O chassi detecta o dialeto ativo e aplica apenas a pasta correspondente.
- Arquivos são aplicados em **ordem alfabética** (use prefixo numérico: `0001_`, `0002_`, etc.).

### Controle de migrations aplicadas

O chassi mantém a tabela `module_migrations` no banco:

| Coluna | Tipo | Descrição |
| ------ | ---- | --------- |
| `id` | int | PK auto-increment |
| `module_slug` | text | Slug do módulo |
| `migration_name` | text | Nome do arquivo SQL |
| `applied_at` | timestamp | Data de aplicação |

Migrations já registradas nessa tabela **não são reaplicadas**, garantindo idempotência.

### Exemplo de migration SQL

```sql
-- 0001_create_leads.sql
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW()
);
```

> **Atenção:** use `IF NOT EXISTS` e operações idempotentes sempre que possível. Evite `DROP TABLE` sem condição.

---

## Slugs Reservados

Os seguintes slugs estão reservados pelo chassi e não podem ser usados por módulos:

- `auth`
- `users`
- `groups`
- `settings`
- `nexus`
- `setup`
- `health`
- `public`
- `permissions`
- `storage`
- `tickets`
- `audit`
- `webhooks`
