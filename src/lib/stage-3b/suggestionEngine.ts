/**
 * Stage 3B — Suggestion engine (brick 1, no UI).
 *
 * Pure function that decides:
 *   - WHEN a suggestion fires.
 *   - WHAT it says (bilingual, em-pronoun thesis on the VI side).
 *
 * Per ROADMAP §3B:
 *
 *   "A suggestion appears ONLY when there is fresh local evidence
 *    AND a useful next action. Soft suggestions only,
 *    context-triggered + learner-controllable."
 *
 * Hard invariants (guarded by tests in `__tests__/suggestionEngine.test.ts`):
 *
 *   - Pure decision core: `decideSuggestion(event, weaknesses, gate)`
 *     takes the gate state as an INPUT so the engine itself can be
 *     unit-tested without touching localStorage. The convenience
 *     wrapper `getSuggestion(event, weaknesses)` reads gate state
 *     from `suggestionState.ts` for real callers.
 *   - Returns `null` unless BOTH:
 *       (a) fresh evidence — the caller passes a current activity
 *           event AND the aggregator's `LocalWeaknessMap` is non-empty.
 *       (b) useful next action — the picked weakness has a known
 *           taxonomy entry (not the catch-all FALLBACK) AND clears
 *           a "repeated or high-confidence" threshold.
 *   - No server write, no Supabase read, no `mercy_user_facts`,
 *     no placement writeback. Reads only `LocalWeaknessMap` +
 *     localStorage (via `suggestionState.ts`).
 *   - Every emitted suggestion has `dismissible: true`. Literal true,
 *     not a variable. ROADMAP §3B: "dismissible every time."
 *   - Suggestion text must not contain streak / XP / shame / daily-
 *     requirement language. Forbidden-words list enforced by tests.
 */

import type { L1WeaknessTag } from "../feedback/l1-error-detector";
import {
  describeL1Tag,
  describePhonemeAxis,
  describePlacementWeakness,
  L1_DESCRIPTIONS,
  PHONEME_DESCRIPTIONS,
  PLACEMENT_DESCRIPTIONS,
  type LearnerLanguage,
} from "../stage-3a/taxonomy";
import type {
  LocalWeaknessMap,
  L1PatternSummary,
  PlacementWeaknessSummary,
  PronunciationPainPointSummary,
} from "../stage-3a/aggregator";
import {
  getDismissedSuggestionIds,
  isSuggestionsDisabled,
} from "./suggestionState";

// ── Public types ──────────────────────────────────────────────────────

export type ActivityEvent =
  | { kind: "lesson_completed"; ts: number }
  | { kind: "tutor_turn_completed"; ts: number }
  | { kind: "placement_step_completed"; ts: number }
  | {
      kind: "pronunciation_exercise_completed";
      ts: number;
      /** Optional axis the learner just practiced (e.g. "TH_T"). */
      axis?: string;
    };

export type TriggerReason =
  | { kind: "repeated_l1_pattern"; tag: string; count: number }
  | { kind: "high_severity_placement"; tag: string }
  | { kind: "high_error_phoneme"; axis: string; errorRate: number };

export type TargetAction =
  | { kind: "review_l1_pattern"; tag: string }
  | { kind: "review_phoneme_axis"; axis: string }
  | { kind: "review_placement_weakness"; tag: string };

export interface Suggestion {
  /** Stable, deterministic id — same evidence → same id, so the
   *  dismissed set survives repeated triggers. */
  id: string;
  triggerReason: TriggerReason;
  suggestionText: { vi: string; en: string };
  targetAction: TargetAction;
  /** Literal `true`. Per ROADMAP §3B: every suggestion is dismissible. */
  dismissible: true;
}

export interface GateState {
  disabled: boolean;
  dismissedIds: Set<string>;
}

// ── Thresholds ────────────────────────────────────────────────────────

/** "Repeated" per ROADMAP §3B — an L1 pattern that's fired twice or more. */
const L1_REPEATED_MIN = 2;

/** "High-confidence" pronunciation error — error rate ≥ 40% on ≥ 3 samples.
 *  Matches the aggregator's own PRONUNCIATION_MIN_SAMPLES (3). */
const PHONEME_HIGH_ERROR_MIN = 0.4;

// ── Pure decision core ────────────────────────────────────────────────

export function decideSuggestion(
  event: ActivityEvent,
  weaknesses: LocalWeaknessMap,
  gate: GateState,
): Suggestion | null {
  if (gate.disabled) return null;
  if (weaknesses.isEmpty) return null;

  const picked = chooseTopWeakness(event, weaknesses);
  if (!picked) return null;

  const id = makeSuggestionId(picked);
  if (gate.dismissedIds.has(id)) return null;

  return buildSuggestion(id, picked);
}

