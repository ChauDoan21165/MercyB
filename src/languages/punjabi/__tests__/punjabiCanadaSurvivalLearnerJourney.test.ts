import { describe, expect, it } from "vitest";

import learnerJourney, {
  PUNJABI_CANADA_SURVIVAL_JOURNEY_DOMAINS,
  PUNJABI_CANADA_SURVIVAL_LEARNER_JOURNEY,
  PUNJABI_CANADA_SURVIVAL_LEARNER_JOURNEY_SCOPE,
  type PunjabiCanadaSurvivalJourneyDomain,
} from "@/languages/punjabi/canadaSurvivalLearnerJourney";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const REQUIRED_DOMAINS: PunjabiCanadaSurvivalJourneyDomain[] = [
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

describe("Punjabi Canada survival learner journey", () => {
  it("exports compact app-consumable TypeScript data", () => {
    expect(learnerJourney).toBe(PUNJABI_CANADA_SURVIVAL_LEARNER_JOURNEY);
    expect(PUNJABI_CANADA_SURVIVAL_LEARNER_JOURNEY.length).toBeGreaterThanOrEqual(REQUIRED_DOMAINS.length);
    expect(PUNJABI_CANADA_SURVIVAL_LEARNER_JOURNEY.length).toBeLessThanOrEqual(14);
    expect(PUNJABI_CANADA_SURVIVAL_LEARNER_JOURNEY_SCOPE.name).toContain("Learner Journey");
  });

  it("declares scope, script policy, and deferred review without overclaiming", () => {
    const scope = `${PUNJABI_CANADA_SURVIVAL_LEARNER_JOURNEY_SCOPE.scriptPolicy} ${PUNJABI_CANADA_SURVIVAL_LEARNER_JOURNEY_SCOPE.reviewStatus} ${PUNJABI_CANADA_SURVIVAL_LEARNER_JOURNEY_SCOPE.boundary}`.toLowerCase();
    expect(scope).toContain("gurmukhi is primary");
    expect(scope).toContain("shahmukhi is awareness only");
    expect(scope).toContain("not a full course");
    expect(scope).toContain("native review is deferred");
    expect(scope).toContain("not a11 integration");
    expect(scope).toContain("not legal, medical, or financial advice");
  });

  it("covers required Canada survival journey domains", () => {
    expect(new Set(PUNJABI_CANADA_SURVIVAL_JOURNEY_DOMAINS)).toEqual(new Set(REQUIRED_DOMAINS));

    const present = new Set(PUNJABI_CANADA_SURVIVAL_LEARNER_JOURNEY.map((item) => item.domain));
    for (const domain of REQUIRED_DOMAINS) {
      expect(present.has(domain), `missing domain: ${domain}`).toBe(true);
    }
  });

  it("keeps stable ids, journey stages, handoffs, and Gurmukhi primary", () => {
    const ids = PUNJABI_CANADA_SURVIVAL_LEARNER_JOURNEY.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => id.startsWith("pa-ca-journey-"))).toBe(true);

    const stages = new Set(PUNJABI_CANADA_SURVIVAL_LEARNER_JOURNEY.map((item) => item.stage));
    expect(stages.has("first_contact")).toBe(true);
    expect(stages.has("clarify_details")).toBe(true);
    expect(stages.has("handoff")).toBe(true);
    expect(stages.has("safety_boundary")).toBe(true);

    for (const item of PUNJABI_CANADA_SURVIVAL_LEARNER_JOURNEY) {
      expect(item.handoff_vi.length).toBeGreaterThan(20);
      expect(item.handoff_en.length).toBeGreaterThan(20);
      expect(item.phrase_pa).toMatch(GURMUKHI);
      expect(item.phrase_pa).not.toMatch(SHAHMUKHI);
      expect(item.support_pa.length).toBeGreaterThanOrEqual(2);
      for (const line of item.support_pa) {
        expect(line).toMatch(GURMUKHI);
        expect(line).not.toMatch(SHAHMUKHI);
      }
    }
  });

  it("includes romanization plus Vietnamese and English learner journey context", () => {
    for (const item of PUNJABI_CANADA_SURVIVAL_LEARNER_JOURNEY) {
      expect(item.romanization.length).toBeGreaterThan(4);
      expect(item.learner_step_vi.length).toBeGreaterThan(20);
      expect(item.learner_step_en.length).toBeGreaterThan(20);
      expect(item.meaning_vi.length).toBeGreaterThan(3);
      expect(item.meaning_en.length).toBeGreaterThan(3);
      expect(item.readiness_note_vi.length).toBeGreaterThan(20);
      expect(item.readiness_note_en.length).toBeGreaterThan(20);
      expect(item.canada_example_vi).toMatch(/Canada|Ở Canada|Dùng/u);
      expect(item.canada_example_en).toMatch(/Canada|Canadian|In Canada|Use/u);
    }
  });

  it("includes Canada-practical learner journey coverage and learner traps", () => {
    const traps = PUNJABI_CANADA_SURVIVAL_LEARNER_JOURNEY.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(8);

    const allText = JSON.stringify(PUNJABI_CANADA_SURVIVAL_LEARNER_JOURNEY).toLowerCase();
    for (const term of [
      "clinic",
      "pharmacy",
      "school",
      "bank",
      "housing",
      "transit",
      "documents",
      "interpreter",
      "emergency",
      "workplace",
      "handoff",
      "journey",
    ]) {
      expect(allText).toContain(term);
    }
  });

  it("keeps forbidden integration and scoring concepts out of the data", () => {
    const allText = JSON.stringify(PUNJABI_CANADA_SURVIVAL_LEARNER_JOURNEY);
    expect(allText).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
    expect(allText).not.toMatch(/native reviewed|reviewed by native|native-approved|full Shahmukhi course|Shahmukhi lesson/i);
  });
});
