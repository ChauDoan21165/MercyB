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
    // Defensive: issue could be null/undefined/non-object if upstream
    // (e.g. OpenAI JSON parse) produced something malformed.
    if (!issue || typeof issue !== 'object') continue;
    const rawUser = (issue as GrammarIssueLike).before ?? (issue as GrammarIssueLike).original;
    const rawExpected = (issue as GrammarIssueLike).corrected ?? (issue as GrammarIssueLike).after;
    const user = typeof rawUser === 'string' ? rawUser.trim() : '';
    const expected = typeof rawExpected === 'string' ? rawExpected.trim() : '';
    if (!user || !expected) continue;

    let res: L1DetectionResult;
    try {
      res = detectL1Error({ userAnswer: user, expectedAnswer: expected });
    } catch (err) {
      // A regex or DP-alignment bug inside the detector must never kill
      // the caller. Log + move on to the next issue.
      console.warn('[l1HintAdapter] detectL1Error threw — skipping this issue:', err);
      continue;
    }

    if (res.matched) {
      return {
        weaknessTag: res.weaknessTag,
        feedback: res.feedback,
      };
    }
  }
  return null;
}