/**
 * Convenience wrapper. Reads gate state from localStorage via
 * `suggestionState.ts` then delegates to `decideSuggestion`. Use this
 * in real callers; use `decideSuggestion` directly in tests.
 */
export function getSuggestion(
  event: ActivityEvent,
  weaknesses: LocalWeaknessMap,
): Suggestion | null {
  return decideSuggestion(event, weaknesses, {
    disabled: isSuggestionsDisabled(),
    dismissedIds: getDismissedSuggestionIds(),
  });
}

// ── Selection ─────────────────────────────────────────────────────────

type PickedWeakness =
  | {
      kind: "l1";
      tag: string;
      count: number;
      lang: LearnerLanguage;
    }
  | {
      kind: "placement";
      tag: string;
      severity: PlacementWeaknessSummary["severity"];
      lang: LearnerLanguage;
    }
  | {
      kind: "phoneme";
      axis: string;
      errorRate: number;
      samples: number;
      lang: LearnerLanguage;
    };

function chooseTopWeakness(
  event: ActivityEvent,
  weaknesses: LocalWeaknessMap,
): PickedWeakness | null {
  // Bias the first probe to the just-completed activity domain. If
  // that probe doesn't clear the threshold or doesn't have a known
  // taxonomy entry, fall through to the next-best domain.
  const probes = orderedProbes(event);
  for (const probe of probes) {
    const candidate = probe(weaknesses);
    if (candidate) return candidate;
  }
  return null;
}

function orderedProbes(
  event: ActivityEvent,
): Array<(w: LocalWeaknessMap) => PickedWeakness | null> {
  switch (event.kind) {
    case "pronunciation_exercise_completed":
      return [pickPhoneme, pickL1, pickPlacement];
    case "placement_step_completed":
      return [pickPlacement, pickL1, pickPhoneme];
    case "lesson_completed":
    case "tutor_turn_completed":
    default:
      return [pickL1, pickPlacement, pickPhoneme];
  }
}

function pickL1(weaknesses: LocalWeaknessMap): PickedWeakness | null {
  for (const entry of weaknesses.topL1Patterns) {
    if (!isRepeatedL1(entry)) continue;
    if (!hasKnownL1Entry(entry.tag)) continue;
    return {
      kind: "l1",
      tag: entry.tag,
      count: entry.count,
      lang: describeL1Tag(entry.tag),
    };
  }
  return null;
}

function pickPlacement(
  weaknesses: LocalWeaknessMap,
): PickedWeakness | null {
  for (const entry of weaknesses.placementWeaknesses) {
    if (!hasKnownPlacementEntry(entry.tag)) continue;
    return {
      kind: "placement",
      tag: entry.tag,
      severity: entry.severity,
      lang: describePlacementWeakness(entry.tag),
    };
  }
  return null;
}

function pickPhoneme(
  weaknesses: LocalWeaknessMap,
): PickedWeakness | null {
  for (const entry of weaknesses.topPronunciationPainPoints) {
    if (!isHighErrorPhoneme(entry)) continue;
    if (!hasKnownPhonemeEntry(entry.axis)) continue;
    return {
      kind: "phoneme",
      axis: entry.axis,
      errorRate: entry.errorRate,
      samples: entry.samples,
      lang: describePhonemeAxis(entry.axis),
    };
  }
  return null;
}

function isRepeatedL1(entry: L1PatternSummary): boolean {
  return entry.count >= L1_REPEATED_MIN;
}

function isHighErrorPhoneme(entry: PronunciationPainPointSummary): boolean {
  return entry.errorRate >= PHONEME_HIGH_ERROR_MIN;
}

// ── Useful-action gate ────────────────────────────────────────────────
//
// A weakness is only a "useful next action" if it maps to a known
// taxonomy entry — i.e. we have bilingual learner-language copy for
// it. Unknown tags fall back to a generic "still working on this"
// blurb that doesn't tell the learner anything actionable; the
// engine declines rather than emit kind-but-empty copy.

function hasKnownL1Entry(tag: string): boolean {
  return Object.prototype.hasOwnProperty.call(
    L1_DESCRIPTIONS as Record<string, LearnerLanguage>,
    tag,
  );
}

function hasKnownPhonemeEntry(axis: string): boolean {
  return Object.prototype.hasOwnProperty.call(
    PHONEME_DESCRIPTIONS as Record<string, LearnerLanguage>,
    axis.toUpperCase(),
  );
}

function hasKnownPlacementEntry(tag: string): boolean {
  if (tag.startsWith("vi_l1_")) return hasKnownL1Entry(tag);
  return Object.prototype.hasOwnProperty.call(
    PLACEMENT_DESCRIPTIONS as Record<string, LearnerLanguage>,
    tag,
  );
}

