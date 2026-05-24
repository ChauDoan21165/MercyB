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
  return normalizeWhitespace(value)
    .replace(/[.!?。！？]+$/u, "")
    .toLowerCase();
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
    if (normalizedForComparison(next) !== normalizedForComparison(corrected)) {
      corrected = next;
      appliedRuleIds.push(rule.id);
    }
  }

  corrected = ensureTerminalPunctuation(corrected, language);

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

  return { status: "unchanged", corrected, appliedRuleIds: [] };
}
