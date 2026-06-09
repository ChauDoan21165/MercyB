// supabase/functions/azure-phoneme-stream/costControls.ts
//
// Hard cost controls for the STREAMING pronunciation path
// (azure-phoneme-stream). This is the piece the C1 audit (invoice
// G163789098) flagged as missing: the streaming endpoint opened a
// WebSocket and ran MANY Azure Pronunciation-Assessment passes per
// recording with no per-user rate limit, no trial/premium gate, no
// global daily $ cap, and no telemetry.
//
// This module is intentionally **Deno-free** (no `Deno.*`, no
// `https://…` imports) so vitest can import it under Node and exercise
// every gate decision without booting Deno or a WebSocket — the same
// split azure-phoneme/core.ts uses against its index.ts. `index.ts`
// wires the production deps (Supabase admin client, the shared
// rateLimit helper, env reads) and calls these.
//
// ENGLISH-ONLY. The streaming endpoint scores en-US pronunciation. This
// module deliberately imports NOTHING from the Vietnamese tone scorer
// (no SUPPORTED_TARGET_LOCALES, no NO_LOG_CONTEXTS, no tone thresholds)
// so English pronunciation scoring stays isolated from tone scoring.
// The only shared import is the pure premium-entitlement decision.

import {
  isPremiumEntitled,
  type PremiumEntitlementRow,
} from "../_shared/premiumEntitlement.ts";

// ── Tunables ────────────────────────────────────────────────────────────

/** Per-user session (WebSocket open) rate limit. Mirrors the batch
 *  azure-phoneme 30/hour ceiling — a streaming session is keyed
 *  separately (`azure-phoneme-stream:<userId>`) so it can't borrow the
 *  batch bucket, but uses the same shape. */
export const STREAM_RATE_LIMIT_MAX_SESSIONS = 30;
export const STREAM_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

/** Hard ceiling on the number of Azure passes a single streaming session
 *  may run (partials + the final pass combined). This is the
 *  per-session equivalent of the batch path's "one call per attempt":
 *  it bounds the multiplicative cost that made streaming dangerous.
 *  With PARTIAL_PASS_INTERVAL_SEC = 1.2 s and MAX_ACCUMULATED_SEC = 30 s
 *  an ungated session could fire ~26 passes; this caps it. When the cap
 *  is hit the running preview simply stops updating — the final pass on
 *  `end` still returns the true score (it is the last allowed pass). */
export const STREAM_MAX_PASSES_PER_SESSION = 12;

/** Minimum accumulated audio (seconds) before we are willing to spend an
 *  Azure pass. Below this the buffer is empty / too short to score —
 *  scoring it would waste budget and could only return a meaningless or
 *  fabricated number. Empty audio (0 bytes → 0 s) is the degenerate
 *  case this also covers. */
export const STREAM_MIN_PASS_AUDIO_SEC = 0.4;

/** Azure Pronunciation-Assessment price. Mirrors azure-phoneme/core.ts
 *  AZURE_USD_PER_MINUTE so the streaming spend logged into
 *  speech_analysis_logs is comparable with batch spend and feeds the
 *  same global daily cap. */
export const AZURE_USD_PER_MINUTE = 1 / 60;

/** Default global daily $ ceiling across ALL Azure speech spend. The
 *  production wiring reads AZURE_SPEECH_DAILY_CAP_USD (same env var the
 *  batch path uses) and falls back to this. Sharing the env var means
 *  one budget governs batch + stream together. */
export const STREAM_GLOBAL_DAILY_CAP_USD_DEFAULT = 25;

// ── Types ───────────────────────────────────────────────────────────────

/** Profile columns the stream trial/premium gate needs. Superset of
 *  PremiumEntitlementRow (premium_status / premium_expires_at / tier)
 *  plus the three historical trial-end column names. */
export type StreamProfileRow = PremiumEntitlementRow & {
  trial_expires_at: string | null;
  trial_ends_at: string | null;
  trial_end: string | null;
};

export type StreamGateReason =
  | "auth_required"
  | "rate_limited"
  | "trial_expired"
  | "global_daily_cap_reached";

export type StreamGateResult =
  | { allowed: true }
  | { allowed: false; reason: StreamGateReason };

export type StreamPassSkipReason =
  | "in_flight"
  | "empty_or_short_audio"
  | "session_pass_cap";

export type StreamPassDecision =
  | { run: true }
  | { run: false; reason: StreamPassSkipReason };

// ── Trial / premium gate ────────────────────────────────────────────────

/**
 * Decide whether the caller may use cloud (Azure) streaming scoring.
 *
 * Allow when EITHER they are an entitled premium user (isPremiumEntitled
 * — active/trialing within expiry, or past_due/grace_period dunning) OR
 * their trial has not yet expired. This is the same policy the batch
 * azure-phoneme path enforces (checkTrialAccess), re-expressed here so
 * the streaming module stays free of any azure-phoneme-batch / tone
 * coupling.
 *
 * Fail-OPEN on a missing profile: a null row means we could not read the
 * profile (Postgres blip / freshly-created row). The per-user rate limit
 * and the global daily cap still protect spend, so blocking a real
 * learner on a read error is the worse outcome — matching the batch
 * path's fail-open posture exactly.
 */
