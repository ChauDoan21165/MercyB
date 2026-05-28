// src/lib/parent-view/parentLocale.ts
//
// L6 — Parent / Family layer. Parent-view locale resolution.
//
// Decision L6-Q2=C (docs/architecture/L6-parent-teacher-family-layer.md
// § Decision: L6-Q2): detect the parent's locale ONCE at signup time and
// default to Vietnamese when detection is ambiguous. Drift-resistant —
// a one-time detection beats live coupling to the learner's
// `lessonUiLang`, which breaks the moment the kid toggles their own UI.
//
// This module is the single read-path the parent view uses. It does NOT
// write the detected locale; the detection-at-signup write is a separate
// concern (an account-settings field). Until that field exists this
// resolver falls back to a best-effort browser detection, still pinned to
// VI on anything non-English. Settings can override later — when an
// account-level `parent_view_locale` lands, wire it into `stored` below
// and this resolver keeps working unchanged for every caller.

export type ParentLocale = "vi" | "en";

const STORAGE_KEY = "mb.l6.parent.locale";

/**
 * Vietnamese-first fallback. Per non-negotiable #1, ambiguity resolves to
 * Vietnamese, never to English.
 */
export const DEFAULT_PARENT_LOCALE: ParentLocale = "vi";

function normalize(raw: string | null | undefined): ParentLocale | null {
  if (!raw) return null;
  const tag = raw.trim().toLowerCase();
  if (tag === "vi" || tag.startsWith("vi-")) return "vi";
  if (tag === "en" || tag.startsWith("en-")) return "en";
  // Any other locale (fr-CA diaspora, etc.) is NOT English → VI per #1.
  return null;
}

/**
 * Read the persisted, signup-detected parent locale if present.
 * Returns null when nothing has been stored yet (caller falls back).
 */
function readStored(): ParentLocale | null {
  try {
    return normalize(
      typeof localStorage !== "undefined"
        ? localStorage.getItem(STORAGE_KEY)
        : null,
    );
  } catch {
    return null;
  }
}

/**
 * Best-effort one-time browser detection. Only used the first time, when
 * nothing was persisted — mirrors "detect at signup". English browsers
 * get EN; everything else (including Vietnamese) resolves to VI.
 */
function detectFromBrowser(): ParentLocale {
  try {
    const nav = typeof navigator !== "undefined" ? navigator : null;
    const candidate =
      nav?.language ?? (Array.isArray(nav?.languages) ? nav?.languages[0] : null);
    return normalize(candidate) ?? DEFAULT_PARENT_LOCALE;
  } catch {
    return DEFAULT_PARENT_LOCALE;
  }
}

/**
 * Resolve the parent-view locale. Pure-ish (reads only).
 *
 * Resolution order:
 *   1. `override` PROVIDED (the signup-detected locale or a test seam):
 *      it is authoritative. Recognized → use it; any other locale (e.g.
 *      a diaspora `fr-CA`) → VI per non-negotiable #1. A provided override
 *      never falls through to browser detection.
 *   2. `override` ABSENT (null/undefined): persisted signup detection →
 *      one-time browser detection → VI fallback.
 *
 * @param override - signup-detected / future account-settings value.
 */
export function resolveParentLocale(
  override?: ParentLocale | string | null,
): ParentLocale {
  const provided = override !== undefined && override !== null && override !== "";
  if (provided) {
    // Authoritative once provided. Non-vi/en resolves to the VI default,
    // never to a browser-derived EN.
    return normalize(String(override)) ?? DEFAULT_PARENT_LOCALE;
  }
  return readStored() ?? detectFromBrowser();
}

/**
 * Persist a signup-time detection so subsequent views are stable. Safe to
 * call repeatedly; no-ops on storage failure. Invalid locales are ignored
 * (the resolver will keep falling back to VI).
 */
export function persistParentLocale(locale: ParentLocale | string): void {
  const normalized = normalize(typeof locale === "string" ? locale : null);
  if (!normalized) return;
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, normalized);
    }
  } catch {
    /* best-effort; ignore quota / disabled storage */
  }
}
