CREATE TABLE `ingredients` (
	`ingr` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `mesurementUnits` (
	`meas_units` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `recipe_ingredient_measUnit` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`recipe_id` text,
	`component` text,
	`amount` text,
	`measUnit_id` text,
	`ingredient_id` text,
	`min_amount` text,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`slug`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`measUnit_id`) REFERENCES `mesurementUnits`(`meas_units`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients`(`ingr`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `recipes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`tags` text NOT NULL,
	`meta_description` text,
	`description` text,
	`image` text NOT NULL,
	`rating` real DEFAULT 0 NOT NULL,
	`views` integer DEFAULT 0 NOT NULL,
	`featured` integer DEFAULT false,
	`cook_time` text DEFAULT '30 mins' NOT NULL,
	`base_servings` integer DEFAULT 4 NOT NULL,
	`min_servings` integer DEFAULT 1 NOT NULL,
	`serving_increment` integer DEFAULT 1 NOT NULL,
	`directions` text DEFAULT '[]' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `recipes_id_unique` ON `recipes` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `recipes_slug_unique` ON `recipes` (`slug`);--> statement-breakpoint
CREATE TABLE `user_bookmarks` (
	`user_id` integer NOT NULL,
	`recipe_slug` text NOT NULL,
	PRIMARY KEY(`user_id`, `recipe_slug`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`recipe_slug`) REFERENCES `recipes`(`slug`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);