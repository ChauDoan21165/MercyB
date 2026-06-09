import { englishCorrectionRules, isClearlyWrongBeginnerEnglish } from "./correctionRules/en";
import { frenchCorrectionRules } from "./correctionRules/fr";
import { chineseCorrectionRules } from "./correctionRules/zh";
import type { CorrectionRule } from "./correctionRules/en";

export type TutorCorrectionLanguage = "en" | "fr" | "zh";

export const AI_CORRECTION_REQUIRED_MESSAGE =
  "Mercy needs the AI correction engine for this one.";

export type CorrectionEngineResult =
  | {
      status: "corrected" | "unchanged";
      corrected: string;
      appliedRuleIds: string[];
      message?: undefined;
    }
  | {
      status: "needs_ai";
      corrected: "";
      appliedRuleIds: string[];
      message: string;
      /** Honest clarification surfaced when a fix would be semantically implausible (BUG1).
       * Present only on the semantic-abstention path; never a confident correction. */
      semanticHint?: string;
    };

export type CorrectionValidationResult =
  | { ok: true; reason?: undefined; message?: undefined }
  | { ok: false; reason: "unchanged_wrong"; message: string };

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function ensureTerminalPunctuation(value: string, language: TutorCorrectionLanguage): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (/[.!?。！？]$/.test(trimmed)) return trimmed;
  return language === "zh" ? `${trimmed}。` : `${trimmed}.`;
}

