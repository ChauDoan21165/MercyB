// Punjabi C2 register safety guard checks. These validate app-consumable
// structure and scope, not certification, official placement, or native review.

import { describe, expect, it } from "vitest";

import {
  C2_REGISTER_SAFETY_GUARDS_DISCLAIMER,
  registerSafetyGuardsC2,
  registerSafetyGuardsC2ByFocus,
  type PunjabiC2RegisterSafetyFocus,
  type PunjabiC2RegisterSafetyGuard,
} from "@/languages/punjabi/registerSafetyGuardsC2";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI_RANGE.test(s);

const REQUIRED_FOCUSES: PunjabiC2RegisterSafetyFocus[] = [
  "nuanced_disagreement",
  "negotiation",
  "diplomacy",
  "mediation",
  "deescalation",
  "sensitive_topic_framing",
  "community_discourse",
  "professional_discourse",
  "public_discourse",
  "public_service",
  "audience_adaptation",
  "advanced_register",
];

describe("Punjabi C2 register safety guards - coverage", () => {
  it("ships a compact app-consumable guard set", () => {
    expect(registerSafetyGuardsC2.length).toBeGreaterThanOrEqual(10);
    expect(registerSafetyGuardsC2.length).toBeLessThanOrEqual(12);
  });

  it("covers every required register safety focus", () => {
    const seen = new Set(registerSafetyGuardsC2.map((item) => item.focus));
    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("has unique non-empty ids", () => {
    const ids = registerSafetyGuardsC2.map((item) => item.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("registerSafetyGuardsC2ByFocus returns only matching items", () => {
    for (const focus of REQUIRED_FOCUSES) {
      const subset = registerSafetyGuardsC2ByFocus(focus);
      expect(subset.length, focus).toBeGreaterThan(0);
      expect(subset.every((item) => item.focus === focus), focus).toBe(true);
    }
  });
});

describe("Punjabi C2 register safety guards - bilingual integrity", () => {
  it("each item has VI+EN scenario and guard goal", () => {
    for (const item of registerSafetyGuardsC2) {
      expect(item.title_vi.length, `${item.id} title_vi`).toBeGreaterThan(0);
      expect(item.title_en.length, `${item.id} title_en`).toBeGreaterThan(0);
      expect(item.scenario_vi.length, `${item.id} scenario_vi`).toBeGreaterThan(0);
      expect(item.scenario_en.length, `${item.id} scenario_en`).toBeGreaterThan(0);
      expect(item.guard_goal_vi.length, `${item.id} goal_vi`).toBeGreaterThan(0);
      expect(item.guard_goal_en.length, `${item.id} goal_en`).toBeGreaterThan(0);
    }
  });

  it("each sample has Gurmukhi, romanization, Vietnamese, and English", () => {
    for (const item of registerSafetyGuardsC2) {
      expect(hasGurmukhi(item.sample_gurmukhi), `${item.id} sample_gurmukhi`).toBe(true);
      expect(item.sample_romanization.length, `${item.id} sample_romanization`).toBeGreaterThan(0);
      expect(item.sample_vi.length, `${item.id} sample_vi`).toBeGreaterThan(0);
      expect(item.sample_en.length, `${item.id} sample_en`).toBeGreaterThan(0);
    }
  });

  it("each guard phrase has Gurmukhi, romanization, VI, and EN", () => {
    for (const item of registerSafetyGuardsC2) {
      expect(item.guard_phrases.length, `${item.id} phrases`).toBeGreaterThanOrEqual(2);
      for (const phrase of item.guard_phrases) {
        expect(hasGurmukhi(phrase.gurmukhi), `${item.id} phrase Gurmukhi`).toBe(true);
        expect(phrase.romanization.length, `${item.id} phrase romanization`).toBeGreaterThan(0);
        expect(phrase.vi.length, `${item.id} phrase vi`).toBeGreaterThan(0);
        expect(phrase.en.length, `${item.id} phrase en`).toBeGreaterThan(0);
      }
    }
  });

  it("includes final-safety, quality, export-readiness, and regression styles", () => {
    const styles = new Set(registerSafetyGuardsC2.map((item) => item.style));
    expect(styles.has("final_safety")).toBe(true);
    expect(styles.has("quality")).toBe(true);
    expect(styles.has("export_readiness")).toBe(true);
    expect(styles.has("regression")).toBe(true);
  });

  it("each item carries guard checks", () => {
    for (const item of registerSafetyGuardsC2) {
      expect(item.checks.length, `${item.id} checks`).toBeGreaterThanOrEqual(1);
      for (const check of item.checks) {
        expect(check.check_vi.length, `${item.id} check_vi`).toBeGreaterThan(0);
        expect(check.check_en.length, `${item.id} check_en`).toBeGreaterThan(0);
        expect(check.signal_vi.length, `${item.id} signal_vi`).toBeGreaterThan(0);
        expect(check.signal_en.length, `${item.id} signal_en`).toBeGreaterThan(0);
      }
    }
  });

  it("includes learner traps and Canada-practical examples where useful", () => {
    expect(registerSafetyGuardsC2.filter((item) => item.learner_trap).length).toBeGreaterThanOrEqual(8);
    const canadaItems = registerSafetyGuardsC2.filter((item) => item.canada_practical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(3);
    expect(JSON.stringify(canadaItems).toLowerCase()).toContain("canada");
  });
});

describe("Punjabi C2 register safety guards - scope framing", () => {
  it("exposes study-support, deferred-review, Shahmukhi-awareness disclaimer", () => {
    expect(C2_REGISTER_SAFETY_GUARDS_DISCLAIMER.vi.length).toBeGreaterThan(0);
    expect(C2_REGISTER_SAFETY_GUARDS_DISCLAIMER.en.length).toBeGreaterThan(0);
    const disclaimer =
      `${C2_REGISTER_SAFETY_GUARDS_DISCLAIMER.vi} ${C2_REGISTER_SAFETY_GUARDS_DISCLAIMER.en}`.toLowerCase();
    expect(disclaimer).toContain("gurmukhi");
    expect(disclaimer).toContain("native review is deferred");
    expect(disclaimer).toContain("not certification");
    expect(disclaimer).toContain("official placement");
    expect(disclaimer).toContain("shahmukhi");
    expect(disclaimer).toContain("awareness");
    expect(disclaimer).not.toContain("full shahmukhi course");
  });

  it("does not claim native review, certification, official placement, or legal authority", () => {
    const blob = JSON.stringify(registerSafetyGuardsC2).toLowerCase();
    expect(blob).not.toContain("native-reviewed");
    expect(blob).not.toContain("native-certified");
    expect(blob).not.toContain("certified by a native");
    expect(blob).not.toContain("official placement");
    expect(blob).not.toContain("legal advice");
  });
});

const _typecheck: PunjabiC2RegisterSafetyGuard[] = registerSafetyGuardsC2;
void _typecheck;
