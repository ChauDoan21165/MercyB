// src/features/review/content/slug.ts — deterministic, stable slug for
// ReviewItem ids. The slug is derived purely from the front text so a card's
// id survives content rebuilds (per the README "stable across rebuilds" rule).
//
// Pure, no imports. Unicode-aware: strips diacritics, lowercases, collapses
// non-alphanumerics to single hyphens. For scripts with no Latin alphanumerics
// (CJK, Korean, bare Vietnamese tone marks that decompose to nothing), falls
// back to a stable short hash so two different fronts never collide to "".

/**
 * Deterministic slug of an arbitrary front string.
 * - Same input → same output, always (no randomness, no time).
 * - Non-empty for any non-empty input.
 */
export function slugify(input: string): string {
  const base = input
    .normalize("NFKD")
    // strip combining marks (accents, Vietnamese tone marks)
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    // any run of non a-z0-9 → single hyphen
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  // CJK / scripts that left nothing Latin behind, or empty input.
  if (base.length === 0) {
    return `h${stableHash(input)}`;
  }

  // Keep ids bounded but stable: cap the readable part and append a hash of
  // the FULL original so long fronts that share a prefix don't collide.
  const MAX = 48;
  if (base.length > MAX) {
    return `${base.slice(0, MAX).replace(/-+$/, "")}-${stableHash(input)}`;
  }
  return base;
}

/**
 * Tiny deterministic 32-bit FNV-1a hash → fixed-width base36 string.
 * Used only to disambiguate / back non-Latin slugs; not for security.
 */
export function stableHash(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    // FNV prime, kept in 32-bit range via Math.imul
    h = Math.imul(h, 0x01000193);
  }
  // >>> 0 → unsigned, base36, pad to a stable width
  return (h >>> 0).toString(36).padStart(7, "0");
}
