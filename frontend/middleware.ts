import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define paths that don't require authentication
const publicPaths = ['/login', '/register', '/forgot-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is a public path
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // Add cache control headers to prevent caching of authenticated state
  const response = NextResponse.next();

  // Add cache control headers
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  return response;
}

export const config = {
  // Matcher ignoring api routes and static files
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
