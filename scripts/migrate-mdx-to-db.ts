/**
 * Migration Script: MDX files → SQLite Database
 * Run: npx tsx scripts/migrate-mdx-to-db.ts
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const DB_PATH = path.join(process.cwd(), 'data', 'blog.db');
const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

// Ensure data directory
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    display_name TEXT NOT NULL DEFAULT 'Admin',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS posts (
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
    status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'pending_review', 'published', 'archived')),
    auto_generated INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    published_at TEXT
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
  CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
  CREATE INDEX IF NOT EXISTS idx_posts_date ON posts(date DESC);
  CREATE INDEX IF NOT EXISTS idx_posts_series ON posts(series);
`);

// Create default admin user
const adminCount = (db.prepare('SELECT COUNT(*) as count FROM admin_users').get() as { count: number }).count;
if (adminCount === 0) {
  const hash = bcrypt.hashSync('admin1234', 12);
  db.prepare(
    'INSERT INTO admin_users (id, username, password_hash, display_name) VALUES (?, ?, ?, ?)'
  ).run(uuidv4(), 'admin', hash, '관리자');
  console.log('Default admin user created (admin / admin1234)');
}

// Insert default settings
const defaultSettings = [
  ['site_title', '금융답게 바라보기, 로아의 시선'],
  ['site_description', '금융을 금융답게 풀어냅니다.'],
  ['site_url', 'https://www.roafinance.me'],
  ['author_name', '로아'],
  ['auto_post_enabled', 'true'],
  ['auto_post_time', '02:00'],
  ['posts_per_page', '12'],
];

const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
for (const [key, value] of defaultSettings) {
  insertSetting.run(key, value);
}
console.log('Default settings initialized');

// Migrate MDX posts
if (!fs.existsSync(POSTS_DIR)) {
  console.log('No posts directory found. Skipping migration.');
  process.exit(0);
}

const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.mdx'));
console.log(`Found ${files.length} MDX files to migrate`);

const insertPost = db.prepare(`
  INSERT OR IGNORE INTO posts (id, slug, title, description, content, date, base_date, tags, series, views, status, auto_generated, created_at, updated_at, published_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

let migrated = 0;
let skipped = 0;

for (const file of files) {
  const filePath = path.join(POSTS_DIR, file);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  // Check if already exists
  const existing = db.prepare('SELECT id FROM posts WHERE slug = ?').get(data.slug);
  if (existing) {
    console.log(`  SKIP: ${data.slug} (already exists)`);
    skipped++;
    continue;
  }

  const now = new Date().toISOString();
  insertPost.run(
    uuidv4(),
    data.slug || file.replace('.mdx', ''),
    data.title || '',
    data.description || '',
    content,
    data.date || now,
    data.base_date || null,
    JSON.stringify(data.tags || []),
    data.series || '',
    data.views || 0,
    'published', // Existing posts are published
    0,
    now,
    now,
    now // published_at
  );

  console.log(`  OK: ${data.slug}`);
  migrated++;
}

console.log(`\nMigration complete: ${migrated} migrated, ${skipped} skipped`);
db.close();
