CREATE TABLE "module_migrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"module_slug" text NOT NULL,
	"migration_name" text NOT NULL,
	"applied_at" timestamp DEFAULT now()
);
