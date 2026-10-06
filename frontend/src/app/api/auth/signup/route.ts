import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mockStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, name } = body;
    
    const user = mockStore.getUser();
    if (name) user.name = name;
    if (email) user.email = email;

    return NextResponse.json({
      message: 'Account created successfully (Demo)',
      data: {
        accessToken: 'mock_jwt_token_smartcard_pro',
        user
      }
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Signup failed' }, { status: 400 });
  }
}
