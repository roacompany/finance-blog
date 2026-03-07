import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 서명된 쿠키에서 직접 세션 정보 반환 (DB 조회 불필요)
    return NextResponse.json({
      user: {
        id: session.userId,
        display_name: session.displayName,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
