// src/lib/weakness/weakness-catalog.ts
//
// Single source of truth for placement-test weakness tags.
//
// Every UI surface that consumes weakness tags (Home focus-areas card,
// micro-lesson dialog, analytics events) reads from this catalog. If a
// tag string changes, only this file needs updating — callers stay stable.
//
// Tag source: src/lib/placement/engine.ts (CC3) emits
// `EngineSnapshot.weaknessFlags: string[]` on test completion. Strings in
// this file were reviewed by Chau on 2026-04-23 — do not edit wording
// without his re-review.
//
// Inline bolding: `**word**` markdown syntax. Rendered by
// `renderInlineBold` in this module. Plain strings stay portable for
// future translation-memory export.
//
// When adding a new tag:
//   1. Add it to the `WeaknessTag` union.
//   2. Add the matching entry to WEAKNESS_CATALOG.
//   3. Ensure the mapped roomId exists in public/data/*.json. The
//      companion test `weakness-catalog.test.ts` fails CI otherwise.

export type WeaknessTag =
  | "vi_l1_3rd_person_s"
  | "vi_l1_past_ed"
  | "vi_l1_plural_s";

export type WeaknessEntry = {
  /** Machine identifier. Must match the string CC3's engine emits. */
  tag: WeaknessTag;
  /** Card / dialog headline — English. */
  displayEn: string;
  /** Card / dialog headline — Vietnamese. */
  displayVi: string;
  /** One-sentence "why this is hard for Vietnamese speakers" — English.
   *  May contain `**word**` markdown bolding. */
  whyEn: string;
  /** One-sentence explanation — Vietnamese. May contain `**word**`. */
  whyVi: string;
  /** Room that addresses this weakness. Must exist in public/data/. */
  roomId: string;
};

export const WEAKNESS_CATALOG: Record<WeaknessTag, WeaknessEntry> = {
  vi_l1_3rd_person_s: {
    tag: "vi_l1_3rd_person_s",
    displayEn: "Subject-verb agreement",
    displayVi: "Chia động từ theo chủ ngữ",
    whyEn:
      "Vietnamese verbs don't change form for person. English adds **-s** to the verb when the subject is **he**, **she**, or **it**.",
    whyVi:
      "Động từ tiếng Việt không thay đổi theo ngôi. Trong tiếng Anh, động từ thêm **-s** khi chủ ngữ là **he**, **she**, **it**.",
    roomId: "english_a1_a107",
  },
  vi_l1_past_ed: {
    tag: "vi_l1_past_ed",
    displayEn: "Past tense with **-ed**",
    displayVi: "Thì quá khứ với **-ed**",
    whyEn:
      "Vietnamese shows past time with words like **hôm qua** or **đã** — the verb doesn't change. English changes the verb itself: **work → worked**.",
    whyVi:
      "Tiếng Việt diễn tả quá khứ bằng các từ như **hôm qua** hoặc **đã**, không đổi hình thức động từ. Tiếng Anh thay đổi chính động từ: **work → worked**.",
    roomId: "english_a2_a206",
  },
  vi_l1_plural_s: {
    tag: "vi_l1_plural_s",
    displayEn: "Plural nouns with **-s**",
    displayVi: "Danh từ số nhiều với **-s**",
    whyEn:
      "Vietnamese nouns don't change when counting more than one — markers like **các** or **những** do the work. English adds **-s** to most nouns when there's more than one: **book → books**.",
    whyVi:
      "Danh từ tiếng Việt không đổi khi đếm nhiều hơn một — dấu hiệu số nhiều nằm ở các từ như **các** hoặc **những**. Tiếng Anh thêm **-s** vào hầu hết danh từ khi số lượng nhiều hơn một: **book → books**.",
    roomId: "english_a1_a109",
  },
};

/** Ordered list of all tags (stable for tests + exhaustiveness checks). */
export const ALL_WEAKNESS_TAGS: readonly WeaknessTag[] = Object.freeze(
  Object.keys(WEAKNESS_CATALOG) as WeaknessTag[],
);

/**
 * Type-guard: narrows an arbitrary string to a known weakness tag.
 * Callers should filter unknown tags (from CC3 emitting new tags before
 * the catalog catches up) rather than crash.
 */
export function isKnownWeaknessTag(value: unknown): value is WeaknessTag {
  return (
    typeof value === "string" && value in WEAKNESS_CATALOG
  );
}

/**
 * Look up an entry by tag string. Returns null for unknown tags so the
 * UI can skip rather than throw. Prefer this over direct record access
 * when the tag comes from an external source (DB, edge function).
 */
export function getWeaknessEntry(tag: string): WeaknessEntry | null {
  if (!isKnownWeaknessTag(tag)) return null;
  return WEAKNESS_CATALOG[tag];
}

/**
 * Map an array of raw tag strings (e.g. from profiles.placement_weaknesses
 * or mb_user_weakness_profile.key_pattern) to catalog entries. Preserves
 * input order, drops unknown tags, deduplicates by tag.
 */
export function resolveWeaknessTags(rawTags: readonly string[]): WeaknessEntry[] {
  const seen = new Set<string>();
  const out: WeaknessEntry[] = [];
  for (const raw of rawTags) {
    if (seen.has(raw)) continue;
    const entry = getWeaknessEntry(raw);
    if (entry) {
      out.push(entry);
      seen.add(raw);
    }
  }
  return out;
}
