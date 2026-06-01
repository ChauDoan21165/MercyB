// src/features/review/content/ingestion/chineseLessons.ts
//
// Adapt the Chinese-for-Vietnamese lesson corpus → vi→zh ReviewCandidates,
// READ-ONLY. ADAPTATION ONLY: map only rows that ALREADY carry a Vietnamese
// gloss (`vi`). The ~half of rows lacking `vi` are the generation gap and are
// OUT OF SCOPE for this adapter — they are skipped, never invented here.
//
// Field mapping (verified against ChineseSentence / ChineseVocabEntry):
//   { chinese, pinyin, english, vi? }
//     front = vi  (Vietnamese)
//     back  = chinese  (hanzi — the target script the vi-zh gate requires)
//     pronunciation = pinyin  (tone-marked in the source → passes PINYIN_NO_TONE)
// Mapping the wrong field would put the wrong script on the back; the gate's
// vi-zh hanzi check + FRONT_NOT_VIETNAMESE guard backstop a slip, but the
// mapping below is the primary correctness mechanism.

import type { CefrLevel, ReviewCandidate } from "../validate";
import { candidateId, clean } from "./candidate";

const FLOW = "vi-zh" as const;
const SOURCE = "chinese/lessons";

const VALID_LEVELS = new Set<CefrLevel>(["A1", "A2", "B1", "B2", "C1", "C2"]);

/** Structural subset of ChineseLesson we depend on (locally declared so tests
 *  inject fakes and we don't couple to the full ChineseLesson type surface). */
export interface ChineseLessonLike {
  level: string;
  sentences?: Array<{
    chinese: string; // hanzi (the target / back)
    pinyin: string; // tone-marked reading
    english?: string; // English gloss (NOT used)
    vi?: string; // Vietnamese gloss (the front; ABSENT on the generation gap)
  }>;
  vocabulary?: Array<{
    chinese: string;
    pinyin: string;
    english?: string;
    vi?: string;
  }>;
}

function asCefr(level: string): CefrLevel {
  const up = level.toUpperCase() as CefrLevel;
  // Unknown levels flow through unchanged so the gate flags INVALID_CEFR rather
  // than this adapter silently dropping/relabelling them.
  return VALID_LEVELS.has(up) ? up : (level as CefrLevel);
}

/**
 * Build vi→zh candidates from Chinese lessons. Deterministic; no IO beyond the
 * already-imported module arrays. Maps ONLY rows where `vi` is present + the
 * hanzi + pinyin are present (adaptation slice). Does not dedup (the gate batch
 * does). Rows without a Vietnamese gloss are the generation gap → skipped.
 */
export function buildChineseCandidates(
  lessons: readonly ChineseLessonLike[],
): ReviewCandidate[] {
  const out: ReviewCandidate[] = [];

  for (const lesson of lessons) {
    const cefr = asCefr(lesson.level);

    for (const s of lesson.sentences ?? []) {
      const front = clean(s.vi); // Vietnamese — absent on the generation gap
      const back = clean(s.chinese); // hanzi
      const pronunciation = clean(s.pinyin); // tone-marked reading
      // Adaptation-only: skip rows missing the VI gloss, hanzi, or pinyin.
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

    for (const v of lesson.vocabulary ?? []) {
      const front = clean(v.vi); // Vietnamese
      const back = clean(v.chinese); // hanzi
      const pronunciation = clean(v.pinyin); // tone-marked reading
      if (!front || !back || !pronunciation) continue;
      out.push({
        id: candidateId(FLOW, "vocab", front),
        flow: FLOW,
        kind: "vocab",
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
