import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { recipes, recipe_ingredient_measUnit } from '@/lib/db/schema';
import { like, eq, or, and, inArray } from 'drizzle-orm';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keywords = searchParams.get('keywords');
  const category = searchParams.get('category');
  const recipeNumber = searchParams.get('recipeNumber');
  const ingredients = searchParams.get('ingredients');

  // If recipe number is provided, search by ID
  if (recipeNumber) {
    const recipeId = parseInt(recipeNumber);
    if (!isNaN(recipeId)) {
      const recipe = db
        .select()
        .from(recipes)
        .where(eq(recipes.id, recipeId))
        .get();

      if (recipe) {
        return NextResponse.json([recipe]);
      }
      return NextResponse.json([]);
    }
  }

  // Build conditions array
  const conditions = [];

  // Keywords search - search in title and tags
  if (keywords) {
    const keywordConditions = or(
      like(recipes.title, `%${keywords}%`),
      like(recipes.tags, `%${keywords}%`)
    );
    if (keywordConditions) {
      conditions.push(keywordConditions);
    }
  }

  // Category search
  if (category) {
    conditions.push(like(recipes.tags, `%"${category}"%`));
  }

  // Ingredients search
  if (ingredients) {
    // Search for recipes that contain the specified ingredient
    const matchingRecipes = db
      .select({ recipe_id: recipe_ingredient_measUnit.recipe_id })
      .from(recipe_ingredient_measUnit)
      .where(like(recipe_ingredient_measUnit.ingredient_id, `%${ingredients}%`))
      .all();

    const recipeSlugs = [...new Set(matchingRecipes.map(r => r.recipe_id).filter(Boolean))];

    if (recipeSlugs.length > 0) {
      conditions.push(inArray(recipes.slug, recipeSlugs as string[]));
    } else {
      // No matching ingredients found, return empty results
      return NextResponse.json([]);
    }
  }

  // Execute query
  let result;
  if (conditions.length > 0) {
    const whereClause = conditions.length === 1 ? conditions[0] : and(...conditions);
    result = db
      .select()
      .from(recipes)
      .where(whereClause)
      .all();
  } else {
    // Return all recipes if no search criteria provided
    result = db.select().from(recipes).all();
  }

  return NextResponse.json(result);
}
