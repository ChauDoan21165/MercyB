// Path: src/lib/translateWord.ts
// Hybrid translation lookup — v1 implements room-keyword lookup only.
// API path (Claude Haiku via Supabase edge fn) comes in v1.1.

export interface RoomKeywordEntry {
  keywords_en?: unknown;
  keywords_vi?: unknown;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item): item is string => item.length > 0);
}

/**
 * Look up a Vietnamese translation for an English word inside a room's entries.
 * Matches positionally within each entry's keywords_en / keywords_vi arrays.
 * Returns null when the word is not found or has no paired translation.
 */
export function lookupRoomTranslation(
  contentEn: string,
  entries: RoomKeywordEntry[] | null | undefined,
): string | null {
  if (!entries || entries.length === 0) return null;
  const needle = contentEn.trim().toLowerCase();
  if (!needle) return null;

  for (const entry of entries) {
    const en = asStringArray(entry.keywords_en);
    const vi = asStringArray(entry.keywords_vi);
    if (en.length === 0 || vi.length === 0) continue;

    const index = en.findIndex((k) => k.toLowerCase() === needle);
    if (index >= 0 && index < vi.length) return vi[index];
  }

  return null;
}
