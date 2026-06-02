// src/features/review/content/ingestion/germanLessons.ts
//
// Adapt the German-for-Vietnamese lesson corpus → vi→de ReviewCandidates,
// READ-ONLY. PURE adaptation, ZERO generation (every front + back is authored).
//
// CRITICAL field-mapping landmine (verified against the live data + types):
//   LessonSentence = { en: <GERMAN sentence>, vi: <Vietnamese>, pronunciation_focus: [VI] }
//     → the field named `en` HOLDS GERMAN. front = vi, back = en.
//   VocabEntry     = { word: <GERMAN>, en: <English gloss>, vi: <Vietnamese>, pronunciation_vi }
//     → here `word` is German and `en` is English. front = vi, back = word.
// Mapping the wrong field would put Vietnamese or English on the back; the gate's
// vi-de script check + FRONT_EQUALS_BACK guard backstop a slip, but the mapping
// below is the primary correctness mechanism.

import type { CefrLevel, ReviewCandidate } from "../validate";
import { candidateId, clean } from "./candidate";

const FLOW = "vi-de" as const;
const SOURCE = "german/lessons";

const VALID_LEVELS = new Set<CefrLevel>(["A1", "A2", "B1", "B2", "C1", "C2"]);

/** Structural subset of GermanLesson we depend on (locally declared so tests
 *  inject fakes and we don't couple to the full GermanLesson type surface). */
export interface GermanLessonLike {
  level: string;
  sentences?: Array<{
    en: string; // holds the German sentence
    vi: string; // Vietnamese gloss
    pronunciation_focus?: string[];
  }>;
  vocabulary?: Array<{
    word: string; // German word
    en?: string; // English gloss (NOT used as back)
    vi: string; // Vietnamese gloss
    pronunciation_vi?: string;
  }>;
}

function asCefr(level: string): CefrLevel {
  const up = level.toUpperCase() as CefrLevel;
  // Unknown levels flow through unchanged so the gate flags INVALID_CEFR rather
  // than this adapter silently dropping/relabelling them.
  return VALID_LEVELS.has(up) ? up : (level as CefrLevel);
}

/**
 * Build vi→de candidates from German lessons. Deterministic; no IO beyond the
 * already-imported module arrays. Does not dedup (the gate batch does).
 */
export function buildGermanCandidates(
  lessons: readonly GermanLessonLike[],
): ReviewCandidate[] {
  const out: ReviewCandidate[] = [];

  for (const lesson of lessons) {
    const cefr = asCefr(lesson.level);

    for (const s of lesson.sentences ?? []) {
      const front = clean(s.vi); // Vietnamese
      const back = clean(s.en); // German (field named `en`)
      if (!front || !back) continue;
      const noteVi = clean((s.pronunciation_focus ?? []).join(" · "));
      out.push({
        id: candidateId(FLOW, "sentence", front),
        flow: FLOW,
        kind: "sentence",
        front,
        back,
        noteVi,
        cefr,
        provenance: "adapted",
        source: SOURCE,
      });
    }

    for (const v of lesson.vocabulary ?? []) {
      const front = clean(v.vi); // Vietnamese
      const back = clean(v.word); // German
      if (!front || !back) continue;
      out.push({
        id: candidateId(FLOW, "vocab", front),
        flow: FLOW,
        kind: "vocab",
        front,
        back,
        // German is Latin — no separate reading; the VI pronunciation hint
        // becomes an optional Vietnamese note, not a `pronunciation` reading.
        noteVi: clean(v.pronunciation_vi),
        cefr,
        provenance: "adapted",
        source: SOURCE,
      });
    }
  }

  return out;
}
