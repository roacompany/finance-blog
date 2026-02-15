import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getPostById, updatePost } from '@/lib/posts-db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/admin/posts/[id]/publish - Publish or unpublish a post
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { action } = body; // 'publish' or 'unpublish'

    const post = getPostById(id);
    if (!post) {
      return NextResponse.json({ error: '포스트를 찾을 수 없습니다.' }, { status: 404 });
    }

    let newStatus: 'published' | 'draft';

    if (action === 'publish') {
      newStatus = 'published';
    } else if (action === 'unpublish') {
      newStatus = 'draft';
    } else {
      return NextResponse.json(
        { error: "action은 'publish' 또는 'unpublish'이어야 합니다." },
        { status: 400 }
      );
    }

    const updated = updatePost(id, { status: newStatus });

    return NextResponse.json({
      ...updated!,
      tags: JSON.parse(updated!.tags),
      message: newStatus === 'published' ? '포스트가 발행되었습니다.' : '포스트가 비공개로 전환되었습니다.',
    });
  } catch (error) {
    console.error('Publish post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
