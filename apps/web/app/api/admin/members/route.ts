import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') ?? '20')));
  const search = searchParams.get('search') ?? '';
  const offset = (page - 1) * limit;

  const db = await getDb();

  const whereClause = search ? `WHERE email LIKE ?` : '';
  const args = search ? [`%${search}%`, limit, offset] : [limit, offset];

  const [countResult, rows] = await Promise.all([
    db.execute({
      sql: `SELECT COUNT(*) as count FROM members ${whereClause}`,
      args: search ? [`%${search}%`] : [],
    }),
    db.execute({
      sql: `SELECT id, email, active, source, created_at FROM members ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      args,
    }),
  ]);

  const total = Number(countResult.rows[0]?.count ?? 0);

  return NextResponse.json({
    members: rows.rows.map(r => ({
      id: r.id,
      email: r.email,
      active: Boolean(r.active),
      source: r.source ?? 'web',
      created_at: r.created_at,
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
