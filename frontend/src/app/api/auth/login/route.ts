import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mockStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email } = body;
    
    const user = mockStore.getUser();
    if (email && email.trim()) {
      user.email = email;
      const namePart = email.split('@')[0];
      user.name = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    }

    return NextResponse.json({
      message: 'Logged in successfully (Demo)',
      data: {
        accessToken: 'mock_jwt_token_smartcard_pro',
        user
      }
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Login failed' }, { status: 400 });
  }
}
