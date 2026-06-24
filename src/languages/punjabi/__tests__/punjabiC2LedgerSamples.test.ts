import { describe, expect, it } from "vitest";

import {
  C2_LEDGER_SAMPLES_DISCLAIMER,
  c2LedgerSamples,
  c2LedgerSamplesByFocus,
  c2LedgerSamplesByStyle,
  type PunjabiC2LedgerContext,
  type PunjabiC2LedgerFocus,
  type PunjabiC2LedgerSample,
  type PunjabiC2LedgerStyle,
} from "@/languages/punjabi/c2LedgerSamples";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI_RANGE.test(s);

const REQUIRED_FOCUSES: PunjabiC2LedgerFocus[] = [
  "nuanced_disagreement",
  "diplomacy",
  "mediation",
  "deescalation",
  "audience_adaptation",
  "sensitive_topic_framing",
  "public_communication_calibration",
  "register_safety",
];

const REQUIRED_CONTEXTS: PunjabiC2LedgerContext[] = ["public", "professional", "community"];
const REQUIRED_STYLES: PunjabiC2LedgerStyle[] = [
  "pre_a11_ledger",
  "archive",
  "signoff",
  "pre_integration",
];

describe("Punjabi C2 ledger samples - coverage", () => {
  it("ships a compact app-consumable ledger sample set", () => {
    expect(c2LedgerSamples.length).toBeGreaterThanOrEqual(8);
    expect(c2LedgerSamples.length).toBeLessThanOrEqual(12);
  });

  it("covers every required ledger focus", () => {
    const seen = new Set(c2LedgerSamples.map((item) => item.focus));
    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus), `missing focus ${focus}`).toBe(true);
      expect(c2LedgerSamplesByFocus(focus).every((item) => item.focus === focus)).toBe(true);
    }
  });

  it("covers public, professional, and community contexts", () => {
    const seen = new Set(c2LedgerSamples.map((item) => item.context));
    for (const context of REQUIRED_CONTEXTS) {
      expect(seen.has(context), `missing context ${context}`).toBe(true);
    }
  });

  it("covers pre-A11 ledger, archive, signoff, and pre-integration styles", () => {
    const seen = new Set(c2LedgerSamples.map((item) => item.style));
    for (const style of REQUIRED_STYLES) {
      expect(seen.has(style), `missing style ${style}`).toBe(true);
      expect(c2LedgerSamplesByStyle(style).every((item) => item.style === style)).toBe(true);
    }
  });

  it("has unique ids and stable filters", () => {
    const ids = c2LedgerSamples.map((item) => item.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Punjabi C2 ledger samples - bilingual integrity", () => {
  it("each item has VI+EN scenario, ledger goal, and usable sample strings", () => {
    for (const item of c2LedgerSamples) {
      expect(item.title_vi.length, `${item.id} title_vi`).toBeGreaterThan(0);
      expect(item.title_en.length, `${item.id} title_en`).toBeGreaterThan(0);
      expect(item.scenario_vi.length, `${item.id} scenario_vi`).toBeGreaterThan(0);
      expect(item.scenario_en.length, `${item.id} scenario_en`).toBeGreaterThan(0);
      expect(item.ledger_goal_vi.length, `${item.id} goal_vi`).toBeGreaterThan(0);
      expect(item.ledger_goal_en.length, `${item.id} goal_en`).toBeGreaterThan(0);
      expect(hasGurmukhi(item.sample_gurmukhi), `${item.id} sample_gurmukhi`).toBe(true);
      expect(item.sample_romanization.length, `${item.id} sample_romanization`).toBeGreaterThan(0);
      expect(item.sample_vi.length, `${item.id} sample_vi`).toBeGreaterThan(0);
      expect(item.sample_en.length, `${item.id} sample_en`).toBeGreaterThan(0);
    }
  });

  it("each ledger phrase carries Gurmukhi, romanization, Vietnamese, and English", () => {
    for (const item of c2LedgerSamples) {
      expect(item.ledger_phrases.length, `${item.id} phrases`).toBeGreaterThanOrEqual(2);
      for (const phrase of item.ledger_phrases) {
        expect(hasGurmukhi(phrase.gurmukhi), `${item.id} phrase Gurmukhi`).toBe(true);
        expect(phrase.romanization.length, `${item.id} phrase romanization`).toBeGreaterThan(0);
        expect(phrase.vi.length, `${item.id} phrase vi`).toBeGreaterThan(0);
        expect(phrase.en.length, `${item.id} phrase en`).toBeGreaterThan(0);
      }
    }
  });

  it("each sample carries learner traps and Canada-practical examples where useful", () => {
    const canadaSamples = c2LedgerSamples.filter((item) => item.canada_practical);
    expect(canadaSamples.length).toBeGreaterThanOrEqual(3);

    for (const item of c2LedgerSamples) {
      expect(item.learner_trap.trap_vi.length, `${item.id} trap_vi`).toBeGreaterThan(0);
      expect(item.learner_trap.trap_en.length, `${item.id} trap_en`).toBeGreaterThan(0);
      expect(item.learner_trap.repair_vi.length, `${item.id} repair_vi`).toBeGreaterThan(0);
      expect(item.learner_trap.repair_en.length, `${item.id} repair_en`).toBeGreaterThan(0);
    }
  });
});

describe("Punjabi C2 ledger samples - scope framing", () => {
  it("states deferred native review and Shahmukhi awareness", () => {
    const blob = JSON.stringify({
      disclaimer: C2_LEDGER_SAMPLES_DISCLAIMER,
      samples: c2LedgerSamples,
    }).toLowerCase();

    expect(blob).toContain("native review is deferred");
    expect(blob).toContain("shahmukhi");
    expect(blob).toContain("awareness");
    expect(blob).toContain("not certification");
    expect(blob).toContain("official placement");
    expect(blob).not.toContain("native-reviewed authority");
  });

  it("keeps forbidden integration and scoring concepts out", () => {
    const blob = JSON.stringify(c2LedgerSamples);
    expect(blob).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
  });
});

const _typecheck: PunjabiC2LedgerSample[] = c2LedgerSamples;
void _typecheck;
