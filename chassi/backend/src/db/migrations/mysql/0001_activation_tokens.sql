-- Link de convite: token de ativação (admin copia o link, sem SMTP)
CREATE TABLE IF NOT EXISTS `user_activation_tokens` (
  `id` int AUTO_INCREMENT NOT NULL PRIMARY KEY,
  `user_id` int NOT NULL,
  `token` text NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp DEFAULT (now()),
  UNIQUE KEY `token_unique` (`token`(64)),
  CONSTRAINT `user_activation_tokens_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
