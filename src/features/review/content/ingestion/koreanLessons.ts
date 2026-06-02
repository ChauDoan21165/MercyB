// src/features/review/content/ingestion/koreanLessons.ts
//
// Adapt the Korean-for-Vietnamese lesson corpus → vi→ko ReviewCandidates,
// READ-ONLY. PURE adaptation, ZERO generation (every front + back + reading is
// authored). Sentences only — see the vocab note below.
//
// Field mapping (verified against KoreanSentence + the live data):
//   KoreanSentence = { korean: <HANGUL>, romanized: <romaja>, en, vi: <Vietnamese> }
//     → front = vi (Vietnamese prompt)
//       back  = korean (hangul answer)
//       pronunciation = romanized (romaja reading; vi-ko REQUIRES a reading)
//   Only rows where korean AND romanized AND vi are all present + non-empty are
//   emitted. Incomplete rows are skipped (we adapt, never generate the gap).
//
// VOCAB is deliberately NOT emitted: KoreanVocabEntry is { hangul, meaning } with
// NO romaja field. vi-ko's gate requires a non-empty reading (MISSING_READING),
// so every vocab candidate would quarantine. Generating the missing romaja is
// out of scope for this pure-adaptation adapter — so vocab is left out entirely.

import type { CefrLevel, ReviewCandidate } from "../validate";
import { candidateId, clean } from "./candidate";

const FLOW = "vi-ko" as const;
const SOURCE = "korean/lessons";

const VALID_LEVELS = new Set<CefrLevel>(["A1", "A2", "B1", "B2", "C1", "C2"]);

/** Structural subset of KoreanLesson we depend on (locally declared so tests
 *  inject fakes and we don't couple to the full KoreanLesson type surface). */
export interface KoreanLessonLike {
  level: string;
  sentences?: Array<{
    korean: string; // hangul (the answer)
    romanized: string; // romaja reading
    en?: string; // English gloss (NOT used)
    vi: string; // Vietnamese gloss (the prompt)
  }>;
}

function asCefr(level: string): CefrLevel {
  const up = level.toUpperCase() as CefrLevel;
  // Unknown levels flow through unchanged so the gate flags INVALID_CEFR rather
  // than this adapter silently dropping/relabelling them.
  return VALID_LEVELS.has(up) ? up : (level as CefrLevel);
}

/**
 * Build vi→ko candidates from Korean lessons. Deterministic; no IO beyond the
 * already-imported module arrays. Sentences only (vocab has no romaja — see top
 * note). Does not dedup (the gate batch does).
 */
export function buildKoreanCandidates(
  lessons: readonly KoreanLessonLike[],
): ReviewCandidate[] {
  const out: ReviewCandidate[] = [];

  for (const lesson of lessons) {
    const cefr = asCefr(lesson.level);

    for (const s of lesson.sentences ?? []) {
      const front = clean(s.vi); // Vietnamese
      const back = clean(s.korean); // hangul
      const pronunciation = clean(s.romanized); // romaja reading
      // vi-ko requires hangul back AND a reading; skip any row missing one.
      if (!front || !back || !pronunciation) continue;
      out.push({
        id: candidateId(FLOW, "sentence", front),
        flow: FLOW,
        kind: "sentence",
        front,
        back,
        pronunciation,
        cefr,
        provenance: "adapted",
        source: SOURCE,
      });
    }
  }

  return out;
}
