import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/mockStore';

export async function GET() {
  const user = mockStore.getUser();
  return NextResponse.json(user);
}
