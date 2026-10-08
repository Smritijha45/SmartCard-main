import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mockStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cardId, type, channel, linkType } = body;

    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    if (backendUrl) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      try {
        await fetch(`${backendUrl}/api/analytics/track`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
      } catch {
        clearTimeout(timeoutId);
      }
    }

    if (cardId && type) {
      const res = mockStore.trackActivity(cardId, type, { channel, linkType });
      return NextResponse.json(res);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: true });
  }
}
