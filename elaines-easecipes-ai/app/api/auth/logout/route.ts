import { NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/auth/session';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.headers.set(
    'Set-Cookie',
    `${COOKIE_NAME}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`
  );
  return response;
}
