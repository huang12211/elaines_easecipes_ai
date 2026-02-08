import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const recipes = sqliteTable('recipes', {
  id: integer('id').primaryKey({ autoIncrement: true }).notNull().unique(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  tags: text('tags').notNull(),
  image: text('image').notNull(),
  rating: real('rating').notNull().default(0),
  views: integer('views').notNull().default(0),
  bookmarked: integer('bookmarked', { mode: 'boolean' }).default(false),
  featured: integer('featured', { mode: 'boolean' }).default(false),
  cookTime: integer('cook_time').notNull().default(30),
  servings: integer('servings').notNull().default(4),
  ingredients: text('ingredients').notNull().default('[]'),
  directions: text('directions').notNull().default('[]'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type Recipe = typeof recipes.$inferSelect;
export type NewRecipe = typeof recipes.$inferInsert;
