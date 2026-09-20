import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';
import { createSessionToken, COOKIE_NAME, COOKIE_MAX_AGE } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // Validate inputs
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }
  if (!password || password.length < 8 || !/^[A-Za-z0-9!@#$%^&* +-]+$/.test(password)) {
    return NextResponse.json({ error: 'Password must be at least 8 characters long and can only contain letters, numbers, and the following special characters: !@#$%^&*+-' }, { status: 400 });
  }

  // Check if email already exists
  const existing = db.select().from(users).where(eq(users.email, email)).get();
  if (existing) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
  }

  // Hash password and create user
  const passwordHash = await bcrypt.hash(password, 12);
  const [user] = db.insert(users).values({ email, passwordHash }).returning().all();

  const token = await createSessionToken({ userId: user.id, email: user.email });

  const response = NextResponse.json({ email: user.email }, { status: 201 });
  response.headers.set(
    'Set-Cookie',
    `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${COOKIE_MAX_AGE}`
  );
  return response;
}
