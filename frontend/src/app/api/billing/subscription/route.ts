import { NextRequest, NextResponse } from 'next/server';
import { mockStore, PLAN_CONFIGS } from '@/lib/mockStore';

export async function GET(req: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    const headers: Record<string, string> = {};
    const auth = req.headers.get('authorization');
    if (auth) headers['Authorization'] = auth;
    const cookie = req.headers.get('cookie');
    if (cookie) headers['Cookie'] = cookie;

    try {
      const res = await fetch(`${backendUrl}/api/billing/subscription`, {
        headers,
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

    const user = mockStore.getUser() as any;
    return NextResponse.json({
      success: true,
      data: {
        subscription: user?.subscription || {
          plan: user?.subscriptionPlan || 'professional',
          status: 'active',
          is24hPass: user?.is24hPass || false,
          passExpiryDate: user?.passExpiresAt || null,
        },
        limits: (PLAN_CONFIGS as any)[user?.subscriptionPlan || 'professional']?.limits,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
