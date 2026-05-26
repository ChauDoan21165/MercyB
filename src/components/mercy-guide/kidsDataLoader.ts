// src/components/mercy-guide/kidsDataLoader.ts
//
// Lazy-loads kids page data on-demand instead of eagerly importing all
// 30 kidPageNData.ts files at module-init time (which was ~519 KB).
// Each page's data is dynamically imported only when a selected key
// matches that page's prefix, then cached for subsequent renders.
//
// Used by both MercySpeakTab and MercyTeacherTab.

type KidsObjectCard = {
  key: string;
  label: string;
  sentence: string;
  imageSrc: string;
  aliases: string[];
};

type KidsLessonCard = {
  key: string;
  label: string;
  sentence: string;
  imageSrc: string;
  dialogue?: string[];
};

type KidsPageItem = {
  key: string;
  label: string;
  image: string;
  dialogue?: string[];
};

// ── Helpers (mirrored from MercySpeakTab so this module is self-contained) ──

function cleanText(value?: string | null): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function toPhraseSentence(label: string): string {
  const base = cleanText(label);
  if (!base) return "";
  return /[.!?]$/.test(base) ? base : `${base}.`;
}

function matchesPageKeyPrefix(
  key: string | null | undefined,
  pageNumber: number,
): key is string {
  const normalized = cleanText(key);
  if (!normalized) return false;
  return new RegExp(`^k${pageNumber}_`, "i").test(normalized);
}

// ── Cache ──────────────────────────────────────────────────────────────────

type ModuleShape = {
  getPage4LessonByKey?: (
    key?: string | null,
  ) => { key: string; label: string; sentence: string; imageSrc: string } | null;
  getPage5LessonByKey?: (
    key?: string | null,
  ) => { key: string; label: string; sentence: string; imageSrc: string } | null;
  getPage6LessonByKey?: (
    key?: string | null,
  ) => { key: string; label: string; sentence: string; imageSrc: string } | null;
  getPage7LessonByKey?: (
    key?: string | null,
  ) => { key: string; label: string; sentence: string; imageSrc: string } | null;
  getPage8LessonByKey?: (
    key?: string | null,
  ) => { key: string; label: string; sentence: string; imageSrc: string } | null;
  getPage9LessonByKey?: (
    key?: string | null,
  ) => { key: string; label: string; sentence: string; imageSrc: string } | null;
  getKidPage11Item?: (key?: string | null) => KidsPageItem | null | undefined;
  getKidPage12Item?: (key?: string | null) => KidsPageItem | null | undefined;
  getKidPage13Item?: (key?: string | null) => KidsPageItem | null | undefined;
  getKidPage14Item?: (key?: string | null) => KidsPageItem | null | undefined;
  getKidPage15Item?: (key?: string | null) => KidsPageItem | null | undefined;
  getKidPage16Item?: (key?: string | null) => KidsPageItem | null | undefined;
  getKidPage17Item?: (key?: string | null) => KidsPageItem | null | undefined;
  getKidPage18Item?: (key?: string | null) => KidsPageItem | null | undefined;
  getKidPage19Item?: (key?: string | null) => KidsPageItem | null | undefined;
  getKidPage20Item?: (key?: string | null) => KidsPageItem | null | undefined;
  getKidPage21Item?: (key?: string | null) => KidsPageItem | null | undefined;
  getKidPage22Item?: (key?: string | null) => KidsPageItem | null | undefined;
  getKidPage23Item?: (key?: string | null) => KidsPageItem | null | undefined;
  getKidPage24Item?: (key?: string | null) => KidsPageItem | null | undefined;
  getKidPage25Item?: (key?: string | null) => KidsPageItem | null | undefined;
  getKidPage26Item?: (key?: string | null) => KidsPageItem | null | undefined;
  getKidPage27Item?: (key?: string | null) => KidsPageItem | null | undefined;
  KID_PAGE_28_ITEMS?: KidsPageItem[];
  KID_PAGE_29_ITEMS?: KidsPageItem[];
  KID_PAGE_30_ITEMS?: KidsPageItem[];
  KID_PAGE_31_ITEMS?: KidsPageItem[];
  KID_PAGE_32_ITEMS?: KidsPageItem[];
  KID_PAGE_33_ITEMS?: KidsPageItem[];
  KID_PAGE_34_ITEMS?: KidsPageItem[];
};

const cache = new Map<number, ModuleShape>();

// Vite cannot statically analyse `import(\`./kids/kidPage${n}Data\`)` —
// the template-literal path has no extension and no glob, so the dynamic
// import resolves to nothing in the production build and loadPageModule
// returns an empty module. Result: the photo grid renders empty on
// /kids/vi-english in prod. `import.meta.glob` is the Vite-documented
// fix: it pre-registers a lazy loader per matching file at build time,
// so each kidPage<N>Data.ts gets its own code-split chunk and the
// dynamic lookup resolves at runtime through PAGE_MODULES.
//
// Lazy mode (`eager: false`) preserves on-demand loading — the modules
// only fetch their chunks when loadPageModule(n) is called, exactly
// like the broken template-literal form intended.
//
// Re-applies the fix from PR #1157 (reverted by #1165's surgical
// 3-revert) — same patch, same rationale, applied on top of the
// post-#1165 kids-restore + safety-pin baseline.
const PAGE_MODULES = import.meta.glob<ModuleShape>(
  './kids/kidPage*Data.ts',
  { eager: false },
);

