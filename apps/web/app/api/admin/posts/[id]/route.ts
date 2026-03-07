import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getPostById, updatePost, deletePost } from '@/lib/posts-db';
import { safeParseTags } from '@/lib/safe-json';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/posts/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const post = await getPostById(id);

    if (!post) {
      return NextResponse.json({ error: '포스트를 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json({
      ...post,
      tags: safeParseTags(post.tags),
    });
  } catch (error) {
    console.error('Get post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/posts/[id]
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: '잘못된 요청 형식입니다.' }, { status: 400 });
    }

    const updated = await updatePost(id, body);

    if (!updated) {
      return NextResponse.json({ error: '포스트를 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json({
      ...updated,
      tags: safeParseTags(updated.tags),
    });
  } catch (error) {
    console.error('Update post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/posts/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await deletePost(id);

    if (!deleted) {
      return NextResponse.json({ error: '포스트를 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
