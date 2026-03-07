import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { isAIConfigured, getAIProviderName } from '@/lib/ai-content';

export async function GET() {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    configured: isAIConfigured(),
    provider: getAIProviderName(),
  });
}
