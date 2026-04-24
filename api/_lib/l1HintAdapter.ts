// api/_lib/l1HintAdapter.ts
//
// Thin adapter that takes a grammar engine's issues[] output and runs the
// Vietnamese L1 error detector across it. Returns the first priority-ordered
// L1 match so callers can attach it to the response as `l1Hint`.
//
// Location rationale: Vercel's serverless bundler does NOT trace imports
// outside common project subtrees (api/, src/, node_modules/). The original
// location at server/mercy/l1HintAdapter.ts caused
//   [ERR_MODULE_NOT_FOUND] Cannot find module '/var/task/server/mercy/l1HintAdapter'
// in production on every grammar request. Relocating here (the standard
// api/_lib convention — underscore prefix keeps it from being routable)
// lets Vercel bundle it automatically.
//
// Shared between:
//   - api/mercy/grammar.ts            (Vercel serverless, OpenAI engine)
//   - server/routes/grammar.ts        (local dev, rule-based engine)
// Both engines use slightly different field names for the before/after
// pair — rule-based emits `{before, corrected}`, OpenAI emits
// `{original, corrected}`. This adapter normalises both shapes.

// Explicit `.js` extension — same ESM resolver requirement as the top
// of api/mercy/grammar.ts. See fix/grammar-esm-extensions.
import {
  detectL1Error,
  type L1DetectionResult,
} from '../../src/lib/feedback/l1-error-detector.js';

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
 *
 * Defensive: never throws. Junk inputs (null entries, non-string fields,
 * a buggy rule regex) are logged and skipped so one bad issue can't poison
 * the whole iteration or 500 the grammar endpoint.
 */
export function firstL1HintFromIssues(
  issues: readonly GrammarIssueLike[] | undefined | null,
): L1HintPayload | null {
  if (!Array.isArray(issues)) return null;

  for (const issue of issues) {
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
