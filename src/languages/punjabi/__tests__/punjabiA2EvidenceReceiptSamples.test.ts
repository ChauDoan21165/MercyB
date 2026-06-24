// src/languages/punjabi/__tests__/punjabiA2EvidenceReceiptSamples.test.ts
//
// Structural guards for Punjabi A2 evidence-receipt samples. This is Wave 61
// only, not A11 integration. Native review is deferred.

import { describe, expect, it } from "vitest";

import { a2EvidenceReceiptSamples } from "@/languages/punjabi/a2EvidenceReceiptSamples";

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
  "pre_a11_evidence_receipt",
  "completion_record_receipt",
  "inventory_seal_receipt",
  "catalog_receipt",
  "bundle_receipt",
  "pre_integration_receipt",
  "readiness_receipt",
] as const;

describe("Punjabi A2 evidence-receipt samples - batch shape", () => {
  it("ships compact evidence-receipt samples for all required scenarios", () => {
    expect(a2EvidenceReceiptSamples.length).toBeGreaterThanOrEqual(12);
    expect(a2EvidenceReceiptSamples.length).toBeLessThanOrEqual(14);

    const present = new Set(a2EvidenceReceiptSamples.map((item) => item.scenario));
    for (const scenario of REQUIRED_SCENARIOS) expect(present.has(scenario)).toBe(true);
  });

  it("has unique ids and valid scenarios/styles", () => {
    const ids = a2EvidenceReceiptSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const item of a2EvidenceReceiptSamples) {
      expect(item.id).toMatch(/^pa_a2_evidence_receipt_/);
      expect(REQUIRED_SCENARIOS.includes(item.scenario)).toBe(true);
      expect(STYLES.includes(item.style)).toBe(true);
    }
  });
});

describe("Punjabi A2 evidence-receipt samples - learner contract", () => {
  it("uses Gurmukhi lines with romanization and bilingual meaning", () => {
    for (const item of a2EvidenceReceiptSamples) {
      expect(nonEmpty(item.title_vi)).toBe(true);
      expect(nonEmpty(item.title_en)).toBe(true);
      expect(nonEmpty(item.evidence_receipt_goal_vi)).toBe(true);
      expect(nonEmpty(item.evidence_receipt_goal_en)).toBe(true);
      expect(nonEmpty(item.stable_signal_vi)).toBe(true);
      expect(nonEmpty(item.stable_signal_en)).toBe(true);
      expect(nonEmpty(item.evidence_note_vi)).toBe(true);
      expect(nonEmpty(item.evidence_note_en)).toBe(true);
      expect(nonEmpty(item.completion_record_reference_vi)).toBe(true);
      expect(nonEmpty(item.completion_record_reference_en)).toBe(true);
      expect(nonEmpty(item.inventory_seal_reference_vi)).toBe(true);
      expect(nonEmpty(item.inventory_seal_reference_en)).toBe(true);
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
    for (const item of a2EvidenceReceiptSamples) {
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
    for (const item of a2EvidenceReceiptSamples) {
      expect(item.script_awareness_vi).toContain("Shahmukhi");
      expect(item.script_awareness_en).toContain("Shahmukhi");
      expect(item.script_awareness_en.toLowerCase()).toContain("not as a separate course");
    }

    const canadaItems = a2EvidenceReceiptSamples.filter((item) => item.canada_practical_vi || item.canada_practical_en);
    expect(canadaItems.length).toBeGreaterThanOrEqual(10);
    for (const item of canadaItems) {
      expect(nonEmpty(item.canada_practical_vi)).toBe(true);
      expect(nonEmpty(item.canada_practical_en)).toBe(true);
    }
  });

  it("covers pre-A11 evidence receipt, completion record, inventory seal, catalog, bundle, pre-integration, and readiness styles", () => {
    const styles = new Set(a2EvidenceReceiptSamples.map((item) => item.style));
    expect(styles.has("pre_a11_evidence_receipt")).toBe(true);
    expect(styles.has("completion_record_receipt")).toBe(true);
    expect(styles.has("inventory_seal_receipt")).toBe(true);
    expect(styles.has("catalog_receipt")).toBe(true);
    expect(styles.has("bundle_receipt")).toBe(true);
    expect(styles.has("pre_integration_receipt")).toBe(true);
    expect(styles.has("readiness_receipt")).toBe(true);
  });

  it("records pre-A11 evidence metadata without native-review claims", () => {
    for (const item of a2EvidenceReceiptSamples) {
      expect(item.evidence_receipt_goal_en.toLowerCase()).toContain("before a11");
      expect(item.evidence_note_en.toLowerCase()).toContain("evidence receipt");
      expect(item.completion_record_reference_en.toLowerCase()).toContain("completion record");
      expect(item.inventory_seal_reference_en.toLowerCase()).toContain("inventory seal");
      expect(item.evidence_receipt_goal_en.toLowerCase()).not.toContain("native reviewed");
      expect(item.evidence_receipt_goal_vi.toLowerCase()).not.toContain("native reviewed");
    }
  });
});
