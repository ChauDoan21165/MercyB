// src/features/review/content/sources/spanishLessons.ts
//
// Source for the `en-es` flow (front = English, back = Spanish), derived
// READ-ONLY from the Spanish-for-English-speakers lesson corpus.
//
// Why the static per-level imports and not the lessons.ts registry:
// src/languages/spanish/lessons.ts ships lazy []-returning stubs — the runtime
// page resolves lessons from Supabase via fetchLessonsBatch. The ACTUAL authored
// content lives in the lessons-{level}.ts files. Importing those module arrays is
// a pure, synchronous, read-only data read — exactly what this adapter needs and
// the only in-bundle source of truth. We do not touch the registry or Supabase.
//
// Mapping (en-es: English prompt → Spanish answer):
//   vocabulary[]  → vocab items   (front = english, back = word, pron = pronunciation)
//   sentences[]   → sentence items(front = english, back = spanish, pron = pronunciation,
//                                  example = the Spanish sentence itself, noteVi = note*)
//   * `note` in the source is English author guidance, NOT Vietnamese — so we map it
//     to `example` context rather than noteVi. noteVi stays absent (honest: source has
//     no Vietnamese gloss for the en-es flow). See README "noteVi always Vietnamese".

import type { ReviewFlowId, ReviewItem } from "@/features/review/types";
import { slugify } from "../slug";
import type { ReviewSource } from "./source";

// Minimal structural shape we depend on — a subset of SpanishLesson. Declared
// locally (not imported from the content module) so tests can inject fakes and
// we don't couple to the full SpanishLesson type surface.
export interface SpanishLessonLike {
  id: string;
  sentences?: Array<{
    spanish: string;
    english: string;
    pronunciation?: string;
  }>;
  vocabulary?: Array<{
    word: string;
    english: string;
    pronunciation?: string;
  }>;
}

const FLOW: ReviewFlowId = "en-es";

function clean(s: string | undefined): string | undefined {
  if (s == null) return undefined;
  const t = s.trim();
  return t.length ? t : undefined;
}

/**
 * Build the `en-es` items from a set of Spanish lessons.
 * Deduplicated by id (later occurrences of the same id win-by-skip).
 */
function buildItems(lessons: readonly SpanishLessonLike[]): ReviewItem[] {
  const out: ReviewItem[] = [];
  const seen = new Set<string>();

  for (const lesson of lessons) {
    for (const v of lesson.vocabulary ?? []) {
      const front = clean(v.english);
      const back = clean(v.word);
      if (!front || !back) continue;
      const id = `${FLOW}:vocab:${slugify(front)}`;
      if (seen.has(id)) continue;
      seen.add(id);
      out.push({
        id,
        flow: FLOW,
        kind: "vocab",
        front,
        back,
        pronunciation: clean(v.pronunciation),
        source: "spanish/lessons",
      });
    }

    for (const s of lesson.sentences ?? []) {
      const front = clean(s.english);
      const back = clean(s.spanish);
      if (!front || !back) continue;
      const id = `${FLOW}:sentence:${slugify(front)}`;
      if (seen.has(id)) continue;
      seen.add(id);
      out.push({
        id,
        flow: FLOW,
        kind: "sentence",
        front,
        back,
        pronunciation: clean(s.pronunciation),
        // The Spanish sentence doubles as its own worked example.
        example: back,
        source: "spanish/lessons",
      });
    }
  }

  return out;
}

/**
 * Factory. Defaults to the real lessons-{level}.ts corpus; tests pass fakes.
 */
export function createSpanishLessonsSource(
  lessons: readonly SpanishLessonLike[],
): ReviewSource {
  const items = buildItems(lessons);
  return {
    name: "spanish/lessons",
    flows: () => [FLOW],
    items: (flow) => (flow === FLOW ? items : []),
  };
}
