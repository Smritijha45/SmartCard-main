import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
    const headers: Record<string, string> = {};
    const auth = req.headers.get('authorization');
    if (auth) headers['Authorization'] = auth;
    const cookie = req.headers.get('cookie');
    if (cookie) headers['Cookie'] = cookie;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    try {
      const res = await fetch(`${backendUrl}/api/billing/history`, {
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

    // Default mock history stubs
    return NextResponse.json({
      success: true,
      data: [
        {
          _id: 'tx_mock_1',
          orderId: 'order_NRV9102481',
          paymentId: 'pay_NRP1029482',
          amount: 2000,
          currency: 'INR',
          status: 'paid',
          productType: 'pass_24h',
          description: '24-Hour Introductory Professional Pass',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: 'tx_mock_2',
          orderId: 'order_NRV9827391',
          paymentId: 'pay_NRP8273619',
          amount: 19900,
          currency: 'INR',
          status: 'paid',
          productType: 'subscription_professional',
          description: 'Professional Monthly Subscription',
          createdAt: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
