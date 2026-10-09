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

        const res = await fetch(`${backendUrl}/api/company/members`, {
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

    return NextResponse.json(mockStore.getTeamMembers());
  } catch {
    return NextResponse.json(mockStore.getTeamMembers());
  }
}
