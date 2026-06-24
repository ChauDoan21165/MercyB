import { describe, expect, it } from "vitest";

import {
  C2_AUDIT_TRAIL_SAMPLES_DISCLAIMER,
  c2AuditTrailSamples,
  c2AuditTrailSamplesByFocus,
  c2AuditTrailSamplesByStyle,
  type PunjabiC2AuditTrailContext,
  type PunjabiC2AuditTrailFocus,
  type PunjabiC2AuditTrailSample,
  type PunjabiC2AuditTrailStyle,
} from "@/languages/punjabi/c2AuditTrailSamples";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI_RANGE.test(s);

const REQUIRED_FOCUSES: PunjabiC2AuditTrailFocus[] = [
  "nuanced_disagreement",
  "diplomacy",
  "mediation",
  "deescalation",
  "audience_adaptation",
  "sensitive_topic_framing",
  "public_communication_calibration",
  "register_safety",
];

const REQUIRED_CONTEXTS: PunjabiC2AuditTrailContext[] = ["public", "professional", "community"];
const REQUIRED_STYLES: PunjabiC2AuditTrailStyle[] = [
  "pre_a11_audit_trail",
  "traceability_audit",
  "evidence_receipt_audit",
  "pre_integration",
];

describe("Punjabi C2 audit trail samples - coverage", () => {
  it("ships a compact app-consumable audit trail sample set", () => {
    expect(c2AuditTrailSamples.length).toBeGreaterThanOrEqual(8);
    expect(c2AuditTrailSamples.length).toBeLessThanOrEqual(12);
  });

  it("covers every required audit trail focus", () => {
    const seen = new Set(c2AuditTrailSamples.map((item) => item.focus));
    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus), `missing focus ${focus}`).toBe(true);
      expect(c2AuditTrailSamplesByFocus(focus).every((item) => item.focus === focus)).toBe(true);
    }
  });

  it("covers public, professional, and community contexts", () => {
    const seen = new Set(c2AuditTrailSamples.map((item) => item.context));
    for (const context of REQUIRED_CONTEXTS) {
      expect(seen.has(context), `missing context ${context}`).toBe(true);
    }
  });

  it("covers pre-A11 audit trail, traceability audit, evidence receipt audit, and pre-integration styles", () => {
    const seen = new Set(c2AuditTrailSamples.map((item) => item.style));
    for (const style of REQUIRED_STYLES) {
      expect(seen.has(style), `missing style ${style}`).toBe(true);
      expect(c2AuditTrailSamplesByStyle(style).every((item) => item.style === style)).toBe(true);
    }
  });

  it("has unique ids and stable filters", () => {
    const ids = c2AuditTrailSamples.map((item) => item.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Punjabi C2 audit trail samples - bilingual integrity", () => {
  it("each item has VI+EN scenario, audit trail goal, and usable sample strings", () => {
    for (const item of c2AuditTrailSamples) {
      expect(item.title_vi.length, `${item.id} title_vi`).toBeGreaterThan(0);
      expect(item.title_en.length, `${item.id} title_en`).toBeGreaterThan(0);
      expect(item.scenario_vi.length, `${item.id} scenario_vi`).toBeGreaterThan(0);
      expect(item.scenario_en.length, `${item.id} scenario_en`).toBeGreaterThan(0);
      expect(item.audit_trail_goal_vi.length, `${item.id} goal_vi`).toBeGreaterThan(0);
      expect(item.audit_trail_goal_en.length, `${item.id} goal_en`).toBeGreaterThan(0);
      expect(hasGurmukhi(item.sample_gurmukhi), `${item.id} sample_gurmukhi`).toBe(true);
      expect(item.sample_romanization.length, `${item.id} sample_romanization`).toBeGreaterThan(0);
      expect(item.sample_vi.length, `${item.id} sample_vi`).toBeGreaterThan(0);
      expect(item.sample_en.length, `${item.id} sample_en`).toBeGreaterThan(0);
    }
  });

  it("each audit trail phrase carries Gurmukhi, romanization, Vietnamese, and English", () => {
    for (const item of c2AuditTrailSamples) {
      expect(item.audit_trail_phrases.length, `${item.id} phrases`).toBeGreaterThanOrEqual(2);
      for (const phrase of item.audit_trail_phrases) {
        expect(hasGurmukhi(phrase.gurmukhi), `${item.id} phrase Gurmukhi`).toBe(true);
        expect(phrase.romanization.length, `${item.id} phrase romanization`).toBeGreaterThan(0);
        expect(phrase.vi.length, `${item.id} phrase vi`).toBeGreaterThan(0);
        expect(phrase.en.length, `${item.id} phrase en`).toBeGreaterThan(0);
      }
    }
  });

  it("each sample carries checks, learner traps, and Canada-practical examples where useful", () => {
    const canadaSamples = c2AuditTrailSamples.filter((item) => item.canada_practical);
    expect(canadaSamples.length).toBeGreaterThanOrEqual(3);

    for (const item of c2AuditTrailSamples) {
      expect(item.audit_trail_checks.length, `${item.id} checks`).toBeGreaterThanOrEqual(1);
      for (const check of item.audit_trail_checks) {
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

describe("Punjabi C2 audit trail samples - scope framing", () => {
  it("states deferred native review and Shahmukhi awareness", () => {
    const blob = JSON.stringify({
      disclaimer: C2_AUDIT_TRAIL_SAMPLES_DISCLAIMER,
      samples: c2AuditTrailSamples,
    }).toLowerCase();

    expect(blob).toContain("native review is deferred");
    expect(blob).toContain("shahmukhi");
    expect(blob).toContain("awareness");
    expect(blob).toContain("not certification");
    expect(blob).toContain("official placement");
    expect(blob).not.toContain("native-reviewed authority");
  });

  it("keeps forbidden integration and scoring concepts out", () => {
    const blob = JSON.stringify(c2AuditTrailSamples);
    expect(blob).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
  });
});

const _typecheck: PunjabiC2AuditTrailSample[] = c2AuditTrailSamples;
void _typecheck;