function capitalizeFirst(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}`;
}

function normalizedForComparison(value: string): string {
  return normalizeWhitespace(value).toLowerCase();
}

/**
 * Semantic plausibility (BUG1 trust floor). A grammar-only fix can be syntactically clean yet
 * still nonsense — e.g. "I buy a head yesterday" -> "I bought a head yesterday". Presenting that
 * confidently violates "a wrong correction is worse than no correction". These high-precision
 * signals flag such cases so the engine abstains (routes to the AI engine) with an honest
 * clarification hint instead of a confident wrong correction. Each signal carries the
 * precision-gate evidence (3+ positives, 2+ confusable negatives, fp_risk_note) the project
 * requires for any correction-affecting category.
 */
export type SemanticImplausibilitySignal = {
  id: string;
  /** Matches the implausible surface form. */
  detect: RegExp;
  /** Excludes plausible uses that would otherwise match `detect` (false-positive guard). */
  plausibleException?: RegExp;
  positives: readonly string[];
  confusableNegatives: readonly string[];
  fpRiskNote: string;
  /** Honest, low-shame, Vietnamese-primary clarification — never a confident correction. */
  clarificationHint: string;
};

export const SEMANTIC_IMPLAUSIBILITY_SIGNALS: readonly SemanticImplausibilitySignal[] = [
  {
    id: "buy-object-head-likely-hat",
    detect: /\b(?:buy|buys|buying|bought)\s+(?:a|an|the|one|another|my|your|some)\s+heads?\b/i,
    // "a head of lettuce/cabbage/garlic/broccoli" is a real, plausible phrase — never flag it.
    plausibleException: /\bheads?\s+of\b/i,
    positives: [
      "I buy a head yesterday.",
      "I bought a head.",
      "I want to buy a head.",
    ],
    confusableNegatives: [
      "I bought a head of lettuce.",
      "I bought a head of cabbage.",
    ],
    fpRiskNote:
      "Only flags buy/bought + 'a/the/my head' as a standalone object; excludes 'a head of <vegetable>' (a real phrase) and the adverb 'ahead'. A bought 'head' is almost always a mis-heard 'hat' — 'head'/'hat' are near-homophones and Vietnamese 'mũ' (hat/helmet) compounds the confusion — so we clarify rather than confidently correct.",
    clarificationHint:
      "Bạn muốn nói \"hat\" (mũ) phải không? Câu \"buy a head\" nghe chưa rõ nghĩa, nên Mercy hỏi lại cho chắc. (Did you mean \"hat\"? \"Buy a head\" doesn't quite make sense, so let's double-check.)",
  },
];

/** Returns the first matching implausibility signal for an English sentence, else null. */
export function findSemanticImplausibility(sentence: string): SemanticImplausibilitySignal | null {
  const normalized = normalizeWhitespace(sentence);
  if (!normalized) return null;
  for (const signal of SEMANTIC_IMPLAUSIBILITY_SIGNALS) {
    if (signal.plausibleException?.test(normalized)) continue;
    if (signal.detect.test(normalized)) return signal;
  }
  return null;
}

function rulesForLanguage(language: TutorCorrectionLanguage): CorrectionRule[] {
  switch (language) {
    case "fr":
      return frenchCorrectionRules;
    case "zh":
      return chineseCorrectionRules;
    case "en":
    default:
      return englishCorrectionRules;
  }
}

export function isClearlyWrongForTutor(
  input: string,
  language: TutorCorrectionLanguage = "en",
): boolean {
  if (language === "en") return isClearlyWrongBeginnerEnglish(input);
  return rulesForLanguage(language).some((rule) => rule.detects(input));
}

export function validateCorrectionChangedWhenNeeded(
  input: string,
  corrected: string,
): CorrectionValidationResult {
  if (
    isClearlyWrongForTutor(input, "en") &&
    normalizedForComparison(input) === normalizedForComparison(corrected)
  ) {
    return {
      ok: false,
      reason: "unchanged_wrong",
      message: AI_CORRECTION_REQUIRED_MESSAGE,
    };
  }

  return { ok: true };
}

export function correctWithTutorRules(
  input: string,
  language: TutorCorrectionLanguage = "en",
): CorrectionEngineResult {
  const trimmed = normalizeWhitespace(input);
  if (!trimmed) {
    return { status: "unchanged", corrected: "", appliedRuleIds: [] };
  }

  let corrected = language === "en" ? capitalizeFirst(trimmed) : trimmed;
  const appliedRuleIds: string[] = [];

  for (const rule of rulesForLanguage(language)) {
    if (!rule.detects(corrected)) continue;
    const next = rule.apply(corrected);
    if (normalizeWhitespace(next) !== normalizeWhitespace(corrected)) {
      corrected = next;
      appliedRuleIds.push(rule.id);
    }
  }

  corrected = ensureTerminalPunctuation(corrected, language);

  // BUG1 trust floor: a grammar fix that is still semantically implausible must not be shown
  // confidently — abstain to the AI engine with an honest clarification hint instead.
  const implausible = language === "en" ? findSemanticImplausibility(corrected) : null;

  if (appliedRuleIds.length > 0) {
    const validation = validateCorrectionChangedWhenNeeded(trimmed, corrected);
    if (!validation.ok) {
      return {
        status: "needs_ai",
        corrected: "",
        appliedRuleIds,
        message: validation.message,
      };
    }
    if (implausible) {
      return {
        status: "needs_ai",
        corrected: "",
        appliedRuleIds,
        message: AI_CORRECTION_REQUIRED_MESSAGE,
        semanticHint: implausible.clarificationHint,
      };
    }
    return { status: "corrected", corrected, appliedRuleIds };
  }

  if (isClearlyWrongForTutor(trimmed, language)) {
    return {
      status: "needs_ai",
      corrected: "",
      appliedRuleIds: [],
      message: AI_CORRECTION_REQUIRED_MESSAGE,
    };
  }

  // A grammatically clean sentence that is still implausible (e.g. "I bought a head.") also
  // abstains rather than silently accepting nonsense.
  if (implausible) {
    return {
      status: "needs_ai",
      corrected: "",
      appliedRuleIds: [],
      message: AI_CORRECTION_REQUIRED_MESSAGE,
      semanticHint: implausible.clarificationHint,
    };
  }

  return { status: "unchanged", corrected, appliedRuleIds: [] };
}
