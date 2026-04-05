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
      en: Array.isArray(processed?.keywordMenu?.en)
        ? (processed.keywordMenu.en as string[])
        : [],
      vi: Array.isArray(processed?.keywordMenu?.vi)
        ? (processed.keywordMenu.vi as string[])
        : [],
    },
  };
}

export function salvageDbEntries(entries: BaseRoomEntry[]): NormalizedEntriesResult {
  const merged: NormalizedRoomEntry[] = entries.map((row, index) => {
    const slug =
      firstNonEmptyString(
        row.slug,
        row.keyword_en,
        row.keywordEn,
        row.title,
        row.title_en,
        row.titleEn
      ) || `entry-${index}`;

    return {
      slug,
      title:
        firstNonEmptyString(row.title, row.title_en, row.titleEn) ||
        `Entry ${index + 1}`,
      copy: row.copy ?? null,
      keywords: Array.isArray(row.keywords) ? row.keywords : [],
      tier: "free",
    };
  });

  const slugs = merged.map((entry) => entry.slug);

  return {
    merged,
    keywordMenu: {
      en: slugs,
      vi: slugs,
    },
  };
}

export function normalizeTier(meta: RoomMeta | JsonRoom | null): string {
  const raw =
    firstNonEmptyString(meta?.roomTier, meta?.tier, meta?.accessTier) || "free";

  const value = raw.toLowerCase();

  if (value.includes("vip3")) return "vip3";
  if (value.includes("vip2")) return "vip2";
  if (value.includes("vip1")) return "vip1";
  if (value.includes("premium")) return "premium";
  if (value.includes("free")) return "free";

  return value;
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