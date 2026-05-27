// src/components/stage-3b/practiceRoutes.ts
//
// Stage 3B — Suggested Practice → practice surface routing.
//
// Pure function that maps a `SuggestedPracticeItem` to an existing
// app route. Lives in its own file so the mapping is unit-testable
// without React.
//
// Routing decisions (verified against `src/router/AppRouter.tsx` on
// `feat/stage-3b-practice-handoff`):
//
//   - l1            → /ai-tutor?focus=<tag>
//                     The live tutor surface already L1-aware via
//                     `src/pages/AiTutor.tsx` `hint.tag` flow. The
//                     `focus` query param is read-optional today; passing
//                     it documents intent for a future L1-deeplink
//                     reader without requiring receiver-side support.
//                     (Route is `AI_TUTOR_UI_ENABLED`-gated, defaulted
//                     ON in `src/lib/featureFlags.ts`.)
//
//   - placement     → /placement/results
//                     The natural review surface for a placement-tagged
//                     weakness — sends the learner back to their result
//                     view, where they can re-read the breakdown.
//
//   - pronunciation → /practice/phoneme/<slug>
//                     `src/data/pronunciation/phoneme-drills/index.ts`
//                     defines a fixed set of single-phoneme drill packs;
//                     the table below maps each Stage 3A
//                     `PainPointAxis` to its closest pack slug. Axes
//                     without a clean pack (currently `INTONATION`) and
//                     unknown axes fall back to
//                     /weak-at?focus=pronunciation:<axis>.
//
// Fallback rule (per dispatch): when no clean target exists for a
// kind, route to /weak-at with a query param that documents intent.
// No new routes are introduced by this module.
//
// Pure: no I/O, no React, no Supabase, no localStorage. Identical
// input → identical output.

import type {
  SuggestedPracticeItem,
  SuggestedPracticeKind,
} from "@/stage-3b/types";

/**
 * Stage 3A `PainPointAxis` → `/practice/phoneme/:phonemeSlug` slug.
 *
 * Slug values are verified to exist in
 * `src/data/pronunciation/phoneme-drills/index.ts`'s `PHONEME_DRILL_PACKS`
 * registry. A slug that disappears from the registry would manifest as
 * a soft 404 on the drill page rather than a crash — but the unit test
 * here is the contract that catches it before it ships.
 */
export const PRONUNCIATION_AXIS_TO_SLUG: Readonly<Record<string, string>> = {
  TH_T: "th",
  R_L: "r",
  ED_ENDINGS: "t_d_final",
  S_PLURALS: "s_final",
  STRESS: "stress_2_3_syllable",
  // INTONATION intentionally omitted — no single-phoneme pack covers
  // sentence-level intonation in the current drill registry. Falls
  // through to /weak-at?focus=pronunciation:INTONATION.
};

/**
 * Resolve the practice destination for a `SuggestedPracticeItem`.
 *
 * Always returns a string — never null. Unknown source tags within a
 * known kind still produce a meaningful route (e.g. unknown L1 tag
 * still lands on /ai-tutor; unknown pronunciation axis lands on
 * /weak-at with a documenting param).
 */
export function routeForSuggestedPractice(
  item: SuggestedPracticeItem,
): string {
  switch (item.kind) {
    case "l1":
      return `/ai-tutor?focus=${encodeURIComponent(item.sourceTag)}`;
    case "placement":
      return "/placement/results";
    case "pronunciation": {
      const slug = PRONUNCIATION_AXIS_TO_SLUG[item.sourceTag];
      if (slug) return `/practice/phoneme/${slug}`;
      return `/weak-at?focus=pronunciation:${encodeURIComponent(item.sourceTag)}`;
    }
    default:
      // Exhaustive over `SuggestedPracticeKind`; the default branch
      // exists only to satisfy noImplicitAny if the union ever grows.
      return assertNever(item.kind);
  }
}

function assertNever(kind: never): string {
  void (kind as SuggestedPracticeKind);
  return "/weak-at";
}
