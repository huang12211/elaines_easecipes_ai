import { sqliteTable, text, integer, real, primaryKey } from 'drizzle-orm/sqlite-core';

// Recipes table
export const recipes = sqliteTable('recipes', {
  id: integer('id').primaryKey({ autoIncrement: true }).notNull().unique(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  tags: text('tags').notNull(),
  metaDescription: text('meta_description'),
  image: text('image').notNull(),
  rating: real('rating').notNull().default(0),
  views: integer('views').notNull().default(0),
  featured: integer('featured', { mode: 'boolean' }).default(false),
  cookTime: text('cook_time').notNull().default("30 mins"),
  baseServings: integer('base_servings').notNull().default(4),
  minServings: integer('min_servings').notNull().default(1),
  servingIncrement: integer('serving_increment').notNull().default(1),
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

// Ingredients table, we will list out all the unique ingredients used across all recipes
export const ingredients = sqliteTable('ingredients', {
  ingr: text('ingr').primaryKey(),
});

export type Ingredients = typeof recipes.$inferSelect
export type InsertIngredient = typeof recipes.$inferInsert

// Measurement Units table, we will list out all the unique measurement units used across all recipes, such as "cup", "tsp", "g", etc.
export const measurementUnits = sqliteTable('mesurementUnits', {
  meas_unit: text('meas_units').primaryKey(),
});

export type MeasurementUnits = typeof measurementUnits.$inferSelect
export type InsertMeasurement = typeof measurementUnits.$inferInsert

//We also want a table to list out all the ingredients used in each recipe
export const recipe_ingredient_measUnit = sqliteTable('recipe_ingredient_measUnit', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  recipe_id: text('recipe_id').references(() => recipes.slug), 
  component: text('component'),
  amount: text('amount'),
  measUnit_id: text('measUnit_id').references(() => measurementUnits.meas_unit), 
  ingredient_id: text('ingredient_id').references(() => ingredients.ingr),
  min_amount: text('min_amount'),
});

// Users table for authentication
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// Personalized to the User Features Requiring Database Storage //
// Recipes Bookmarked by Each User
export const userBookmarks = sqliteTable('user_bookmarks', {
  userId: integer('user_id').notNull().references(() => users.id),
  recipeSlug: text('recipe_slug').notNull().references(() => recipes.slug),
}, (t) => [primaryKey({ columns: [t.userId, t.recipeSlug] })]);

export type UserBookmark = typeof userBookmarks.$inferSelect;