CREATE TABLE `audit_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`user_name` text,
	`action` text NOT NULL,
	`entity_type` text,
	`entity_id` text,
	`details` json,
	`ip_address` text,
	`user_agent` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `module_config` (
	`id` int AUTO_INCREMENT NOT NULL,
	`module_id` int NOT NULL,
	`key` text NOT NULL,
	`value` text,
	`type` text DEFAULT ('string'),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `module_config_id` PRIMARY KEY(`id`),
	CONSTRAINT `module_config_module_id_key_unique` UNIQUE(`module_id`,`key`)
);
--> statement-breakpoint
CREATE TABLE `module_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`module_id` int NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text,
	`data` json,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `module_data_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `module_migrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`module_slug` text NOT NULL,
	`migration_name` text NOT NULL,
	`applied_at` timestamp DEFAULT (now()),
	CONSTRAINT `module_migrations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `module_permissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`module_id` int NOT NULL,
	`user_id` int,
	`group_id` int,
	`allowed` boolean NOT NULL DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `module_permissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `modules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`version` text,
	`path` text,
	`active` boolean NOT NULL DEFAULT true,
	`config` json,
	`icon` text,
	`color` text,
	`sort_order` int DEFAULT 0,
	`remote_entry` text,
	`type` text DEFAULT ('installed'),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `modules_id` PRIMARY KEY(`id`),
	CONSTRAINT `modules_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `nexus_installations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`installation_id` text NOT NULL,
	`master_key_hash` text,
	`version` text,
	`url` text,
	`hostname` text,
	`last_pulse_at` timestamp,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `nexus_installations_id` PRIMARY KEY(`id`),
	CONSTRAINT `nexus_installations_installation_id_unique` UNIQUE(`installation_id`)
);
--> statement-breakpoint
CREATE TABLE `storage_files` (
	`id` varchar(36) NOT NULL,
	`owner_type` text,
	`owner_id` text,
	`original_name` text NOT NULL,
	`stored_name` text NOT NULL,
	`mime_type` text,
	`size_bytes` bigint,
	`sha256` text,
	`storage_path` text NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`expires_at` timestamp,
	`deleted_at` timestamp,
	CONSTRAINT `storage_files_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `system_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` text NOT NULL,
	`value` text,
	`category` text,
	`description` text,
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `system_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `system_settings_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `ticket_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ticket_id` int NOT NULL,
	`user_id` int,
	`message` text NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `ticket_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`subject` text NOT NULL,
	`description` text,
	`status` text DEFAULT ('open'),
	`priority` text DEFAULT ('normal'),
	`last_response` text,
	`last_response_at` timestamp,
	`last_response_by_user_id` int,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `tickets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_group_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`group_id` int NOT NULL,
	`user_id` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `user_group_members_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_group_members_group_id_user_id_unique` UNIQUE(`group_id`,`user_id`)
);
--> statement-breakpoint
CREATE TABLE `user_groups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `user_groups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`role` enum('admin','user') NOT NULL DEFAULT 'user',
	`avatar` text,
	`active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `webhook_definitions` (
	`id` varchar(36) NOT NULL,
	`module_id` int,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`secret` text,
	`events` json DEFAULT ('[]'),
	`active` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `webhook_definitions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `webhook_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`webhook_id` varchar(36),
	`event` text,
	`payload` json,
	`response_status` int,
	`response_body` text,
	`success` boolean,
	`duration_ms` int,
	`error` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `webhook_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `module_config` ADD CONSTRAINT `module_config_module_id_modules_id_fk` FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `module_data` ADD CONSTRAINT `module_data_module_id_modules_id_fk` FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `module_permissions` ADD CONSTRAINT `module_permissions_module_id_modules_id_fk` FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `module_permissions` ADD CONSTRAINT `module_permissions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `module_permissions` ADD CONSTRAINT `module_permissions_group_id_user_groups_id_fk` FOREIGN KEY (`group_id`) REFERENCES `user_groups`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ticket_messages` ADD CONSTRAINT `ticket_messages_ticket_id_tickets_id_fk` FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ticket_messages` ADD CONSTRAINT `ticket_messages_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_group_members` ADD CONSTRAINT `user_group_members_group_id_user_groups_id_fk` FOREIGN KEY (`group_id`) REFERENCES `user_groups`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_group_members` ADD CONSTRAINT `user_group_members_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `webhook_definitions` ADD CONSTRAINT `webhook_definitions_module_id_modules_id_fk` FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `webhook_logs` ADD CONSTRAINT `webhook_logs_webhook_id_webhook_definitions_id_fk` FOREIGN KEY (`webhook_id`) REFERENCES `webhook_definitions`(`id`) ON DELETE cascade ON UPDATE no action;