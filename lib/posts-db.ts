import { getDb, parseTags, stringifyTags } from './db';
import { v4 as uuidv4 } from 'uuid';
import { calculateReadingTime, type PostMeta, type Post } from './content';
import type { Row } from '@libsql/client';

export type PostStatus = 'draft' | 'pending_review' | 'published' | 'archived';

export interface DbPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  date: string;
  base_date: string | null;
  tags: string; // JSON string
  series: string;
  views: number;
  status: PostStatus;
  auto_generated: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface PostInput {
  title: string;
  slug: string;
  description: string;
  content: string;
  date: string;
  base_date?: string;
  tags: string[];
  series?: string;
  status?: PostStatus;
  auto_generated?: boolean;
}

function rowToDbPost(row: Row): DbPost {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    description: String(row.description ?? ''),
    content: String(row.content ?? ''),
    date: String(row.date),
    base_date: row.base_date ? String(row.base_date) : null,
    tags: String(row.tags ?? '[]'),
    series: String(row.series ?? ''),
    views: Number(row.views ?? 0),
    status: String(row.status ?? 'draft') as PostStatus,
    auto_generated: Number(row.auto_generated ?? 0),
    created_at: String(row.created_at ?? ''),
    updated_at: String(row.updated_at ?? ''),
    published_at: row.published_at ? String(row.published_at) : null,
  };
}

// Create a new post
export async function createPost(input: PostInput): Promise<DbPost> {
  const db = await getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  await db.execute({
    sql: `INSERT INTO posts (id, slug, title, description, content, date, base_date, tags, series, status, auto_generated, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      input.slug,
      input.title,
      input.description,
      input.content,
      input.date,
      input.base_date || null,
      stringifyTags(input.tags),
      input.series || '',
      input.status || 'draft',
      input.auto_generated ? 1 : 0,
      now,
      now,
    ],
  });

  const post = await getPostById(id);
  if (!post) throw new Error('Failed to create post');
  return post;
}

// Get post by ID
export async function getPostById(id: string): Promise<DbPost | null> {
  const db = await getDb();
  const result = await db.execute({
    sql: 'SELECT * FROM posts WHERE id = ?',
    args: [id],
  });
  if (result.rows.length === 0) return null;
  return rowToDbPost(result.rows[0]);
}

// Get post by slug
export async function getPostBySlugDb(slug: string): Promise<DbPost | null> {
  const db = await getDb();
  const result = await db.execute({
    sql: 'SELECT * FROM posts WHERE slug = ?',
    args: [slug],
  });
  if (result.rows.length === 0) return null;
  return rowToDbPost(result.rows[0]);
}

// Update a post
export async function updatePost(id: string, input: Partial<PostInput>): Promise<DbPost | null> {
  const db = await getDb();
  const existing = await getPostById(id);
  if (!existing) return null;

  const updates: string[] = [];
  const values: (string | number | null)[] = [];

  if (input.title !== undefined) { updates.push('title = ?'); values.push(input.title); }
  if (input.slug !== undefined) { updates.push('slug = ?'); values.push(input.slug); }
  if (input.description !== undefined) { updates.push('description = ?'); values.push(input.description); }
  if (input.content !== undefined) { updates.push('content = ?'); values.push(input.content); }
  if (input.date !== undefined) { updates.push('date = ?'); values.push(input.date); }
  if (input.base_date !== undefined) { updates.push('base_date = ?'); values.push(input.base_date || null); }
  if (input.tags !== undefined) { updates.push('tags = ?'); values.push(stringifyTags(input.tags)); }
  if (input.series !== undefined) { updates.push('series = ?'); values.push(input.series); }
  if (input.status !== undefined) {
    updates.push('status = ?');
    values.push(input.status);
    if (input.status === 'published' && !existing.published_at) {
      updates.push('published_at = ?');
      values.push(new Date().toISOString());
    }
  }

  updates.push("updated_at = ?");
  values.push(new Date().toISOString());
  values.push(id);

  await db.execute({
    sql: `UPDATE posts SET ${updates.join(', ')} WHERE id = ?`,
    args: values,
  });

  return getPostById(id);
}

// Delete a post
export async function deletePost(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db.execute({
    sql: 'DELETE FROM posts WHERE id = ?',
    args: [id],
  });
  return (result.rowsAffected ?? 0) > 0;
}

// List posts with filtering
export async function listPosts(options: {
  status?: PostStatus | 'all';
  series?: string;
  search?: string;
  page?: number;
  limit?: number;
  orderBy?: string;
} = {}): Promise<{ posts: DbPost[]; total: number }> {
  const db = await getDb();
  const {
    status = 'all',
    series,
    search,
    page = 1,
    limit = 20,
    orderBy = 'date DESC',
  } = options;

  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (status !== 'all') {
    conditions.push('status = ?');
    params.push(status);
  }

  if (series) {
    conditions.push('series = ?');
    params.push(series);
  }

  if (search) {
    conditions.push('(title LIKE ? OR description LIKE ? OR content LIKE ?)');
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await db.execute({
    sql: `SELECT COUNT(*) as count FROM posts ${whereClause}`,
    args: params,
  });
  const total = Number(countResult.rows[0]?.count ?? 0);

  const offset = (page - 1) * limit;
  const postsResult = await db.execute({
    sql: `SELECT * FROM posts ${whereClause} ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
    args: [...params, limit, offset],
  });

  const posts = postsResult.rows.map(rowToDbPost);
  return { posts, total };
}

