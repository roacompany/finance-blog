import { createClient, type Client } from '@libsql/client';
import path from 'path';
import fs from 'fs';

let client: Client | null = null;
let initialized = false;

function getClient(): Client {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;

    if (url) {
      // 원격 DB (Turso) 또는 명시적 로컬 DB
      client = createClient({
        url,
        authToken: process.env.TURSO_AUTH_TOKEN,
      });
    } else if (process.env.VERCEL) {
      // Vercel serverless: /tmp만 쓰기 가능
      client = createClient({
        url: 'file:/tmp/blog.db',
      });
    } else {
      // 로컬 개발용 파일 DB
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const dbPath = path.join(dataDir, 'blog.db');
      client = createClient({
        url: `file:${dbPath}`,
      });
    }
  }
  return client;
}

export async function getDb(): Promise<Client> {
  const db = getClient();
  if (!initialized) {
    await initializeDb(db);
    initialized = true;
  }
  return db;
}

async function initializeDb(db: Client) {
  await db.batch([
    `CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL DEFAULT 'Admin',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      date TEXT NOT NULL,
      base_date TEXT,
      tags TEXT NOT NULL DEFAULT '[]',
      series TEXT DEFAULT '',
      views INTEGER DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'draft',
      auto_generated INTEGER DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      published_at TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
    `CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status)`,
    `CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug)`,
    `CREATE INDEX IF NOT EXISTS idx_posts_date ON posts(date DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_posts_series ON posts(series)`,
  ], 'write');

  // Insert default settings if not exist
  const defaultSettings = [
    ['site_title', '금융답게 바라보기, 로아의 시선'],
    ['site_description', '금융을 금융답게 풀어냅니다.'],
    ['site_url', 'https://www.roafinance.me'],
    ['author_name', '로아'],
    ['auto_post_enabled', 'true'],
    ['auto_post_time', '02:00'],
    ['posts_per_page', '12'],
  ];

  for (const [key, value] of defaultSettings) {
    await db.execute({
      sql: 'INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)',
      args: [key, value],
    });
  }

  // MDX 파일을 DB로 동기화 (어드민 패널에서 MDX 포스트 표시)
  await syncMdxToDb(db);
}

async function syncMdxToDb(db: Client) {
  try {
    const { readAllMdxFiles } = await import('./content');
    const mdxPosts = readAllMdxFiles();

    for (const post of mdxPosts) {
      const { v4: uuidv4 } = await import('uuid');
      const now = new Date().toISOString();
      await db.execute({
        sql: `INSERT OR IGNORE INTO posts (id, slug, title, description, content, date, base_date, tags, series, views, status, created_at, updated_at, published_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, ?)`,
        args: [
          uuidv4(),
          post.slug,
          post.title,
          post.description,
          post.content,
          post.date,
          post.base_date || null,
          JSON.stringify(post.tags),
          post.series || '',
          typeof post.views === 'number' ? post.views : 0,
          now,
          now,
          now,
        ],
      });
    }
  } catch (error) {
    console.error('[DB] MDX sync failed (non-critical):', error);
  }
}

// Helper: Parse tags from JSON string
export function parseTags(tagsJson: string): string[] {
  try {
    return JSON.parse(tagsJson);
  } catch {
    return [];
  }
}

// Helper: Stringify tags to JSON
export function stringifyTags(tags: string[]): string {
  return JSON.stringify(tags);
}
