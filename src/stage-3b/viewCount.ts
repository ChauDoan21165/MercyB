/**
 * Stage 3B — Local view counter for the Suggested Practice surface.
 *
 * Stores a single integer in localStorage under `mb.stage3b.viewCount`
 * and increments it each time `<SuggestedPracticeList />` renders with
 * a non-empty item list (i.e. the user actually saw at least one
 * suggested-practice card).
 *
 * Purely local: never read by any analytics pipeline, never sent over
 * the network, never written to Supabase, never observed by Sentry.
 * The value exists for our own diagnostic curl-ups when triaging
 * "did the new surface get any visibility on this device?" type
 * questions during a hands-on session. It is per-device and trivially
 * resettable by the user via DevTools.
 *
 * ─────────────────────────────────────────────────────────────────
 * INVARIANT CARVE-OUT — read this before adding any other write.
 *
 *   `localStorage.setItem(VIEW_COUNT_KEY, ...)` in this file is the
 *   ONE allowed Stage 3B localStorage write site. Every other code
 *   path in `src/stage-3b/` and `src/components/stage-3b/` is
 *   read-only with respect to localStorage — they consume the Stage
 *   3A aggregator's read seam and never write back.
 *
 *   Invariant tests guarding the Stage 3B trees should:
 *     - allow `localStorage.setItem` exactly in this file, for
 *       exactly the `mb.stage3b.viewCount` key, and
 *     - reject any other `localStorage.setItem` / `removeItem`
 *       inside `src/stage-3b/` or `src/components/stage-3b/`.
 *
 *   If you find yourself wanting to add a second write site, stop
 *   and ask first — the read-only invariant is what keeps Stage 3B
 *   from sliding into a write-back / sync-back design that would
 *   need a privacy review.
 * ─────────────────────────────────────────────────────────────────
 */

export const VIEW_COUNT_KEY = "mb.stage3b.viewCount";

/**
 * Bump the counter by 1. Safe to call from any browser context;
 * SSR / quota-exceeded / private-mode all degrade to a silent no-op
 * because a diagnostic counter must never block the UI.
 */
export function recordSuggestedPracticeView(): void {
  try {
    const next = readSuggestedPracticeViewCount() + 1;
    localStorage.setItem(VIEW_COUNT_KEY, String(next));
  } catch {
    // localStorage unavailable — diagnostic counter degrades silently.
  }
}

/**
 * Read the current counter. Returns 0 when the key is missing,
 * malformed, negative, or localStorage is unavailable.
 */
export function readSuggestedPracticeViewCount(): number {
  try {
    const raw = localStorage.getItem(VIEW_COUNT_KEY);
    if (raw === null) return 0;
    const n = Number(raw);
    return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
  } catch {
    return 0;
  }
}
