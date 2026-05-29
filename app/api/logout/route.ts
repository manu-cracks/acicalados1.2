import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const url = new URL('/login', request.url);
  const response = NextResponse.redirect(url, 303);
  response.cookies.delete('session_token');
  return response;
}
