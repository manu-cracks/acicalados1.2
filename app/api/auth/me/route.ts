import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function GET(request: Request) {
  try {
    const token = request.headers.get('cookie')?.split('session_token=')?.[1]?.split(';')?.[0];
    if (!token) return NextResponse.json({ role: null }, { status: 401 });

    const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
    const { payload } = await jwtVerify(token, secret);

    return NextResponse.json({ role: payload.role });
  } catch (e) {
    return NextResponse.json({ role: null }, { status: 401 });
  }
}
