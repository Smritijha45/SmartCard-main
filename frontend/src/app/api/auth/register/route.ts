import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mockStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, name, password } = body;
    
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
    if (backendUrl) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      try {
        const res = await fetch(`${backendUrl}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name, password }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          return NextResponse.json(data, { status: res.status });
        }
      } catch {
        clearTimeout(timeoutId);
      }
    }

    const user = mockStore.getUser();
    if (name) user.name = name;
    if (email) user.email = email;

    return NextResponse.json({
      message: 'Account created successfully',
      data: {
        accessToken: 'mock_jwt_token_smartcard_pro',
        user
      }
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Signup failed' }, { status: 400 });
  }
}
