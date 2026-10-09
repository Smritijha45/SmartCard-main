import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mockStore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'csv';

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

        const res = await fetch(`${backendUrl}/api/company/reports/export?${searchParams.toString()}`, {
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
              'Content-Disposition': `attachment; filename="smartcard-team-report-${Date.now()}.${format}"`,
            },
          });
        }
      } catch {
        clearTimeout(timeoutId);
      }
    }

    const company = mockStore.getCompany();
    const members = mockStore.getTeamMembers();
    const cards = mockStore.getCards();
    const leads = mockStore.getLeads();

    if (format === 'json') {
      const payload = { organization: company, members, cards, leads };
      return new NextResponse(JSON.stringify(payload, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${company.name.toLowerCase().replace(/\s+/g, '-')}-report-${Date.now()}.json"`,
        },
      });
    }

    const rows = [
      `"Organization:","${company.name}"`,
      `"Total Members:","${members.length}"`,
      `"Total Active Cards:","${cards.length}"`,
      `"Total Leads Captured:","${leads.length}"`,
      '',
      '"--- TEAM MEMBERS ---"',
      '"ID","Name","Email","Role","JoinedDate"',
      ...members.map(m => `"${m.id}","${m.name}","${m.email}","${m.role}","${m.joinedAt}"`),
      '',
      '"--- TEAM CARDS ---"',
      '"Card ID","Name","Username","Views","Scans","Public URL"',
      ...cards.map(c => `"${c.id}","${c.name}","${c.username}",${c.totalViews || c.views || 0},${c.scans || 0},"${c.qrCodeUrl || ''}"`),
      '',
      '"--- CENTRALIZED LEADS ---"',
      '"Lead ID","Name","Email","Company","Status","Score","DateCreated"',
      ...leads.map(l => `"${l.id}","${l.name}","${l.email || ''}","${l.company || ''}","${l.status}",${l.score || 0},"${l.createdAt}"`)
    ];

    return new NextResponse(rows.join('\n'), {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${company.name.toLowerCase().replace(/\s+/g, '-')}-report-${Date.now()}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
