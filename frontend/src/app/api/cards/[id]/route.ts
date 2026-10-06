import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mockStore';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const p = await params;
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    if (backendUrl) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      try {
        const res = await fetch(`${backendUrl}/api/cards/${p.id}`, {
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
    const card = mockStore.getCardById(p.id);
    if (!card) {
      // If requested id is not found, return the primary demo card so visitors always see a card
      const fallback = mockStore.getCards()[0];
      return NextResponse.json(fallback || { message: 'Card not found' }, { status: fallback ? 200 : 404 });
    }
    return NextResponse.json(card);
  } catch (error: any) {
    const fallback = mockStore.getCards()[0];
    return NextResponse.json(fallback || { message: 'Card not found' }, { status: 200 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();
    const p = await params;
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    if (backendUrl) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      try {
        const res = await fetch(`${backendUrl}/api/cards/${p.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...(req.headers.get('authorization') ? { Authorization: req.headers.get('authorization')! } : {}) },
          body: JSON.stringify(body),
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
    const updated = mockStore.updateCard(p.id, body);
    return NextResponse.json(updated || { message: 'Card not found' }, { status: updated ? 200 : 404 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const p = await params;
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    if (backendUrl) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      try {
        const res = await fetch(`${backendUrl}/api/cards/${p.id}`, {
          method: 'DELETE',
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
    mockStore.deleteCard(p.id);
    return NextResponse.json({ message: 'Card deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
