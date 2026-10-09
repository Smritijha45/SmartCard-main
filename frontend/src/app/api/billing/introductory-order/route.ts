import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const auth = req.headers.get('authorization');
    if (auth) headers['Authorization'] = auth;
    const cookie = req.headers.get('cookie');
    if (cookie) headers['Cookie'] = cookie;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    try {
      const res = await fetch(`${backendUrl}/api/billing/introductory-order`, {
        method: 'POST',
        headers,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    } catch {
      clearTimeout(timeoutId);
    }

    // Development / Mock fallback if backend is offline or keys missing
    const dummyOrderId = 'order_mock_' + Math.random().toString(36).substring(2, 9);
    return NextResponse.json({
      success: true,
      data: {
        orderId: dummyOrderId,
        amount: 2000,
        currency: 'INR',
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mockkey12345',
        productName: 'SmartCard Professional 24-Hour Introductory Pass',
        description: 'Try Professional for ₹20 — full access for 24 hours.',
        durationHours: 24,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
