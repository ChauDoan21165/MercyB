// Auto-prompt gate for the "share your story" Home card.
//
// We only ask once per 30 days, and only if the user is eligible. The
// last-shown timestamp lives in localStorage (per user) — server-side
// tracking would require a roundtrip on every Home render and the cost
// isn't justified for a once-a-month decision.
//
// Storage key: `mb.story_prompt_last_shown.<userId>`
//
// The 30-day cooldown counts from the *last shown* moment, not from
// dismissal — same window either way. Dismissal records the same key
// because a "Để sau" click is functionally equivalent to seeing it: we
// don't want to re-prompt tomorrow.

import { isUserEligibleToShareStory } from "./eligibility";

const COOLDOWN_DAYS = 30;
const DAY_MS = 86_400_000;
export const STORY_PROMPT_KEY_PREFIX = "mb.story_prompt_last_shown.";

function key(userId: string): string {
  return `${STORY_PROMPT_KEY_PREFIX}${userId}`;
}

function readLastShown(userId: string): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key(userId));
    if (!raw) return null;
    const ts = Number(raw);
    return Number.isFinite(ts) ? ts : null;
  } catch {
    return null;
  }
}

function writeLastShown(userId: string, ts: number): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key(userId), String(ts));
  } catch {
    // localStorage can be disabled / full / cross-origin blocked. Failing
    // silently means we may show the prompt again next session — that's
    // a milder failure than throwing on Home render.
  }
}

/**
 * Pure decision: given the last-shown timestamp and current time, has
 * the cooldown elapsed? Exported for tests so we don't have to mock
 * localStorage in the unit tests for the cooldown logic itself.
 */
export function isCooldownElapsed(
  lastShownMs: number | null,
  nowMs: number,
): boolean {
  if (lastShownMs == null) return true;
  return nowMs - lastShownMs >= COOLDOWN_DAYS * DAY_MS;
}

/**
 * Returns true ONLY IF:
 *   1. The user is eligible (see eligibility.ts), AND
 *   2. We have not shown the prompt in the last 30 days.
 *
 * Eligibility is checked *after* the cooldown so we don't burn DB
 * roundtrips on users we just asked.
 */
export async function shouldShowStoryPrompt(userId: string): Promise<boolean> {
  if (!userId) return false;
  if (!isCooldownElapsed(readLastShown(userId), Date.now())) return false;

  const result = await isUserEligibleToShareStory(userId);
  return result.eligible;
}

/**
 * Mark the prompt as shown — call this when the card mounts. Resets the
 * 30-day cooldown.
 */
export async function recordPromptShown(userId: string): Promise<void> {
  if (!userId) return;
  writeLastShown(userId, Date.now());
}

/**
 * Mark the prompt as dismissed ("Để sau"). Same effect as `shown` —
 * resets the cooldown so we don't re-ask tomorrow. Kept as a separate
 * function so callers self-document intent and so we can diverge later
 * (e.g. give dismissal a longer cooldown) without changing call sites.
 */
export async function recordPromptDismissed(userId: string): Promise<void> {
  if (!userId) return;
  writeLastShown(userId, Date.now());
}

export const STORY_PROMPT_COOLDOWN_DAYS = COOLDOWN_DAYS;
