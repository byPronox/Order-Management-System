import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PATHS = ['/dashboard', '/orders', '/customers', '/products', '/settings'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value;

  const isProtectedRoute = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  const isLoginRoute = pathname.startsWith('/login');

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isLoginRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/orders/:path*', '/customers/:path*', '/products/:path*', '/settings/:path*', '/login'],
};