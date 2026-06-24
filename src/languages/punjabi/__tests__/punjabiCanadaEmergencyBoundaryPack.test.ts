import { describe, expect, it } from "vitest";

import emergencyBoundaryPack, {
  PUNJABI_CANADA_EMERGENCY_BOUNDARY_DOMAINS,
  PUNJABI_CANADA_EMERGENCY_BOUNDARY_PACK,
  PUNJABI_CANADA_EMERGENCY_BOUNDARY_SCOPE,
  type PunjabiCanadaEmergencyBoundaryDomain,
} from "@/languages/punjabi/canadaEmergencyBoundaryPack";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const REQUIRED_DOMAINS: PunjabiCanadaEmergencyBoundaryDomain[] = [
  "interpreter_request",
  "urgent_vs_non_urgent",
  "immediate_need",
  "workplace_injury",
  "housing_emergency",
  "clinic_boundary",
  "pharmacy_boundary",
  "call_911_boundary",
  "safety_disclaimer",
  "review_remediation",
];

describe("Punjabi Canada emergency boundary pack", () => {
  it("exports compact app-consumable TypeScript data", () => {
    expect(emergencyBoundaryPack).toBe(PUNJABI_CANADA_EMERGENCY_BOUNDARY_PACK);
    expect(PUNJABI_CANADA_EMERGENCY_BOUNDARY_PACK.length).toBeGreaterThanOrEqual(REQUIRED_DOMAINS.length);
    expect(PUNJABI_CANADA_EMERGENCY_BOUNDARY_PACK.length).toBeLessThanOrEqual(12);
    expect(PUNJABI_CANADA_EMERGENCY_BOUNDARY_SCOPE.name).toContain("Emergency Boundary");
  });

  it("declares script policy, scope, and deferred review without overclaiming", () => {
    const scope = `${PUNJABI_CANADA_EMERGENCY_BOUNDARY_SCOPE.scriptPolicy} ${PUNJABI_CANADA_EMERGENCY_BOUNDARY_SCOPE.reviewStatus} ${PUNJABI_CANADA_EMERGENCY_BOUNDARY_SCOPE.safetyBoundary}`.toLowerCase();

    expect(scope).toContain("gurmukhi is primary");
    expect(scope).toContain("shahmukhi is awareness only");
    expect(scope).toContain("not a full course");
    expect(scope).toContain("native review is deferred");
    expect(scope).toContain("not legal advice");
    expect(scope).toContain("not medical advice");
  });

  it("covers required Canada emergency-boundary domains", () => {
    expect(new Set(PUNJABI_CANADA_EMERGENCY_BOUNDARY_DOMAINS)).toEqual(new Set(REQUIRED_DOMAINS));

    const present = new Set(PUNJABI_CANADA_EMERGENCY_BOUNDARY_PACK.map((item) => item.domain));
    for (const domain of REQUIRED_DOMAINS) {
      expect(present.has(domain), `missing domain: ${domain}`).toBe(true);
    }
  });

  it("keeps stable ids, levels, Gurmukhi primary text, and Shahmukhi awareness only", () => {
    const ids = PUNJABI_CANADA_EMERGENCY_BOUNDARY_PACK.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => id.startsWith("pa-ca-emergency-boundary-"))).toBe(true);

    const levels = new Set(PUNJABI_CANADA_EMERGENCY_BOUNDARY_PACK.map((item) => item.level));
    expect(levels.has("first_words")).toBe(true);
    expect(levels.has("clarify")).toBe(true);
    expect(levels.has("handoff")).toBe(true);
    expect(levels.has("boundary")).toBe(true);

    for (const item of PUNJABI_CANADA_EMERGENCY_BOUNDARY_PACK) {
      expect(item.phrase_pa).toMatch(GURMUKHI);
      expect(item.phrase_pa).not.toMatch(SHAHMUKHI);
      expect(item.support_pa.length).toBeGreaterThanOrEqual(2);
      for (const line of item.support_pa) {
        expect(line).toMatch(GURMUKHI);
        expect(line).not.toMatch(SHAHMUKHI);
      }
    }
  });

  it("includes romanization plus Vietnamese and English emergency-boundary explanations", () => {
    for (const item of PUNJABI_CANADA_EMERGENCY_BOUNDARY_PACK) {
      expect(item.romanization.length).toBeGreaterThan(8);
      expect(item.meaning_vi.length).toBeGreaterThan(12);
      expect(item.meaning_en.length).toBeGreaterThan(12);
      expect(item.canada_context_vi).toMatch(/Canada|Ở Canada|Dùng/u);
      expect(item.canada_context_en).toMatch(/Canada|In Canada|Use/u);
      expect(item.boundary_vi.length).toBeGreaterThan(30);
      expect(item.boundary_en.length).toBeGreaterThan(30);
      expect(item.next_step_vi.length).toBeGreaterThan(25);
      expect(item.next_step_en.length).toBeGreaterThan(25);
    }
  });

  it("includes practical Canada examples, traps, review, remediation, and handoffs", () => {
    const allText = JSON.stringify(PUNJABI_CANADA_EMERGENCY_BOUNDARY_PACK).toLowerCase();
    for (const term of [
      "interpreter",
      "urgent",
      "non-urgent",
      "clinic",
      "pharmacy",
      "workplace",
      "housing",
      "911",
      "emergency",
      "handoff",
      "review",
      "remediation",
    ]) {
      expect(allText).toContain(term);
    }

    const traps = PUNJABI_CANADA_EMERGENCY_BOUNDARY_PACK.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(8);
  });

  it("keeps restricted integration and scoring concepts out of the data", () => {
    const allText = JSON.stringify(PUNJABI_CANADA_EMERGENCY_BOUNDARY_PACK);
    expect(allText).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
    expect(allText).not.toMatch(/native reviewed|reviewed by native|native-approved|full Shahmukhi course|Shahmukhi lesson/i);
  });
});
