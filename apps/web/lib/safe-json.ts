/**
 * Safely parse tags JSON string from DB.
 * Returns empty array if parsing fails.
 */
export function safeParseTags(tagsStr: string | null | undefined): string[] {
  if (!tagsStr) return [];
  try {
    const parsed = JSON.parse(tagsStr);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    console.error('[safeParseTags] Failed to parse:', tagsStr);
    return [];
  }
}

/**
 * Safely parse JSON request body.
 * Returns null if parsing fails.
 */
export async function safeParseBody<T = Record<string, unknown>>(
  request: Request
): Promise<T | null> {
  try {
    return await request.json() as T;
  } catch {
    return null;
  }
}
