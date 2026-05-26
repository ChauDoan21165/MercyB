/**
 * Path: supabase/functions/ai-chat/factSlotting.ts
 *
 * Step 7 (AI Teacher v2) — pure helpers for slotting active user facts
 * into the ai-chat system prompt. The edge function (`index.ts`) wires
 * the DB fetch + write-back; this module is the "what does the prompt
 * actually look like?" surface, which lets vitest exercise it from
 * Node without booting Deno.
 *
 * Designed to mirror A2's `getActiveFactsForUser` ordering (confidence
 * DESC, then last_referenced_at DESC). The ordering invariant lives
 * here because the edge function fetches via the JS client which
 * accepts the same order clauses.
 */

/** Maximum facts injected into a single prompt. Brief says N = 10. */
export const MAX_FACTS_IN_PROMPT = 10;

/**
 * Confidence floor: facts below this are dropped before formatting,
 * matching the design doc ("anything below 0.3 is dropped").
 */
export const MIN_CONFIDENCE_FOR_PROMPT = 0.3;

export type EdgeUserFact = {
  id: string;
  fact_type: "preference" | "goal" | "context" | "avoidance";
  content: string;
  confidence: number;
  last_referenced_at: string | null;
};

/**
 * Bucket label for a confidence score. Mirrors the design-doc model:
 *   ≥ 0.8 → high
 *   ≥ 0.5 → medium
 *   else  → low
 *
 * (Below 0.3 is dropped before this point — see selectTopFacts.)
 */
export function confidenceBucket(c: number): "high" | "medium" | "low" {
  if (c >= 0.8) return "high";
  if (c >= 0.5) return "medium";
  return "low";
}

/**
 * Sort + drop-low-confidence + slice. Returns at most `n` facts.
 *
 * Sort key: confidence DESC, then last_referenced_at DESC (nulls last).
 * Two facts with identical keys keep input order — stable sort.
 */
export function selectTopFacts(
  facts: ReadonlyArray<EdgeUserFact>,
  n: number = MAX_FACTS_IN_PROMPT,
): EdgeUserFact[] {
  if (n <= 0) return [];
  const filtered = facts.filter(
    (f) => f.confidence >= MIN_CONFIDENCE_FOR_PROMPT,
  );
  const sorted = filtered.slice().sort((a, b) => {
    if (b.confidence !== a.confidence) return b.confidence - a.confidence;
    const aRef = a.last_referenced_at
      ? Date.parse(a.last_referenced_at)
      : Number.NEGATIVE_INFINITY;
    const bRef = b.last_referenced_at
      ? Date.parse(b.last_referenced_at)
      : Number.NEGATIVE_INFINITY;
    return bRef - aRef;
  });
  return sorted.slice(0, n);
}

/**
 * Format the active facts as a system-prompt section. Returns an empty
 * string when the (post-filter) list is empty, so callers can
 * concatenate unconditionally without leaving an empty header behind.
 */
export function formatUserFactsSection(
  facts: ReadonlyArray<EdgeUserFact>,
): string {
  if (facts.length === 0) return "";

  const bullets = facts.map((f) => {
    const bucket = confidenceBucket(f.confidence);
    const typeLabel = capitalize(f.fact_type);
    return `- ${typeLabel}: ${f.content}  (${bucket} confidence)`;
  });

  // Header copy mirrors A2's design doc ("What I know about this learner")
  // but uses the brief's wording ("Things I remember about you") so the
  // prompt language reads natural to the model. Both forms point at the
  // same data — keep the prompt voice consistent across follow-ups.
  return [
    "## Things I remember about you",
    "Use these facts to choose pacing, tone, and examples. Don't quote them",
    "back at the learner verbatim — adapt your reply to fit them.",
    "",
    ...bullets,
  ].join("\n");
}

function capitalize(s: string): string {
  if (!s) return s;
  return s[0].toUpperCase() + s.slice(1);
}
