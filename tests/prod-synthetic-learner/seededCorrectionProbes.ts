export type ExpectedLpiShadowPath = "target_form_correct_now" | "generic_form_defer";
export type ExpectedProductPath = "immediate_correction" | "legacy_timing_defer" | "lpi_shadow_defer";

export type SeededCorrectionProbe = {
  id: string;
  sentence: string;
  expectedDetector: string;
  expectedShadowPath: ExpectedLpiShadowPath;
  expectedProductPath: ExpectedProductPath;
  note: string;
};

export const SEEDED_CORRECTION_PROBES: readonly SeededCorrectionProbe[] = [
  {
    id: "vi-l1-missing-be-copula",
    sentence: "She happy today.",
    expectedDetector: "en-vn-copula-be-adjective",
    expectedShadowPath: "target_form_correct_now",
    expectedProductPath: "immediate_correction",
    note: "Flagship Vietnamese-L1 copula drop; expected first-turn LPI action is correct_now.",
  },
  {
    id: "vi-l1-past-marker",
    sentence: "She watch TV yesterday.",
    expectedDetector: "en-vn-past-marker-regular-verb",
    expectedShadowPath: "target_form_correct_now",
    expectedProductPath: "immediate_correction",
    note: "Flagship Vietnamese-L1 past-marker transfer; expected first-turn LPI action is correct_now.",
  },
  {
    id: "generic-local-discuss-about",
    sentence: "We discussed about the lesson yesterday.",
    expectedDetector: "en-step6-discuss-about",
    expectedShadowPath: "generic_form_defer",
    expectedProductPath: "legacy_timing_defer",
    note: "Generic non-flagship local rule; short/minor legacy timing gate shows the UI defer notice.",
  },
  {
    id: "generic-ai-comparative",
    sentence: "This lesson is more easy than yesterday.",
    expectedDetector: "ai-correction",
    expectedShadowPath: "generic_form_defer",
    expectedProductPath: "lpi_shadow_defer",
    note: "Generic non-flagship form path through AI fallback; expected first-turn LPI action is defer_to_recap.",
  },
] as const;

export const PINNED_FEEDBACK_PROBE = SEEDED_CORRECTION_PROBES[0];

export const ROTATING_CORRECTION_PROBES = SEEDED_CORRECTION_PROBES.filter(
  (probe) => probe.id !== PINNED_FEEDBACK_PROBE.id,
);

export function selectSeededCorrectionProbe(now: Date = new Date()): SeededCorrectionProbe {
  const hourBucket = Math.floor(now.getTime() / (60 * 60 * 1000));
  return ROTATING_CORRECTION_PROBES[hourBucket % ROTATING_CORRECTION_PROBES.length];
}

export function selectSeededCorrectionProbes(
  now: Date = new Date(),
): readonly SeededCorrectionProbe[] {
  return [selectSeededCorrectionProbe(now), PINNED_FEEDBACK_PROBE];
}
