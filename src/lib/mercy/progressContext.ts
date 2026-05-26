// Build a small "what does Mercy know about this learner's recent
// pronunciation progress" payload, used by the proactive-progress
// feature to inject a single block into the Mercy chat system prompt.
//
// Source: src/lib/analytics/speechProgress.getWeeklyProgressSummary
// (the exact data /progress dashboard reads). We project it down to
// the shape that's actually useful inside a chat system prompt:
// a few headline numbers, the top improved phoneme, and one weak
// phoneme. Anything richer would push the prompt over budget without
// helping the LLM choose better wording.
//
// Caching:
//   - SessionStorage-keyed by user-id with a 10-minute TTL. Mercy may
//     issue multiple chat turns in a session; refetching weekly stats
//     on every turn is wasteful.
//   - The cache is best-effort. Falls back to a fresh fetch when
//     sessionStorage is unavailable (Safari private mode, SSR).
//
// "Empty signal" rule: returns null when the user has fewer than 3
// attempts this week. Below that, any "improvement" claim is noise —
// the data isn't strong enough for Mercy to mention it without
// sounding like a coach who's making things up.

import { getWeeklyProgressSummary } from "@/lib/analytics/speechProgress";
import { getPhonemeHeatmap } from "@/lib/pronunciation/phonemeHeatmap";
import { generateInsights } from "@/lib/pronunciation/heatmapInsights";

/** Minimum attempts this week before we surface progress at all. */
export const MIN_WEEKLY_ATTEMPTS_FOR_CONTEXT = 3;

/** SessionStorage TTL for the cached payload (10 min). */
const SESSION_TTL_MS = 10 * 60 * 1000;

const SESSION_KEY_PREFIX = "mercy.progress.context.v1.";

/**
 * The payload shape sent over the wire and slotted into the Mercy
 * system prompt. Intentionally tiny — the LLM should only need a few
 * concrete numbers to ground a single sentence.
 */
export type ProgressContext = {
  /** Attempts in the current ISO week (Monday-start UTC). */
  attemptsThisWeek: number;
  /** Average overall score this week, 0..100. Null when no scoring data. */
  averageScoreThisWeek: number | null;
  /** Score delta vs last week (this - last). Null on either side absent. */
  scoreDelta: number | null;
  /** Top improved phoneme this week vs last; null if none qualify. */
  mostImprovedPhoneme:
    | { phoneme: string; previousScore: number; currentScore: number; delta: number }
    | null;
  /** One phoneme to focus on (lowest current-week average); null if no phonemes. */
  weakestPhoneme:
    | { phoneme: string; averageScore: number }
    | null;
  /** Server-side current streak (profiles.streak_current). */
  streak: number;
  /**
   * One-line snapshot from the 30-day phoneme heatmap, populated
   * lazily when a heatmap snapshot exists for the user. The shape is
   * deliberately minimal: just enough for Mercy to say "tôi thấy bạn
   * đã cải thiện /θ/ — tăng từ 65 lên 82 trong 2 tuần" without
   * inventing numbers.
   */
  heatmapHighlight:
    | {
        kind: "most_improved" | "plateau" | "needs_work" | "doing_well";
        phoneme: string;
        averageScore: number;
        delta: number | null;
      }
    | null;
  /** When this snapshot was built (epoch ms). Used for client-side cache TTL. */
  builtAt: number;
};

/**
 * Fetch + project + cache the progress context for a user. Returns
 * null when the signal isn't strong enough to surface, or when the
 * underlying fetch fails (we never want a Mercy turn to break because
 * progress aggregation hiccupped — proactive mention is a bonus, not
 * a critical path).
 */
