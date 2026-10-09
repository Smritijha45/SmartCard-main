import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mockStore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').toLowerCase().trim();
    
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    if (backendUrl) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      try {
        const res = await fetch(`${backendUrl}/api/search?q=${encodeURIComponent(q)}`, {
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

    if (!q) {
      return NextResponse.json({ cards: [], leads: [] });
    }

    const cards = mockStore.getCards().filter(c => 
      (c.name && c.name.toLowerCase().includes(q)) || 
      (c.role && c.role.toLowerCase().includes(q)) || 
      (c.company && c.company.toLowerCase().includes(q)) || 
      (c.email && c.email.toLowerCase().includes(q))
    );

    const leads = mockStore.getLeads().filter(l => 
      (l.name && l.name.toLowerCase().includes(q)) || 
      (l.company && l.company.toLowerCase().includes(q)) || 
      (l.email && l.email.toLowerCase().includes(q)) ||
      (l.notes && l.notes.toLowerCase().includes(q))
    );

    return NextResponse.json({ cards, leads });
  } catch (error: any) {
    return NextResponse.json({ cards: [], leads: [] });
  }
}
