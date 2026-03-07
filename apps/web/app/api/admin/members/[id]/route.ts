import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';

interface Params { params: Promise<{ id: string }> }

export async function PATCH(req: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { active } = await req.json();

  if (typeof active !== 'boolean') {
    return NextResponse.json({ error: 'active must be boolean' }, { status: 400 });
  }

  const db = await getDb();
  await db.execute({
    sql: 'UPDATE members SET active = ? WHERE id = ?',
    args: [active ? 1 : 0, id],
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const db = await getDb();
  await db.execute({ sql: 'DELETE FROM members WHERE id = ?', args: [id] });

  return NextResponse.json({ ok: true });
}
