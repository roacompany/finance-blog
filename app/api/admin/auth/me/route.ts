import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const result = await db.execute({
      sql: 'SELECT id, username, display_name FROM admin_users WHERE id = ?',
      args: [session.userId],
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const user = result.rows[0];
    return NextResponse.json({
      user: {
        id: String(user.id),
        username: String(user.username),
        display_name: String(user.display_name),
      },
    });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
