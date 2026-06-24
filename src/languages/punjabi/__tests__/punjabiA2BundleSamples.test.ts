// src/languages/punjabi/__tests__/punjabiA2BundleSamples.test.ts
//
// Structural guards for Punjabi A2 bundle samples. This is Wave 57 only,
// not A11 integration. Native review is deferred.

import { describe, expect, it } from "vitest";

import { a2BundleSamples } from "@/languages/punjabi/a2BundleSamples";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI.test(s);
const nonEmpty = (s: unknown): s is string => typeof s === "string" && s.trim().length > 0;

const REQUIRED_SCENARIOS = [
  "daily_routines",
  "appointments",
  "transport",
  "housing",
  "school",
  "childcare",
  "workplace_small_talk",
  "forms",
  "short_messages",
  "service_flow",
  "polite_problem_descriptions",
  "interaction_repair",
] as const;

const STYLES = [
  "pre_a11_bundle",
  "receipt_bundle",
  "ledger_bundle",
  "archive_bundle",
  "pre_integration_bundle",
  "service_bundle",
  "readiness_bundle",
] as const;

describe("Punjabi A2 bundle samples - batch shape", () => {
  it("ships compact bundle samples for all required scenarios", () => {
    expect(a2BundleSamples.length).toBeGreaterThanOrEqual(12);
    expect(a2BundleSamples.length).toBeLessThanOrEqual(14);

    const present = new Set(a2BundleSamples.map((item) => item.scenario));
    for (const scenario of REQUIRED_SCENARIOS) expect(present.has(scenario)).toBe(true);
  });

  it("has unique ids and valid scenarios/styles", () => {
    const ids = a2BundleSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const item of a2BundleSamples) {
      expect(item.id).toMatch(/^pa_a2_bundle_/);
      expect(REQUIRED_SCENARIOS.includes(item.scenario)).toBe(true);
      expect(STYLES.includes(item.style)).toBe(true);
    }
  });
});

describe("Punjabi A2 bundle samples - learner contract", () => {
  it("uses Gurmukhi lines with romanization and bilingual meaning", () => {
    for (const item of a2BundleSamples) {
      expect(nonEmpty(item.title_vi)).toBe(true);
      expect(nonEmpty(item.title_en)).toBe(true);
      expect(nonEmpty(item.bundle_goal_vi)).toBe(true);
      expect(nonEmpty(item.bundle_goal_en)).toBe(true);
      expect(nonEmpty(item.stable_signal_vi)).toBe(true);
      expect(nonEmpty(item.stable_signal_en)).toBe(true);
      expect(nonEmpty(item.bundle_note_vi)).toBe(true);
      expect(nonEmpty(item.bundle_note_en)).toBe(true);
      expect(nonEmpty(item.receipt_reference_vi)).toBe(true);
      expect(nonEmpty(item.receipt_reference_en)).toBe(true);
      expect(item.lines.length).toBeGreaterThanOrEqual(2);

      for (const line of item.lines) {
        expect(hasGurmukhi(line.pa)).toBe(true);
        expect(nonEmpty(line.romanization)).toBe(true);
        expect(nonEmpty(line.vi)).toBe(true);
        expect(nonEmpty(line.en)).toBe(true);
      }
    }
  });

  it("includes checks and common learner traps", () => {
    for (const item of a2BundleSamples) {
      expect(item.checks.length).toBeGreaterThanOrEqual(2);
      for (const check of item.checks) {
        expect(nonEmpty(check.q_vi)).toBe(true);
        expect(nonEmpty(check.q_en)).toBe(true);
        expect(hasGurmukhi(check.answer_pa)).toBe(true);
        expect(nonEmpty(check.answer_romanization)).toBe(true);
        expect(nonEmpty(check.answer_vi)).toBe(true);
        expect(nonEmpty(check.answer_en)).toBe(true);
      }

      expect(item.traps.length).toBeGreaterThanOrEqual(1);
      for (const trap of item.traps) {
        expect(nonEmpty(trap.trap_vi)).toBe(true);
        expect(nonEmpty(trap.trap_en)).toBe(true);
        expect(hasGurmukhi(trap.fix_pa)).toBe(true);
        expect(nonEmpty(trap.fix_romanization)).toBe(true);
      }
    }
  });

  it("keeps Shahmukhi as awareness only and includes Canada-practical coverage", () => {
    for (const item of a2BundleSamples) {
      expect(item.script_awareness_vi).toContain("Shahmukhi");
      expect(item.script_awareness_en).toContain("Shahmukhi");
      expect(item.script_awareness_en.toLowerCase()).toContain("not as a separate course");
    }

    const canadaItems = a2BundleSamples.filter((item) => item.canada_practical_vi || item.canada_practical_en);
    expect(canadaItems.length).toBeGreaterThanOrEqual(10);
    for (const item of canadaItems) {
      expect(nonEmpty(item.canada_practical_vi)).toBe(true);
      expect(nonEmpty(item.canada_practical_en)).toBe(true);
    }
  });

  it("covers pre-A11 bundle, receipt, ledger, archive, pre-integration, service, and readiness styles", () => {
    const styles = new Set(a2BundleSamples.map((item) => item.style));
    expect(styles.has("pre_a11_bundle")).toBe(true);
    expect(styles.has("receipt_bundle")).toBe(true);
    expect(styles.has("ledger_bundle")).toBe(true);
    expect(styles.has("archive_bundle")).toBe(true);
    expect(styles.has("pre_integration_bundle")).toBe(true);
    expect(styles.has("service_bundle")).toBe(true);
    expect(styles.has("readiness_bundle")).toBe(true);
  });

  it("records pre-A11 bundle metadata without native-review claims", () => {
    for (const item of a2BundleSamples) {
      expect(item.bundle_goal_en.toLowerCase()).toContain("before a11");
      expect(item.bundle_note_en.toLowerCase()).toContain("bundle");
      expect(item.receipt_reference_en.toLowerCase()).toContain("receipt");
      expect(item.bundle_goal_en.toLowerCase()).not.toContain("native reviewed");
      expect(item.bundle_goal_vi.toLowerCase()).not.toContain("native reviewed");
    }
  });
});
