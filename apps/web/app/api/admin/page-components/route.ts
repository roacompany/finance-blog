import { NextResponse } from 'next/server';
import { getPageComponents, upsertPageComponent } from '@/lib/page-components';
import { getSession } from '@/lib/auth';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page') ?? 'home';
  const components = await getPageComponents(page);
  return NextResponse.json(components);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const result = await upsertPageComponent(body);
  if (!result) return NextResponse.json({ error: 'Failed to upsert' }, { status: 500 });
  return NextResponse.json(result, { status: 201 });
}
