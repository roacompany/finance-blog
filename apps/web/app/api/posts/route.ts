import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/content';

function isTodayKST(dateStr: string): boolean {
  const todayKST = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });
  return dateStr.startsWith(todayKST);
}

export async function GET() {
  try {
    const posts = await getAllPosts();
    const payload = posts.map((post) => ({
      id:          post.slug,
      slug:        post.slug,
      title:       post.title,
      description: post.description,
      date:        post.date,
      tags:        post.tags ?? [],
      series:      post.series ?? '',
      readingTime: post.readingTime ?? '1분',
      isToday:     isTodayKST(post.date),
    }));
    return NextResponse.json({ posts: payload }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch (error) {
    console.error('[api/posts] error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
