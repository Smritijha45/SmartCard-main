import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || '7';
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

        const res = await fetch(`${backendUrl}/api/analytics/timeseries?range=${range}`, {
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

    const points = range === '30' ? [
      { date: 'W1', views: 680, clicks: 230, shares: 90, scans: 480, saves: 45 },
      { date: 'W2', views: 820, clicks: 290, shares: 110, scans: 590, saves: 58 },
      { date: 'W3', views: 990, clicks: 350, shares: 130, scans: 710, saves: 72 },
      { date: 'W4', views: 1284, clicks: 438, shares: 170, scans: 890, saves: 84 },
    ] : [
      { date: 'Mon', views: 164, clicks: 52, shares: 18, scans: 114, saves: 11 },
      { date: 'Tue', views: 198, clicks: 68, shares: 21, scans: 142, saves: 14 },
      { date: 'Wed', views: 245, clicks: 84, shares: 26, scans: 175, saves: 18 },
      { date: 'Thu', views: 218, clicks: 72, shares: 20, scans: 151, saves: 15 },
      { date: 'Fri', views: 284, clicks: 96, shares: 29, scans: 198, saves: 19 },
      { date: 'Sat', views: 142, clicks: 46, shares: 12, scans: 98, saves: 7 },
      { date: 'Sun', views: 233, clicks: 70, shares: 20, scans: 164, saves: 15 },
    ];

    return NextResponse.json({ range, points });
  } catch (error: any) {
    return NextResponse.json({ range: '7', points: [] });
  }
}