export function checkStreamTrialAccess(
  profile: StreamProfileRow | null,
  nowMs: number = Date.now(),
): boolean {
  if (!profile) return true; // fail-open (rate limit + global cap still guard)

  if (isPremiumEntitled(profile, nowMs)) return true;

  const trialIso =
    profile.trial_expires_at ??
    profile.trial_ends_at ??
    profile.trial_end ??
    null;

  // No trial timestamp anywhere → treat as not-yet-expired (legacy
  // users), same fallback the web app and batch path use.
  if (!trialIso) return true;

  const expiresMs = Date.parse(trialIso);
  if (!Number.isFinite(expiresMs)) return true; // unparseable → fail-open

  return nowMs <= expiresMs;
}

// ── Pre-connection gate ─────────────────────────────────────────────────

export type StreamGateDeps = {
  /** Throws an Error with message "RATE_LIMIT_EXCEEDED" when the bucket
   *  is full. Wired from _shared/rateLimit.ts in production. */
  rateLimit: (key: string, max: number, windowMs: number) => Promise<void>;
  /** Read the trial / entitlement columns for this user. Returns null on
   *  miss / error so the trial gate can fail-open. */
  fetchUserProfile: (userId: string) => Promise<StreamProfileRow | null>;
  /** Sum of today's logged Azure spend (USD) across all users + paths. */
  sumGlobalCostToday: () => Promise<number>;
  /** Hard ceiling in USD/day for Azure spend. */
  globalDailyCapUsd: number;
};

/**
 * The single chokepoint that must pass BEFORE the server upgrades the
 * WebSocket. If it denies, the caller never opens the socket, so the
 * session runs ZERO Azure passes. Order mirrors the batch handler:
 * rate limit → trial/premium gate → global daily cap.
 *
 * `userId` is the already-validated user id (JWT auth happens before
 * this — a missing/invalid token is the caller's `auth_required` path).
 */
export async function evaluateStreamGate(
  deps: StreamGateDeps,
  userId: string,
  nowMs: number = Date.now(),
): Promise<StreamGateResult> {
  // 1. Per-user rate limit on session opens.
  try {
    await deps.rateLimit(
      `azure-phoneme-stream:${userId}`,
      STREAM_RATE_LIMIT_MAX_SESSIONS,
      STREAM_RATE_LIMIT_WINDOW_MS,
    );
  } catch (err) {
    if (err instanceof Error && err.message === "RATE_LIMIT_EXCEEDED") {
      return { allowed: false, reason: "rate_limited" };
    }
    // Rate-limit subsystem error → fail-open (don't block on a blip);
    // the trial gate + global cap below still run.
  }

  // 2. Trial / premium gate. Profile read failure fails-open inside
  //    checkStreamTrialAccess.
  let profile: StreamProfileRow | null = null;
  try {
    profile = await deps.fetchUserProfile(userId);
  } catch {
    profile = null; // fail-open
  }
  if (!checkStreamTrialAccess(profile, nowMs)) {
    return { allowed: false, reason: "trial_expired" };
  }

  // 3. Global daily $ ceiling. Shared with the batch path.
  let todayUsd = 0;
  try {
    todayUsd = await deps.sumGlobalCostToday();
  } catch {
    todayUsd = 0; // read failure → don't block; cap re-checks next session
  }
  if (todayUsd >= deps.globalDailyCapUsd) {
    return { allowed: false, reason: "global_daily_cap_reached" };
  }

  return { allowed: true };
}

// ── Per-pass guard ──────────────────────────────────────────────────────

/**
 * Decide whether to spend ONE Azure pass on the current buffer. Pure;
 * the streaming server calls this immediately before every partial and
 * the final pass. Guards three ways:
 *   - a pass already in flight (don't double-fire / double-bill),
 *   - empty / too-short audio (nothing real to score — never fabricate),
 *   - the per-session pass cap (bounds multiplicative cost).
 *
 * `isFinal` lets the final pass run as the LAST allowed pass even when
 * partials have consumed the budget up to the cap: a learner who
 * actually recorded audio must still get their real end-of-utterance
 * score. It never lifts the empty-audio guard — empty audio yields no
 * score in either mode.
 */
export function shouldRunStreamAzurePass(args: {
  accumulatedSec: number;
  passesUsed: number;
  inFlight: boolean;
  isFinal?: boolean;
}): StreamPassDecision {
  if (args.inFlight) return { run: false, reason: "in_flight" };

  if (
    !Number.isFinite(args.accumulatedSec) ||
    args.accumulatedSec < STREAM_MIN_PASS_AUDIO_SEC
  ) {
    return { run: false, reason: "empty_or_short_audio" };
  }

  // Final pass may use the cap'th slot (passesUsed === cap - 1 ... and
  // one extra for final) — it is the last billable pass. Partial passes
  // stop strictly at the cap.
  const limit = args.isFinal
    ? STREAM_MAX_PASSES_PER_SESSION + 1
    : STREAM_MAX_PASSES_PER_SESSION;
  if (args.passesUsed >= limit) {
    return { run: false, reason: "session_pass_cap" };
  }

  return { run: true };
}

/** USD cost of one Azure pass over `accumulatedSec` of audio. Azure
 *  bills the full accumulated buffer on each pass; logging this per pass
 *  makes streaming spend visible in speech_analysis_logs and countable
 *  against the global daily cap. */
export function streamPassCostUsd(accumulatedSec: number): number {
  if (!accumulatedSec || accumulatedSec <= 0) return 0;
  return Number(((accumulatedSec / 60) * AZURE_USD_PER_MINUTE).toFixed(6));
}
