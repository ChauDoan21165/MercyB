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

// ─── STT Garble Detection ─────────────────────────────────────────────

/**
 * Exact abstain copy surfaced when the corrector detects a probable STT mishearing
 * but cannot identify the intended word with confidence.
 * Required verbatim by product spec — never alter this string.
 */
export const STT_ABSTAIN_MESSAGE =
  "Mình chưa chắc bạn định nói gì — bạn gõ lại nhé?";

export type SttGarbleSignal = {
  id: string;
  /** Detects the garble pattern in context. */
  detect: RegExp;
  /** Guards real uses that would otherwise fire the detect (false-positive guard). */
  plausibleException?: RegExp;
  /** When present: the word to find-and-replace in the corrected text. */
  garbleRe?: RegExp;
  /** When present: the intended replacement. Pair with garbleRe. */
  intended?: string;
  /** 3+ sentences that must fire. */
  positives: readonly string[];
  /** 2+ sentences that must NOT fire (despite surface similarity). */
  confusableNegatives: readonly string[];
  fpRiskNote: string;
};

type SttGarbleResult =
  | { type: "fix"; corrected: string; ruleId: string }
  | { type: "abstain" }
  | null;

export const STT_GARBLE_SIGNALS: readonly SttGarbleSignal[] = [
  {
    id: "stt-degree-sunday-to-sunny",
    // Degree adverb immediately before "sunday" — a proper noun can never be gradable.
    // Sunday/sunny are near-homophones; this is the most frequent STT confusion in this class.
    detect: /\b(?:very|so|really|quite|pretty|too|extremely)\s+sunday\b/i,
    garbleRe: /\bsunday\b/gi,
    intended: "sunny",
    positives: [
      "It's very Sunday in the summer.",
      "The weather is so Sunday today.",
      "It is really Sunday outside.",
    ],
    confusableNegatives: [
      "I love Sunday mornings.",
      "See you on Sunday.",
      "Every Sunday I go to church.",
    ],
    fpRiskNote:
      "Only fires when 'Sunday' immediately follows a degree adverb — a syntactic position where a proper noun is impossible. Sunday/sunny are near-homophones; Vietnamese learners speaking into STT frequently produce this pair. Standalone 'Sunday' mentions (prepositional, subject, object) never match because no degree adverb precedes them.",
  },
  {
    id: "stt-degree-weekday-no-known-fix",
    // Degree adverb before any other weekday — ungrammatical, but no single clear phonetic
    // analogue, so we abstain rather than guess. Plausible exception guards prepositional
    // weekday phrases ("on Monday", "last Friday", "every Tuesday").
    detect:
      /\b(?:very|so|really|quite|pretty|too|extremely)\s+(?:monday|tuesday|wednesday|thursday|friday|saturday)\b/i,
    plausibleException:
      /\b(?:every|last|this|next|on|by|each)\s+(?:monday|tuesday|wednesday|thursday|friday|saturday)\b/i,
    positives: [
      "It's very Monday outside.",
      "The office is so Friday.",
      "He feels really Thursday.",
    ],
    confusableNegatives: [
      "Every Monday I go to school.",
      "On Friday we have a meeting.",
      "Last Tuesday was busy.",
    ],
    fpRiskNote:
      "Degree adverb + any weekday as a predicate adjective is always ungrammatical (weekdays are proper nouns, not gradable). Without a clear phonetically-similar adjective counterpart (unlike Sunday/sunny), we abstain rather than guess. Plausible exception guards prepositional weekday phrases.",
  },
  {
    id: "stt-feel-week-to-weak",
    // "feel week" — "weak" and "week" are homophones; "feel weak" is the intended phrase.
    // The negative lookahead blocks "feel [determiner] week" where week is a temporal noun.
    detect: /\bfeel(?:s|ing)?\s+(?:so\s+)?week(?!\s*-|\s+(?:is|was|will|that|to|which|when|long)\b)\b/i,
    plausibleException: /\bfeel\s+(?:this|last|next|each|every|the)\s+week\b/i,
    positives: [
      "I feel week after the workout.",
      "She feels week today.",
      "He is feeling so week.",
    ],
    confusableNegatives: [
      "I feel good this week.",
      "She feels better every week.",
      "I feel weak.",
    ],
    fpRiskNote:
      "'Feel week' as a predicate (feel + noun) is never grammatical — 'week' cannot be a predicate adjective. 'Weak' and 'week' are homophones in most accents and a documented STT confusion pair. The negative lookahead and plausibleException block temporal uses ('feel this week', 'feel that the week...', 'feel week-long fatigue').",
  },
  {
    id: "stt-dishes-this-is",
    // "dishes" /dɪʃɪz/ and "this is" /ðɪs ɪz/ are near-homophones for STT engines.
    // When a possessive/definite/demonstrative determiner (the/my/your/his/her/our/their/
    // these/those) immediately precedes "this is", the construction is syntactically
    // impossible — determiners must govern nouns, never a demonstrative + copula clause.
    // Logged case: learner said "dishes", STT returned "this is" in "a lot of this is
    // because"; the determiner-gated signal covers the most reliable subset.
    detect: /\b(?:the|my|your|his|her|our|their|these|those)\s+this\s+is\b/i,
    garbleRe: /\bthis\s+is\b/gi,
    intended: "dishes",
    positives: [
      "I need to wash the this is after dinner.",
      "Can you do the this is please?",
      "She cleaned my this is yesterday.",
    ],
    confusableNegatives: [
      "I think this is correct.",
      "This is a good idea.",
      "A lot of this is because of him.",
    ],
    fpRiskNote:
      "Only fires when a possessive or definite/demonstrative determiner (the/my/your/his/her/our/their/these/those) immediately precedes 'this is' — a syntactically impossible construction (determiners must govern nouns, not demonstrative + copula clauses). 'dishes' /dɪʃɪz/ and 'this is' /ðɪs ɪz/ are near-homophones in STT. Standalone 'this is', clausal 'this is because', and pronoun uses such as 'a lot of this is' (where 'this' is a valid pronoun complement of 'of') are all excluded by the determiner-adjacency requirement.",
  },
];

