import { getDb } from './db';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET || 'roa-finance-blog-session-secret-k8x2m';
const SESSION_COOKIE = 'admin_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// ─── HMAC 서명 쿠키 기반 Stateless 세션 ───
// 서버 메모리에 의존하지 않음 → Vercel serverless 완벽 호환
// 쿠키 값: base64url(payload).hmac_signature

function signPayload(encoded: string): string {
  return crypto.createHmac('sha256', SESSION_SECRET).update(encoded).digest('hex');
}

function createSignedToken(userId: string, displayName: string): string {
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = JSON.stringify({ userId, displayName, expiresAt });
  const encoded = Buffer.from(payload).toString('base64url');
  const signature = signPayload(encoded);
  return `${encoded}.${signature}`;
}

function verifySignedToken(token: string): { userId: string; displayName: string } | null {
  const dotIndex = token.indexOf('.');
  if (dotIndex === -1) return null;

  const encoded = token.substring(0, dotIndex);
  const signature = token.substring(dotIndex + 1);
  if (!encoded || !signature) return null;

  // 타이밍 공격 방지를 위한 안전한 비교
  const expectedSignature = signPayload(encoded);
  try {
    if (!crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSignature, 'hex'))) {
      return null;
    }
  } catch {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString());
    if (!payload.userId || !payload.expiresAt) return null;
    if (Date.now() > payload.expiresAt) return null;
    return { userId: payload.userId, displayName: payload.displayName || '관리자' };
  } catch {
    return null;
  }
}

// ─── 관리자 계정 관리 ───

export async function createAdminUser(
  username: string,
  password: string,
  displayName: string = 'Admin'
): Promise<boolean> {
  const db = await getDb();
  const hash = bcrypt.hashSync(password, 12);
  const id = uuidv4();

  try {
    await db.execute({
      sql: 'INSERT INTO admin_users (id, username, password_hash, display_name) VALUES (?, ?, ?, ?)',
      args: [id, username, hash, displayName],
    });
    return true;
  } catch {
    return false;
  }
}

export async function verifyCredentials(
  username: string,
  password: string
): Promise<{ id: string; username: string; display_name: string } | null> {
  const db = await getDb();
  const result = await db.execute({
    sql: 'SELECT id, username, password_hash, display_name FROM admin_users WHERE username = ?',
    args: [username],
  });

  if (result.rows.length === 0) return null;
  const user = result.rows[0];

  if (!bcrypt.compareSync(password, String(user.password_hash))) return null;

  return {
    id: String(user.id),
    username: String(user.username),
    display_name: String(user.display_name),
  };
}

// ─── 세션 관리 (Stateless 서명 쿠키) ───

export async function createSession(userId: string, displayName?: string): Promise<string> {
  const token = createSignedToken(userId, displayName || '관리자');

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });

  return token;
}

export async function getSession(): Promise<{ userId: string; displayName: string } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    if (!token) return null;

    const session = verifySignedToken(token);
    if (!session) return null;

    return { userId: session.userId, displayName: session.displayName };
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

export async function requireAuth(): Promise<{ userId: string }> {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

// ─── 기본 관리자 생성 ───

export async function ensureDefaultAdmin() {
  const db = await getDb();
  const result = await db.execute('SELECT COUNT(*) as count FROM admin_users');
  const count = Number(result.rows[0]?.count ?? 0);

  if (count === 0) {
    const hash = bcrypt.hashSync('admin1234', 12);
    const id = uuidv4();
    await db.execute({
      sql: 'INSERT INTO admin_users (id, username, password_hash, display_name) VALUES (?, ?, ?, ?)',
      args: [id, 'admin', hash, '관리자'],
    });
  }
}
