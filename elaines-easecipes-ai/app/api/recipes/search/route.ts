import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { recipes, recipe_ingredient_measUnit, userBookmarks } from '@/lib/db/schema';
import { like, eq, or, and, inArray } from 'drizzle-orm';
import { verifySessionToken, parseCookie, COOKIE_NAME } from '@/lib/auth/session';

async function getUserId(request: Request): Promise<number | null> {
  const token = parseCookie(request.headers.get('cookie'), COOKIE_NAME);
  if (!token) return null;
  const payload = await verifySessionToken(token);
  return payload?.userId ?? null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keywords = searchParams.get('keywords');
  const category = searchParams.get('category');
  const recipeNumber = searchParams.get('recipeNumber');
  const ingredients = searchParams.get('ingredients');

  const userId = await getUserId(request);

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
    const matchingRecipes = db
      .select({ recipe_id: recipe_ingredient_measUnit.recipe_id })
      .from(recipe_ingredient_measUnit)
      .where(like(recipe_ingredient_measUnit.ingredient_id, `%${ingredients}%`))
      .all();

    const recipeSlugs = [...new Set(matchingRecipes.map(r => r.recipe_id).filter(Boolean))];

    if (recipeSlugs.length > 0) {
      conditions.push(inArray(recipes.slug, recipeSlugs as string[]));
    } else {
      return NextResponse.json([]);
    }
  }

  // Execute query
  let result;
  if (conditions.length > 0) {
    const whereClause = conditions.length === 1 ? conditions[0] : and(...conditions);
    result = db.select().from(recipes).where(whereClause).all();
  } else {
    result = db.select().from(recipes).all();
  }

  if (userId) {
    const bookmarks = db.select().from(userBookmarks).where(eq(userBookmarks.userId, userId)).all();
    const bookmarkedSlugs = new Set(bookmarks.map(b => b.recipeSlug));
    return NextResponse.json(result.map(r => ({ ...r, bookmarked: bookmarkedSlugs.has(r.slug) })));
  }

  return NextResponse.json(result.map(r => ({ ...r, bookmarked: false })));
}
