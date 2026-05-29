import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const ownerUser = process.env.OWNER_USER;
    const ownerPass = process.env.OWNER_PASS;
    const recepUser = process.env.RECEPTIONIST_USER;
    const recepPass = process.env.RECEPTIONIST_PASS;

    let role = null;

    if (username === ownerUser && password === ownerPass) {
      role = 'OWNER';
    } else if (username === recepUser && password === recepPass) {
      role = 'RECEPTIONIST';
    }

    if (!role) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
    const token = await new SignJWT({ role, username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('8h')
      .sign(secret);

    const response = NextResponse.json({ success: true, role });
    
    response.cookies.set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
