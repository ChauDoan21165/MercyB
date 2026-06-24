import { describe, expect, it } from "vitest";

import readinessGate, {
  PUNJABI_CANADA_SURVIVAL_READINESS_DOMAINS,
  PUNJABI_CANADA_SURVIVAL_READINESS_GATE,
  PUNJABI_CANADA_SURVIVAL_READINESS_GATE_SCOPE,
  type PunjabiCanadaSurvivalReadinessDomain,
} from "@/languages/punjabi/canadaSurvivalReadinessGate";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const REQUIRED_DOMAINS: PunjabiCanadaSurvivalReadinessDomain[] = [
  "clinic",
  "pharmacy",
  "school_childcare",
  "bank",
  "housing",
  "transport",
  "public_office",
  "interpreter_request",
  "emergency_boundary",
  "workplace_safety",
];

describe("Punjabi Canada survival readiness gate", () => {
  it("exports compact app-consumable TypeScript data", () => {
    expect(readinessGate).toBe(PUNJABI_CANADA_SURVIVAL_READINESS_GATE);
    expect(PUNJABI_CANADA_SURVIVAL_READINESS_GATE.length).toBeGreaterThanOrEqual(REQUIRED_DOMAINS.length);
    expect(PUNJABI_CANADA_SURVIVAL_READINESS_GATE.length).toBeLessThanOrEqual(14);
    expect(PUNJABI_CANADA_SURVIVAL_READINESS_GATE_SCOPE.name).toContain("Readiness Gate");
    expect(PUNJABI_CANADA_SURVIVAL_READINESS_GATE_SCOPE.readinessLabel).toBe("READY_FOR_A11_CONTENT_GATE");
  });

  it("declares scope, script policy, and deferred review without overclaiming", () => {
    const scope = `${PUNJABI_CANADA_SURVIVAL_READINESS_GATE_SCOPE.scriptPolicy} ${PUNJABI_CANADA_SURVIVAL_READINESS_GATE_SCOPE.reviewStatus} ${PUNJABI_CANADA_SURVIVAL_READINESS_GATE_SCOPE.boundary}`.toLowerCase();
    expect(scope).toContain("gurmukhi is primary");
    expect(scope).toContain("shahmukhi is awareness only");
    expect(scope).toContain("not a full course");
    expect(scope).toContain("native review is deferred");
    expect(scope).toContain("not a11 integration");
    expect(scope).toContain("not legal, medical, or financial advice");
  });

  it("covers the required Canada survival readiness domains", () => {
    expect(new Set(PUNJABI_CANADA_SURVIVAL_READINESS_DOMAINS)).toEqual(new Set(REQUIRED_DOMAINS));

    const present = new Set(PUNJABI_CANADA_SURVIVAL_READINESS_GATE.map((item) => item.domain));
    for (const domain of REQUIRED_DOMAINS) {
      expect(present.has(domain), `missing domain: ${domain}`).toBe(true);
    }
  });

  it("keeps stable ids, readiness routes, checkpoints, and Gurmukhi primary", () => {
    const ids = PUNJABI_CANADA_SURVIVAL_READINESS_GATE.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => id.startsWith("pa-ca-readiness-"))).toBe(true);

    const routes = new Set(PUNJABI_CANADA_SURVIVAL_READINESS_GATE.map((item) => item.route));
    expect(routes.has("ready")).toBe(true);
    expect(routes.has("review_before_live_use")).toBe(true);
    expect(routes.has("emergency_escalation")).toBe(true);

    for (const item of PUNJABI_CANADA_SURVIVAL_READINESS_GATE) {
      expect(item.checkpoint.length).toBeGreaterThan(4);
      expect(item.phrase_pa).toMatch(GURMUKHI);
      expect(item.phrase_pa).not.toMatch(SHAHMUKHI);
      expect(item.support_pa.length).toBeGreaterThanOrEqual(2);
      for (const line of item.support_pa) {
        expect(line).toMatch(GURMUKHI);
        expect(line).not.toMatch(SHAHMUKHI);
      }
    }
  });

  it("includes romanization plus Vietnamese and English readiness context", () => {
    for (const item of PUNJABI_CANADA_SURVIVAL_READINESS_GATE) {
      expect(item.romanization.length).toBeGreaterThan(4);
      expect(item.learner_can_do_vi.length).toBeGreaterThan(20);
      expect(item.learner_can_do_en.length).toBeGreaterThan(20);
      expect(item.meaning_vi.length).toBeGreaterThan(3);
      expect(item.meaning_en.length).toBeGreaterThan(3);
      expect(item.readiness_check_vi.length).toBeGreaterThan(20);
      expect(item.readiness_check_en.length).toBeGreaterThan(20);
      expect(item.canada_example_vi).toMatch(/Canada|Ở Canada|Dùng/u);
      expect(item.canada_example_en).toMatch(/Canada|Canadian|In Canada|Use/u);
    }
  });

  it("includes Canada-practical readiness coverage and learner traps", () => {
    const traps = PUNJABI_CANADA_SURVIVAL_READINESS_GATE.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(8);

    const allText = JSON.stringify(PUNJABI_CANADA_SURVIVAL_READINESS_GATE).toLowerCase();
    for (const term of [
      "clinic",
      "pharmacy",
      "school",
      "bank",
      "repair",
      "bus",
      "documents",
      "interpreter",
      "emergency",
      "workplace",
      "readiness",
      "checkpoint",
      "route",
    ]) {
      expect(allText).toContain(term);
    }
  });

  it("keeps forbidden integration and scoring concepts out of the data", () => {
    const allText = JSON.stringify(PUNJABI_CANADA_SURVIVAL_READINESS_GATE);
    expect(allText).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
    expect(allText).not.toMatch(/native reviewed|reviewed by native|native-approved|full Shahmukhi course|Shahmukhi lesson/i);
  });
});
