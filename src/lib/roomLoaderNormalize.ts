/**
 * File: roomLoaderNormalize.ts
 * Path: src/lib/roomLoaderNormalize.ts
 */

import { processEntriesOptimized } from "./roomLoaderHelpers";
import type {
  BaseRoomEntry,
  JsonRoom,
  NormalizedRoomEntry,
  RoomMeta,
} from "./roomLoader";

export type KeywordMenu = {
  en: string[];
  vi: string[];
};

export interface NormalizedEntriesResult {
  merged: NormalizedRoomEntry[];
  keywordMenu: KeywordMenu;
}

interface ProcessedEntriesResult {
  merged?: unknown;
  keywordMenu?: {
    en?: unknown;
    vi?: unknown;
  };
}

export function normalizeEntries(entries: BaseRoomEntry[]): NormalizedEntriesResult {
  const processed = processEntriesOptimized(entries) as ProcessedEntriesResult;

  return {
    merged: Array.isArray(processed?.merged)
      ? (processed.merged as NormalizedRoomEntry[])
      : [],
    keywordMenu: {
      en: normalizeStringArray(processed?.keywordMenu?.en),
      vi: normalizeStringArray(processed?.keywordMenu?.vi),
    },
  };
}

export function salvageDbEntries(entries: BaseRoomEntry[]): NormalizedEntriesResult {
  const merged: NormalizedRoomEntry[] = entries.map((row, index) => {
    const safeRow = isRecord(row) ? (row as BaseRoomEntry) : undefined;

    const slug =
      firstNonEmptyString(
        safeRow?.slug,
        safeRow?.keyword_en,
        safeRow?.keywordEn,
        safeRow?.keyword_vi,
        safeRow?.keywordVi,
        firstArrayString(safeRow?.keywords_en),
        firstArrayString(safeRow?.keywords_vi),
        firstArrayString(safeRow?.keywords),
        safeRow?.title,
        safeRow?.title_en,
        safeRow?.titleEn,
      ) || `entry-${index}`;

    const copy = normalizeCopyValue(safeRow?.copy);

    return {
      slug,
      ...(copy !== undefined ? { copy } : {}),
    };
  });

  const keywordMenu = buildKeywordMenu(entries, merged);

  return {
    merged,
    keywordMenu,
  };
}

export function normalizeTier(meta: RoomMeta | JsonRoom | null): string {
  const raw =
    firstNonEmptyString(meta?.roomTier, meta?.tier, meta?.accessTier) || "level0";

  const value = raw.toLowerCase();

  if (value.includes("level3")) return "level3";
  if (value.includes("level2")) return "level2";
  if (value.includes("level1")) return "level1";
  if (value.includes("premium")) return "premium";
  if (value.includes("level0")) return "level0";

  return value;
}

function buildKeywordMenu(
  entries: BaseRoomEntry[],
  merged: NormalizedRoomEntry[],
): KeywordMenu {
  const en: string[] = [];
  const vi: string[] = [];

  entries.forEach((row, index) => {
    const safeRow = isRecord(row) ? (row as BaseRoomEntry) : undefined;
    const fallbackSlug = merged[index]?.slug || `entry-${index}`;

    const enValue =
      firstNonEmptyString(
        safeRow?.keyword_en,
        safeRow?.keywordEn,
        firstArrayString(safeRow?.keywords_en),
        firstArrayString(safeRow?.keywords),
        fallbackSlug,
      ) || fallbackSlug;

    const viValue =
      firstNonEmptyString(
        safeRow?.keyword_vi,
        safeRow?.keywordVi,
        firstArrayString(safeRow?.keywords_vi),
        firstArrayString(safeRow?.keywords),
        enValue,
      ) || enValue;

    en.push(enValue);
    vi.push(viValue);
  });

  return {
    en: normalizeStringArray(en),
    vi: normalizeStringArray(vi),
  };
}

function normalizeCopyValue(value: unknown): string | { en?: string | null; vi?: string | null } | undefined {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || undefined;
  }

  if (!isRecord(value)) return undefined;

  const en = typeof value.en === "string" ? value.en.trim() : "";
  const vi = typeof value.vi === "string" ? value.vi.trim() : "";

  if (!en && !vi) return undefined;

  return {
    ...(en ? { en } : {}),
    ...(vi ? { vi } : {}),
  };
}

function normalizeStringArray(values: unknown): string[] {
  if (!Array.isArray(values)) return [];

  const out: string[] = [];
  const seen = new Set<string>();

  for (const value of values) {
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (!trimmed) continue;
    if (seen.has(trimmed)) continue;
    seen.add(trimmed);
    out.push(trimmed);
  }

  return out;
}

function firstArrayString(value: unknown): string | null {
  if (!Array.isArray(value)) return null;

  for (const item of value) {
    if (typeof item === "string" && item.trim()) {
      return item.trim();
    }
  }

  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function firstNonEmptyString(
  ...values: Array<string | null | undefined>
): string | null {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}