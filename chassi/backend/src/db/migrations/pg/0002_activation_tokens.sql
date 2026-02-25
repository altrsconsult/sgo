-- Link de convite: token de ativação para usuário definir senha (admin copia o link, sem SMTP)
CREATE TABLE IF NOT EXISTS "user_activation_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"token" text NOT NULL UNIQUE,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now()
);

ALTER TABLE "user_activation_tokens" ADD CONSTRAINT "user_activation_tokens_user_id_users_id_fk" 
  FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
