export const LEARNER_PATTERN_TREND_EVIDENCE_FLOOR = 5;

export type LearnerPatternTrend = "insufficient" | "improving" | "stable" | "worsening";

export function computePatternTrend(
  previousOccurrence: number,
  previousResolved: number,
  occurrence: number,
  resolved: number,
): LearnerPatternTrend {
  if (occurrence < LEARNER_PATTERN_TREND_EVIDENCE_FLOOR) return "insufficient";

  const previousOpen = Math.max(0, previousOccurrence - previousResolved);
  const nextOpen = Math.max(0, occurrence - resolved);
  if (nextOpen < previousOpen) return "improving";
  if (nextOpen > previousOpen && previousOccurrence > 0) return "worsening";
  return "stable";
}
