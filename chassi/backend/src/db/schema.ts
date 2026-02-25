import {
  pgTable, pgEnum, serial, text, integer, boolean,
  timestamp, jsonb, uuid, bigint, unique
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Role enum — SEM superadmin no chassi (superadmin apenas no Nexus)
export const userRoleEnum = pgEnum('user_role', ['admin', 'user']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  role: userRoleEnum('role').notNull().default('user'),
  avatar: text('avatar'),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/** Tipo do usuário (contexto de auth) */
export type User = typeof users.$inferSelect;

export const modules = pgTable('modules', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  version: text('version'),
  path: text('path'),
  active: boolean('active').notNull().default(true),
  config: jsonb('config'),
  icon: text('icon'),
  color: text('color'),
  sortOrder: integer('sort_order').default(0),
  remoteEntry: text('remote_entry'),
  type: text('type').default('installed'), // 'installed' | 'dev'
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const userGroups = pgTable('user_groups', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const userGroupMembers = pgTable('user_group_members', {
  id: serial('id').primaryKey(),
  groupId: integer('group_id').notNull().references(() => userGroups.id, { onDelete: 'cascade' }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => [unique().on(t.groupId, t.userId)]);

export const modulePermissions = pgTable('module_permissions', {
  id: serial('id').primaryKey(),
  moduleId: integer('module_id').notNull().references(() => modules.id, { onDelete: 'cascade' }),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  groupId: integer('group_id').references(() => userGroups.id, { onDelete: 'cascade' }),
  allowed: boolean('allowed').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const systemSettings = pgTable('system_settings', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value'),
  category: text('category'),
  description: text('description'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const moduleConfig = pgTable('module_config', {
  id: serial('id').primaryKey(),
  moduleId: integer('module_id').notNull().references(() => modules.id, { onDelete: 'cascade' }),
  key: text('key').notNull(),
  value: text('value'),
  type: text('type').default('string'), // string | number | boolean | json
  updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => [unique().on(t.moduleId, t.key)]);

export const moduleData = pgTable('module_data', {
  id: serial('id').primaryKey(),
  moduleId: integer('module_id').notNull().references(() => modules.id, { onDelete: 'cascade' }),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id'),
  data: jsonb('data'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const nexusInstallations = pgTable('nexus_installations', {
  id: serial('id').primaryKey(),
  installationId: text('installation_id').notNull().unique(),
  masterKeyHash: text('master_key_hash'),
  version: text('version'),
  url: text('url'),
  hostname: text('hostname'),
  lastPulseAt: timestamp('last_pulse_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const storageFiles = pgTable('storage_files', {
  id: uuid('id').defaultRandom().primaryKey(),
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

export const tickets = pgTable('tickets', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  subject: text('subject').notNull(),
  description: text('description'),
  status: text('status').default('open'),    // open | in_progress | closed
  priority: text('priority').default('normal'), // low | normal | high
  lastResponse: text('last_response'),
  lastResponseAt: timestamp('last_response_at'),
  lastResponseByUserId: integer('last_response_by_user_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const ticketMessages = pgTable('ticket_messages', {
  id: serial('id').primaryKey(),
  ticketId: integer('ticket_id').notNull().references(() => tickets.id, { onDelete: 'cascade' }),
  userId: integer('user_id').references(() => users.id),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const ticketsRelations = relations(tickets, ({ many }) => ({
  messages: many(ticketMessages),
}));

export const ticketMessagesRelations = relations(ticketMessages, ({ one }) => ({
  ticket: one(tickets, { fields: [ticketMessages.ticketId], references: [tickets.id] }),
}));

export const webhookDefinitions = pgTable('webhook_definitions', {
  id: uuid('id').defaultRandom().primaryKey(),
  moduleId: integer('module_id').references(() => modules.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  url: text('url').notNull(),
  secret: text('secret'),
  events: jsonb('events').$type<string[]>().default([]),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const webhookLogs = pgTable('webhook_logs', {
  id: serial('id').primaryKey(),
  webhookId: uuid('webhook_id').references(() => webhookDefinitions.id, { onDelete: 'cascade' }),
  event: text('event'),
  payload: jsonb('payload'),
  responseStatus: integer('response_status'),
  responseBody: text('response_body'),
  success: boolean('success'),
  durationMs: integer('duration_ms'),
  error: text('error'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id'),
  userName: text('user_name'),
  action: text('action').notNull(),
  entityType: text('entity_type'),
  entityId: text('entity_id'),
  details: jsonb('details'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Tabela de controle de migrations por módulo
export const moduleMigrations = pgTable('module_migrations', {
  id: serial('id').primaryKey(),
  moduleSlug: text('module_slug').notNull(),
  migrationName: text('migration_name').notNull(),
  appliedAt: timestamp('applied_at').defaultNow(),
});
