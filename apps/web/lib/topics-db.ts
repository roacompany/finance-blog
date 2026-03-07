import { getDb, parseTags, stringifyTags } from './db';
import { v4 as uuidv4 } from 'uuid';
import type { Row } from '@libsql/client';

export type TopicStatus = 'backlog' | 'in_progress' | 'completed' | 'skipped';

export interface DbTopic {
  id: string;
  title: string;
  description: string;
  tags: string; // JSON string
  series: string;
  priority: number; // 0=normal, 1=high, 2=urgent
  status: TopicStatus;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface TopicInput {
  title: string;
  description?: string;
  tags?: string[];
  series?: string;
  priority?: number;
  status?: TopicStatus;
  notes?: string;
}

function rowToTopic(row: Row): DbTopic {
  return {
    id: String(row.id),
    title: String(row.title),
    description: String(row.description ?? ''),
    tags: String(row.tags ?? '[]'),
    series: String(row.series ?? ''),
    priority: Number(row.priority ?? 0),
    status: String(row.status ?? 'backlog') as TopicStatus,
    notes: String(row.notes ?? ''),
    created_at: String(row.created_at ?? ''),
    updated_at: String(row.updated_at ?? ''),
  };
}

export async function createTopic(input: TopicInput): Promise<DbTopic> {
  const db = await getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  await db.execute({
    sql: `INSERT INTO post_topics (id, title, description, tags, series, priority, status, notes, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      input.title,
      input.description || '',
      stringifyTags(input.tags || []),
      input.series || '',
      input.priority ?? 0,
      input.status || 'backlog',
      input.notes || '',
      now,
      now,
    ],
  });

  const topic = await getTopicById(id);
  if (!topic) throw new Error('Failed to create topic');
  return topic;
}

export async function getTopicById(id: string): Promise<DbTopic | null> {
  const db = await getDb();
  const result = await db.execute({
    sql: 'SELECT * FROM post_topics WHERE id = ?',
    args: [id],
  });
  if (result.rows.length === 0) return null;
  return rowToTopic(result.rows[0]);
}

export async function updateTopic(id: string, input: Partial<TopicInput>): Promise<DbTopic | null> {
  const db = await getDb();
  const existing = await getTopicById(id);
  if (!existing) return null;

  const updates: string[] = [];
  const values: (string | number | null)[] = [];

  if (input.title !== undefined) { updates.push('title = ?'); values.push(input.title); }
  if (input.description !== undefined) { updates.push('description = ?'); values.push(input.description); }
  if (input.tags !== undefined) { updates.push('tags = ?'); values.push(stringifyTags(input.tags)); }
  if (input.series !== undefined) { updates.push('series = ?'); values.push(input.series); }
  if (input.priority !== undefined) { updates.push('priority = ?'); values.push(input.priority); }
  if (input.status !== undefined) { updates.push('status = ?'); values.push(input.status); }
  if (input.notes !== undefined) { updates.push('notes = ?'); values.push(input.notes); }

  updates.push("updated_at = ?");
  values.push(new Date().toISOString());
  values.push(id);

  await db.execute({
    sql: `UPDATE post_topics SET ${updates.join(', ')} WHERE id = ?`,
    args: values,
  });

  return getTopicById(id);
}

export async function deleteTopic(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db.execute({
    sql: 'DELETE FROM post_topics WHERE id = ?',
    args: [id],
  });
  return (result.rowsAffected ?? 0) > 0;
}

export async function listTopics(options: {
  status?: TopicStatus | 'all';
  page?: number;
  limit?: number;
} = {}): Promise<{ topics: DbTopic[]; total: number }> {
  const db = await getDb();
  const { status = 'all', page = 1, limit = 50 } = options;

  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (status !== 'all') {
    conditions.push('status = ?');
    params.push(status);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await db.execute({
    sql: `SELECT COUNT(*) as count FROM post_topics ${whereClause}`,
    args: params,
  });
  const total = Number(countResult.rows[0]?.count ?? 0);

  const offset = (page - 1) * limit;
  const result = await db.execute({
    sql: `SELECT * FROM post_topics ${whereClause} ORDER BY priority DESC, created_at DESC LIMIT ? OFFSET ?`,
    args: [...params, limit, offset],
  });

  return { topics: result.rows.map(rowToTopic), total };
}

export async function getTopicStats(): Promise<{
  total: number;
  backlog: number;
  in_progress: number;
  completed: number;
  skipped: number;
}> {
  const db = await getDb();
  const result = await db.execute(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'backlog' THEN 1 ELSE 0 END) as backlog,
      SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
      SUM(CASE WHEN status = 'skipped' THEN 1 ELSE 0 END) as skipped
    FROM post_topics
  `);

  const stats = result.rows[0] || {};
  return {
    total: Number(stats.total ?? 0),
    backlog: Number(stats.backlog ?? 0),
    in_progress: Number(stats.in_progress ?? 0),
    completed: Number(stats.completed ?? 0),
    skipped: Number(stats.skipped ?? 0),
  };
}

// Helper: parse tags for frontend
export function topicToJson(topic: DbTopic) {
  return {
    ...topic,
    tags: parseTags(topic.tags),
  };
}
