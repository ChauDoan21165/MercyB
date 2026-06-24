import { describe, expect, it } from "vitest";

import canadaSurvivalCapstone, {
  PUNJABI_CANADA_SURVIVAL_CAPSTONE,
  PUNJABI_CANADA_SURVIVAL_CAPSTONE_DOMAINS,
  PUNJABI_CANADA_SURVIVAL_CAPSTONE_SCOPE,
  type PunjabiCanadaSurvivalCapstoneDomain,
} from "@/languages/punjabi/canadaSurvivalCapstone";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const REQUIRED_DOMAINS: PunjabiCanadaSurvivalCapstoneDomain[] = [
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

describe("Punjabi Canada survival capstone", () => {
  it("exports compact app-consumable TypeScript data", () => {
    expect(canadaSurvivalCapstone).toBe(PUNJABI_CANADA_SURVIVAL_CAPSTONE);
    expect(PUNJABI_CANADA_SURVIVAL_CAPSTONE.length).toBeGreaterThanOrEqual(REQUIRED_DOMAINS.length);
    expect(PUNJABI_CANADA_SURVIVAL_CAPSTONE.length).toBeLessThanOrEqual(14);
    expect(PUNJABI_CANADA_SURVIVAL_CAPSTONE_SCOPE.name).toContain("Survival Capstone");
  });

  it("declares scope, script policy, and deferred review without overclaiming", () => {
    const scope = `${PUNJABI_CANADA_SURVIVAL_CAPSTONE_SCOPE.scriptPolicy} ${PUNJABI_CANADA_SURVIVAL_CAPSTONE_SCOPE.reviewStatus} ${PUNJABI_CANADA_SURVIVAL_CAPSTONE_SCOPE.boundary}`.toLowerCase();
    expect(scope).toContain("gurmukhi is primary");
    expect(scope).toContain("shahmukhi is awareness only");
    expect(scope).toContain("not a full course");
    expect(scope).toContain("native review is deferred");
    expect(scope).toContain("not legal, medical, or financial advice");
  });

  it("covers the required Canada survival capstone domains", () => {
    expect(new Set(PUNJABI_CANADA_SURVIVAL_CAPSTONE_DOMAINS)).toEqual(new Set(REQUIRED_DOMAINS));

    const present = new Set(PUNJABI_CANADA_SURVIVAL_CAPSTONE.map((item) => item.domain));
    for (const domain of REQUIRED_DOMAINS) {
      expect(present.has(domain), `missing domain: ${domain}`).toBe(true);
    }
  });

  it("keeps stable ids, checkpoints, and Gurmukhi primary", () => {
    const ids = PUNJABI_CANADA_SURVIVAL_CAPSTONE.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => id.startsWith("pa-ca-capstone-"))).toBe(true);

    for (const item of PUNJABI_CANADA_SURVIVAL_CAPSTONE) {
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

  it("includes romanization plus Vietnamese and English learner context", () => {
    for (const item of PUNJABI_CANADA_SURVIVAL_CAPSTONE) {
      expect(item.romanization.length).toBeGreaterThan(4);
      expect(item.situation_vi.length).toBeGreaterThan(20);
      expect(item.situation_en.length).toBeGreaterThan(20);
      expect(item.meaning_vi.length).toBeGreaterThan(3);
      expect(item.meaning_en.length).toBeGreaterThan(3);
      expect(item.use_vi.length).toBeGreaterThan(10);
      expect(item.use_en.length).toBeGreaterThan(10);
      expect(item.canada_example_vi).toMatch(/Canada|Ở Canada|Dùng/u);
      expect(item.canada_example_en).toMatch(/Canada|Canadian|In Canada|Use/u);
    }
  });

  it("includes Canada-practical capstone coverage and learner traps", () => {
    const traps = PUNJABI_CANADA_SURVIVAL_CAPSTONE.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(8);

    const allText = JSON.stringify(PUNJABI_CANADA_SURVIVAL_CAPSTONE).toLowerCase();
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
      "checkpoint",
    ]) {
      expect(allText).toContain(term);
    }
  });

  it("keeps forbidden integration and scoring concepts out of the data", () => {
    const allText = JSON.stringify(PUNJABI_CANADA_SURVIVAL_CAPSTONE);
    expect(allText).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
    expect(allText).not.toMatch(/native reviewed|reviewed by native|native-approved|full Shahmukhi course|Shahmukhi lesson/i);
  });
});
