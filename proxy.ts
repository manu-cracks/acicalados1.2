import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export default async function proxy(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value;
  
  // Public paths
  if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname.startsWith('/api/login')) {
    if (token) {
      // If already logged in, redirect to appropriate page
      try {
        const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
        const { payload } = await jwtVerify(token, secret);
        if (payload.role === 'OWNER') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        } else {
          return NextResponse.redirect(new URL('/checkin', request.url));
        }
      } catch (e) {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // API Paths (excluding login)
  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    try {
      const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (e) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }
  }

  // Protected paths
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    // Role-based protection
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      if (payload.role !== 'OWNER') {
        return NextResponse.redirect(new URL('/checkin', request.url));
      }
    }
    
    return NextResponse.next();
  } catch (error) {
    // Invalid token
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.webp).*)'],
};
