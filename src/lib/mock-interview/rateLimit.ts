// src/lib/mock-interview/rateLimit.ts
//
// Free-tier weekly rate limit for mock-interview rooms.
//
// Free tier: 1 mock interview per rolling 7-day window.
// Trial / paid: unlimited.
//
// Why localStorage: this is a *soft* gate at the UI layer. The point is
// to nudge users toward upgrading, not to be tamper-proof — anyone who
// clears storage gets a free pass, which is fine for the funnel. A
// future iteration can move the counter into Supabase for hard
// enforcement, but that's out of scope for the first ship.

const STORAGE_KEY = "mb:mock-interview:starts";
const WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
const FREE_LIMIT = 1;

export type GateStatus =
  | { allowed: true; reason: "paid" | "trial" | "within_free_limit" }
  | { allowed: false; reason: "free_limit_hit"; resetsAt: number };

/** Tier shape we care about — the auth provider exposes a richer object,
 *  but we only need a couple of booleans here. */
export interface GateUserContext {
  isPaid: boolean;
  isTrial: boolean;
}

function readStarts(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((n): n is number => typeof n === "number");
  } catch {
    return [];
  }
}

function writeStarts(stamps: number[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stamps));
  } catch {
    // localStorage might be disabled — accept the soft-gate failure mode.
  }
}

function pruneOld(stamps: number[], now: number): number[] {
  const cutoff = now - WINDOW_MS;
  return stamps.filter((t) => t >= cutoff);
}

export function checkGate(
  ctx: GateUserContext,
  now: number = Date.now(),
): GateStatus {
  if (ctx.isPaid) return { allowed: true, reason: "paid" };
  if (ctx.isTrial) return { allowed: true, reason: "trial" };

  const recent = pruneOld(readStarts(), now);
  if (recent.length < FREE_LIMIT) {
    return { allowed: true, reason: "within_free_limit" };
  }
  // Oldest start in the window — that's the one whose expiry frees a slot.
  const oldest = Math.min(...recent);
  return {
    allowed: false,
    reason: "free_limit_hit",
    resetsAt: oldest + WINDOW_MS,
  };
}

export function recordStart(now: number = Date.now()): void {
  const next = pruneOld(readStarts(), now);
  next.push(now);
  writeStarts(next);
}

/** Test seam: clear the local counter. */
export function _resetGateForTests(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
