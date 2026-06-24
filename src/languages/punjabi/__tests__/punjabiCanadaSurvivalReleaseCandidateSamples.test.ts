import { describe, expect, it } from "vitest";

import releaseCandidateSamples, {
  PUNJABI_CANADA_SURVIVAL_RELEASE_CANDIDATE_SAMPLES,
  PUNJABI_CANADA_SURVIVAL_RELEASE_CANDIDATE_SCOPE,
  type PunjabiCanadaSurvivalReleaseCandidateDomain,
} from "@/languages/punjabi/canadaSurvivalReleaseCandidateSamples";

const GURMUKHI_BLOCK = /[਀-੿]/;

const REQUIRED_DOMAINS: PunjabiCanadaSurvivalReleaseCandidateDomain[] = [
  "clinic",
  "pharmacy",
  "school_childcare",
  "bank",
  "housing",
  "transport",
  "public_office",
  "forms_service_desk",
  "interpreter_request",
  "emergency_boundary",
  "service_recovery",
  "workplace_safety",
];

describe("Punjabi Canada survival release candidate samples", () => {
  it("exports app-consumable TypeScript data", () => {
    expect(releaseCandidateSamples).toBe(PUNJABI_CANADA_SURVIVAL_RELEASE_CANDIDATE_SAMPLES);
    expect(Array.isArray(releaseCandidateSamples)).toBe(true);
    expect(PUNJABI_CANADA_SURVIVAL_RELEASE_CANDIDATE_SCOPE.name).toContain("Release Candidate Samples");
  });

  it("covers the required Canada survival domains compactly", () => {
    expect(releaseCandidateSamples.length).toBeGreaterThanOrEqual(REQUIRED_DOMAINS.length);
    expect(releaseCandidateSamples.length).toBeLessThanOrEqual(18);

    const present = new Set(releaseCandidateSamples.map((item) => item.domain));
    for (const domain of REQUIRED_DOMAINS) {
      expect(present.has(domain), `missing domain: ${domain}`).toBe(true);
    }
  });

  it("uses stable ids and release-candidate styles", () => {
    const ids = releaseCandidateSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(releaseCandidateSamples.some((item) => item.use === "release_candidate")).toBe(true);
    expect(releaseCandidateSamples.some((item) => item.use === "closure_validation")).toBe(true);
    expect(releaseCandidateSamples.some((item) => item.use === "pre_integration")).toBe(true);
    expect(releaseCandidateSamples.some((item) => item.use === "handoff_check")).toBe(true);
  });

  it("keeps Gurmukhi primary with romanization, Vietnamese, and English", () => {
    for (const item of releaseCandidateSamples) {
      expect(item.phrase_pa).toMatch(GURMUKHI_BLOCK);
      expect(item.support_pa.length).toBeGreaterThanOrEqual(2);
      for (const line of item.support_pa) {
        expect(line).toMatch(GURMUKHI_BLOCK);
      }

      expect(item.romanization.length).toBeGreaterThan(4);
      expect(item.candidate_vi.length).toBeGreaterThan(20);
      expect(item.candidate_en.length).toBeGreaterThan(20);
      expect(item.goal_vi.length).toBeGreaterThan(10);
      expect(item.goal_en.length).toBeGreaterThan(10);
      expect(item.meaning_vi.length).toBeGreaterThan(3);
      expect(item.meaning_en.length).toBeGreaterThan(3);
      expect(item.candidate_check_vi).toMatch(/Release-candidate|Closure-validation|Pre-integration|Handoff/u);
      expect(item.candidate_check_en).toMatch(/Release candidate|closure validation|Pre-integration|handoff/i);
      expect(item.canada_example_vi).toMatch(/Canada|Ở Canada|Dùng/u);
      expect(item.canada_example_en).toMatch(/Canada|Use|In Canada|At a Canadian/u);
    }
  });

  it("includes learner traps and end-to-end practical flow coverage", () => {
    const traps = releaseCandidateSamples.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(9);

    const allContent = JSON.stringify(releaseCandidateSamples);
    expect(allContent).toMatch(/clinic|pharmacy|school|bank|rental|bus|service centre|workplace/i);
  });

  it("mentions Shahmukhi only as awareness and defers native review", () => {
    expect(PUNJABI_CANADA_SURVIVAL_RELEASE_CANDIDATE_SCOPE.scriptPolicy).toMatch(/Shahmukhi is awareness only/i);
    expect(PUNJABI_CANADA_SURVIVAL_RELEASE_CANDIDATE_SCOPE.reviewStatus).toBe("Native review is deferred.");

    const allContent = JSON.stringify({
      scope: PUNJABI_CANADA_SURVIVAL_RELEASE_CANDIDATE_SCOPE,
      releaseCandidateSamples,
    });
    expect(allContent).not.toMatch(/native reviewed|native-approved|full Shahmukhi course/i);
  });

  it("keeps forbidden integration and scoring concepts out of the data", () => {
    const allContent = JSON.stringify(releaseCandidateSamples);
    expect(allContent).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
  });
});
