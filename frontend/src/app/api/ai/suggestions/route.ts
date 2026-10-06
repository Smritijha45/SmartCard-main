import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      score: 94,
      tips: [
        'Add a custom calendar booking link to convert 35% more card viewers.',
        'Upload your downloadable PDF portfolio for conference networking.',
        'Share your card on WhatsApp after key meetings to boost relationship follow-up.'
      ]
    }
  });
}
