import { processEntriesOptimized } from "./roomLoaderHelpers";

export type KeywordMenu = {
  en: string[];
  vi: string[];
};

export function normalizeEntries(entries: any[]): {
  merged: any[];
  keywordMenu: KeywordMenu;
} {
  const processed = processEntriesOptimized(entries);

  return {
    merged: Array.isArray(processed?.merged) ? processed.merged : [],
    keywordMenu: {
      en: Array.isArray(processed?.keywordMenu?.en)
        ? processed.keywordMenu.en
        : [],
      vi: Array.isArray(processed?.keywordMenu?.vi)
        ? processed.keywordMenu.vi
        : [],
    },
  };
}

export function salvageDbEntries(entries: any[]): {
  merged: any[];
  keywordMenu: KeywordMenu;
} {
  const merged = entries.map((row, index) => {
    const slug =
      firstNonEmptyString(
        row?.slug,
        row?.keyword_en,
        row?.keywordEn,
        row?.title,
        row?.title_en,
        row?.titleEn
      ) || `entry-${index}`;

    return {
      slug,
      title:
        firstNonEmptyString(row?.title, row?.title_en, row?.titleEn) ||
        `Entry ${index + 1}`,
      copy: row?.copy ?? null,
      keywords: Array.isArray(row?.keywords) ? row.keywords : [],
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

export function normalizeTier(meta: any): string {
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

function firstNonEmptyString(...values: any[]): string | null {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}