import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mockStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cardId, type } = body;
    if (cardId && (type === 'view' || type === 'share')) {
      const res = mockStore.trackActivity(cardId, type);
      return NextResponse.json(res);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: true });
  }
}
