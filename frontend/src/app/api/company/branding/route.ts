import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mockStore';

export async function PATCH(req: NextRequest) {
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

        const res = await fetch(`${backendUrl}/api/company/branding`, {
          method: 'PATCH',
          headers,
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

    const updated = mockStore.updateBranding(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
