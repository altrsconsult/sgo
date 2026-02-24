// Roles do chassi — superadmin NÃO existe no chassi, apenas no Nexus
export type UserRole = 'admin' | 'user'

export interface User {
  id: number
  username: string
  name: string
  email: string
  role: UserRole
  avatar: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface Module {
  id: number
  slug: string
  name: string
  description: string
  version: string
  path: string
  active: boolean
  icon: string
  color: string
  sortOrder: number
  remoteEntry: string | null
  type: 'installed' | 'dev'
  createdAt: string
}

export interface ModuleManifest {
  slug: string
  name: string
  title: string
  version: string
  description: string
  icon: string          // nome do ícone Lucide
  color: string         // hex color, ex: "#f59e0b"
  author: string
  webhooks: string[]
  permissions: string[]
  config: Record<string, unknown>
}

// Contexto passado ao backend de cada módulo
export interface ModuleContext {
  db: unknown           // instância Drizzle (tipagem específica no backend)
  moduleSlug: string
  uploadsPath: string
  modulesStoragePath: string
}

export interface SystemSetting {
  key: string
  value: string
  category: string
  description: string
}

export interface Permission {
  id: number
  moduleId: number
  userId: number | null
  groupId: number | null
  allowed: boolean
}
