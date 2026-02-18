import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getTopicById, updateTopic, topicToJson } from '@/lib/topics-db';
import { createPost } from '@/lib/posts-db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/admin/topics/[id]/generate
 *
 * 백로그 토픽을 기반으로 포스트 초안을 생성합니다.
 * mode: 'draft' (수동 작성용 빈 초안) | 'auto' (AI 자동 생성 요청)
 */
export async function POST(request: NextRequest, context: RouteContext) {
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

  try {
    const body = await request.json();
    const mode = body.mode || 'draft'; // 'draft' or 'auto'

    const tags = JSON.parse(topic.tags || '[]');
    const slug = topic.title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 60);

    if (mode === 'auto') {
      // 자동 생성: auto-post API를 내부 호출
      const autoPostSecret = process.env.AUTO_POST_SECRET || 'auto-post-default-key';
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000';

      const autoRes = await fetch(`${baseUrl}/api/auto-post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${autoPostSecret}`,
        },
        body: JSON.stringify({
          title: topic.title,
          slug,
          description: topic.description || `${topic.title}에 대해 알아봅니다.`,
          content: generateDraftContent(topic.title, tags),
          date: new Date().toISOString().split('T')[0],
          tags,
          series: topic.series || '',
        }),
      });

      if (!autoRes.ok) {
        const err = await autoRes.json();
        return NextResponse.json({ error: err.error || '자동 생성 실패' }, { status: 500 });
      }

      const autoData = await autoRes.json();

      // 토픽 상태를 completed로 업데이트
      await updateTopic(id, { status: 'completed' });

      return NextResponse.json({
        success: true,
        mode: 'auto',
        post: autoData.post,
        topic: topicToJson((await getTopicById(id))!),
      });
    } else {
      // 수동 작성: 빈 초안 생성 후 편집 페이지로 이동
      const post = await createPost({
        title: topic.title,
        slug,
        description: topic.description || '',
        content: generateDraftContent(topic.title, tags),
        date: new Date().toISOString().split('T')[0],
        tags,
        series: topic.series || '',
        status: 'draft',
      });

      // 토픽 상태를 in_progress로 업데이트
      await updateTopic(id, { status: 'in_progress' });

      return NextResponse.json({
        success: true,
        mode: 'draft',
        post: { id: post.id, title: post.title, slug: post.slug },
        topic: topicToJson((await getTopicById(id))!),
      });
    }
  } catch (error) {
    console.error('Generate from topic error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateDraftContent(title: string, tags: string[]): string {
  return `## ${title}

> 이 포스트는 백로그 토픽에서 생성된 초안입니다. 내용을 채워주세요.

### 핵심 요약

- 핵심 내용 1
- 핵심 내용 2
- 핵심 내용 3

### 상세 분석

본문 내용을 작성해주세요.

### 실전 활용 팁

독자에게 실질적인 도움이 되는 팁을 작성해주세요.

### 마치며

마무리 내용을 작성해주세요.

---

**관련 키워드**: ${tags.join(', ')}
`;
}
