import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { listTopics, createTopic, getTopicStats, topicToJson } from '@/lib/topics-db';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = (searchParams.get('status') || 'all') as 'all' | 'backlog' | 'in_progress' | 'completed' | 'skipped';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');
  const includeStats = searchParams.get('stats') === 'true';

  const { topics, total } = await listTopics({ status, page, limit });
  const result: Record<string, unknown> = {
    topics: topics.map(topicToJson),
    total,
    page,
    limit,
  };

  if (includeStats) {
    result.stats = await getTopicStats();
  }

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, tags, series, priority, notes } = body;

    if (!title) {
      return NextResponse.json({ error: '제목은 필수입니다.' }, { status: 400 });
    }

    const topic = await createTopic({
      title,
      description: description || '',
      tags: tags || [],
      series: series || '',
      priority: priority ?? 0,
      notes: notes || '',
    });

    return NextResponse.json(topicToJson(topic), { status: 201 });
  } catch (error) {
    console.error('Create topic error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
