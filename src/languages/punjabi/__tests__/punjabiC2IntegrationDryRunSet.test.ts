// Punjabi C2 integration dry run set guards. These validate app-consumable
// structure and scope, not certification, official placement, or native review.

import { describe, expect, it } from "vitest";

import {
  C2_INTEGRATION_DRY_RUN_SET_DISCLAIMER,
  c2IntegrationDryRunSet,
  c2IntegrationDryRunSetByFocus,
  type PunjabiC2DryRunFocus,
  type PunjabiC2IntegrationDryRunItem,
} from "@/languages/punjabi/c2IntegrationDryRunSet";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI_RANGE.test(s);

const REQUIRED_FOCUSES: PunjabiC2DryRunFocus[] = [
  "nuanced_disagreement",
  "audience_adaptation",
  "mediation",
  "deescalation",
  "advanced_register",
  "public_communication",
  "sensitive_topic_framing",
  "diplomacy",
  "community_discourse",
  "professional_discourse",
  "public_service",
];

describe("Punjabi C2 integration dry run set - coverage", () => {
  it("ships a compact app-consumable dry run set", () => {
    expect(c2IntegrationDryRunSet.length).toBeGreaterThanOrEqual(10);
    expect(c2IntegrationDryRunSet.length).toBeLessThanOrEqual(12);
  });

  it("covers every required dry-run focus", () => {
    const seen = new Set(c2IntegrationDryRunSet.map((item) => item.focus));
    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("has unique non-empty ids", () => {
    const ids = c2IntegrationDryRunSet.map((item) => item.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("c2IntegrationDryRunSetByFocus returns only matching items", () => {
    for (const focus of REQUIRED_FOCUSES) {
      const subset = c2IntegrationDryRunSetByFocus(focus);
      expect(subset.length, focus).toBeGreaterThan(0);
      expect(subset.every((item) => item.focus === focus), focus).toBe(true);
    }
  });
});

describe("Punjabi C2 integration dry run set - bilingual integrity", () => {
  it("each item has VI+EN scenario and dry-run goal", () => {
    for (const item of c2IntegrationDryRunSet) {
      expect(item.title_vi.length, `${item.id} title_vi`).toBeGreaterThan(0);
      expect(item.title_en.length, `${item.id} title_en`).toBeGreaterThan(0);
      expect(item.scenario_vi.length, `${item.id} scenario_vi`).toBeGreaterThan(0);
      expect(item.scenario_en.length, `${item.id} scenario_en`).toBeGreaterThan(0);
      expect(item.dry_run_goal_vi.length, `${item.id} goal_vi`).toBeGreaterThan(0);
      expect(item.dry_run_goal_en.length, `${item.id} goal_en`).toBeGreaterThan(0);
    }
  });

  it("each sample has Gurmukhi, romanization, Vietnamese, and English", () => {
    for (const item of c2IntegrationDryRunSet) {
      expect(hasGurmukhi(item.sample_gurmukhi), `${item.id} sample_gurmukhi`).toBe(true);
      expect(item.sample_romanization.length, `${item.id} sample_romanization`).toBeGreaterThan(0);
      expect(item.sample_vi.length, `${item.id} sample_vi`).toBeGreaterThan(0);
      expect(item.sample_en.length, `${item.id} sample_en`).toBeGreaterThan(0);
    }
  });

  it("each dry-run phrase has Gurmukhi, romanization, VI, and EN", () => {
    for (const item of c2IntegrationDryRunSet) {
      expect(item.dry_run_phrases.length, `${item.id} phrases`).toBeGreaterThanOrEqual(2);
      for (const phrase of item.dry_run_phrases) {
        expect(hasGurmukhi(phrase.gurmukhi), `${item.id} phrase Gurmukhi`).toBe(true);
        expect(phrase.romanization.length, `${item.id} phrase romanization`).toBeGreaterThan(0);
        expect(phrase.vi.length, `${item.id} phrase vi`).toBeGreaterThan(0);
        expect(phrase.en.length, `${item.id} phrase en`).toBeGreaterThan(0);
      }
    }
  });

  it("includes dry-run, pre-integration, final-readiness, and regression styles", () => {
    const styles = new Set(c2IntegrationDryRunSet.map((item) => item.style));
    expect(styles.has("dry_run")).toBe(true);
    expect(styles.has("pre_integration")).toBe(true);
    expect(styles.has("final_readiness")).toBe(true);
    expect(styles.has("regression")).toBe(true);
  });

  it("each item carries checks", () => {
    for (const item of c2IntegrationDryRunSet) {
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
    expect(c2IntegrationDryRunSet.filter((item) => item.learner_trap).length).toBeGreaterThanOrEqual(8);
    const canadaItems = c2IntegrationDryRunSet.filter((item) => item.canada_practical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(3);
    expect(JSON.stringify(canadaItems).toLowerCase()).toContain("canada");
  });
});

describe("Punjabi C2 integration dry run set - scope framing", () => {
  it("exposes study-support, deferred-review, Shahmukhi-awareness disclaimer", () => {
    expect(C2_INTEGRATION_DRY_RUN_SET_DISCLAIMER.vi.length).toBeGreaterThan(0);
    expect(C2_INTEGRATION_DRY_RUN_SET_DISCLAIMER.en.length).toBeGreaterThan(0);
    const disclaimer =
      `${C2_INTEGRATION_DRY_RUN_SET_DISCLAIMER.vi} ${C2_INTEGRATION_DRY_RUN_SET_DISCLAIMER.en}`.toLowerCase();
    expect(disclaimer).toContain("gurmukhi");
    expect(disclaimer).toContain("native review is deferred");
    expect(disclaimer).toContain("not certification");
    expect(disclaimer).toContain("official placement");
    expect(disclaimer).toContain("shahmukhi");
    expect(disclaimer).toContain("awareness");
    expect(disclaimer).not.toContain("full shahmukhi course");
  });

  it("does not claim native review, certification, official placement, or legal authority", () => {
    const blob = JSON.stringify(c2IntegrationDryRunSet).toLowerCase();
    expect(blob).not.toContain("native-reviewed");
    expect(blob).not.toContain("native-certified");
    expect(blob).not.toContain("certified by a native");
    expect(blob).not.toContain("official placement");
    expect(blob).not.toContain("legal advice");
  });
});

const _typecheck: PunjabiC2IntegrationDryRunItem[] = c2IntegrationDryRunSet;
void _typecheck;
