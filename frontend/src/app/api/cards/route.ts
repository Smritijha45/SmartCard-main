import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mockStore';

export async function GET(req: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    if (backendUrl) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      try {
        const res = await fetch(`${backendUrl}/api/cards`, {
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
    // Fallback to mock store
    return NextResponse.json(mockStore.getCards());
  } catch (error: any) {
    return NextResponse.json(mockStore.getCards());
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    if (backendUrl) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      try {
        const res = await fetch(`${backendUrl}/api/cards`, {
          method: 'POST',
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
    const created = mockStore.createCard(body);
    return NextResponse.json(created);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
