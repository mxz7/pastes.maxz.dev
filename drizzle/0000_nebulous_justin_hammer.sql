CREATE TABLE `pastes` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`size` integer NOT NULL,
	`created_by_ip` text NOT NULL,
	`created_by_user_agent` text
);