async function loadPageModule(pageNumber: number): Promise<ModuleShape> {
  const cached = cache.get(pageNumber);
  if (cached) return cached;

  const path = `./kids/kidPage${pageNumber}Data.ts`;
  const loader = PAGE_MODULES[path];
  if (!loader) {
    throw new Error(`kidPage${pageNumber}Data module not registered`);
  }
  const mod = await loader();
  cache.set(pageNumber, mod as ModuleShape);
  return mod as ModuleShape;
}

// ── Public API ──────────────────────────────────────────────────────────────

export type KidsDataLoaderResult = KidsLessonCard | KidsObjectCard | null;

/**
 * Given a kids object key, dynamically imports the correct kids page data
 * file and returns the matching lesson card. Returns null when no match.
 * Cached per page — second call for the same page is instant.
 */
export async function loadKidsLessonByKey(
  key: string | null | undefined,
): Promise<KidsLessonCard | null> {
  if (!key) return null;

  // Pages 4-9: direct getter functions
  for (const page of [4, 5, 6, 7, 8, 9]) {
    if (!matchesPageKeyPrefix(key, page)) continue;
    const mod = await loadPageModule(page);
    const fnName = `getPage${page}LessonByKey` as keyof ModuleShape;
    const fn = mod[fnName] as
      | ((k?: string | null) => { key: string; label: string; sentence: string; imageSrc: string } | null)
      | undefined;
    const item = fn?.(key);
    if (!item) return null;
    return {
      key: item.key,
      label: item.label,
      sentence: item.sentence,
      imageSrc: item.imageSrc,
    };
  }

  // Pages 11-27: getItem functions + makePageLessonGetter wrapper
  for (const page of [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]) {
    if (!matchesPageKeyPrefix(key, page)) continue;
    const mod = await loadPageModule(page);
    const fnName = `getKidPage${page}Item` as keyof ModuleShape;
    const getItem = mod[fnName] as
      | ((k?: string | null) => KidsPageItem | null | undefined)
      | undefined;
    if (!getItem) return null;
    const item = getItem(key);
    if (!item) return null;
    return {
      key: item.key,
      label: item.label,
      sentence: item.dialogue ? item.dialogue[0]! : toPhraseSentence(item.label),
      imageSrc: item.image,
      dialogue: item.dialogue,
    };
  }

  // Pages 28-34: KID_PAGE_NN_ITEMS arrays
  for (const page of [28, 29, 30, 31, 32, 33, 34]) {
    if (!matchesPageKeyPrefix(key, page)) continue;
    const mod = await loadPageModule(page);
    const propName = `KID_PAGE_${page}_ITEMS` as keyof ModuleShape;
    const items = mod[propName] as KidsPageItem[] | undefined;
    if (!items) return null;
    const item = items.find((i) => i.key === key);
    if (!item) return null;
    return {
      key: item.key,
      label: item.label,
      sentence: item.dialogue ? item.dialogue[0]! : toPhraseSentence(item.label),
      imageSrc: item.image,
      dialogue: item.dialogue,
    };
  }

  return null;
}

/**
 * Batch loader for MercyTeacherTab — loads all kids items for a range
 * of pages. Used to populate the kids item grid without static imports.
 * Returns items grouped by page.
 */
export async function loadKidsItemsForPages(
  pages: number[],
): Promise<Map<number, KidsPageItem[]>> {
  const result = new Map<number, KidsPageItem[]>();

  await Promise.all(
    pages.map(async (page) => {
      try {
        const mod = await loadPageModule(page);

        // Pages 11-27 use getKidPage[N]Item getter — but for the grid
        // we need the raw items array. The page modules don't always
        // export a flat array, so we try both patterns.
        const itemsKey = `KID_PAGE_${page}_ITEMS` as keyof ModuleShape;
        let items = mod[itemsKey] as KidsPageItem[] | undefined;

        // Fallback: if not an array, try to scan for getter-named entries
        if (!Array.isArray(items)) {
          const getterName = `getKidPage${page}Item` as keyof ModuleShape;
          const getter = mod[getterName] as
            | ((k?: string | null) => KidsPageItem | null | undefined)
            | undefined;
          // Can't enumerate without keys — only works for known-key lookups
          // This path shouldn't be needed for the grid; the grid uses
          // individual UI items, not batch loading.
        }

        if (Array.isArray(items) && items.length > 0) {
          result.set(page, items);
        }
      } catch {
        // Page module not found or failed — skip
      }
    }),
  );

  return result;
}
