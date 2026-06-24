import { describe, expect, it } from "vitest";

import {
  C2_ARCHIVE_SAMPLES_DISCLAIMER,
  c2ArchiveSamples,
  c2ArchiveSamplesByFocus,
  c2ArchiveSamplesByStyle,
  type PunjabiC2ArchiveContext,
  type PunjabiC2ArchiveFocus,
  type PunjabiC2ArchiveSample,
  type PunjabiC2ArchiveStyle,
} from "@/languages/punjabi/c2ArchiveSamples";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI_RANGE.test(s);

const REQUIRED_FOCUSES: PunjabiC2ArchiveFocus[] = [
  "nuanced_disagreement",
  "diplomacy",
  "mediation",
  "deescalation",
  "audience_adaptation",
  "sensitive_topic_framing",
  "public_communication_calibration",
  "register_safety",
];

const REQUIRED_CONTEXTS: PunjabiC2ArchiveContext[] = ["public", "professional", "community"];
const REQUIRED_STYLES: PunjabiC2ArchiveStyle[] = [
  "pre_archive",
  "archive_signoff",
  "seal_ready",
  "pre_integration",
];

describe("Punjabi C2 archive samples - coverage", () => {
  it("ships a compact app-consumable archive sample set", () => {
    expect(c2ArchiveSamples.length).toBeGreaterThanOrEqual(8);
    expect(c2ArchiveSamples.length).toBeLessThanOrEqual(12);
  });

  it("covers every required archive focus", () => {
    const seen = new Set(c2ArchiveSamples.map((item) => item.focus));
    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus), `missing focus ${focus}`).toBe(true);
      expect(c2ArchiveSamplesByFocus(focus).every((item) => item.focus === focus)).toBe(true);
    }
  });

  it("covers public, professional, and community contexts", () => {
    const seen = new Set(c2ArchiveSamples.map((item) => item.context));
    for (const context of REQUIRED_CONTEXTS) {
      expect(seen.has(context), `missing context ${context}`).toBe(true);
    }
  });

  it("covers pre-archive, signoff, seal, and pre-integration styles", () => {
    const seen = new Set(c2ArchiveSamples.map((item) => item.style));
    for (const style of REQUIRED_STYLES) {
      expect(seen.has(style), `missing style ${style}`).toBe(true);
      expect(c2ArchiveSamplesByStyle(style).every((item) => item.style === style)).toBe(true);
    }
  });

  it("has unique ids and focus/style filters", () => {
    const ids = c2ArchiveSamples.map((item) => item.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Punjabi C2 archive samples - bilingual integrity", () => {
  it("each item has VI+EN scenario, archive goal, and usable sample strings", () => {
    for (const item of c2ArchiveSamples) {
      expect(item.title_vi.length, `${item.id} title_vi`).toBeGreaterThan(0);
      expect(item.title_en.length, `${item.id} title_en`).toBeGreaterThan(0);
      expect(item.scenario_vi.length, `${item.id} scenario_vi`).toBeGreaterThan(0);
      expect(item.scenario_en.length, `${item.id} scenario_en`).toBeGreaterThan(0);
      expect(item.archive_goal_vi.length, `${item.id} goal_vi`).toBeGreaterThan(0);
      expect(item.archive_goal_en.length, `${item.id} goal_en`).toBeGreaterThan(0);
      expect(hasGurmukhi(item.sample_gurmukhi), `${item.id} sample_gurmukhi`).toBe(true);
      expect(item.sample_romanization.length, `${item.id} sample_romanization`).toBeGreaterThan(0);
      expect(item.sample_vi.length, `${item.id} sample_vi`).toBeGreaterThan(0);
      expect(item.sample_en.length, `${item.id} sample_en`).toBeGreaterThan(0);
    }
  });

  it("each archive phrase carries Gurmukhi, romanization, Vietnamese, and English", () => {
    for (const item of c2ArchiveSamples) {
      expect(item.archive_phrases.length, `${item.id} phrases`).toBeGreaterThanOrEqual(2);
      for (const phrase of item.archive_phrases) {
        expect(hasGurmukhi(phrase.gurmukhi), `${item.id} phrase Gurmukhi`).toBe(true);
        expect(phrase.romanization.length, `${item.id} phrase romanization`).toBeGreaterThan(0);
        expect(phrase.vi.length, `${item.id} phrase vi`).toBeGreaterThan(0);
        expect(phrase.en.length, `${item.id} phrase en`).toBeGreaterThan(0);
      }
    }
  });

  it("each sample carries checks, learner traps, and Canada-practical examples where useful", () => {
    const canadaSamples = c2ArchiveSamples.filter((item) => item.canada_practical);
    expect(canadaSamples.length).toBeGreaterThanOrEqual(2);

    for (const item of c2ArchiveSamples) {
      expect(item.checks.length, `${item.id} checks`).toBeGreaterThanOrEqual(1);
      for (const check of item.checks) {
        expect(check.check_vi.length, `${item.id} check_vi`).toBeGreaterThan(0);
        expect(check.check_en.length, `${item.id} check_en`).toBeGreaterThan(0);
        expect(check.signal_vi.length, `${item.id} signal_vi`).toBeGreaterThan(0);
        expect(check.signal_en.length, `${item.id} signal_en`).toBeGreaterThan(0);
      }

      expect(item.learner_trap, `${item.id} trap`).toBeTruthy();
      expect(item.learner_trap?.trap_vi.length ?? 0, `${item.id} trap_vi`).toBeGreaterThan(0);
      expect(item.learner_trap?.trap_en.length ?? 0, `${item.id} trap_en`).toBeGreaterThan(0);
      expect(item.learner_trap?.repair_vi.length ?? 0, `${item.id} repair_vi`).toBeGreaterThan(0);
      expect(item.learner_trap?.repair_en.length ?? 0, `${item.id} repair_en`).toBeGreaterThan(0);
    }
  });
});

describe("Punjabi C2 archive samples - scope framing", () => {
  it("states deferred native review and Shahmukhi awareness", () => {
    const blob = JSON.stringify({
      disclaimer: C2_ARCHIVE_SAMPLES_DISCLAIMER,
      samples: c2ArchiveSamples,
    }).toLowerCase();

    expect(blob).toContain("native review is deferred");
    expect(blob).toContain("shahmukhi");
    expect(blob).toContain("awareness");
    expect(blob).toContain("not certification");
    expect(blob).toContain("official placement");
    expect(blob).not.toContain("native-reviewed authority");
  });
});

const _typecheck: PunjabiC2ArchiveSample[] = c2ArchiveSamples;
void _typecheck;

