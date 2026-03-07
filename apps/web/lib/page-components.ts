/**
 * page_components — libSQL 기반 CMS 데이터 레이어
 *
 * page_components 테이블: db.ts initializeDb에서 자동 생성 + 시딩
 */

import { getDb } from './db';
import { v4 as uuidv4 } from 'uuid';
import {
  DEFAULT_HOME_LAYOUT,
  type PageComponent,
  type ComponentConfig,
} from './component-registry';

// ─── Row → PageComponent 변환 ───────────────────────────────────────────────

function rowToComponent(row: Record<string, unknown>): PageComponent {
  return {
    id:            String(row.id),
    page:          String(row.page),
    component_key: String(row.component_key),
    enabled:       Boolean(row.enabled),
    order:         Number(row.order),
    config:        JSON.parse(String(row.config ?? '{}')),
    updated_at:    String(row.updated_at ?? ''),
  };
}

// ─── Read ────────────────────────────────────────────────────────────────────

export async function getPageComponents(page = 'home'): Promise<PageComponent[]> {
  try {
    const db = await getDb();
    const result = await db.execute({
      sql: `SELECT * FROM page_components WHERE page = ? ORDER BY "order" ASC`,
      args: [page],
    });

    if (result.rows.length === 0) {
      // DB는 있지만 데이터 없음 → fallback
      return DEFAULT_HOME_LAYOUT.map((c, i) => ({
        ...c,
        id: String(i),
        updated_at: new Date().toISOString(),
      }));
    }

    return result.rows.map(row => rowToComponent(row as Record<string, unknown>));
  } catch (error) {
    console.error('[page-components] fetch error:', error);
    return DEFAULT_HOME_LAYOUT.map((c, i) => ({
      ...c,
      id: String(i),
      updated_at: new Date().toISOString(),
    }));
  }
}

// ─── Write ───────────────────────────────────────────────────────────────────

export async function updatePageComponent(
  id: string,
  patch: Partial<Pick<PageComponent, 'enabled' | 'order' | 'config'>>
): Promise<PageComponent | null> {
  try {
    const db = await getDb();
    const sets: string[] = [];
    const args: (string | number | null)[] = [];

    if (patch.enabled !== undefined) { sets.push('enabled = ?');         args.push(patch.enabled ? 1 : 0); }
    if (patch.order   !== undefined) { sets.push('"order" = ?');         args.push(patch.order); }
    if (patch.config  !== undefined) { sets.push('config = ?');          args.push(JSON.stringify(patch.config)); }
    sets.push('updated_at = ?');
    args.push(new Date().toISOString());
    args.push(id);

    await db.execute({
      sql: `UPDATE page_components SET ${sets.join(', ')} WHERE id = ?`,
      args,
    });

    const result = await db.execute({
      sql: 'SELECT * FROM page_components WHERE id = ?',
      args: [id],
    });

    return result.rows[0] ? rowToComponent(result.rows[0] as Record<string, unknown>) : null;
  } catch (error) {
    console.error('[page-components] update error:', error);
    return null;
  }
}

export async function upsertPageComponent(
  component: Omit<PageComponent, 'id' | 'updated_at'>
): Promise<PageComponent | null> {
  try {
    const db = await getDb();
    const id = uuidv4();
    const now = new Date().toISOString();
    await db.execute({
      sql: `INSERT INTO page_components (id, page, component_key, enabled, "order", config, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        component.page,
        component.component_key,
        component.enabled ? 1 : 0,
        component.order,
        JSON.stringify(component.config),
        now,
        now,
      ],
    });

    const result = await db.execute({
      sql: 'SELECT * FROM page_components WHERE id = ?',
      args: [id],
    });

    return result.rows[0] ? rowToComponent(result.rows[0] as Record<string, unknown>) : null;
  } catch (error) {
    console.error('[page-components] upsert error:', error);
    return null;
  }
}

export async function reorderPageComponents(orderedIds: string[]): Promise<boolean> {
  try {
    const db = await getDb();
    const now = new Date().toISOString();
    for (let i = 0; i < orderedIds.length; i++) {
      await db.execute({
        sql: `UPDATE page_components SET "order" = ?, updated_at = ? WHERE id = ?`,
        args: [i, now, orderedIds[i]],
      });
    }
    return true;
  } catch (error) {
    console.error('[page-components] reorder error:', error);
    return false;
  }
}

export async function togglePageComponent(id: string, enabled: boolean): Promise<PageComponent | null> {
  return updatePageComponent(id, { enabled });
}

export async function updatePageComponentConfig(id: string, config: ComponentConfig): Promise<PageComponent | null> {
  return updatePageComponent(id, { config });
}
