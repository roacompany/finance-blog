import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getTopicById, updateTopic, deleteTopic, topicToJson } from '@/lib/topics-db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const topic = await getTopicById(id);
  if (!topic) {
    return NextResponse.json({ error: '토픽을 찾을 수 없습니다.' }, { status: 404 });
  }

  return NextResponse.json(topicToJson(topic));
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const body = await request.json();
    const topic = await updateTopic(id, body);

    if (!topic) {
      return NextResponse.json({ error: '토픽을 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json(topicToJson(topic));
  } catch (error) {
    console.error('Update topic error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const success = await deleteTopic(id);

  if (!success) {
    return NextResponse.json({ error: '토픽을 찾을 수 없습니다.' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
