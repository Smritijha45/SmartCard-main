import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mockStore';

export async function GET(req: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
    if (backendUrl) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      try {
        const headers: Record<string, string> = {};
        const auth = req.headers.get('authorization');
        if (auth) headers['Authorization'] = auth;
        const cookie = req.headers.get('cookie');
        if (cookie) headers['Cookie'] = cookie;

        const res = await fetch(`${backendUrl}/api/cards/me`, {
          headers,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          return NextResponse.json(data.data || data);
        }
      } catch {
        clearTimeout(timeoutId);
      }
    }

    const card = mockStore.getCards()[0];
    return NextResponse.json(card || { message: 'No card found' }, { status: card ? 200 : 404 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to load card' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
    if (backendUrl) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        const auth = req.headers.get('authorization');
        if (auth) headers['Authorization'] = auth;
        const cookie = req.headers.get('cookie');
        if (cookie) headers['Cookie'] = cookie;

        const res = await fetch(`${backendUrl}/api/cards/me`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          return NextResponse.json(data.data || data);
        }
      } catch {
        clearTimeout(timeoutId);
      }
    }

    const firstCard = mockStore.getCards()[0];
    if (firstCard) {
      const updated = mockStore.updateCard(firstCard.id, body);
      return NextResponse.json(updated);
    }
    const created = mockStore.createCard(body);
    return NextResponse.json(created);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to update card' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
    if (backendUrl) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      try {
        const headers: Record<string, string> = {};
        const auth = req.headers.get('authorization');
        if (auth) headers['Authorization'] = auth;
        const cookie = req.headers.get('cookie');
        if (cookie) headers['Cookie'] = cookie;

        const res = await fetch(`${backendUrl}/api/cards/me`, {
          method: 'DELETE',
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
    }

    const firstCard = mockStore.getCards()[0];
    if (firstCard) {
      mockStore.deleteCard(firstCard.id);
    }
    return NextResponse.json({ message: 'Card deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to delete card' }, { status: 500 });
  }
}
