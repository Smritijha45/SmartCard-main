import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mockStore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'csv';
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

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

        const res = await fetch(`${backendUrl}/api/leads/export?${searchParams.toString()}`, {
          headers,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          const contentType = res.headers.get('content-type') || (format === 'json' ? 'application/json' : 'text/csv');
          const data = await res.text();
          return new NextResponse(data, {
            status: 200,
            headers: {
              'Content-Type': contentType,
              'Content-Disposition': `attachment; filename="smartcard-leads-${Date.now()}.${format}"`,
            },
          });
        }
      } catch {
        clearTimeout(timeoutId);
      }
    }

    const leads = mockStore.getLeads({ status, search });
    if (format === 'json') {
      return new NextResponse(JSON.stringify(leads, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="smartcard-leads-${Date.now()}.json"`,
        },
      });
    }

    // CSV format
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Role', 'Status', 'Score', 'EventTag', 'Source', 'DateCreated'];
    const rows = leads.map(l => [
      `"${l.id}"`,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.company || '').replace(/"/g, '""')}"`,
      `"${(l.role || '').replace(/"/g, '""')}"`,
      `"${l.status}"`,
      l.score || 0,
      `"${(l.eventTag || '').replace(/"/g, '""')}"`,
      `"${(l.source || '').replace(/"/g, '""')}"`,
      `"${l.createdAt}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="smartcard-leads-${Date.now()}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
