// src/lib/writing-feedback/rubric.ts
//
// Types for the rule-based essay scoring rubric. All five dimensions
// score on a 0–5 integer scale; no fractional scores so the bar UI can
// render as five discrete pips.
//
// Why 0–5 (not 0–100): users have to read this on mobile in Vietnamese.
// Five named buckets ("kém / yếu / trung bình / khá / tốt / xuất sắc")
// is a dimension a learner can act on. A 73/100 isn't.
//
// LLM-based rubric (out of scope here, daytime work) will produce a
// richer payload but should preserve this same shape so the UI doesn't
// fork.

import type { L1WeaknessTag } from "@/lib/feedback/l1-error-detector";

/** Integer score 0–5. 0 = absent, 5 = strong. */
export type DimensionScore = 0 | 1 | 2 | 3 | 4 | 5;

/** CEFR level estimate. Heuristic. UI must show "estimate" not "verdict." */
export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type GrammarDimension = {
  score: DimensionScore;
  /** L1-tagged issues found in the essay, deduped, in order of appearance. */
  issues: L1WeaknessTag[];
};

export type VocabularyDimension = {
  score: DimensionScore;
  level_estimate: CefrLevel;
  /** Short Vietnamese-leaning notes on lexical choices. */
  notes: string[];
};

export type StructureDimension = {
  score: DimensionScore;
  has_intro: boolean;
  has_conclusion: boolean;
  paragraph_count: number;
};

export type SpellingPunctuationDimension = {
  score: DimensionScore;
  /** Lower-cased misspelt tokens (best-effort, not exhaustive). */
  errors: string[];
};

export type CoherenceDimension = {
  score: DimensionScore;
  /** Brief Vietnamese-leaning notes on flow/transitions/pronouns. */
  notes: string[];
};

export type WritingRubric = {
  grammar: GrammarDimension;
  vocabulary: VocabularyDimension;
  structure: StructureDimension;
  spelling_punctuation: SpellingPunctuationDimension;
  coherence: CoherenceDimension;
};

// ── Score helpers ─────────────────────────────────────────────────────────

/** Clamp + integer-coerce a score. */
export function toDimensionScore(n: number): DimensionScore {
  if (!Number.isFinite(n)) return 0;
  const r = Math.max(0, Math.min(5, Math.round(n)));
  return r as DimensionScore;
}

/** Average of all five dimensions, rounded to one decimal (display only). */
export function overallScore(rubric: WritingRubric): number {
  const sum =
    rubric.grammar.score +
    rubric.vocabulary.score +
    rubric.structure.score +
    rubric.spelling_punctuation.score +
    rubric.coherence.score;
  return Math.round((sum / 5) * 10) / 10;
}

/** Empty rubric for the no-input / very-short paths. */
export function emptyRubric(): WritingRubric {
  return {
    grammar: { score: 0, issues: [] },
    vocabulary: { score: 0, level_estimate: "A1", notes: [] },
    structure: { score: 0, has_intro: false, has_conclusion: false, paragraph_count: 0 },
    spelling_punctuation: { score: 0, errors: [] },
    coherence: { score: 0, notes: [] },
  };
}
