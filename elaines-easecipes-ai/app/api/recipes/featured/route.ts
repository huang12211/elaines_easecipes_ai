import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { recipes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  const result = db
    .select()
    .from(recipes)
    .where(eq(recipes.featured, true))
    .limit(1)
    .get();

  if (!result) {
    return NextResponse.json({ error: 'No featured recipe found' }, { status: 404 });
  }

  return NextResponse.json(result);
}
