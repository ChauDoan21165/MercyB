// Mercy's "what should I practice tonight?" engine.
//
// Reads the existing speechProgress aggregates (no new server work)
// + a thin practice-history view, runs them through a priority-ordered
// rule list (./recommendationRules), enforces a per-recommendation
// cooldown (same suggestion won't reappear within 4 hours), and
// returns one recommendation — or null when no rule fires.
//
// Two surfaces consume this:
//   - Home page card (PracticeRecommendationCard) — auto-fetched on
//     mount when the practice_recommendations_enabled flag is on.
//   - Mercy chat — when the user asks "tôi nên luyện gì?" the chat
//     layer fetches a recommendation via this module and renders an
//     inline card under Mercy's reply.
//
// Lazy by default. Cached in sessionStorage for 10 min so multiple
// surfaces in the same session don't re-fetch the underlying weekly
// summary.

import {
  getWeeklyProgressSummary,
  type WeeklyProgress,
} from "@/lib/analytics/speechProgress";
import {
  RECOMMENDATION_RULES,
  type Recommendation,
  type RecommendationRule,
  type RecommendationContext,
} from "./recommendationRules";

export type {
  Recommendation,
  RecommendationRule,
  RecommendationContext,
} from "./recommendationRules";

/** Same suggestion blocked from reappearing within this window. */
export const RECOMMENDATION_COOLDOWN_MS = 4 * 60 * 60 * 1000;

/** SessionStorage TTL on the upstream WeeklyProgress fetch. */
const SESSION_TTL_MS = 10 * 60 * 1000;
const SESSION_KEY_PREFIX = "mercy.practiceRec.context.v1.";
const STATE_KEY_PREFIX = "mercy.practiceRec.lastRecommended.v1.";

export type RecommendationState = {
  /** ID of the recommendation last shown to this user. */
  lastRecommendationId: string | null;
  /** When that recommendation was shown (epoch ms). */
  lastShownAt: number;
};

const EMPTY_STATE: RecommendationState = {
  lastRecommendationId: null,
  lastShownAt: 0,
};

// ── Public API ──────────────────────────────────────────────────────────

/**
 * Return the next-best recommendation for the user, or null when
 * either:
 *   - The user has no progress signal yet (anonymous, or zero attempts).
 *   - All eligible rules' recommendations are still on cooldown.
 *   - The upstream progress fetch failed (we never block on infra hiccups).
 */
export async function getRecommendation(
  userId: string | null,
): Promise<Recommendation | null> {
  if (!userId) return null;

  let weekly: WeeklyProgress;
  try {
    weekly = await loadWeeklyCached(userId);
  } catch (err) {
    console.warn("[practiceRecommendations] fetch failed:", err);
    return null;
  }

  const state = readRecommendationState(userId);
  const ctx: RecommendationContext = {
    userId,
    weekly,
    now: Date.now(),
  };

  return selectRecommendation(RECOMMENDATION_RULES, ctx, state);
}

/**
 * Pure orchestrator. Exported separately so tests can pass synthetic
 * rule arrays without going through the whole module.
 *
 * Priority semantics: walk rules in order; for each rule whose
 * `isEligible` returns true, build the recommendation and check
 * cooldown. Return the first one that passes the cooldown gate.
 * If every eligible rule is on cooldown, return null (deliberate —
 * we'd rather show nothing than recycle a stale suggestion).
 */
export function selectRecommendation(
  rules: readonly RecommendationRule[],
  ctx: RecommendationContext,
  state: RecommendationState,
): Recommendation | null {
  for (const rule of rules) {
    if (!rule.isEligible(ctx)) continue;
    const rec = rule.build(ctx);
    if (!rec) continue;
    if (!isCooldownPassed(rec.id, state, ctx.now)) continue;
    return rec;
  }
  return null;
}

/**
 * Mark a recommendation as just-shown. Caller invokes this after the
 * UI has rendered the recommendation (Home card mount, chat-card
 * append) to start the cooldown clock.
 */
export function recordRecommendationShown(
  userId: string,
  recommendation: Recommendation,
  now: number = Date.now(),
): RecommendationState {
  const next: RecommendationState = {
    lastRecommendationId: recommendation.id,
    lastShownAt: now,
  };
  writeRecommendationState(userId, next);
  return next;
}

export function readRecommendationState(userId: string): RecommendationState {
  if (!userId || typeof localStorage === "undefined") return { ...EMPTY_STATE };
  try {
    const raw = localStorage.getItem(STATE_KEY_PREFIX + userId);
    if (!raw) return { ...EMPTY_STATE };
    const parsed = JSON.parse(raw) as Partial<RecommendationState>;
    return {
      lastRecommendationId:
        typeof parsed.lastRecommendationId === "string"
          ? parsed.lastRecommendationId
          : null,
      lastShownAt: typeof parsed.lastShownAt === "number" ? parsed.lastShownAt : 0,
    };
  } catch {
    return { ...EMPTY_STATE };
  }
}

/**
 * Pure cooldown predicate. The same recommendation ID can't reappear
 * within RECOMMENDATION_COOLDOWN_MS. Different IDs always pass.
 */
export function isCooldownPassed(
  recommendationId: string,
  state: RecommendationState,
  now: number = Date.now(),
): boolean {
  if (state.lastRecommendationId !== recommendationId) return true;
  if (state.lastShownAt === 0) return true;
  return now - state.lastShownAt >= RECOMMENDATION_COOLDOWN_MS;
}

/** Test-only — clear the per-user cache + cooldown state. */
export function __clearRecommendationStateForTests(userId: string): void {
  if (typeof localStorage !== "undefined") {
    try { localStorage.removeItem(STATE_KEY_PREFIX + userId); } catch { /* ignore */ }
  }
  if (typeof sessionStorage !== "undefined") {
    try { sessionStorage.removeItem(SESSION_KEY_PREFIX + userId); } catch { /* ignore */ }
  }
}

// ── Caching helpers ─────────────────────────────────────────────────────

async function loadWeeklyCached(userId: string): Promise<WeeklyProgress> {
  const cached = readWeeklyCache(userId);
  if (cached) return cached;
  const summary = await getWeeklyProgressSummary(userId);
  writeWeeklyCache(userId, summary);
  return summary;
}

type CachedWeekly = { builtAt: number; summary: WeeklyProgress };

function readWeeklyCache(userId: string): WeeklyProgress | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY_PREFIX + userId);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedWeekly;
    if (typeof parsed.builtAt !== "number") return null;
    if (Date.now() - parsed.builtAt > SESSION_TTL_MS) return null;
    return parsed.summary;
  } catch {
    return null;
  }
}

function writeWeeklyCache(userId: string, summary: WeeklyProgress): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    const payload: CachedWeekly = { builtAt: Date.now(), summary };
    sessionStorage.setItem(SESSION_KEY_PREFIX + userId, JSON.stringify(payload));
  } catch {
    /* ignore — quota exceeded, private mode */
  }
}

function writeRecommendationState(userId: string, state: RecommendationState): void {
  if (!userId || typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STATE_KEY_PREFIX + userId, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}
