CREATE TYPE "public"."user_role" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"user_name" text,
	"action" text NOT NULL,
	"entity_type" text,
	"entity_id" text,
	"details" jsonb,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "module_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"module_id" integer NOT NULL,
	"key" text NOT NULL,
	"value" text,
	"type" text DEFAULT 'string',
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "module_config_module_id_key_unique" UNIQUE("module_id","key")
);
--> statement-breakpoint
CREATE TABLE "module_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"module_id" integer NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text,
	"data" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "module_permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"module_id" integer NOT NULL,
	"user_id" integer,
	"group_id" integer,
	"allowed" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "modules" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"version" text,
	"path" text,
	"active" boolean DEFAULT true NOT NULL,
	"config" jsonb,
	"icon" text,
	"color" text,
	"sort_order" integer DEFAULT 0,
	"remote_entry" text,
	"type" text DEFAULT 'installed',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "modules_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "nexus_installations" (
	"id" serial PRIMARY KEY NOT NULL,
	"installation_id" text NOT NULL,
	"master_key_hash" text,
	"version" text,
	"url" text,
	"hostname" text,
	"last_pulse_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "nexus_installations_installation_id_unique" UNIQUE("installation_id")
);
--> statement-breakpoint
CREATE TABLE "storage_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_type" text,
	"owner_id" text,
	"original_name" text NOT NULL,
	"stored_name" text NOT NULL,
	"mime_type" text,
	"size_bytes" bigint,
	"sha256" text,
	"storage_path" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "system_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"value" text,
	"category" text,
	"description" text,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "system_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "ticket_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"ticket_id" integer NOT NULL,
	"user_id" integer,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"subject" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'open',
	"priority" text DEFAULT 'normal',
	"last_response" text,
	"last_response_at" timestamp,
	"last_response_by_user_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_group_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "user_group_members_group_id_user_id_unique" UNIQUE("group_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "user_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"avatar" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "webhook_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_id" integer,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"secret" text,
	"events" jsonb DEFAULT '[]'::jsonb,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "webhook_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"webhook_id" uuid,
	"event" text,
	"payload" jsonb,
	"response_status" integer,
	"response_body" text,
	"success" boolean,
	"duration_ms" integer,
	"error" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "module_config" ADD CONSTRAINT "module_config_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "module_data" ADD CONSTRAINT "module_data_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "module_permissions" ADD CONSTRAINT "module_permissions_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "module_permissions" ADD CONSTRAINT "module_permissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "module_permissions" ADD CONSTRAINT "module_permissions_group_id_user_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."user_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_messages" ADD CONSTRAINT "ticket_messages_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_messages" ADD CONSTRAINT "ticket_messages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_group_members" ADD CONSTRAINT "user_group_members_group_id_user_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."user_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_group_members" ADD CONSTRAINT "user_group_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webhook_definitions" ADD CONSTRAINT "webhook_definitions_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webhook_logs" ADD CONSTRAINT "webhook_logs_webhook_id_webhook_definitions_id_fk" FOREIGN KEY ("webhook_id") REFERENCES "public"."webhook_definitions"("id") ON DELETE cascade ON UPDATE no action;