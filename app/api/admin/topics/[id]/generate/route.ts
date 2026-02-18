import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth';
import { getTopicById, updateTopic, topicToJson } from '@/lib/topics-db';
import { createPost, getPostBySlugDb } from '@/lib/posts-db';

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

    // slug 생성 + 충돌 방지
    const baseSlug = topic.title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 60);

    let slug = baseSlug;
    let suffix = 1;
    while (await getPostBySlugDb(slug)) {
      slug = `${baseSlug}-${suffix}`;
      suffix++;
      if (suffix > 20) {
        return NextResponse.json({ error: '슬러그를 생성할 수 없습니다. 제목을 변경해주세요.' }, { status: 409 });
      }
    }

    if (mode === 'auto') {
      // 자동 생성: pending_review 상태로 직접 생성
      const post = await createPost({
        title: topic.title,
        slug,
        description: topic.description || `${topic.title}에 대해 알아봅니다.`,
        content: generateDraftContent(topic.title, tags),
        date: new Date().toISOString().split('T')[0],
        tags,
        series: topic.series || '',
        status: 'pending_review',
        auto_generated: true,
      });

      // 토픽 상태를 completed로 업데이트
      await updateTopic(id, { status: 'completed' });

      // 캐시 갱신 (대시보드에서 승인 대기 목록 즉시 반영)
      try { revalidatePath('/'); } catch { /* non-critical */ }

      return NextResponse.json({
        success: true,
        mode: 'auto',
        post: { id: post.id, title: post.title, slug: post.slug, status: post.status },
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

      // 캐시 갱신
      try { revalidatePath('/'); } catch { /* non-critical */ }

      return NextResponse.json({
        success: true,
        mode: 'draft',
        post: { id: post.id, title: post.title, slug: post.slug },
        topic: topicToJson((await getTopicById(id))!),
      });
    }
  } catch (error) {
    console.error('Generate from topic error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
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
