import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { recipes } from '@/lib/db/schema';
import { like, eq } from 'drizzle-orm';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const slug = searchParams.get('slug');
  const limit = parseInt(searchParams.get('limit') || '10');

  // Fetch single recipe by slug
  if (slug) {
    const recipe = db
      .select()
      .from(recipes)
      .where(eq(recipes.slug, slug))
      .get();

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    return NextResponse.json(recipe);
  }

  let result;
  if (category) {
    result = db
      .select()
      .from(recipes)
      .where(like(recipes.categories, `%"${category}"%`))
      .limit(limit)
      .all();
  } else {
    result = db.select().from(recipes).limit(limit).all();
  }

  return NextResponse.json(result);
}
