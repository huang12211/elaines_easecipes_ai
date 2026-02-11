import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { recipes, recipe_ingredient_measUnit } from '@/lib/db/schema';
import { like, eq } from 'drizzle-orm';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  // Fetch ingredients list for a recipe by slug
  if (slug) {
    const ingredientsList = db
      .select()
      .from(recipe_ingredient_measUnit)
      .where(eq(recipe_ingredient_measUnit.recipe_id, slug))
      .all();

    if (!ingredientsList || ingredientsList.length === 0) {
      return NextResponse.json({ error: 'Recipe not found or has no ingredients' }, { status: 404 });
    }

    return NextResponse.json(ingredientsList);
  }
}
