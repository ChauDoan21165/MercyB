// server/mercy/l1HintAdapter.ts
//
// Thin adapter that takes a grammar engine's issues[] output and runs the
// Vietnamese L1 error detector across it. Returns the first priority-ordered
// L1 match so callers can attach it to the response as `l1Hint`.
//
// Shared between:
//   - server/routes/grammar.ts        (local dev, rule-based engine)
//   - api/mercy/grammar.ts            (Vercel serverless, OpenAI engine)
//
// The two engines use slightly different field names for the before/after
// pair — rule-based emits `{before, corrected}`, OpenAI emits
// `{original, corrected}`. This adapter normalises both shapes.

import {
  detectL1Error,
  type L1DetectionResult,
} from '../../src/lib/feedback/l1-error-detector';

export type GrammarIssueLike = {
  before?: string;
  original?: string;
  corrected?: string;
  after?: string;
};

export type L1HintPayload = {
  weaknessTag: string;
  feedback: { en: string; vi: string };
};

/**
 * Iterate issues in order and return the first L1 match. Returns null when
 * no rule fires on any issue — caller should fall back to the engine's
 * existing generic feedback (L1 detector enhances, never removes).
 */
export function firstL1HintFromIssues(
  issues: readonly GrammarIssueLike[] | undefined | null,
): L1HintPayload | null {
  if (!Array.isArray(issues)) return null;

  for (const issue of issues) {
    const user = (issue.before ?? issue.original ?? '').trim();
    const expected = (issue.corrected ?? issue.after ?? '').trim();
    if (!user || !expected) continue;

    const res: L1DetectionResult = detectL1Error({
      userAnswer: user,
      expectedAnswer: expected,
    });

    if (res.matched) {
      return {
        weaknessTag: res.weaknessTag,
        feedback: res.feedback,
      };
    }
  }
  return null;
}
