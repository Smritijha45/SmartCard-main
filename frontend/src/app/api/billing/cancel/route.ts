import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mockStore';

export async function POST(req: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const auth = req.headers.get('authorization');
    if (auth) headers['Authorization'] = auth;
    const cookie = req.headers.get('cookie');
    if (cookie) headers['Cookie'] = cookie;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    try {
      const res = await fetch(`${backendUrl}/api/billing/cancel`, {
        method: 'POST',
        headers,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    } catch {
      clearTimeout(timeoutId);
    }

    const updated = mockStore.setPlan('starter');
    return NextResponse.json({
      success: true,
      message: 'Subscription scheduled for cancellation. Access will remain active until the end of your current billing period.',
      data: {
        cancelAtPeriodEnd: true,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        subscription: (updated as any).subscription || { plan: 'starter', status: 'canceled' },
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