// Get published posts (for frontend)
export async function getPublishedPosts(): Promise<PostMeta[]> {
  const db = await getDb();
  const result = await db.execute(
    "SELECT * FROM posts WHERE status = 'published' ORDER BY date DESC"
  );
  return result.rows.map(row => dbPostToPostMeta(rowToDbPost(row)));
}

// Get published post by slug (for frontend)
export async function getPublishedPostBySlug(slug: string): Promise<Post | null> {
  const db = await getDb();
  const result = await db.execute({
    sql: "SELECT * FROM posts WHERE slug = ? AND status = 'published'",
    args: [slug],
  });

  if (result.rows.length === 0) return null;
  const post = rowToDbPost(result.rows[0]);

  return {
    frontmatter: dbPostToPostMeta(post),
    content: post.content,
  };
}

// Get all published slugs
export async function getPublishedSlugs(): Promise<string[]> {
  const db = await getDb();
  const result = await db.execute(
    "SELECT slug FROM posts WHERE status = 'published'"
  );
  return result.rows.map(r => String(r.slug));
}

// Convert DbPost to PostMeta
export function dbPostToPostMeta(post: DbPost): PostMeta {
  return {
    title: post.title,
    slug: post.slug,
    description: post.description,
    date: post.date,
    base_date: post.base_date || post.date,
    tags: parseTags(post.tags),
    series: post.series || '',
    views: post.views,
    readingTime: calculateReadingTime(post.content),
  };
}

// Get post stats for dashboard
export async function getPostStats(): Promise<{
  total: number;
  published: number;
  draft: number;
  pending_review: number;
  archived: number;
  auto_generated: number;
}> {
  const db = await getDb();
  const result = await db.execute(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
      SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft,
      SUM(CASE WHEN status = 'pending_review' THEN 1 ELSE 0 END) as pending_review,
      SUM(CASE WHEN status = 'archived' THEN 1 ELSE 0 END) as archived,
      SUM(CASE WHEN auto_generated = 1 THEN 1 ELSE 0 END) as auto_generated
    FROM posts
  `);

  const stats = result.rows[0] || {};
  return {
    total: Number(stats.total ?? 0),
    published: Number(stats.published ?? 0),
    draft: Number(stats.draft ?? 0),
    pending_review: Number(stats.pending_review ?? 0),
    archived: Number(stats.archived ?? 0),
    auto_generated: Number(stats.auto_generated ?? 0),
  };
}

// Settings helpers
export async function getSetting(key: string): Promise<string | null> {
  const db = await getDb();
  const result = await db.execute({
    sql: 'SELECT value FROM settings WHERE key = ?',
    args: [key],
  });
  if (result.rows.length === 0) return null;
  return String(result.rows[0].value);
}

export async function setSetting(key: string, value: string): Promise<void> {
  const db = await getDb();
  await db.execute({
    sql: 'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, datetime("now"))',
    args: [key, value],
  });
}

export async function getAllSettings(): Promise<Record<string, string>> {
  const db = await getDb();
  const result = await db.execute('SELECT key, value FROM settings');
  const settings: Record<string, string> = {};
  for (const row of result.rows) {
    settings[String(row.key)] = String(row.value);
  }
  return settings;
}
