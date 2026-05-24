CREATE TABLE `recipe_embeddings` (
	`recipe_slug` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`embedding` text NOT NULL,
	FOREIGN KEY (`recipe_slug`) REFERENCES `recipes`(`slug`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `recipes` DROP COLUMN `description`;