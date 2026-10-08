import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mockStore';

export async function GET(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  try {
    const p = await params;
    const username = (p.username || '').toLowerCase().trim();

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
    if (backendUrl) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      try {
        const res = await fetch(`${backendUrl}/api/cards/public/${username}`, {
          headers: req.headers as any,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          return NextResponse.json(data.data || data);
        } else if (res.status === 403) {
          return NextResponse.json({ message: 'This SmartCard is currently private' }, { status: 403 });
        } else if (res.status === 404) {
          return NextResponse.json({ message: 'SmartCard not found' }, { status: 404 });
        }
      } catch {
        clearTimeout(timeoutId);
      }
    }

    const cards = mockStore.getCards();
    const matched = cards.find(
      (c) => (c.username && c.username.toLowerCase() === username) || c.id === username
    );

    if (matched) {
      if (matched.isPublic === false) {
        return NextResponse.json({ message: 'This SmartCard is currently private' }, { status: 403 });
      }
      return NextResponse.json(matched);
    }

    if (username === 'smriti' || username === 'demo') {
      const fallback = cards[0];
      return NextResponse.json(fallback || { message: 'SmartCard not found' }, { status: fallback ? 200 : 404 });
    }

    return NextResponse.json({ message: 'SmartCard not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch public card' }, { status: 500 });
  }
}
