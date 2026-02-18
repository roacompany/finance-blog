import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'data', 'blog.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    try {
      db = new Database(DB_PATH);
      db.pragma('journal_mode = WAL');
      db.pragma('foreign_keys = ON');
      initializeDb(db);
    } catch (error) {
      console.error('[DB] Failed to initialize database:', error);
      throw new Error(`Database initialization failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return db;
}

function initializeDb(db: Database.Database) {
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

  const insertSetting = db.prepare(
    'INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)'
  );

  for (const [key, value] of defaultSettings) {
    insertSetting.run(key, value);
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
