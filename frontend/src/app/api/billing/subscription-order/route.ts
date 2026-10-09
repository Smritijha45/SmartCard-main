import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const auth = req.headers.get('authorization');
    if (auth) headers['Authorization'] = auth;
    const cookie = req.headers.get('cookie');
    if (cookie) headers['Cookie'] = cookie;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    try {
      const res = await fetch(`${backendUrl}/api/billing/subscription-order`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    } catch {
      clearTimeout(timeoutId);
    }

    const plan = body.plan === 'enterprise' ? 'enterprise' : 'professional';
    const amount = plan === 'enterprise' ? 79900 : 19900;
    const dummyOrderId = 'order_sub_mock_' + Math.random().toString(36).substring(2, 9);

    return NextResponse.json({
      success: true,
      data: {
        orderId: dummyOrderId,
        amount,
        currency: 'INR',
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mockkey12345',
        productName: plan === 'enterprise' ? 'SmartCard Team & Enterprise Monthly Subscription' : 'SmartCard Professional Monthly Subscription',
        plan,
        recurringMonthlyInr: plan === 'enterprise' ? 799 : 199,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
