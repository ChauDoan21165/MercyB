// Punjabi C2 readiness gate guards. These validate app-consumable structure and
// scope, not certification, placement authority, or native-level review.

import { describe, expect, it } from "vitest";

import {
  C2_READINESS_GATE_DISCLAIMER,
  readinessGateC2ByFocus,
  readinessGateC2Items,
  type PunjabiC2ReadinessFocus,
  type PunjabiC2ReadinessGateItem,
} from "@/languages/punjabi/readinessGateC2";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI_RANGE.test(s);

const REQUIRED_FOCUSES: PunjabiC2ReadinessFocus[] = [
  "nuanced_discourse",
  "negotiation",
  "deescalation",
  "sensitive_topic_framing",
  "advanced_register",
  "community_communication",
  "professional_communication",
  "public_communication",
];

describe("Punjabi C2 readiness gate — coverage", () => {
  it("ships a compact app-consumable readiness gate", () => {
    expect(readinessGateC2Items.length).toBeGreaterThanOrEqual(8);
    expect(readinessGateC2Items.length).toBeLessThanOrEqual(14);
  });

  it("covers every required readiness focus", () => {
    const seen = new Set(readinessGateC2Items.map((item) => item.focus));
    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("has unique non-empty ids", () => {
    const ids = readinessGateC2Items.map((item) => item.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("readinessGateC2ByFocus returns only matching items", () => {
    for (const focus of REQUIRED_FOCUSES) {
      const subset = readinessGateC2ByFocus(focus);
      expect(subset.length, focus).toBeGreaterThan(0);
      expect(subset.every((item) => item.focus === focus), focus).toBe(true);
    }
  });
});

describe("Punjabi C2 readiness gate — bilingual integrity", () => {
  it("each item has VI+EN scenario and prompt text", () => {
    for (const item of readinessGateC2Items) {
      expect(item.title_vi.length, `${item.id} title_vi`).toBeGreaterThan(0);
      expect(item.title_en.length, `${item.id} title_en`).toBeGreaterThan(0);
      expect(item.scenario_vi.length, `${item.id} scenario_vi`).toBeGreaterThan(0);
      expect(item.scenario_en.length, `${item.id} scenario_en`).toBeGreaterThan(0);
      expect(item.prompt_vi.length, `${item.id} prompt_vi`).toBeGreaterThan(0);
      expect(item.prompt_en.length, `${item.id} prompt_en`).toBeGreaterThan(0);
    }
  });

  it("each model has Gurmukhi, romanization, Vietnamese, and English", () => {
    for (const item of readinessGateC2Items) {
      expect(hasGurmukhi(item.model_gurmukhi), `${item.id} model_gurmukhi`).toBe(true);
      expect(item.model_romanization.length, `${item.id} model_romanization`).toBeGreaterThan(0);
      expect(item.model_vi.length, `${item.id} model_vi`).toBeGreaterThan(0);
      expect(item.model_en.length, `${item.id} model_en`).toBeGreaterThan(0);
    }
  });

  it("each target phrase has Gurmukhi, romanization, VI, and EN", () => {
    for (const item of readinessGateC2Items) {
      expect(item.target_phrases.length, `${item.id} phrases`).toBeGreaterThanOrEqual(2);
      for (const phrase of item.target_phrases) {
        expect(hasGurmukhi(phrase.gurmukhi), `${item.id} phrase Gurmukhi`).toBe(true);
        expect(phrase.romanization.length, `${item.id} phrase romanization`).toBeGreaterThan(0);
        expect(phrase.vi.length, `${item.id} phrase vi`).toBeGreaterThan(0);
        expect(phrase.en.length, `${item.id} phrase en`).toBeGreaterThan(0);
      }
    }
  });

  it("includes checkpoint and routing style items", () => {
    for (const item of readinessGateC2Items) {
      expect(item.checkpoints.length, `${item.id} checkpoints`).toBeGreaterThanOrEqual(1);
      expect(item.routing.if_missing_vi.length, `${item.id} route vi condition`).toBeGreaterThan(0);
      expect(item.routing.if_missing_en.length, `${item.id} route en condition`).toBeGreaterThan(0);
      expect(item.routing.route_vi.length, `${item.id} route vi`).toBeGreaterThan(0);
      expect(item.routing.route_en.length, `${item.id} route en`).toBeGreaterThan(0);
    }
    const outcomes = new Set(readinessGateC2Items.map((item) => item.routing.outcome));
    expect(outcomes.has("route_to_practice")).toBe(true);
    expect(outcomes.has("review")).toBe(true);
  });

  it("includes common learner traps and Canada-practical examples where useful", () => {
    expect(readinessGateC2Items.filter((item) => item.learner_trap).length).toBeGreaterThanOrEqual(5);
    const canadaItems = readinessGateC2Items.filter((item) => item.canada_practical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(2);
    expect(JSON.stringify(canadaItems).toLowerCase()).toContain("canada");
  });
});

describe("Punjabi C2 readiness gate — scope framing", () => {
  it("exposes certification-free, deferred-review, Shahmukhi-awareness disclaimer", () => {
    expect(C2_READINESS_GATE_DISCLAIMER.vi.length).toBeGreaterThan(0);
    expect(C2_READINESS_GATE_DISCLAIMER.en.length).toBeGreaterThan(0);
    const disclaimer =
      `${C2_READINESS_GATE_DISCLAIMER.vi} ${C2_READINESS_GATE_DISCLAIMER.en}`.toLowerCase();
    expect(disclaimer).toContain("gurmukhi");
    expect(disclaimer).toContain("native review is deferred");
    expect(disclaimer).toContain("not certification");
    expect(disclaimer).toContain("shahmukhi");
    expect(disclaimer).toContain("awareness");
    expect(disclaimer).not.toContain("full shahmukhi course");
  });

  it("does not claim native review, certification, or official placement in item text", () => {
    const blob = JSON.stringify(readinessGateC2Items).toLowerCase();
    expect(blob).not.toContain("native-reviewed");
    expect(blob).not.toContain("native-certified");
    expect(blob).not.toContain("certified by a native");
    expect(blob).not.toContain("official placement");
  });
});

const _typecheck: PunjabiC2ReadinessGateItem[] = readinessGateC2Items;
void _typecheck;