// ── Suggestion construction ───────────────────────────────────────────

function makeSuggestionId(picked: PickedWeakness): string {
  switch (picked.kind) {
    case "l1":
      return `stage3b:l1:${picked.tag}`;
    case "placement":
      return `stage3b:placement:${picked.tag}`;
    case "phoneme":
      return `stage3b:phoneme:${picked.axis.toUpperCase()}`;
  }
}

function buildSuggestion(id: string, picked: PickedWeakness): Suggestion {
  const triggerReason = buildTriggerReason(picked);
  const targetAction = buildTargetAction(picked);
  const suggestionText = buildSuggestionText(picked);
  return {
    id,
    triggerReason,
    suggestionText,
    targetAction,
    dismissible: true,
  };
}

function buildTriggerReason(picked: PickedWeakness): TriggerReason {
  switch (picked.kind) {
    case "l1":
      return {
        kind: "repeated_l1_pattern",
        tag: picked.tag,
        count: picked.count,
      };
    case "placement":
      return { kind: "high_severity_placement", tag: picked.tag };
    case "phoneme":
      return {
        kind: "high_error_phoneme",
        axis: picked.axis.toUpperCase(),
        errorRate: picked.errorRate,
      };
  }
}

function buildTargetAction(picked: PickedWeakness): TargetAction {
  switch (picked.kind) {
    case "l1":
      return { kind: "review_l1_pattern", tag: picked.tag };
    case "placement":
      return { kind: "review_placement_weakness", tag: picked.tag };
    case "phoneme":
      return {
        kind: "review_phoneme_axis",
        axis: picked.axis.toUpperCase(),
      };
  }
}

/**
 * Bilingual suggestion copy. VI uses the "em" pronoun (intimate
 * 2nd-person) per the em-pronoun thesis. EN uses neutral "you".
 *
 * Tone: kind suggestion, never command. No streak / XP / shame /
 * daily-requirement language — the `suggestionEngine.test.ts`
 * forbidden-words guardrail asserts every output passes the filter.
 */
function buildSuggestionText(picked: PickedWeakness): {
  vi: string;
  en: string;
} {
  const { lang } = picked;
  switch (picked.kind) {
    case "l1":
      return {
        vi: `Mercy thấy em vẫn đang luyện "${lang.shortVi}". Thử thêm một chút nhé?`,
        en: `Mercy noticed you're still working on "${lang.shortEn}". Want to try a bit more?`,
      };
    case "placement":
      return {
        vi: `"${lang.shortVi}" là điểm em có thể luyện thêm. Thử một lượt nhanh nhé?`,
        en: `"${lang.shortEn}" is something you can work on. Try a quick round?`,
      };
    case "phoneme":
      return {
        vi: `Có muốn luyện thêm "${lang.shortVi}" không em?`,
        en: `Want to practice "${lang.shortEn}" a bit more?`,
      };
  }
}

// ── Test helpers (exported for the test suite only) ───────────────────

/**
 * Phrases this engine must never emit. Tests assert every suggestion
 * produced across the full L1 / placement / phoneme taxonomy passes
 * this filter.
 *
 * Each phrase targets a *product-copy* anti-pattern (streak / XP /
 * pushy / shame / loss-aversion language) — not a bare linguistic
 * word. The taxonomy describes grammar patterns using words like
 * "must" (modal verb) and "every day" (habit example sentence);
 * those are legitimate linguistic content. The phrases below are
 * specific learning-app anti-patterns ("you must", "every day"
 * never appears as standalone usage-requirement phrasing — the
 * engine's own templates control that surface).
 *
 * The test layer normalises both the output and these phrases to
 * lowercase before comparing.
 */
export const FORBIDDEN_PHRASES = [
  // streak / daily-chain language
  "streak",
  "chuỗi ngày",
  "ngày liên tiếp",
  // XP / point-score language
  "điểm kinh nghiệm",
  "điểm số",
  // pushy / required-daily / loss-of-momentum language
  "you must",
  "you have to",
  "bạn phải",
  "em phải",
  "don't miss",
  "đừng bỏ lỡ",
  // shame / labeling-the-learner language
  "you're weak",
  "you are weak",
  "em yếu",
  "em kém",
  "you failed",
  "thất bại",
] as const;

/** XP / point matches need a word boundary check — "xp" as a
 *  substring would false-positive on "expression", "experience", etc.
 *  Test layer applies this regex in addition to the substring list. */
export const FORBIDDEN_REGEXES = [
  /\bxp\b/i,
] as const;

/** Re-export for tests so they can construct minimal `LocalWeaknessMap`
 *  fixtures without re-reading types from a deep relative path. */
export type { L1WeaknessTag };
