PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_recipes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`tags` text NOT NULL,
	`meta_description` text,
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
INSERT INTO `__new_recipes`("id", "title", "slug", "tags", "meta_description", "image", "rating", "views", "featured", "cook_time", "base_servings", "min_servings", "serving_increment", "directions", "created_at", "updated_at") SELECT "id", "title", "slug", "tags", "meta_description", "image", "rating", "views", "featured", "cook_time", "base_servings", "min_servings", "serving_increment", "directions", "created_at", "updated_at" FROM `recipes`;--> statement-breakpoint
DROP TABLE `recipes`;--> statement-breakpoint
ALTER TABLE `__new_recipes` RENAME TO `recipes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `recipes_id_unique` ON `recipes` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `recipes_slug_unique` ON `recipes` (`slug`);