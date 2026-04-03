import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { recipes, userBookmarks } from '@/lib/db/schema';
import { like, eq, sql, and } from 'drizzle-orm';
import { verifySessionToken, parseCookie, COOKIE_NAME } from '@/lib/auth/session';

async function getUserIdFromRequest(request: Request): Promise<number | null> {
  const token = parseCookie(request.headers.get('cookie'), COOKIE_NAME);
  if (!token) return null;
  const payload = await verifySessionToken(token);
  return payload?.userId ?? null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get('tag');
  const slug = searchParams.get('slug');
  const limit = parseInt(searchParams.get('limit') || '10');

  const userId = await getUserIdFromRequest(request);

  // Fetch single recipe by slug
  if (slug) {
    const recipe = db
      .update(recipes)
      .set({ views: sql`${recipes.views} + 1` })
      .where(eq(recipes.slug, slug))
      .returning()
      .get();

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    const bookmarked = userId
      ? !!db.select().from(userBookmarks)
          .where(and(eq(userBookmarks.userId, userId), eq(userBookmarks.recipeSlug, slug)))
          .get()
      : false;

    return NextResponse.json({ ...recipe, bookmarked });
  }

  let result;
  if (tag) {
    result = db.select().from(recipes).where(like(recipes.tags, `%"${tag}"%`)).limit(limit).all();
  } else {
    result = db.select().from(recipes).limit(limit).all();
  }

  if (userId) {
    const bookmarks = db.select().from(userBookmarks).where(eq(userBookmarks.userId, userId)).all();
    const bookmarkedSlugs = new Set(bookmarks.map(b => b.recipeSlug));
    return NextResponse.json(result.map(r => ({ ...r, bookmarked: bookmarkedSlugs.has(r.slug) })));
  }

  return NextResponse.json(result.map(r => ({ ...r, bookmarked: false })));
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { slug, bookmarked } = body;

  if (!slug || typeof bookmarked !== 'boolean') {
    return NextResponse.json(
      { error: 'Missing required fields: slug and bookmarked' },
      { status: 400 }
    );
  }

  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const recipe = db.select().from(recipes).where(eq(recipes.slug, slug)).get();
  if (!recipe) {
    return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
  }

  if (bookmarked) {
    db.insert(userBookmarks).values({ userId, recipeSlug: slug }).onConflictDoNothing().run();
  } else {
    db.delete(userBookmarks)
      .where(and(eq(userBookmarks.userId, userId), eq(userBookmarks.recipeSlug, slug)))
      .run();
  }

  return NextResponse.json({ ...recipe, bookmarked });
}
