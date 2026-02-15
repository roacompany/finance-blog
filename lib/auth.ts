import { getDb } from './db';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';

const SESSION_COOKIE = 'admin_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// In-memory session store (sufficient for single-instance blog)
const sessions = new Map<string, { userId: string; expiresAt: number }>();

export async function createAdminUser(
  username: string,
  password: string,
  displayName: string = 'Admin'
): Promise<boolean> {
  const db = getDb();
  const hash = bcrypt.hashSync(password, 12);
  const id = uuidv4();

  try {
    db.prepare(
      'INSERT INTO admin_users (id, username, password_hash, display_name) VALUES (?, ?, ?, ?)'
    ).run(id, username, hash, displayName);
    return true;
  } catch {
    return false;
  }
}

export async function verifyCredentials(
  username: string,
  password: string
): Promise<{ id: string; username: string; display_name: string } | null> {
  const db = getDb();
  const user = db
    .prepare('SELECT id, username, password_hash, display_name FROM admin_users WHERE username = ?')
    .get(username) as { id: string; username: string; password_hash: string; display_name: string } | undefined;

  if (!user) return null;
  if (!bcrypt.compareSync(password, user.password_hash)) return null;

  return { id: user.id, username: user.username, display_name: user.display_name };
}

export async function createSession(userId: string): Promise<string> {
  const sessionId = uuidv4();
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;

  sessions.set(sessionId, { userId, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });

  return sessionId;
}

export async function getSession(): Promise<{ userId: string } | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) return null;

  const session = sessions.get(sessionId);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    sessions.delete(sessionId);
    return null;
  }

  return { userId: session.userId };
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (sessionId) {
    sessions.delete(sessionId);
  }

  cookieStore.delete(SESSION_COOKIE);
}

export async function requireAuth(): Promise<{ userId: string }> {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

// Ensure default admin exists
export function ensureDefaultAdmin() {
  const db = getDb();
  const adminCount = db.prepare('SELECT COUNT(*) as count FROM admin_users').get() as { count: number };

  if (adminCount.count === 0) {
    const hash = bcrypt.hashSync('admin1234', 12);
    const id = uuidv4();
    db.prepare(
      'INSERT INTO admin_users (id, username, password_hash, display_name) VALUES (?, ?, ?, ?)'
    ).run(id, 'admin', hash, '관리자');
  }
}
