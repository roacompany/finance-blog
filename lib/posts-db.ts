import { getDb, parseTags, stringifyTags } from './db';
import { v4 as uuidv4 } from 'uuid';
import { calculateReadingTime, type PostMeta, type Post } from './content';

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

// Create a new post
export function createPost(input: PostInput): DbPost {
  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO posts (id, slug, title, description, content, date, base_date, tags, series, status, auto_generated, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
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
    now
  );

  return getPostById(id)!;
}

// Get post by ID
export function getPostById(id: string): DbPost | null {
  const db = getDb();
  return db.prepare('SELECT * FROM posts WHERE id = ?').get(id) as DbPost | null;
}

// Get post by slug
export function getPostBySlugDb(slug: string): DbPost | null {
  const db = getDb();
  return db.prepare('SELECT * FROM posts WHERE slug = ?').get(slug) as DbPost | null;
}

// Update a post
export function updatePost(id: string, input: Partial<PostInput>): DbPost | null {
  const db = getDb();
  const existing = getPostById(id);
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

  db.prepare(`UPDATE posts SET ${updates.join(', ')} WHERE id = ?`).run(...values);

  return getPostById(id);
}

// Delete a post
export function deletePost(id: string): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM posts WHERE id = ?').run(id);
  return result.changes > 0;
}

// List posts with filtering
export function listPosts(options: {
  status?: PostStatus | 'all';
  series?: string;
  search?: string;
  page?: number;
  limit?: number;
  orderBy?: string;
} = {}): { posts: DbPost[]; total: number } {
  const db = getDb();
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

  const total = (db.prepare(`SELECT COUNT(*) as count FROM posts ${whereClause}`).get(...params) as { count: number }).count;

  const offset = (page - 1) * limit;
  const posts = db.prepare(
    `SELECT * FROM posts ${whereClause} ORDER BY ${orderBy} LIMIT ? OFFSET ?`
  ).all(...params, limit, offset) as DbPost[];

  return { posts, total };
}

// Get published posts (for frontend)
export function getPublishedPosts(): PostMeta[] {
  const db = getDb();
  const posts = db.prepare(
    "SELECT * FROM posts WHERE status = 'published' ORDER BY date DESC"
  ).all() as DbPost[];

  return posts.map(dbPostToPostMeta);
}

// Get published post by slug (for frontend)
export function getPublishedPostBySlug(slug: string): Post | null {
  const db = getDb();
  const post = db.prepare(
    "SELECT * FROM posts WHERE slug = ? AND status = 'published'"
  ).get(slug) as DbPost | null;

  if (!post) return null;

  return {
    frontmatter: dbPostToPostMeta(post),
    content: post.content,
  };
}

// Get all published slugs
export function getPublishedSlugs(): string[] {
  const db = getDb();
  const rows = db.prepare(
    "SELECT slug FROM posts WHERE status = 'published'"
  ).all() as { slug: string }[];
  return rows.map(r => r.slug);
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
export function getPostStats(): {
  total: number;
  published: number;
  draft: number;
  pending_review: number;
  archived: number;
  auto_generated: number;
} {
  const db = getDb();
  const stats = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
      SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft,
      SUM(CASE WHEN status = 'pending_review' THEN 1 ELSE 0 END) as pending_review,
      SUM(CASE WHEN status = 'archived' THEN 1 ELSE 0 END) as archived,
      SUM(CASE WHEN auto_generated = 1 THEN 1 ELSE 0 END) as auto_generated
    FROM posts
  `).get() as Record<string, number>;

  return {
    total: stats.total || 0,
    published: stats.published || 0,
    draft: stats.draft || 0,
    pending_review: stats.pending_review || 0,
    archived: stats.archived || 0,
    auto_generated: stats.auto_generated || 0,
  };
}

// Settings helpers
export function getSetting(key: string): string | null {
  const db = getDb();
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as { value: string } | undefined;
  return row?.value ?? null;
}

export function setSetting(key: string, value: string): void {
  const db = getDb();
  db.prepare(
    'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, datetime("now"))'
  ).run(key, value);
}

export function getAllSettings(): Record<string, string> {
  const db = getDb();
  const rows = db.prepare('SELECT key, value FROM settings').all() as { key: string; value: string }[];
  const settings: Record<string, string> = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  return settings;
}
