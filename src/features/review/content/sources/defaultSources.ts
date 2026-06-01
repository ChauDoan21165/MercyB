// src/features/review/content/sources/defaultSources.ts
//
// The ONLY module that imports real MercyBlade content. Kept separate from the
// adapter and the per-source mappers so tests can build the adapter with fakes
// and never pull these imports (which would drag the whole content corpus +
// the zod-validated JSON into the test graph).
//
// READ-ONLY: these are plain module-array reads + pure transforms. Nothing here
// writes, uploads, hits Supabase, or touches the audio pipeline. Everything here
// is still gated by FEATURE_REVIEW (default off) at the route/nav layer.

import { lessons as spanishA1 } from "@/languages/spanish/lessons-a1";
import { lessons as spanishA2 } from "@/languages/spanish/lessons-a2";
import { lessons as spanishB1 } from "@/languages/spanish/lessons-b1";
import { lessons as spanishB2 } from "@/languages/spanish/lessons-b2";
import { lessons as spanishC1 } from "@/languages/spanish/lessons-c1";
import { lessons as spanishC2 } from "@/languages/spanish/lessons-c2";
import { BILINGUAL_SENTENCES } from "@/data/bilingualSentencesSchema";

// Gate-certified, reviewed seeds (seeds/out/). Static JSON — read-only, bundled.
import viDeSeed from "../seeds/out/vi-de.A1.seed.json";
import viKoSeed from "../seeds/out/vi-ko.A1.seed.json";
import viZhSeed from "../seeds/out/vi-zh.B2.seed.json";
import viJaSeed from "../seeds/out/vi-ja.A1.seed.json";

import type { ReviewSource } from "./source";
import { createSpanishLessonsSource } from "./spanishLessons";
import { createBilingualSentencesSource } from "./bilingualSentences";
import { createSeedSource, type SeedLike } from "./seedSource";

/**
 * Build the live, real-content sources.
 *
 * Wired flows:
 *   - en-es          ← Spanish lessons-{level}.ts corpus (vocab + sentences)
 *   - en-vi / vi-en  ← bilingual sentence library (text_en + vn_translation)
 *   - vi-de          ← reviewed A1 seed (adapted from German lessons)
 *   - vi-ko          ← reviewed A1 seed (adapted from Korean lessons, sentences)
 *   - vi-zh          ← reviewed B2 seed (adapted from Chinese lessons)
 *   - vi-ja          ← reviewed A1 seed (generated; romaji human-corrected:
 *                      は→"wa", kanji transliterated — see japaneseSeed.authored.ts)
 *
 * All 7 flows are now wired (still gated by FEATURE_REVIEW, default off).
 *
 * Note:
 *   - vi-zh is **B2-only**: Chinese A1/A2/B1 lessons carry no Vietnamese gloss,
 *     so an A1 vi-zh seed is a KNOWN GAP for a future GENERATION pass (see
 *     content/README.md). The empty seeds/out/vi-zh.A1.seed.json marks it.
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
    createSeedSource("seed:vi-de:A1", "vi-de", viDeSeed as unknown as SeedLike),
    createSeedSource("seed:vi-ko:A1", "vi-ko", viKoSeed as unknown as SeedLike),
    createSeedSource("seed:vi-zh:B2", "vi-zh", viZhSeed as unknown as SeedLike),
    createSeedSource("seed:vi-ja:A1", "vi-ja", viJaSeed as unknown as SeedLike),
  ];
}
