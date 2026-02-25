import {
  mysqlTable, mysqlEnum, int, text, boolean,
  timestamp, json, varchar, bigint, unique
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// Role enum — equivalente MySQL do pgEnum
export const userRoleEnum = mysqlEnum('user_role', ['admin', 'user']);

export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  role: mysqlEnum('role', ['admin', 'user']).notNull().default('user'),
  avatar: text('avatar'),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/** Tipo do usuário (contexto de auth) */
export type User = typeof users.$inferSelect;

/** Tokens de ativação (link de convite — admin copia e envia) */
export const userActivationTokens = mysqlTable('user_activation_tokens', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id').notNull(),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const modules = mysqlTable('modules', {
  id: int('id').autoincrement().primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  version: text('version'),
  path: text('path'),
  active: boolean('active').notNull().default(true),
  config: json('config'),
  icon: text('icon'),
  color: text('color'),
  sortOrder: int('sort_order').default(0),
  remoteEntry: text('remote_entry'),
  type: text('type').default('installed'), // 'installed' | 'dev'
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const userGroups = mysqlTable('user_groups', {
  id: int('id').autoincrement().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const userGroupMembers = mysqlTable('user_group_members', {
  id: int('id').autoincrement().primaryKey(),
  groupId: int('group_id').notNull().references(() => userGroups.id, { onDelete: 'cascade' }),
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => [unique().on(t.groupId, t.userId)]);

export const modulePermissions = mysqlTable('module_permissions', {
  id: int('id').autoincrement().primaryKey(),
  moduleId: int('module_id').notNull().references(() => modules.id, { onDelete: 'cascade' }),
  userId: int('user_id').references(() => users.id, { onDelete: 'cascade' }),
  groupId: int('group_id').references(() => userGroups.id, { onDelete: 'cascade' }),
  allowed: boolean('allowed').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const systemSettings = mysqlTable('system_settings', {
  id: int('id').autoincrement().primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value'),
  category: text('category'),
  description: text('description'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const moduleConfig = mysqlTable('module_config', {
  id: int('id').autoincrement().primaryKey(),
  moduleId: int('module_id').notNull().references(() => modules.id, { onDelete: 'cascade' }),
  key: text('key').notNull(),
  value: text('value'),
  type: text('type').default('string'), // string | number | boolean | json
  updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => [unique().on(t.moduleId, t.key)]);

export const moduleData = mysqlTable('module_data', {
  id: int('id').autoincrement().primaryKey(),
  moduleId: int('module_id').notNull().references(() => modules.id, { onDelete: 'cascade' }),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id'),
  data: json('data'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const nexusInstallations = mysqlTable('nexus_installations', {
  id: int('id').autoincrement().primaryKey(),
  installationId: text('installation_id').notNull().unique(),
  masterKeyHash: text('master_key_hash'),
  version: text('version'),
  url: text('url'),
  hostname: text('hostname'),
  lastPulseAt: timestamp('last_pulse_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// UUID gerado na aplicação (MySQL não tem gen_random_uuid() nativo)
export const storageFiles = mysqlTable('storage_files', {
  id: varchar('id', { length: 36 }).$defaultFn(() => crypto.randomUUID()).primaryKey(),
  ownerType: text('owner_type'),
  ownerId: text('owner_id'),
  originalName: text('original_name').notNull(),
  storedName: text('stored_name').notNull(),
  mimeType: text('mime_type'),
  sizeBytes: bigint('size_bytes', { mode: 'number' }),
  sha256: text('sha256'),
  storagePath: text('storage_path').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  expiresAt: timestamp('expires_at'),
  deletedAt: timestamp('deleted_at'),
});

export const tickets = mysqlTable('tickets', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id').references(() => users.id),
  subject: text('subject').notNull(),
  description: text('description'),
  status: text('status').default('open'),    // open | in_progress | closed
  priority: text('priority').default('normal'), // low | normal | high
  lastResponse: text('last_response'),
  lastResponseAt: timestamp('last_response_at'),
  lastResponseByUserId: int('last_response_by_user_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const ticketMessages = mysqlTable('ticket_messages', {
  id: int('id').autoincrement().primaryKey(),
  ticketId: int('ticket_id').notNull().references(() => tickets.id, { onDelete: 'cascade' }),
  userId: int('user_id').references(() => users.id),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const ticketsRelations = relations(tickets, ({ many }) => ({
  messages: many(ticketMessages),
}));

export const ticketMessagesRelations = relations(ticketMessages, ({ one }) => ({
  ticket: one(tickets, { fields: [ticketMessages.ticketId], references: [tickets.id] }),
}));

// UUID gerado na aplicação para webhookDefinitions
export const webhookDefinitions = mysqlTable('webhook_definitions', {
  id: varchar('id', { length: 36 }).$defaultFn(() => crypto.randomUUID()).primaryKey(),
  moduleId: int('module_id').references(() => modules.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  url: text('url').notNull(),
  secret: text('secret'),
  events: json('events').$type<string[]>().default([]),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const webhookLogs = mysqlTable('webhook_logs', {
  id: int('id').autoincrement().primaryKey(),
  webhookId: varchar('webhook_id', { length: 36 }).references(() => webhookDefinitions.id, { onDelete: 'cascade' }),
  event: text('event'),
  payload: json('payload'),
  responseStatus: int('response_status'),
  responseBody: text('response_body'),
  success: boolean('success'),
  durationMs: int('duration_ms'),
  error: text('error'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const auditLogs = mysqlTable('audit_logs', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id'),
  userName: text('user_name'),
  action: text('action').notNull(),
  entityType: text('entity_type'),
  entityId: text('entity_id'),
  details: json('details'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Tabela de controle de migrations por módulo
export const moduleMigrations = mysqlTable('module_migrations', {
  id: int('id').autoincrement().primaryKey(),
  moduleSlug: text('module_slug').notNull(),
  migrationName: text('migration_name').notNull(),
  appliedAt: timestamp('applied_at').defaultNow(),
});
