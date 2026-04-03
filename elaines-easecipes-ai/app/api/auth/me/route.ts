import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, parseCookie, COOKIE_NAME } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie');
  const token = parseCookie(cookieHeader, COOKIE_NAME);

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const payload = await verifySessionToken(token);
  if (!payload) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  return NextResponse.json({ userId: payload.userId, email: payload.email });
}
