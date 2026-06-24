import { describe, expect, it } from "vitest";

import goldenSamples, {
  PUNJABI_CANADA_SURVIVAL_GOLDEN_DOMAINS,
  PUNJABI_CANADA_SURVIVAL_GOLDEN_SAMPLES,
  PUNJABI_CANADA_SURVIVAL_GOLDEN_SCOPE,
  type PunjabiCanadaSurvivalGoldenDomain,
} from "@/languages/punjabi/canadaSurvivalGoldenSamples";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const REQUIRED_DOMAINS: PunjabiCanadaSurvivalGoldenDomain[] = [
  "clinic",
  "pharmacy",
  "school_childcare",
  "bank",
  "housing",
  "transport",
  "public_office",
  "interpreter_request",
  "emergency_boundary",
  "service_desk",
  "workplace_safety",
];

describe("Punjabi Canada survival golden samples", () => {
  it("exports compact app-consumable TypeScript data", () => {
    expect(goldenSamples).toBe(PUNJABI_CANADA_SURVIVAL_GOLDEN_SAMPLES);
    expect(PUNJABI_CANADA_SURVIVAL_GOLDEN_SAMPLES.length).toBeGreaterThanOrEqual(REQUIRED_DOMAINS.length);
    expect(PUNJABI_CANADA_SURVIVAL_GOLDEN_SAMPLES.length).toBeLessThanOrEqual(13);
    expect(PUNJABI_CANADA_SURVIVAL_GOLDEN_SCOPE.name).toContain("Golden Samples");
  });

  it("declares script policy, readiness scope, and deferred review without overclaiming", () => {
    const scope = `${PUNJABI_CANADA_SURVIVAL_GOLDEN_SCOPE.scriptPolicy} ${PUNJABI_CANADA_SURVIVAL_GOLDEN_SCOPE.reviewStatus} ${PUNJABI_CANADA_SURVIVAL_GOLDEN_SCOPE.readinessBoundary}`.toLowerCase();

    expect(scope).toContain("gurmukhi is primary");
    expect(scope).toContain("shahmukhi is awareness only");
    expect(scope).toContain("not a full course");
    expect(scope).toContain("native review is deferred");
    expect(scope).toContain("not a11 integration");
    expect(scope).toContain("not legal advice");
    expect(scope).toContain("not medical advice");
    expect(scope).toContain("not financial advice");
  });

  it("covers required Canada survival golden-sample domains", () => {
    expect(new Set(PUNJABI_CANADA_SURVIVAL_GOLDEN_DOMAINS)).toEqual(new Set(REQUIRED_DOMAINS));

    const present = new Set(PUNJABI_CANADA_SURVIVAL_GOLDEN_SAMPLES.map((item) => item.domain));
    for (const domain of REQUIRED_DOMAINS) {
      expect(present.has(domain), `missing domain: ${domain}`).toBe(true);
    }
  });

  it("keeps stable ids, QA uses, Gurmukhi primary text, and Shahmukhi awareness only", () => {
    const ids = PUNJABI_CANADA_SURVIVAL_GOLDEN_SAMPLES.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => id.startsWith("pa-ca-golden-"))).toBe(true);

    const uses = new Set(PUNJABI_CANADA_SURVIVAL_GOLDEN_SAMPLES.map((item) => item.use));
    expect(uses.has("golden_sample")).toBe(true);
    expect(uses.has("final_qa")).toBe(true);
    expect(uses.has("integration_readiness")).toBe(true);
    expect(uses.has("remediation")).toBe(true);

    for (const item of PUNJABI_CANADA_SURVIVAL_GOLDEN_SAMPLES) {
      expect(item.phrase_pa).toMatch(GURMUKHI);
      expect(item.phrase_pa).not.toMatch(SHAHMUKHI);
      expect(item.support_pa.length).toBeGreaterThanOrEqual(2);
      for (const line of item.support_pa) {
        expect(line).toMatch(GURMUKHI);
        expect(line).not.toMatch(SHAHMUKHI);
      }
    }
  });

  it("includes romanization plus Vietnamese and English golden-sample guidance", () => {
    for (const item of PUNJABI_CANADA_SURVIVAL_GOLDEN_SAMPLES) {
      expect(item.romanization.length).toBeGreaterThan(8);
      expect(item.meaning_vi.length).toBeGreaterThan(12);
      expect(item.meaning_en.length).toBeGreaterThan(12);
      expect(item.canada_context_vi).toMatch(/Canada|Ở Canada|Dùng/u);
      expect(item.canada_context_en).toMatch(/Canada|In Canada|Use/u);
      expect(item.final_qa_vi.length).toBeGreaterThan(25);
      expect(item.final_qa_en.length).toBeGreaterThan(25);
      expect(item.readiness_signal_vi.length).toBeGreaterThan(25);
      expect(item.readiness_signal_en.length).toBeGreaterThan(25);
      expect(item.boundary_vi.length).toBeGreaterThan(20);
      expect(item.boundary_en.length).toBeGreaterThan(20);
    }
  });

  it("includes golden-sample, final-QA, integration-readiness, and survival topic coverage", () => {
    const allText = JSON.stringify(PUNJABI_CANADA_SURVIVAL_GOLDEN_SAMPLES).toLowerCase();
    for (const term of [
      "clinic",
      "pharmacy",
      "school",
      "bank",
      "housing",
      "transit",
      "public office",
      "interpreter",
      "emergency",
      "service desk",
      "workplace",
      "golden sample",
      "final qa",
      "integration-readiness",
      "remediation",
    ]) {
      expect(allText).toContain(term);
    }

    const traps = PUNJABI_CANADA_SURVIVAL_GOLDEN_SAMPLES.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(9);
  });

  it("keeps restricted integration and scoring concepts out of the data", () => {
    const allText = JSON.stringify(PUNJABI_CANADA_SURVIVAL_GOLDEN_SAMPLES);
    expect(allText).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
    expect(allText).not.toMatch(/native reviewed|reviewed by native|native-approved|full Shahmukhi course|Shahmukhi lesson/i);
  });
});
