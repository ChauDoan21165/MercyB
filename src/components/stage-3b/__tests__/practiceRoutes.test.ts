// src/components/stage-3b/__tests__/practiceRoutes.test.ts
//
// Unit tests for `routeForSuggestedPractice` — pure function, no React.

import { describe, expect, it } from "vitest";

import {
  PHONEME_DRILL_PACKS,
} from "@/data/pronunciation/phoneme-drills";
import type { SuggestedPracticeItem } from "@/stage-3b/types";

import {
  PRONUNCIATION_AXIS_TO_SLUG,
  routeForSuggestedPractice,
} from "../practiceRoutes";

function makeItem(
  overrides: Partial<SuggestedPracticeItem> & Pick<SuggestedPracticeItem, "kind" | "sourceTag">,
): SuggestedPracticeItem {
  return {
    id: `${overrides.kind}:${overrides.sourceTag}`,
    viLabel: "vi",
    enLabel: "en",
    rationale: "vi rationale",
    ...overrides,
  };
}

describe("routeForSuggestedPractice", () => {
  it("l1 → /ai-tutor with the source tag in a `focus` query param", () => {
    const route = routeForSuggestedPractice(
      makeItem({ kind: "l1", sourceTag: "vi_l1_3rd_person_s" }),
    );
    expect(route).toBe("/ai-tutor?focus=vi_l1_3rd_person_s");
  });

  it("l1 → encodes special characters in the source tag", () => {
    const route = routeForSuggestedPractice(
      makeItem({ kind: "l1", sourceTag: "tag with space" }),
    );
    expect(route).toBe("/ai-tutor?focus=tag%20with%20space");
  });

  it("placement → /placement/results (review surface)", () => {
    const route = routeForSuggestedPractice(
      makeItem({ kind: "placement", sourceTag: "th_stopping_and_fronting" }),
    );
    expect(route).toBe("/placement/results");
  });

  it("pronunciation TH_T → /practice/phoneme/th", () => {
    const route = routeForSuggestedPractice(
      makeItem({ kind: "pronunciation", sourceTag: "TH_T" }),
    );
    expect(route).toBe("/practice/phoneme/th");
  });

  it("pronunciation R_L → /practice/phoneme/r", () => {
    const route = routeForSuggestedPractice(
      makeItem({ kind: "pronunciation", sourceTag: "R_L" }),
    );
    expect(route).toBe("/practice/phoneme/r");
  });

  it("pronunciation ED_ENDINGS → /practice/phoneme/t_d_final", () => {
    const route = routeForSuggestedPractice(
      makeItem({ kind: "pronunciation", sourceTag: "ED_ENDINGS" }),
    );
    expect(route).toBe("/practice/phoneme/t_d_final");
  });

  it("pronunciation S_PLURALS → /practice/phoneme/s_final", () => {
    const route = routeForSuggestedPractice(
      makeItem({ kind: "pronunciation", sourceTag: "S_PLURALS" }),
    );
    expect(route).toBe("/practice/phoneme/s_final");
  });

  it("pronunciation STRESS → /practice/phoneme/stress_2_3_syllable", () => {
    const route = routeForSuggestedPractice(
      makeItem({ kind: "pronunciation", sourceTag: "STRESS" }),
    );
    expect(route).toBe("/practice/phoneme/stress_2_3_syllable");
  });

  it("pronunciation INTONATION (no pack) → /weak-at fallback with documented intent", () => {
    const route = routeForSuggestedPractice(
      makeItem({ kind: "pronunciation", sourceTag: "INTONATION" }),
    );
    expect(route).toBe("/weak-at?focus=pronunciation:INTONATION");
  });

  it("pronunciation unknown axis → /weak-at fallback with documented intent", () => {
    const route = routeForSuggestedPractice(
      makeItem({ kind: "pronunciation", sourceTag: "TOTALLY_UNKNOWN" }),
    );
    expect(route).toBe("/weak-at?focus=pronunciation:TOTALLY_UNKNOWN");
  });

  it("every mapped pronunciation slug exists in the phoneme drill registry", () => {
    // Contract guard: if a slug disappears from the registry, the
    // mapping silently sends users to a soft-404 drill page. This
    // test pins the contract.
    const validSlugs = new Set(PHONEME_DRILL_PACKS.map((p) => p.slug));
    for (const [axis, slug] of Object.entries(PRONUNCIATION_AXIS_TO_SLUG)) {
      expect(validSlugs.has(slug), `axis ${axis} → slug ${slug} not in registry`).toBe(true);
    }
  });

  it("is deterministic — same input twice → identical output", () => {
    const item = makeItem({ kind: "pronunciation", sourceTag: "TH_T" });
    expect(routeForSuggestedPractice(item)).toBe(
      routeForSuggestedPractice(item),
    );
  });
});
