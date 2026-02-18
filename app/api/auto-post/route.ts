import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createPost } from '@/lib/posts-db';

/**
 * POST /api/auto-post
 *
 * Claude Code가 매일 새벽 2시에 호출하는 자동 포스트 생성 엔드포인트.
 *
 * 요청 헤더에 API key를 포함하거나, 환경변수 AUTO_POST_SECRET과 일치하는
 * authorization 토큰을 사용합니다.
 *
 * 요청 본문 (JSON):
 * {
 *   "title": "포스트 제목",
 *   "slug": "post-slug",
 *   "description": "포스트 설명",
 *   "content": "## MDX 본문 내용",
 *   "date": "2026-02-15",
 *   "tags": ["금리", "투자"],
 *   "series": "Series 01. 금리·통화정책"
 * }
 *
 * 포스트는 'pending_review' 상태로 생성되며,
 * 관리자가 어드민 패널에서 '발행 승인'을 해야 프론트에 노출됩니다.
 */
export async function POST(request: NextRequest) {
  try {
    // API key 검증
    const authHeader = request.headers.get('authorization');
    const apiSecret = process.env.AUTO_POST_SECRET || 'auto-post-default-key';

    if (authHeader !== `Bearer ${apiSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: '잘못된 요청 형식입니다.' }, { status: 400 });
    }
    const { title, slug, description, content, date, base_date, tags, series } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'title, slug, content는 필수입니다.' },
        { status: 400 }
      );
    }

    const post = await createPost({
      title,
      slug,
      description: description || '',
      content,
      date: date || new Date().toISOString().split('T')[0],
      base_date,
      tags: tags || [],
      series: series || '',
      status: 'pending_review',
      auto_generated: true,
    });

    // 캐시 갱신 (승인 대기지만 대시보드 등에서 바로 보이도록)
    try { revalidatePath('/'); } catch { /* non-critical */ }

    return NextResponse.json({
      success: true,
      message: '포스트가 승인 대기 상태로 생성되었습니다.',
      post: {
        id: post.id,
        title: post.title,
        slug: post.slug,
        status: post.status,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Auto post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
