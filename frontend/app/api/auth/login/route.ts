import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const backendResponse = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await backendResponse.json();

  if (!backendResponse.ok) {
    return NextResponse.json({ message: data.message ?? 'Invalid credentials' }, { status: backendResponse.status });
  }

  const response = NextResponse.json({ user: data.user });

  response.cookies.set('access_token', data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 15, // 15 min, alineado con JWT_EXPIRES_IN
  });

  return response;
}