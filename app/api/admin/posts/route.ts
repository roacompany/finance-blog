import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { listPosts, createPost, type PostStatus } from '@/lib/posts-db';
import { safeParseTags } from '@/lib/safe-json';

// GET /api/admin/posts - List posts
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = (searchParams.get('status') || 'all') as PostStatus | 'all';
    const series = searchParams.get('series') || undefined;
    const search = searchParams.get('search') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const result = listPosts({ status, series, search, page, limit });

    return NextResponse.json({
      posts: result.posts.map(post => ({
        ...post,
        tags: safeParseTags(post.tags),
      })),
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit),
    });
  } catch (error) {
    console.error('List posts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/posts - Create post
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: '잘못된 요청 형식입니다.' }, { status: 400 });
    }
    const { title, slug, description, content, date, base_date, tags, series, status } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { error: '제목과 슬러그는 필수입니다.' },
        { status: 400 }
      );
    }

    const post = createPost({
      title,
      slug,
      description: description || '',
      content: content || '',
      date: date || new Date().toISOString().split('T')[0],
      base_date,
      tags: tags || [],
      series: series || '',
      status: status || 'draft',
    });

    return NextResponse.json({
      ...post,
      tags: safeParseTags(post.tags),
    }, { status: 201 });
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
