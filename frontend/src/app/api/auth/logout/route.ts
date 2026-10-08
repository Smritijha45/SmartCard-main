import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
  if (backendUrl) {
    try {
      const headers: Record<string, string> = {};
      const auth = req.headers.get('authorization');
      if (auth) headers['Authorization'] = auth;
      const cookie = req.headers.get('cookie');
      if (cookie) headers['Cookie'] = cookie;

      await fetch(`${backendUrl}/api/auth/logout`, {
        method: 'POST',
        headers,
      }).catch(() => {});
    } catch {}
  }

  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.delete('auth_token');
  response.cookies.delete('token');
  return response;
}
