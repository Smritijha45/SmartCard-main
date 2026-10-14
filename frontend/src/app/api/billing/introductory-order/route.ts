import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const backendUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000').replace(/\/$/, '');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const auth = req.headers.get('authorization');
    if (auth) headers['Authorization'] = auth;
    const cookie = req.headers.get('cookie');
    if (cookie) headers['Cookie'] = cookie;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const res = await fetch(`${backendUrl}/api/billing/introductory-order`, {
        method: 'POST',
        headers,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    } catch (fetchErr: any) {
      clearTimeout(timeoutId);
      return NextResponse.json(
        {
          success: false,
          message: fetchErr.name === 'AbortError'
            ? 'Backend order creation timed out. If the service is spinning up, please retry shortly.'
            : 'Unable to connect to backend payment service. Please verify backend deployment and NEXT_PUBLIC_API_URL configuration.',
        },
        { status: 502 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
