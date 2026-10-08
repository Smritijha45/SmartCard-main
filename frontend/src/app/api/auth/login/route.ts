import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mockStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body;
    
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
    if (backendUrl) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      try {
        const res = await fetch(`${backendUrl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          return NextResponse.json(data);
        }
      } catch {
        clearTimeout(timeoutId);
      }
    }

    const user = mockStore.getUser();
    if (email && email.trim()) {
      user.email = email;
      const namePart = email.split('@')[0];
      user.name = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    }

    return NextResponse.json({
      message: 'Logged in successfully',
      data: {
        accessToken: 'mock_jwt_token_smartcard_pro',
        user
      }
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Login failed' }, { status: 400 });
  }
}
