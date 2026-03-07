import { NextResponse } from 'next/server';
import { updatePageComponent, reorderPageComponents } from '@/lib/page-components';
import { getSession } from '@/lib/auth';

interface Params { params: Promise<{ id: string }> }

export async function PATCH(req: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  // 일괄 순서 변경: { reorder: string[] }
  if (body.reorder) {
    const ok = await reorderPageComponents(body.reorder);
    return ok
      ? NextResponse.json({ ok: true })
      : NextResponse.json({ error: 'Reorder failed' }, { status: 500 });
  }

  const result = await updatePageComponent(id, body);
  if (!result) return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  return NextResponse.json(result);
}
