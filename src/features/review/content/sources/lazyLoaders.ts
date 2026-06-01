// src/features/review/content/sources/lazyLoaders.ts
//
// Per-flow LAZY content loaders. This is the single source of truth for which
// flows are wired and where their content comes from — replacing the old
// eager createDefaultSources(), which statically imported the WHOLE corpus
// (Spanish lessons + bilingual sentences + every seed) into the ReviewApp
// chunk (~230 KB gzip of content that loaded even for a user who never opens a
// deck). Each loader uses dynamic import() so Vite code-splits a flow's content
// into its own chunk, fetched only when that deck is actually reviewed.
//
// READ-ONLY: still just module-array reads + pure transforms; nothing writes,
// uploads, hits Supabase, or touches audio. Still gated by FEATURE_REVIEW.
//
// Wired flows:
//   - en-es          ← Spanish lessons-{level}.ts corpus (lazy)
//   - en-vi / vi-en  ← bilingual sentence library (lazy, shared chunk)
//   - vi-de          ← reviewed A1 seed (German adaptation)
//   - vi-ko          ← reviewed A1 seed (Korean adaptation, sentences)
//   - vi-zh          ← reviewed B2 seed (Chinese adaptation; A1 is a generation
//                      gap surfaced separately, not wired here)
//   - vi-ja          ← reviewed A1 seed (generated; romaji human-corrected)

import type { ReviewFlowId, ReviewItem } from "@/features/review/types";
import { createSeedSource, type SeedLike } from "./seedSource";

export type ItemsLoader = () => Promise<ReviewItem[]>;

function seedItems(flow: ReviewFlowId, mod: { default: unknown }): ReviewItem[] {
  return createSeedSource(`seed:${flow}`, flow, mod.default as unknown as SeedLike).items(flow);
}

async function loadSpanish(): Promise<ReviewItem[]> {
  const [a1, a2, b1, b2, c1, c2, sp] = await Promise.all([
    import("@/languages/spanish/lessons-a1"),
    import("@/languages/spanish/lessons-a2"),
    import("@/languages/spanish/lessons-b1"),
    import("@/languages/spanish/lessons-b2"),
    import("@/languages/spanish/lessons-c1"),
    import("@/languages/spanish/lessons-c2"),
    import("./spanishLessons"),
  ]);
  const all = [
    ...a1.lessons,
    ...a2.lessons,
    ...b1.lessons,
    ...b2.lessons,
    ...c1.lessons,
    ...c2.lessons,
  ];
  return sp.createSpanishLessonsSource(all).items("en-es");
}

async function loadBilingual(flow: ReviewFlowId): Promise<ReviewItem[]> {
  const [data, bs] = await Promise.all([
    import("@/data/bilingualSentencesSchema"),
    import("./bilingualSentences"),
  ]);
  return bs.createBilingualSentencesSource(data.BILINGUAL_SENTENCES).items(flow);
}

export const DEFAULT_FLOW_LOADERS: Partial<Record<ReviewFlowId, ItemsLoader>> = {
  "en-es": loadSpanish,
  "en-vi": () => loadBilingual("en-vi"),
  "vi-en": () => loadBilingual("vi-en"),
  "vi-de": () => import("../seeds/out/vi-de.A1.seed.json").then((m) => seedItems("vi-de", m)),
  "vi-ko": () => import("../seeds/out/vi-ko.A1.seed.json").then((m) => seedItems("vi-ko", m)),
  "vi-zh": () => import("../seeds/out/vi-zh.B2.seed.json").then((m) => seedItems("vi-zh", m)),
  "vi-ja": () => import("../seeds/out/vi-ja.A1.seed.json").then((m) => seedItems("vi-ja", m)),
};
