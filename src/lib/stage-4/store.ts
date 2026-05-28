/**
 * Stage 4 (L4) — local suggestion store.
 *
 * The device-local persistence seam between the write-side evaluator
 * (`signalHook.ts`, Q9=B) and the read-side consumer
 * (`useStage4Suggestion`). L4 writes ONE small localStorage buffer and
 * reads it back; it never touches Supabase, the network, or
 * `mercy_user_facts`.
 *
 * Three pieces of state:
 *
 *   1. `mb.stage4.suggestion` (localStorage) — the current persisted
 *      `Stage4Suggestion`, written when a signal change re-evaluates the
 *      rules. TTL-expired on read.
 *   2. `mb.stage4.session.owner` (sessionStorage) — the id of the
 *      suggestion that claimed this session's single L4 slot. Enforces
 *      the ≤1-per-session cap (Q7=A): once a suggestion is surfaced, a
 *      *different* suggestion is suppressed until the next session, while
 *      the same suggestion may refresh.
 *   3. Dismissals are NOT stored here — they reuse Stage 3B's
 *      deterministic dismissed-id set (`suggestionState.ts`) so dismiss
 *      is permanent (Q4=A) and shared with the Stage 3B surface.
 *
 * Resilience contract (inherited from the Stage 3A adapters): every
 * reader tolerates SSR (no `window`), denied storage (private mode),
 * quota errors, and corrupted JSON without throwing; every writer
 * swallows errors silently so a failed write never blocks the UI.
 */

import {
  getDismissedSuggestionIds,
  isSuggestionsDisabled,
  dismissSuggestion,
} from "@/lib/stage-3b/suggestionState";

import type { Stage4Gate, Stage4Suggestion } from "./types";

const SUGGESTION_KEY = "mb.stage4.suggestion";
const SESSION_OWNER_KEY = "mb.stage4.session.owner";

function getLocalStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

function getSessionStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.sessionStorage ?? null;
  } catch {
    return null;
  }
}

/**
 * Build the pure evaluator's gate from local state. Reuses Stage 3B's
 * disable flag + dismissed-id set so the two surfaces share both.
 */
export function readStage4Gate(): Stage4Gate {
  return {
    disabled: isSuggestionsDisabled(),
    dismissedIds: getDismissedSuggestionIds(),
  };
}

/**
 * Validate a parsed blob is a well-formed `Stage4Suggestion`. Defensive
 * against schema drift / hand-edited storage — a malformed buffer reads
 * as "no suggestion" rather than crashing a consumer.
 */
function isStage4Suggestion(value: unknown): value is Stage4Suggestion {
  if (!value || typeof value !== "object") return false;
  const s = value as Partial<Stage4Suggestion>;
  return (
    typeof s.id === "string" &&
    typeof s.ruleId === "string" &&
    typeof s.ttlMs === "number" &&
    typeof s.generatedAt === "number" &&
    !!s.triggerReason &&
    typeof s.triggerReason === "object" &&
    !!s.targetAction &&
    typeof s.targetAction === "object"
  );
}

/** Persist (or clear, when `null`) the current L4 suggestion buffer. */
export function writeStoredStage4Suggestion(
  suggestion: Stage4Suggestion | null,
): void {
  const storage = getLocalStorage();
  if (!storage) return;
  try {
    if (suggestion === null) {
      storage.removeItem(SUGGESTION_KEY);
    } else {
      storage.setItem(SUGGESTION_KEY, JSON.stringify(suggestion));
    }
  } catch {
    // Quota / denied — fail soft per Local-Only Posture.
  }
}

/**
 * Read the persisted L4 suggestion, applying TTL expiry. A suggestion
 * whose `generatedAt + ttlMs` has passed `now` is treated as absent and
 * cleared from storage (a stale intervention must not linger).
 */
export function readStoredStage4Suggestion(
  now: number,
): Stage4Suggestion | null {
  const storage = getLocalStorage();
  if (!storage) return null;
  let parsed: unknown;
  try {
    const raw = storage.getItem(SUGGESTION_KEY);
    if (!raw) return null;
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isStage4Suggestion(parsed)) return null;
  // L5-PENDING: TTL expiry uses the provisional 7-day default stamped on
  // the suggestion (see rules.ts). L5 may revise the lifetime.
  if (parsed.generatedAt + parsed.ttlMs <= now) {
    writeStoredStage4Suggestion(null);
    return null;
  }
  return parsed;
}

/** Read which suggestion id owns this session's single L4 slot (Q7=A). */
export function readSessionOwnerId(): string | null {
  const storage = getSessionStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(SESSION_OWNER_KEY);
    return raw && raw.length > 0 ? raw : null;
  } catch {
    return null;
  }
}

/** Claim this session's single L4 slot for `id` (idempotent). */
export function claimSessionOwner(id: string): void {
  if (!id) return;
  const storage = getSessionStorage();
  if (!storage) return;
  try {
    storage.setItem(SESSION_OWNER_KEY, id);
  } catch {
    // ditto — fail soft.
  }
}

/**
 * Apply the ≤1-per-session cap (Q7=A) to a stored suggestion at display
 * time. Pure decision over the stored suggestion + the session-owner id:
 *
 *   - No stored suggestion → nothing to surface.
 *   - No owner yet → `candidate` claims the slot and surfaces.
 *   - Owner === candidate.id → same suggestion refreshing → surfaces.
 *   - Owner !== candidate.id → a *different* suggestion already used the
 *     session's slot → suppress until next session.
 *
 * Returns `{ surfaced, claimId }`: `surfaced` is what the consumer should
 * render; `claimId` (when non-null) is the id the consumer should pass to
 * `claimSessionOwner` to record the surface. Kept side-effect-free so it
 * is unit-testable; the consumer performs the single session write.
 */
export function applySessionCap(
  candidate: Stage4Suggestion | null,
  sessionOwnerId: string | null,
): { surfaced: Stage4Suggestion | null; claimId: string | null } {
  if (!candidate) return { surfaced: null, claimId: null };
  if (sessionOwnerId && sessionOwnerId !== candidate.id) {
    return { surfaced: null, claimId: null };
  }
  return {
    surfaced: candidate,
    claimId: sessionOwnerId ? null : candidate.id,
  };
}

/**
 * Permanently dismiss an L4 suggestion (Q4=A). Records the id in Stage
 * 3B's deterministic dismissed-id set (so the evaluator never re-emits
 * it) and clears the local buffer so the current view drops it.
 */
export function dismissStage4Suggestion(id: string): void {
  if (!id) return;
  dismissSuggestion(id);
  writeStoredStage4Suggestion(null);
}

/** Test-only key handles. Not part of the public engine API. */
export const __STAGE4_KEYS_FOR_TESTS = {
  SUGGESTION_KEY,
  SESSION_OWNER_KEY,
} as const;
