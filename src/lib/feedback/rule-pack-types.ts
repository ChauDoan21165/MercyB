/**
 * Rule-pack types for the L1 error detector.
 *
 * The detector engine is language-agnostic. A "rule pack" is the
 * data + ordered rule functions for a specific learner first language
 * (L1). Today we ship one pack: Vietnamese (`vi`). Future packs
 * (Korean `ko`, Russian `ru`, etc.) are file additions under
 * `rule-packs/<code>/` — no detector changes required.
 *
 * What lives in a pack:
 *   - `rules`        — ordered list of pure rule functions. First match
 *                      wins; order encodes priority (specific patterns
 *                      before generic fallbacks).
 *   - `explanations` — bilingual feedback templates keyed by tag. The
 *                      detector substitutes `{FIX}` / `{USER_PREP}` /
 *                      etc. into these at result time.
 *
 * What stays in the detector:
 *   - English-grammar helpers (tokenize, contraction normalisation,
 *     past-form detection, plural-form detection, …). These are
 *     properties of the TARGET language (English), not the L1.
 *   - The execution algorithm itself.
 *
 * Re-exports the `L1Rule` / `RuleHit` / `RuleArgs` types from the
 * detector so pack authors only need one import to write rule
 * functions.
 */

import type {
  L1Rule,
  RuleArgs,
  RuleHit,
  StringTemplate,
} from "./l1-error-detector.js";

export type { L1Rule, RuleArgs, RuleHit, StringTemplate };

/**
 * Bilingual short-form feedback for one rule. The `en` and `vi`
 * strings are surfaced verbatim by the UI after token substitution.
 *
 * Keep these tight (one short paragraph at most) — long-form
 * teacher-voice copy lives in `l1-vn-explanations.ts` and is shown on
 * separate detail screens, not in the answer-time bubble.
 */
export interface L1Explanation {
  /** Tag must match a rule in the same pack's `rules` array. */
  tag: string;
  /** English text — supports `{TOKEN}` placeholders. */
  en: string;
  /** L1-language text — supports `{TOKEN}` placeholders. */
  vi: string;
}

/**
 * One language pack. Self-contained: the detector + this object are
 * everything needed to evaluate `text → result`.
 */
export interface L1RulePack {
  /** ISO 639-1 code, lowercase. e.g. 'vi', 'ko', 'ru'. */
  l1Code: string;
  /** Native-language display name. e.g. 'Tiếng Việt', '한국어'. */
  l1Name: string;
  /** Semver. Bump on rule additions or feedback-string edits. */
  version: string;
  /** Ordered rule functions; first match wins. */
  rules: L1Rule[];
  /** Bilingual templates indexed by tag at runtime. */
  explanations: L1Explanation[];
}

// ──────────────────────────────────────────────────────────────────────
// Validation
// ──────────────────────────────────────────────────────────────────────

/**
 * Pure validator. Returns an array of issue strings; an empty array
 * means the pack is structurally OK.
 *
 * Checks:
 *   - required string fields are non-empty
 *   - rules and explanations are arrays
 *   - every explanation tag is a non-empty string
 *   - every rule has a corresponding explanation entry
 *   - explanation tags are unique
 *   - version is dot-separated digits (lightweight semver check)
 *
 * Does NOT execute any rule functions — that's a runtime concern
 * exercised by the existing detector tests.
 */
export function validateRulePack(pack: L1RulePack): string[] {
  const issues: string[] = [];

  if (!pack || typeof pack !== "object") {
    return ["pack is not an object"];
  }
  if (typeof pack.l1Code !== "string" || pack.l1Code.trim() === "") {
    issues.push("l1Code is required and must be a non-empty string");
  }
  if (typeof pack.l1Name !== "string" || pack.l1Name.trim() === "") {
    issues.push("l1Name is required and must be a non-empty string");
  }
  if (typeof pack.version !== "string" || !/^\d+(\.\d+){0,2}$/.test(pack.version)) {
    issues.push("version must be a dot-separated semver-style string");
  }
  if (!Array.isArray(pack.rules)) {
    issues.push("rules must be an array");
  }
  if (!Array.isArray(pack.explanations)) {
    issues.push("explanations must be an array");
  }
  if (!Array.isArray(pack.rules) || !Array.isArray(pack.explanations)) {
    return issues;
  }
  if (pack.rules.length === 0) {
    issues.push("rules array is empty");
  }
  if (pack.explanations.length === 0) {
    issues.push("explanations array is empty");
  }

  for (const rule of pack.rules) {
    if (typeof rule !== "function") {
      issues.push("a rule entry is not a function");
      break;
    }
  }

  const seenTags = new Set<string>();
  for (const exp of pack.explanations) {
    if (!exp || typeof exp !== "object") {
      issues.push("an explanation entry is not an object");
      continue;
    }
    if (typeof exp.tag !== "string" || exp.tag.trim() === "") {
      issues.push("explanation.tag must be a non-empty string");
      continue;
    }
    if (seenTags.has(exp.tag)) {
      issues.push(`duplicate explanation tag: ${exp.tag}`);
    }
    seenTags.add(exp.tag);
    if (typeof exp.en !== "string" || exp.en.trim() === "") {
      issues.push(`explanation.en is empty for tag ${exp.tag}`);
    }
    if (typeof exp.vi !== "string" || exp.vi.trim() === "") {
      issues.push(`explanation.vi is empty for tag ${exp.tag}`);
    }
  }

  return issues;
}

/**
 * Build a tag → StringTemplate map from a pack's explanations array.
 * Used by the detector at result time to fill bilingual feedback.
 */
export function explanationsByTag(
  pack: L1RulePack,
): Record<string, StringTemplate> {
  const out: Record<string, StringTemplate> = {};
  for (const exp of pack.explanations) {
    out[exp.tag] = { en: exp.en, vi: exp.vi };
  }
  return out;
}
