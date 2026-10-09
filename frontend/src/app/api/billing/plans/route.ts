import { NextRequest, NextResponse } from 'next/server';
import { PLAN_CONFIGS } from '@/lib/mockStore';

export async function GET(req: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    try {
      const res = await fetch(`${backendUrl}/api/billing/plans`, {
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

    return NextResponse.json({
      success: true,
      data: {
        plans: PLAN_CONFIGS,
        introductoryPass: {
          name: '24-Hour Introductory Professional Pass',
          amountInr: 20,
          durationHours: 24,
          description: 'Try Professional for ₹20 — full access for 24 hours.',
          headline: 'Try Professional for ₹20 — full access for 24 hours.',
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
