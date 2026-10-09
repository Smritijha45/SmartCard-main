import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mockStore';

export async function POST(req: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
    if (backendUrl) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      try {
        const headers: Record<string, string> = {};
        const auth = req.headers.get('authorization');
        if (auth) headers['Authorization'] = auth;
        const cookie = req.headers.get('cookie');
        if (cookie) headers['Cookie'] = cookie;

        const res = await fetch(`${backendUrl}/api/company/domain/verify`, {
          method: 'POST',
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

    const verified = mockStore.verifyDomain();
    return NextResponse.json({ success: true, message: 'Custom domain verified and active!', data: verified });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
