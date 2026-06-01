// src/features/review/content/sources/defaultSources.ts
//
// The ONLY module that imports real MercyBlade content. Kept separate from the
// adapter and the per-source mappers so tests can build the adapter with fakes
// and never pull these imports (which would drag the whole content corpus +
// the zod-validated JSON into the test graph).
//
// READ-ONLY: these are plain module-array reads + pure transforms. Nothing here
// writes, uploads, hits Supabase, or touches the audio pipeline.

import { lessons as spanishA1 } from "@/languages/spanish/lessons-a1";
import { lessons as spanishA2 } from "@/languages/spanish/lessons-a2";
import { lessons as spanishB1 } from "@/languages/spanish/lessons-b1";
import { lessons as spanishB2 } from "@/languages/spanish/lessons-b2";
import { lessons as spanishC1 } from "@/languages/spanish/lessons-c1";
import { lessons as spanishC2 } from "@/languages/spanish/lessons-c2";
import { BILINGUAL_SENTENCES } from "@/data/bilingualSentencesSchema";

import type { ReviewSource } from "./source";
import { createSpanishLessonsSource } from "./spanishLessons";
import { createBilingualSentencesSource } from "./bilingualSentences";

/**
 * Build the live, real-content sources wired to the flows whose content shape
 * is clear today:
 *   - en-es          ← Spanish lessons-{level}.ts corpus (vocab + sentences)
 *   - en-vi / vi-en  ← bilingual sentence library (text_en + vn_translation)
 *
 * Flows with no clean source yet (vi-de, vi-ja, vi-ko, vi-zh) are intentionally
 * NOT wired here — getItems() returns [] for them (fail soft).
 *   // TODO(D3): wire vi-de source (german lessons carry no Vietnamese gloss today)
 *   // TODO(D3): wire vi-ja source (japanese lessons: confirm vi field before wiring)
 *   // TODO(D3): wire vi-ko source (korean lessons: confirm vi field before wiring)
 *   // TODO(D3): wire vi-zh source (chinese lessons: confirm vi field before wiring)
 */
export function createDefaultSources(): ReviewSource[] {
  const allSpanish = [
    ...spanishA1,
    ...spanishA2,
    ...spanishB1,
    ...spanishB2,
    ...spanishC1,
    ...spanishC2,
  ];

  return [
    createSpanishLessonsSource(allSpanish),
    createBilingualSentencesSource(BILINGUAL_SENTENCES),
  ];
}