/** Returns the first matching STT garble action for an English sentence, else null. */
export function findAndFixSttGarble(sentence: string): SttGarbleResult {
  const normalized = normalizeWhitespace(sentence);
  if (!normalized) return null;
  for (const signal of STT_GARBLE_SIGNALS) {
    if (signal.plausibleException?.test(normalized)) continue;
    if (!signal.detect.test(normalized)) continue;
    if (signal.garbleRe && signal.intended !== undefined) {
      const fixed = normalized.replace(signal.garbleRe, signal.intended);
      if (fixed !== normalized) {
        return { type: "fix", corrected: fixed, ruleId: signal.id };
      }
    }
    return { type: "abstain" };
  }
  return null;
}

// ─── Run-on Detection and Segmentation ───────────────────────────────────────

/**
 * English connectives that indicate a multi-clause (run-on) sentence when several appear
 * together. The pattern is intentionally broad — false positives are cheap (we segment a
 * slightly over-eager sentence), false negatives are expensive (run-on stays unhandled).
 */
const RUN_ON_SIGNAL_RE =
  /\b(?:and|but|so|because|or|yet|then|after|before|when|while|since|unless|although|though|however|moreover|furthermore|therefore|thus|hence|meanwhile|otherwise|besides|also|additionally|consequently|nevertheless|nonetheless)\b/gi;

/**
 * Returns true when the English input is likely a run-on or multi-clause sentence.
 * Heuristic: word count ≥ 12 AND (≥ 2 connective conjunctions OR ≥ 2 commas).
 * English-only; never fires on short inputs.
 */
export function detectRunOn(text: string): boolean {
  const normalized = normalizeWhitespace(text);
  if (!normalized) return false;
  const words = normalized.split(/\s+/).length;
  if (words < 12) return false;
  const conjunctions = (normalized.match(RUN_ON_SIGNAL_RE) || []).length;
  const commas = (normalized.match(/,/g) || []).length;
  return conjunctions >= 2 || commas >= 2;
}

/**
 * Splits a run-on sentence into individual clauses.
 *
 * Priority: existing sentence boundaries → comma + conjunction → all commas →
 * bare coordinating conjunction. Each returned segment has leading conjunctions
 * stripped and is trimmed. Returns null when no split with ≥ 2 valid clauses
 * (each ≥ 3 words) can be found — callers treat null as a segmentation failure.
 */
