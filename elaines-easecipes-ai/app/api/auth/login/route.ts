import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { createSessionToken, COOKIE_NAME, COOKIE_MAX_AGE } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const user = db.select().from(users).where(eq(users.email, email)).get();
  if (!user) {
    return NextResponse.json({ error: 'Sorry we don\'t have a user with that email' }, { status: 401 });
  }
  else if (!bcrypt.compareSync(password, user.passwordHash)) {
    return NextResponse.json({ error: 'Oops! Wrong password' }, { status: 401 });
  }

  const token = await createSessionToken({ userId: user.id, email: user.email });

  const response = NextResponse.json({ email: user.email }, { status: 200 });
  response.headers.set(
    'Set-Cookie',
    `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${COOKIE_MAX_AGE}`
  );
  return response;
}
