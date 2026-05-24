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

  // Keywords search - split by spaces/commas, each term must match title or tags
  if (keywords) {
    const terms = keywords.split(/[\s,]+/).filter(Boolean);
    for (const term of terms) {
      const termCondition = or(
        like(recipes.title, `%${term}%`),
        like(recipes.tags, `%${term}%`)
      );
      if (termCondition) conditions.push(termCondition);
    }
  }

  // Category search
  if (category) {
    conditions.push(like(recipes.tags, `%"${category}"%`));
  }

  // Ingredients search - split by spaces/commas, recipe must contain all terms
  if (ingredients) {
    const terms = ingredients.split(/[\s,]+/).filter(Boolean);
    let validSlugs: string[] | null = null;

    for (const term of terms) {
      const matchingRecipes = db
        .select({ recipe_id: recipe_ingredient_measUnit.recipe_id })
        .from(recipe_ingredient_measUnit)
        .where(like(recipe_ingredient_measUnit.ingredient_id, `%${term}%`))
        .all();

      const slugs = [...new Set(matchingRecipes.map(r => r.recipe_id).filter(Boolean))] as string[];

      if (slugs.length === 0) return NextResponse.json([]);

      validSlugs = validSlugs === null ? slugs : validSlugs.filter(s => slugs.includes(s));

      if (validSlugs.length === 0) return NextResponse.json([]);
    }

    if (validSlugs && validSlugs.length > 0) {
      conditions.push(inArray(recipes.slug, validSlugs));
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