export function segmentRunOn(text: string): string[] | null {
  const normalized = normalizeWhitespace(text);
  if (!normalized) return null;

  const MIN_CLAUSE_WORDS = 3;
  const enoughWords = (s: string) => s.trim().split(/\s+/).length >= MIN_CLAUSE_WORDS;

  // Strip a leading coordinating conjunction that became the first word after splitting.
  const stripLeadingConj = (s: string) =>
    s.replace(/^(?:and|but|so|or|yet|nor|then)\s+/i, "").trim();

  const clean = (parts: string[]): string[] =>
    parts.map(stripLeadingConj).filter(enoughWords);

  // 1. Already has internal sentence boundaries — split there.
  const bySentence = normalized.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
  if (bySentence.length > 1) return bySentence;

  // 2. Comma + coordinating conjunction: "A, and B" / "A, but C".
  const byCommaConj = clean(normalized.split(/,\s*(?=(?:and|but|so|or|yet|nor)\s+)/i));
  if (byCommaConj.length > 1) return byCommaConj;

  // 3. All commas — each part must be a full clause (≥ MIN_CLAUSE_WORDS words).
  const byComma = clean(normalized.split(/,\s+/));
  if (byComma.length > 1) return byComma;

  // 4. Bare coordinating conjunction between clauses: "A and B and C".
  const byConj = clean(normalized.split(/\s+(?:and|but|so)\s+/i));
  if (byConj.length > 1) return byConj;

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

/**
 * Detects article-initiated fragments: sentences that start with "a" or "an" but have no finite
 * verb in the first clause (before any coordinating conjunction). These are almost always learner
 * fragments rather than complete sentences.
 *
 * Precision gate: only triggers on article initiators — the highest-confidence signal that the
 * learner started a noun phrase instead of a sentence. False-positive risk with "an" + verb (e.g.
 * "An unexpected thing happened") is guarded by the finite-verb check.
 *
 * Positives: "a good mother yesterday and invited her", "a beautiful day and no school",
 *   "a student in my class and very smart", "an old man yesterday and helped me"
 * Confusable negatives (must NOT fire): "an unexpected visitor arrived",
 *   "a dog barked", "an eagle flies high"
 */
function looksLikeArticleInitiatedFragment(input: string): boolean {
  const normalized = input.replace(/\s+/g, " ").trim();
  // Must start with bare indefinite article (article-initiated noun phrase).
  // "The ..." is less reliable (questions, demonstratives) — only "a/an".
  if (!/^(?:a|an)\s/i.test(normalized)) return false;
  // The Vietlish pattern is "article NP + conjunction + predicate-without-subject".
  // Simple noun phrases without a conjunction (e.g. "a documentary about whales") are
  // not the pattern — they must not be routed to AI.
  if (!/\s+(?:and|or|but|so|yet)\s+/i.test(normalized)) return false;
  // Take the first clause (before coordinating conjunction).
  const firstClause = normalized.split(/\s+(?:and|or|but|so|yet)\s+/i)[0];
  // If a finite verb appears in the first clause it is NOT a fragment.
  const finiteVerbPattern =
    /\b(?:is|are|was|were|am|will|would|can|could|shall|should|may|might|do|does|did|have|has|had|be|been|go|goes|went|come|comes|came|want|wants|wanted|need|needs|needed|like|likes|liked|love|loves|loved|work|works|worked|speak|speaks|spoke|study|studies|studied|help|helps|helped|arrive|arrives|arrived|happen|happens|happened|become|becomes|became|look|looks|looked|seem|seems|seemed|feel|feels|felt|get|gets|got|make|makes|made|take|takes|took|give|gives|gave|know|knows|knew|see|sees|saw|think|thinks|thought|say|says|said|tell|tells|told|run|runs|ran|eat|eats|ate|drink|drinks|drank|walk|walks|walked|start|starts|started|stop|stops|stopped|try|tries|tried|ask|asks|asked|find|finds|found|show|shows|showed|move|moves|moved|live|lives|lived|play|plays|played|buy|buys|bought|sell|sells|sold|bring|brings|brought|put|puts|leave|leaves|left|sit|sits|sat|stand|stands|stood|win|wins|won|lose|loses|lost|send|sends|sent|read|reads|write|writes|wrote|open|opens|opened|close|closes|closed|call|calls|called|wait|waits|waited|turn|turns|turned|stay|stays|stayed|follow|follows|followed|pass|passes|passed|carry|carries|carried|keep|keeps|kept|hold|holds|held|cut|cuts|continue|continues|continued|drive|drives|drove)\b/i;
  if (finiteVerbPattern.test(firstClause)) return false;
  return true;
}

/**
 * Corrects a single, non-run-on clause through the full rule pipeline.
 * Receives a whitespace-normalised, non-empty string.
 * Internal — call `correctWithTutorRules` from outside this module.
 */
function _correctClause(trimmed: string, language: TutorCorrectionLanguage): CorrectionEngineResult {
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
  // STT-garble guard: detect probable speech-to-text mishearings (e.g. Sunday→sunny) on the
  // grammar-corrected text. A fix replaces the garble; an abstain routes to the AI engine.
  const sttGarble = language === "en" ? findAndFixSttGarble(corrected) : null;

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
    if (sttGarble) {
      if (sttGarble.type === "fix") {
        return {
          status: "corrected",
          corrected: sttGarble.corrected,
          appliedRuleIds: [...appliedRuleIds, sttGarble.ruleId],
        };
      }
      return {
        status: "needs_ai",
        corrected: "",
        appliedRuleIds,
        message: STT_ABSTAIN_MESSAGE,
        semanticHint: STT_ABSTAIN_MESSAGE,
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

  // STT garble on a grammar-clean sentence: fix it directly or route to AI.
  if (sttGarble) {
    if (sttGarble.type === "fix") {
      return {
        status: "corrected",
        corrected: sttGarble.corrected,
        appliedRuleIds: [sttGarble.ruleId],
      };
    }
    return {
      status: "needs_ai",
      corrected: "",
      appliedRuleIds: [],
      message: STT_ABSTAIN_MESSAGE,
      semanticHint: STT_ABSTAIN_MESSAGE,
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

  // Q1 trust floor: article-initiated fragments (no finite verb in the first clause) must never
  // silently pass as "correct". Route to AI so the learner gets an honest correction or a request
  // to rephrase — never a false-positive "câu của bạn đã rõ".
  // Scope: only fires when no rule applied (appliedRuleIds is empty at this point) and no finite
  // verb precedes the first coordinating conjunction (or end of clause). High-precision: article
  // initiators ("a", "an") are rarely valid sentence starters in English.
  if (language === "en" && looksLikeArticleInitiatedFragment(trimmed)) {
    return {
      status: "needs_ai",
      corrected: "",
      appliedRuleIds: [],
      message: AI_CORRECTION_REQUIRED_MESSAGE,
    };
  }

  return { status: "unchanged", corrected, appliedRuleIds: [] };
}

export function correctWithTutorRules(
  input: string,
  language: TutorCorrectionLanguage = "en",
): CorrectionEngineResult {
  const trimmed = normalizeWhitespace(input);
  if (!trimmed) {
    return { status: "unchanged", corrected: "", appliedRuleIds: [] };
  }

  // Run the full single-clause pipeline first. Specific rules (e.g. the morning-routine
  // carryover rule, the dinner-invite run-on rule) must take priority over the generic
  // run-on segmenter — they already produce the correct assembled output.
  const clauseResult = _correctClause(trimmed, language);

  // Generic run-on segmentation: only when no specific rule fired (status "unchanged"),
  // the language is English, and the input looks like a multi-clause sentence.
  // Per spec: abstain only when segmentation itself fails (segmentRunOn returns null).
  if (clauseResult.status !== "unchanged" || language !== "en" || !detectRunOn(trimmed)) {
    return clauseResult;
  }

  const segments = segmentRunOn(trimmed);
  if (!segments) {
    // Segmentation failed — route to AI engine.
    return {
      status: "needs_ai",
      corrected: "",
      appliedRuleIds: [],
      message: AI_CORRECTION_REQUIRED_MESSAGE,
    };
  }

  const correctedParts: string[] = [];
  const allRuleIds: string[] = ["runon-segmented"];
  for (const seg of segments) {
    const segTrimmed = normalizeWhitespace(seg);
    const result = _correctClause(segTrimmed, language);
    if (result.status === "corrected") {
      correctedParts.push(result.corrected);
      allRuleIds.push(...result.appliedRuleIds);
    } else {
      // unchanged or needs_ai: add terminal punctuation and capitalise, but keep text.
      correctedParts.push(ensureTerminalPunctuation(capitalizeFirst(segTrimmed), language));
    }
  }
  const assembled = correctedParts.join(" ");
  // If reassembling the segments produces the same text as the original (e.g. the input
  // already had proper sentence boundaries), no real change occurred — return "unchanged".
  if (normalizeWhitespace(assembled) === trimmed) {
    return { status: "unchanged", corrected: assembled, appliedRuleIds: [] };
  }
  return { status: "corrected", corrected: assembled, appliedRuleIds: allRuleIds };
}
