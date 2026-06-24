// Punjabi C2 discourse stress-test guards. These validate app-consumable
// structure and scope, not certification, official placement, or native review.

import { describe, expect, it } from "vitest";

import {
  C2_DISCOURSE_STRESS_TESTS_DISCLAIMER,
  discourseStressTestsC2,
  discourseStressTestsC2ByFocus,
  type PunjabiC2DiscourseStressTest,
  type PunjabiC2StressFocus,
} from "@/languages/punjabi/discourseStressTestsC2";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI_RANGE.test(s);

const REQUIRED_FOCUSES: PunjabiC2StressFocus[] = [
  "nuanced_disagreement",
  "negotiation",
  "diplomacy",
  "mediation",
  "deescalation",
  "audience_adaptation",
  "sensitive_topic_framing",
  "advanced_register",
  "community_discourse",
  "professional_discourse",
  "public_discourse",
];

describe("Punjabi C2 discourse stress tests - coverage", () => {
  it("ships compact app-consumable stress tests", () => {
    expect(discourseStressTestsC2.length).toBeGreaterThanOrEqual(10);
    expect(discourseStressTestsC2.length).toBeLessThanOrEqual(12);
  });

  it("covers every required C2 stress focus", () => {
    const seen = new Set(discourseStressTestsC2.map((item) => item.focus));
    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("has unique non-empty ids", () => {
    const ids = discourseStressTestsC2.map((item) => item.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("discourseStressTestsC2ByFocus returns only matching items", () => {
    for (const focus of REQUIRED_FOCUSES) {
      const subset = discourseStressTestsC2ByFocus(focus);
      expect(subset.length, focus).toBeGreaterThan(0);
      expect(subset.every((item) => item.focus === focus), focus).toBe(true);
    }
  });
});

describe("Punjabi C2 discourse stress tests - bilingual integrity", () => {
  it("each item has VI+EN scenario and task", () => {
    for (const item of discourseStressTestsC2) {
      expect(item.title_vi.length, `${item.id} title_vi`).toBeGreaterThan(0);
      expect(item.title_en.length, `${item.id} title_en`).toBeGreaterThan(0);
      expect(item.scenario_vi.length, `${item.id} scenario_vi`).toBeGreaterThan(0);
      expect(item.scenario_en.length, `${item.id} scenario_en`).toBeGreaterThan(0);
      expect(item.task_vi.length, `${item.id} task_vi`).toBeGreaterThan(0);
      expect(item.task_en.length, `${item.id} task_en`).toBeGreaterThan(0);
    }
  });

  it("each sample has Gurmukhi, romanization, Vietnamese, and English", () => {
    for (const item of discourseStressTestsC2) {
      expect(hasGurmukhi(item.sample_gurmukhi), `${item.id} sample_gurmukhi`).toBe(true);
      expect(item.sample_romanization.length, `${item.id} sample_romanization`).toBeGreaterThan(0);
      expect(item.sample_vi.length, `${item.id} sample_vi`).toBeGreaterThan(0);
      expect(item.sample_en.length, `${item.id} sample_en`).toBeGreaterThan(0);
    }
  });

  it("each guard phrase has Gurmukhi, romanization, VI, and EN", () => {
    for (const item of discourseStressTestsC2) {
      expect(item.guard_phrases.length, `${item.id} phrases`).toBeGreaterThanOrEqual(2);
      for (const phrase of item.guard_phrases) {
        expect(hasGurmukhi(phrase.gurmukhi), `${item.id} phrase Gurmukhi`).toBe(true);
        expect(phrase.romanization.length, `${item.id} phrase romanization`).toBeGreaterThan(0);
        expect(phrase.vi.length, `${item.id} phrase vi`).toBeGreaterThan(0);
        expect(phrase.en.length, `${item.id} phrase en`).toBeGreaterThan(0);
      }
    }
  });

  it("includes stress-test, final-risk, and final-QA styles", () => {
    const styles = new Set(discourseStressTestsC2.map((item) => item.style));
    expect(styles.has("stress_test")).toBe(true);
    expect(styles.has("final_risk")).toBe(true);
    expect(styles.has("final_qa")).toBe(true);
  });

  it("each item carries risk checks", () => {
    for (const item of discourseStressTestsC2) {
      expect(item.final_risks.length, `${item.id} risks`).toBeGreaterThanOrEqual(1);
      for (const risk of item.final_risks) {
        expect(risk.risk_vi.length, `${item.id} risk_vi`).toBeGreaterThan(0);
        expect(risk.risk_en.length, `${item.id} risk_en`).toBeGreaterThan(0);
        expect(risk.guard_vi.length, `${item.id} guard_vi`).toBeGreaterThan(0);
        expect(risk.guard_en.length, `${item.id} guard_en`).toBeGreaterThan(0);
      }
    }
  });

  it("includes learner traps and Canada-practical examples where useful", () => {
    expect(discourseStressTestsC2.filter((item) => item.learner_trap).length).toBeGreaterThanOrEqual(8);
    const canadaItems = discourseStressTestsC2.filter((item) => item.canada_practical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(3);
    expect(JSON.stringify(canadaItems).toLowerCase()).toContain("canada");
  });
});

describe("Punjabi C2 discourse stress tests - scope framing", () => {
  it("exposes study-support, deferred-review, Shahmukhi-awareness disclaimer", () => {
    expect(C2_DISCOURSE_STRESS_TESTS_DISCLAIMER.vi.length).toBeGreaterThan(0);
    expect(C2_DISCOURSE_STRESS_TESTS_DISCLAIMER.en.length).toBeGreaterThan(0);
    const disclaimer =
      `${C2_DISCOURSE_STRESS_TESTS_DISCLAIMER.vi} ${C2_DISCOURSE_STRESS_TESTS_DISCLAIMER.en}`.toLowerCase();
    expect(disclaimer).toContain("gurmukhi");
    expect(disclaimer).toContain("native review is deferred");
    expect(disclaimer).toContain("not certification");
    expect(disclaimer).toContain("official placement");
    expect(disclaimer).toContain("shahmukhi");
    expect(disclaimer).toContain("awareness");
    expect(disclaimer).not.toContain("full shahmukhi course");
  });

  it("does not claim native review, certification, official placement, or legal authority", () => {
    const blob = JSON.stringify(discourseStressTestsC2).toLowerCase();
    expect(blob).not.toContain("native-reviewed");
    expect(blob).not.toContain("native-certified");
    expect(blob).not.toContain("certified by a native");
    expect(blob).not.toContain("official placement");
    expect(blob).not.toContain("legal advice");
  });
});

const _typecheck: PunjabiC2DiscourseStressTest[] = discourseStressTestsC2;
void _typecheck;
