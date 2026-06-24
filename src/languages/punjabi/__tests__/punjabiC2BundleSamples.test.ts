import { describe, expect, it } from "vitest";

import {
  C2_BUNDLE_SAMPLES_DISCLAIMER,
  c2BundleSamples,
  c2BundleSamplesByFocus,
  c2BundleSamplesByStyle,
  type PunjabiC2BundleContext,
  type PunjabiC2BundleFocus,
  type PunjabiC2BundleSample,
  type PunjabiC2BundleStyle,
} from "@/languages/punjabi/c2BundleSamples";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI_RANGE.test(s);

const REQUIRED_FOCUSES: PunjabiC2BundleFocus[] = [
  "nuanced_disagreement",
  "diplomacy",
  "mediation",
  "deescalation",
  "audience_adaptation",
  "sensitive_topic_framing",
  "public_communication_calibration",
  "register_safety",
];

const REQUIRED_CONTEXTS: PunjabiC2BundleContext[] = ["public", "professional", "community"];
const REQUIRED_STYLES: PunjabiC2BundleStyle[] = [
  "pre_a11_bundle",
  "receipt_bundle",
  "ledger_bundle",
  "pre_integration",
];

describe("Punjabi C2 bundle samples - coverage", () => {
  it("ships a compact app-consumable bundle sample set", () => {
    expect(c2BundleSamples.length).toBeGreaterThanOrEqual(8);
    expect(c2BundleSamples.length).toBeLessThanOrEqual(12);
  });

  it("covers every required bundle focus", () => {
    const seen = new Set(c2BundleSamples.map((item) => item.focus));
    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus), `missing focus ${focus}`).toBe(true);
      expect(c2BundleSamplesByFocus(focus).every((item) => item.focus === focus)).toBe(true);
    }
  });

  it("covers public, professional, and community contexts", () => {
    const seen = new Set(c2BundleSamples.map((item) => item.context));
    for (const context of REQUIRED_CONTEXTS) {
      expect(seen.has(context), `missing context ${context}`).toBe(true);
    }
  });

  it("covers pre-A11 bundle, receipt bundle, ledger bundle, and pre-integration styles", () => {
    const seen = new Set(c2BundleSamples.map((item) => item.style));
    for (const style of REQUIRED_STYLES) {
      expect(seen.has(style), `missing style ${style}`).toBe(true);
      expect(c2BundleSamplesByStyle(style).every((item) => item.style === style)).toBe(true);
    }
  });

  it("has unique ids and stable filters", () => {
    const ids = c2BundleSamples.map((item) => item.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Punjabi C2 bundle samples - bilingual integrity", () => {
  it("each item has VI+EN scenario, bundle goal, and usable sample strings", () => {
    for (const item of c2BundleSamples) {
      expect(item.title_vi.length, `${item.id} title_vi`).toBeGreaterThan(0);
      expect(item.title_en.length, `${item.id} title_en`).toBeGreaterThan(0);
      expect(item.scenario_vi.length, `${item.id} scenario_vi`).toBeGreaterThan(0);
      expect(item.scenario_en.length, `${item.id} scenario_en`).toBeGreaterThan(0);
      expect(item.bundle_goal_vi.length, `${item.id} goal_vi`).toBeGreaterThan(0);
      expect(item.bundle_goal_en.length, `${item.id} goal_en`).toBeGreaterThan(0);
      expect(hasGurmukhi(item.sample_gurmukhi), `${item.id} sample_gurmukhi`).toBe(true);
      expect(item.sample_romanization.length, `${item.id} sample_romanization`).toBeGreaterThan(0);
      expect(item.sample_vi.length, `${item.id} sample_vi`).toBeGreaterThan(0);
      expect(item.sample_en.length, `${item.id} sample_en`).toBeGreaterThan(0);
    }
  });

  it("each bundle phrase carries Gurmukhi, romanization, Vietnamese, and English", () => {
    for (const item of c2BundleSamples) {
      expect(item.bundle_phrases.length, `${item.id} phrases`).toBeGreaterThanOrEqual(2);
      for (const phrase of item.bundle_phrases) {
        expect(hasGurmukhi(phrase.gurmukhi), `${item.id} phrase Gurmukhi`).toBe(true);
        expect(phrase.romanization.length, `${item.id} phrase romanization`).toBeGreaterThan(0);
        expect(phrase.vi.length, `${item.id} phrase vi`).toBeGreaterThan(0);
        expect(phrase.en.length, `${item.id} phrase en`).toBeGreaterThan(0);
      }
    }
  });

  it("each sample carries checks, learner traps, and Canada-practical examples where useful", () => {
    const canadaSamples = c2BundleSamples.filter((item) => item.canada_practical);
    expect(canadaSamples.length).toBeGreaterThanOrEqual(3);

    for (const item of c2BundleSamples) {
      expect(item.bundle_checks.length, `${item.id} checks`).toBeGreaterThanOrEqual(1);
      for (const check of item.bundle_checks) {
        expect(check.check_vi.length, `${item.id} check_vi`).toBeGreaterThan(0);
        expect(check.check_en.length, `${item.id} check_en`).toBeGreaterThan(0);
        expect(check.signal_vi.length, `${item.id} signal_vi`).toBeGreaterThan(0);
        expect(check.signal_en.length, `${item.id} signal_en`).toBeGreaterThan(0);
      }

      expect(item.learner_trap.trap_vi.length, `${item.id} trap_vi`).toBeGreaterThan(0);
      expect(item.learner_trap.trap_en.length, `${item.id} trap_en`).toBeGreaterThan(0);
      expect(item.learner_trap.repair_vi.length, `${item.id} repair_vi`).toBeGreaterThan(0);
      expect(item.learner_trap.repair_en.length, `${item.id} repair_en`).toBeGreaterThan(0);
    }
  });
});

describe("Punjabi C2 bundle samples - scope framing", () => {
  it("states deferred native review and Shahmukhi awareness", () => {
    const blob = JSON.stringify({
      disclaimer: C2_BUNDLE_SAMPLES_DISCLAIMER,
      samples: c2BundleSamples,
    }).toLowerCase();

    expect(blob).toContain("native review is deferred");
    expect(blob).toContain("shahmukhi");
    expect(blob).toContain("awareness");
    expect(blob).toContain("not certification");
    expect(blob).toContain("official placement");
    expect(blob).not.toContain("native-reviewed authority");
  });

  it("keeps forbidden integration and scoring concepts out", () => {
    const blob = JSON.stringify(c2BundleSamples);
    expect(blob).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
  });
});

const _typecheck: PunjabiC2BundleSample[] = c2BundleSamples;
void _typecheck;
