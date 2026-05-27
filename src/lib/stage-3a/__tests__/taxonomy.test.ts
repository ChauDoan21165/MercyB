import { describe, it, expect } from "vitest";

import type { L1WeaknessTag } from "../../feedback/l1-error-detector.js";
import {
  L1_DESCRIPTIONS,
  PHONEME_AXIS_KEYS,
  PHONEME_DESCRIPTIONS,
  PLACEMENT_DESCRIPTIONS,
  describeL1Tag,
  describePhonemeAxis,
  describePlacementWeakness,
  type LearnerLanguage,
} from "../taxonomy.js";

const wordCount = (s: string): number =>
  s.replace(/[*_]/g, "").trim().split(/\s+/).filter(Boolean).length;

const allL1Tags = Object.keys(L1_DESCRIPTIONS) as L1WeaknessTag[];

const allEntries: { source: string; key: string; entry: LearnerLanguage }[] = [
  ...allL1Tags.map((tag) => ({
    source: "L1_DESCRIPTIONS",
    key: tag,
    entry: L1_DESCRIPTIONS[tag],
  })),
  ...PHONEME_AXIS_KEYS.map((axis) => ({
    source: "PHONEME_DESCRIPTIONS",
    key: axis,
    entry: PHONEME_DESCRIPTIONS[axis],
  })),
  ...Object.keys(PLACEMENT_DESCRIPTIONS).map((tag) => ({
    source: "PLACEMENT_DESCRIPTIONS",
    key: tag,
    entry: PLACEMENT_DESCRIPTIONS[tag]!,
  })),
];

describe("Stage 3A learner-language taxonomy", () => {
  it("covers every L1WeaknessTag with non-empty shortVi + shortEn", () => {
    expect(allL1Tags.length).toBeGreaterThanOrEqual(15);
    for (const tag of allL1Tags) {
      const entry = L1_DESCRIPTIONS[tag];
      expect(entry.shortVi.trim().length, `${tag}.shortVi`).toBeGreaterThan(0);
      expect(entry.shortEn.trim().length, `${tag}.shortEn`).toBeGreaterThan(0);
    }
  });

  it("covers every phoneme pain-point axis", () => {
    const expected = ["TH_T", "R_L", "ED_ENDINGS", "S_PLURALS", "STRESS", "INTONATION"];
    for (const axis of expected) {
      expect(PHONEME_AXIS_KEYS).toContain(axis);
      const entry = describePhonemeAxis(axis);
      expect(entry.shortVi.trim().length, `${axis}.shortVi`).toBeGreaterThan(0);
      expect(entry.shortEn.trim().length, `${axis}.shortEn`).toBeGreaterThan(0);
    }
  });

  it("keeps every shortVi at 12 words or fewer", () => {
    for (const { source, key, entry } of allEntries) {
      expect(wordCount(entry.shortVi), `${source}/${key}.shortVi: "${entry.shortVi}"`).toBeLessThanOrEqual(12);
    }
  });

  it("keeps every shortEn at 12 words or fewer", () => {
    for (const { source, key, entry } of allEntries) {
      expect(wordCount(entry.shortEn), `${source}/${key}.shortEn: "${entry.shortEn}"`).toBeLessThanOrEqual(12);
    }
  });

  it("returns the generic fallback for unknown tags and does not throw", () => {
    const fallbackL1 = describeL1Tag("vi_l1_does_not_exist_yet" as L1WeaknessTag);
    const fallbackPhoneme = describePhonemeAxis("XX_NOT_A_REAL_AXIS");
    const fallbackPlacement = describePlacementWeakness("not_a_real_pattern");

    for (const got of [fallbackL1, fallbackPhoneme, fallbackPlacement]) {
      expect(got.shortVi.trim().length).toBeGreaterThan(0);
      expect(got.shortEn.trim().length).toBeGreaterThan(0);
      expect(got.severity).toMatch(/^(low|medium|high)$/);
    }

    // All three should agree on the fallback identity — single FALLBACK const.
    expect(fallbackL1).toEqual(fallbackPhoneme);
    expect(fallbackL1).toEqual(fallbackPlacement);
  });

  it("uses no shame-language in any description", () => {
    const shameEn = /\b(weakness|bad at|wrong|mistake|fail)\b/i;
    const shameVi = /(yếu|sai|kém|tệ)/i;

    for (const { source, key, entry } of allEntries) {
      const enFields = [entry.shortEn, entry.exampleEn ?? ""].join(" ");
      const viFields = [entry.shortVi, entry.exampleVi ?? ""].join(" ");
      expect(shameEn.test(enFields), `${source}/${key} EN: "${enFields}"`).toBe(false);
      expect(shameVi.test(viFields), `${source}/${key} VI: "${viFields}"`).toBe(false);
    }
  });

  it("routes vi_l1_* placement tags back through L1_DESCRIPTIONS", () => {
    const placementV1Tags = ["vi_l1_3rd_person_s", "vi_l1_past_ed", "vi_l1_plural_s"];
    for (const tag of placementV1Tags) {
      expect(describePlacementWeakness(tag)).toEqual(L1_DESCRIPTIONS[tag as L1WeaknessTag]);
    }
  });
});
