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
      // Vercel serverless: /tmp만 쓰기 가능 (휘발성 - 재배포/콜드스타트 시 초기화됨)
      console.warn('[DB] ⚠️ Vercel 환경에서 /tmp DB 사용 중. 데이터가 재배포 시 초기화됩니다. 영구 저장을 위해 TURSO_DATABASE_URL 환경변수를 설정하세요.');
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
    `CREATE TABLE IF NOT EXISTS post_topics (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      tags TEXT NOT NULL DEFAULT '[]',
      series TEXT DEFAULT '',
      priority INTEGER DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'backlog',
      notes TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
    `CREATE INDEX IF NOT EXISTS idx_topics_status ON post_topics(status)`,
    `CREATE INDEX IF NOT EXISTS idx_topics_priority ON post_topics(priority DESC)`,
    `CREATE TABLE IF NOT EXISTS page_components (
      id TEXT PRIMARY KEY,
      page TEXT NOT NULL DEFAULT 'home',
      component_key TEXT NOT NULL,
      enabled INTEGER NOT NULL DEFAULT 1,
      "order" INTEGER NOT NULL DEFAULT 0,
      config TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
    `CREATE INDEX IF NOT EXISTS idx_page_components_page ON page_components(page, "order")`,
    `CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      active INTEGER NOT NULL DEFAULT 1,
      source TEXT DEFAULT 'web',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
  ], 'write');

  // Insert default settings if not exist
  const defaultSettings = [
    ['site_title', '금융답게 바라보기, 로아의 시선'],
    ['site_description', '금융을 금융답게 풀어냅니다.'],
    ['site_url', 'https://www.roafinance.me'],
    ['author_name', '로아'],
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

  // 기본 토픽 백로그 시딩
  await seedDefaultTopics(db);

  // 홈 페이지 컴포넌트 레이아웃 시딩
  await seedDefaultPageComponents(db);
}

async function syncMdxToDb(db: Client) {
  try {
    const { readAllMdxFiles } = await import('./content');
    const mdxPosts = readAllMdxFiles();

    for (const post of mdxPosts) {
      const { v4: uuidv4 } = await import('uuid');
      const now = new Date().toISOString();

      // slug 기준으로 이미 존재하면 내용 업데이트, 없으면 새로 삽입
      const existing = await db.execute({
        sql: 'SELECT id FROM posts WHERE slug = ?',
        args: [post.slug],
      });

      if (existing.rows.length > 0) {
        // 기존 포스트 업데이트 (status, views 등 사용자 데이터는 보존)
        await db.execute({
          sql: `UPDATE posts SET title = ?, description = ?, content = ?, date = ?, base_date = ?, tags = ?, series = ?, updated_at = ?
                WHERE slug = ?`,
          args: [
            post.title,
            post.description,
            post.content,
            post.date,
            post.base_date || null,
            JSON.stringify(post.tags),
            post.series || '',
            now,
            post.slug,
          ],
        });
      } else {
        // 새 포스트 삽입
        await db.execute({
          sql: `INSERT INTO posts (id, slug, title, description, content, date, base_date, tags, series, views, status, created_at, updated_at, published_at)
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
    }
  } catch (error) {
    console.error('[DB] MDX sync failed (non-critical):', error);
  }
}