export async function buildProgressContext(
  userId: string,
): Promise<ProgressContext | null> {
  if (!userId) return null;

  const cached = readCache(userId);
  if (cached) return cached;

  let summary;
  try {
    summary = await getWeeklyProgressSummary(userId);
  } catch (err) {
    console.warn("[mercy/progressContext] fetch failed:", err);
    return null;
  }

  if (summary.thisWeek.attempts < MIN_WEEKLY_ATTEMPTS_FOR_CONTEXT) {
    return null;
  }

  const top = summary.mostImproved[0];
  const weakest = summary.weakest[0];

  // Heatmap snapshot is best-effort. A failure here must NOT prevent
  // the rest of the progress context from being returned — the chat
  // turn already factored Mercy's response on the weekly summary.
  let heatmapHighlight: ProgressContext["heatmapHighlight"] = null;
  try {
    const heatmap = await getPhonemeHeatmap(userId, 30);
    if (heatmap) {
      const insights = generateInsights(heatmap);
      // Prefer most_improved (it's the most quotable). Fall back to
      // needs_work for users who haven't shown gains yet.
      const top =
        insights.find((i) => i.kind === "most_improved") ??
        insights.find((i) => i.kind === "needs_work") ??
        insights[0];
      if (top) {
        heatmapHighlight = {
          kind: top.kind,
          phoneme: top.phoneme,
          averageScore: top.averageScore,
          delta: top.delta,
        };
      }
    }
  } catch (err) {
    console.warn("[mercy/progressContext] heatmap projection failed:", err);
  }

  const ctx: ProgressContext = {
    attemptsThisWeek: summary.thisWeek.attempts,
    averageScoreThisWeek: summary.thisWeek.averageScore,
    scoreDelta: summary.scoreDelta,
    mostImprovedPhoneme: top
      ? {
          phoneme: top.phoneme,
          previousScore: Math.round(top.averageScore - top.delta),
          currentScore: Math.round(top.averageScore),
          delta: Math.round(top.delta),
        }
      : null,
    weakestPhoneme: weakest
      ? {
          phoneme: weakest.phoneme,
          averageScore: Math.round(weakest.averageScore),
        }
      : null,
    streak: summary.streak,
    heatmapHighlight,
    builtAt: Date.now(),
  };

  writeCache(userId, ctx);
  return ctx;
}

/**
 * Format the context as a block to inject into the Mercy system prompt.
 * Bilingual labels because Mercy's response is bilingual; the LLM
 * picks language based on user input but having both tags helps the
 * model identify the field.
 *
 * Returns "" when ctx is null so callers can string-concat without a
 * branch.
 */
export function formatProgressContextForPrompt(
  ctx: ProgressContext | null,
): string {
  if (!ctx) return "";

  const lines: string[] = [
    "STUDENT_PROGRESS (use sparingly; mention at most ONE point per response, only when the user expresses doubt, frustration, or wins; never lecture):",
    `- Attempts this week: ${ctx.attemptsThisWeek}`,
  ];

  if (ctx.averageScoreThisWeek !== null) {
    lines.push(`- Average score this week: ${ctx.averageScoreThisWeek}/100`);
  }
  if (ctx.scoreDelta !== null) {
    const sign = ctx.scoreDelta >= 0 ? "+" : "";
    lines.push(`- Score change vs last week: ${sign}${ctx.scoreDelta}`);
  }
  if (ctx.mostImprovedPhoneme) {
    const m = ctx.mostImprovedPhoneme;
    lines.push(
      `- Most improved phoneme: /${m.phoneme}/ went ${m.previousScore} → ${m.currentScore} (+${m.delta})`,
    );
  }
  if (ctx.weakestPhoneme) {
    lines.push(
      `- Still working on: /${ctx.weakestPhoneme.phoneme}/ (currently ${ctx.weakestPhoneme.averageScore}/100)`,
    );
  }
  if (ctx.streak > 0) {
    lines.push(`- Current streak: ${ctx.streak} days`);
  }
  if (ctx.heatmapHighlight) {
    const h = ctx.heatmapHighlight;
    const tag =
      h.kind === "most_improved"
        ? "30-day improving"
        : h.kind === "plateau"
        ? "30-day plateau"
        : h.kind === "needs_work"
        ? "30-day low"
        : "30-day strong";
    const deltaPart = h.delta !== null ? ` (delta ${h.delta >= 0 ? "+" : ""}${h.delta})` : "";
    lines.push(
      `- Heatmap (${tag}): /${h.phoneme}/ at ${h.averageScore}/100${deltaPart}`,
    );
  }

  return lines.join("\n");
}

/** Test-only — dump the cache (used by progressTriggers tests too). */
export function clearProgressContextCache(userId: string): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.removeItem(SESSION_KEY_PREFIX + userId);
  } catch {
    /* ignore */
  }
}

// ── Cache helpers ───────────────────────────────────────────────────────

function readCache(userId: string): ProgressContext | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY_PREFIX + userId);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ProgressContext;
    if (typeof parsed.builtAt !== "number") return null;
    if (Date.now() - parsed.builtAt > SESSION_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(userId: string, ctx: ProgressContext): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_KEY_PREFIX + userId, JSON.stringify(ctx));
  } catch {
    /* ignore — quota exceeded, private mode */
  }
}
