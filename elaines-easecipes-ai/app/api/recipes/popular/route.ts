import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { recipes } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '6');

  const result = db
    .select()
    .from(recipes)
    .orderBy(desc(recipes.views))
    .limit(limit)
    .all();

  return NextResponse.json(result);
}