async function seedDefaultTopics(db: Client) {
  try {
    const existing = await db.execute('SELECT COUNT(*) as count FROM post_topics');
    if (Number(existing.rows[0]?.count ?? 0) > 0) return;

    const { v4: uuidv4 } = await import('uuid');
    const topics = [
      { title: '2026 한국은행 기준금리 전망과 투자 전략', tags: ['기준금리', '투자', '한국은행'], series: 'Series 01. 금리·통화정책', priority: 2 },
      { title: 'COFIX 금리 변동이 내 대출이자에 미치는 영향', tags: ['COFIX', '대출금리', '변동금리'], series: 'Series 01. 금리·통화정책', priority: 1 },
      { title: '전세자금대출 완벽 가이드: 조건부터 금리 비교까지', tags: ['전세', '대출', '부동산'], series: 'Series 02. 실전 대출 가이드', priority: 2 },
      { title: '신용대출 vs 담보대출, 나에게 맞는 선택은?', tags: ['신용대출', '담보대출', '대출'], series: 'Series 02. 실전 대출 가이드', priority: 1 },
      { title: 'ETF 투자 입문: 초보자를 위한 완벽 가이드', tags: ['ETF', '투자', '주식'], series: '', priority: 1 },
      { title: '채권 투자 기초: 금리와 채권 가격의 관계', tags: ['채권', '금리', '투자'], series: 'Series 01. 금리·통화정책', priority: 0 },
      { title: '부동산 세금 총정리: 취득세부터 양도세까지', tags: ['부동산', '세금', '양도세'], series: '', priority: 1 },
      { title: '연말정산 절세 팁: 직장인이 놓치기 쉬운 공제 항목', tags: ['세금', '연말정산', '절약'], series: '', priority: 0 },
      { title: '적금 vs 예금, 2026년 수익률 비교 분석', tags: ['적금', '예금', '금리'], series: '', priority: 0 },
      { title: '금리인하 시기, 자산 포트폴리오 리밸런싱 전략', tags: ['금리인하', '투자', '포트폴리오'], series: 'Series 01. 금리·통화정책', priority: 1 },
      { title: '주택담보대출 갈아타기: 대환대출 체크리스트', tags: ['주담대', '대환대출', '대출'], series: 'Series 02. 실전 대출 가이드', priority: 2 },
      { title: '스트레스 DSR 3단계, 내 대출한도는 얼마나 줄까?', tags: ['DSR', '대출한도', '스트레스DSR'], series: 'Series 02. 실전 대출 가이드', priority: 1 },
      { title: '해외 송금 수수료 절약법: 서비스별 비교', tags: ['해외송금', '수수료', '절약'], series: '', priority: 0 },
      { title: 'ISA 계좌 활용법: 세제혜택 최대화 전략', tags: ['ISA', '절세', '투자'], series: '', priority: 0 },
      { title: '물가연동채권(TIPS)으로 인플레이션 헤지하기', tags: ['채권', '인플레이션', '투자'], series: '', priority: 0 },
    ];

    for (const topic of topics) {
      await db.execute({
        sql: `INSERT INTO post_topics (id, title, tags, series, priority) VALUES (?, ?, ?, ?, ?)`,
        args: [uuidv4(), topic.title, JSON.stringify(topic.tags), topic.series, topic.priority],
      });
    }
  } catch (error) {
    console.error('[DB] Topic seed failed (non-critical):', error);
  }
}

async function seedDefaultPageComponents(db: Client) {
  try {
    const existing = await db.execute({ sql: 'SELECT COUNT(*) as count FROM page_components WHERE page = ?', args: ['home'] });
    if (Number(existing.rows[0]?.count ?? 0) > 0) return;

    const { v4: uuidv4 } = await import('uuid');
    const defaultComponents = [
      { component_key: 'promo-banner',      enabled: 0, order: 0, config: { text: '오늘 가입하면 전체 아카이브를 무료로 열람할 수 있어요', ctaText: '무료 가입', ctaLink: '/membership', bgColor: '#E8D5B0', textColor: '#0A0A0A', enabled: true } },
      { component_key: 'hero-today',        enabled: 1, order: 1, config: { badgeText: '오늘의 노트', showCountdown: true, ctaText: '전문 읽기' } },
      { component_key: 'series-carousel',   enabled: 1, order: 2, config: { title: '시리즈로 읽기', seriesIds: [], showAll: true } },
      { component_key: 'article-grid',      enabled: 1, order: 3, config: { title: '아카이브', limit: 9 } },
      { component_key: 'membership-banner', enabled: 1, order: 4, config: { headline: '지나간 글은 멤버만 읽을 수 있어요', subtext: '이메일 하나로 무료 가입. 모든 아카이브 글과 시리즈를 열람하세요.', ctaText: '무료로 멤버 가입하기', showBenefits: true } },
    ];

    for (const c of defaultComponents) {
      await db.execute({
        sql: `INSERT INTO page_components (id, page, component_key, enabled, "order", config) VALUES (?, 'home', ?, ?, ?, ?)`,
        args: [uuidv4(), c.component_key, c.enabled, c.order, JSON.stringify(c.config)],
      });
    }
  } catch (error) {
    console.error('[DB] Page components seed failed (non-critical):', error);
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
