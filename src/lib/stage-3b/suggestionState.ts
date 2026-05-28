/**
 * Stage 3B — Suggestion state (local-only).
 *
 * Two pieces of learner-controllable state live here:
 *
 *   1. `mb.stage3b.disabled` — global suggestions-off preference. When
 *      truthy, the engine returns `null` for every call. Per ROADMAP
 *      §3B "learner can turn suggestions off entirely."
 *
 *   2. `mb.stage3b.dismissed` — set of suggestion ids the learner has
 *      dismissed. Per ROADMAP §3B "dismissible every time." Once a
 *      suggestion id is in this set, the engine returns `null` for it
 *      until `clearDismissedSuggestions()` is called (e.g. via a
 *      "show suggestions again" path the UI may add later).
 *
 * Hard invariants:
 *   - localStorage only. Zero Supabase, zero network, zero
 *     `mercy_user_facts`. Per ROADMAP Local-Only Posture.
 *   - All readers tolerate SSR (no `window`), quota errors, denied
 *     storage (private mode), and corrupted JSON — same contract as
 *     the Stage 3A adapters.
 *   - Writers swallow errors silently. A failed write must NOT crash
 *     the calling component or block a learner action.
 */

const DISABLED_KEY = "mb.stage3b.disabled";
const DISMISSED_KEY = "mb.stage3b.dismissed";

function getStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

export function isSuggestionsDisabled(): boolean {
  const storage = getStorage();
  if (!storage) return false;
  try {
    return storage.getItem(DISABLED_KEY) === "1";
  } catch {
    return false;
  }
}

export function setSuggestionsDisabled(disabled: boolean): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    if (disabled) {
      storage.setItem(DISABLED_KEY, "1");
    } else {
      storage.removeItem(DISABLED_KEY);
    }
  } catch {
    // Quota / denied — fail soft per Local-Only Posture.
  }
}

export function getDismissedSuggestionIds(): Set<string> {
  const storage = getStorage();
  if (!storage) return new Set();
  try {
    const raw = storage.getItem(DISMISSED_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    const out = new Set<string>();
    for (const entry of parsed) {
      if (typeof entry === "string" && entry.length > 0) out.add(entry);
    }
    return out;
  } catch {
    return new Set();
  }
}

export function dismissSuggestion(id: string): void {
  if (!id) return;
  const storage = getStorage();
  if (!storage) return;
  try {
    const current = getDismissedSuggestionIds();
    if (current.has(id)) return;
    current.add(id);
    storage.setItem(DISMISSED_KEY, JSON.stringify(Array.from(current)));
  } catch {
    // Same fail-soft contract.
  }
}

export function clearDismissedSuggestions(): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(DISMISSED_KEY);
  } catch {
    // ditto.
  }
}

/**
 * Test-only / dev-only escape hatch: read the raw storage keys so a
 * caller can verify they exist without going through the typed
 * readers. Not exported as part of the public engine API.
 */
export const __STAGE3B_KEYS_FOR_TESTS = {
  DISABLED_KEY,
  DISMISSED_KEY,
} as const;
