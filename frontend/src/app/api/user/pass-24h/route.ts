import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mockStore';

export async function POST(req: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    if (backendUrl) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      try {
        const res = await fetch(`${backendUrl}/api/users/me/pass-24h`, {
          method: 'POST',
          headers: req.headers as any,
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

    const updated = mockStore.purchase24hPass();
    return NextResponse.json({
      success: true,
      message: '₹20 24-Hour Introductory Professional Pass activated successfully!',
      data: updated
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to activate pass' },
      { status: 500 }
    );
  }
}
