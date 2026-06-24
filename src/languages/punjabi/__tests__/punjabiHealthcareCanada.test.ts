import { describe, expect, it } from "vitest";

import punjabiHealthcareCanada, {
  PUNJABI_HEALTHCARE_CANADA,
  PUNJABI_HEALTHCARE_CANADA_SCOPE,
  PUNJABI_HEALTHCARE_CANADA_TOPICS,
  type PunjabiHealthcareCanadaTopic,
} from "@/languages/punjabi/healthcareCanada";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const REQUIRED_TOPICS: PunjabiHealthcareCanadaTopic[] = [
  "clinic_check_in",
  "symptoms",
  "appointment",
  "pharmacy",
  "interpreter_request",
  "allergy",
  "medication_question",
  "follow_up",
  "emergency_boundary",
];

describe("Punjabi healthcare Canada pack", () => {
  it("exports compact app-consumable TypeScript data", () => {
    expect(punjabiHealthcareCanada).toBe(PUNJABI_HEALTHCARE_CANADA);
    expect(PUNJABI_HEALTHCARE_CANADA.length).toBeGreaterThanOrEqual(18);
    expect(PUNJABI_HEALTHCARE_CANADA.length).toBeLessThanOrEqual(24);
  });

  it("declares scope, script policy, and deferred review", () => {
    const scope = `${PUNJABI_HEALTHCARE_CANADA_SCOPE.scriptPolicy} ${PUNJABI_HEALTHCARE_CANADA_SCOPE.reviewStatus} ${PUNJABI_HEALTHCARE_CANADA_SCOPE.boundary}`.toLowerCase();
    expect(scope).toContain("gurmukhi is primary");
    expect(scope).toContain("shahmukhi is awareness only");
    expect(scope).toContain("not a full course");
    expect(scope).toContain("native review is deferred");
    expect(scope).toContain("not medical advice");
  });

  it("covers every required healthcare topic", () => {
    expect(new Set(PUNJABI_HEALTHCARE_CANADA_TOPICS)).toEqual(new Set(REQUIRED_TOPICS));
    const present = new Set(PUNJABI_HEALTHCARE_CANADA.map((item) => item.topic));
    for (const topic of REQUIRED_TOPICS) expect(present.has(topic), `missing ${topic}`).toBe(true);
  });

  it("keeps ids unique", () => {
    const ids = PUNJABI_HEALTHCARE_CANADA.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => id.startsWith("pa-ca-health-"))).toBe(true);
  });

  it("uses Gurmukhi primary with romanization, Vietnamese, and English", () => {
    for (const item of PUNJABI_HEALTHCARE_CANADA) {
      expect(item.phrase_pa).toMatch(GURMUKHI);
      expect(item.phrase_pa).not.toMatch(SHAHMUKHI);
      expect(item.romanization.length).toBeGreaterThan(0);
      expect(item.meaning_vi.length).toBeGreaterThan(0);
      expect(item.meaning_en.length).toBeGreaterThan(0);
      expect(item.use_vi.length).toBeGreaterThan(0);
      expect(item.use_en.length).toBeGreaterThan(0);
      expect(item.canada_example_vi.length).toBeGreaterThan(0);
      expect(item.canada_example_en.length).toBeGreaterThan(0);
    }
  });

  it("includes clinic, pharmacy, interpreter, allergy, medication, follow-up, and emergency language", () => {
    const text = PUNJABI_HEALTHCARE_CANADA.map(
      (item) => `${item.topic} ${item.meaning_en} ${item.use_en} ${item.canada_example_en}`,
    )
      .join(" ")
      .toLowerCase();

    for (const term of [
      "clinic",
      "symptoms",
      "appointment",
      "pharmacy",
      "interpreter",
      "allergic",
      "medicine",
      "follow-up",
      "911",
      "emergency",
    ]) {
      expect(text).toContain(term);
    }
  });

  it("includes learner traps, Canada-practical examples, and no native-review claim", () => {
    expect(PUNJABI_HEALTHCARE_CANADA.filter((item) => item.learner_trap_vi && item.learner_trap_en).length).toBeGreaterThanOrEqual(4);
    const allText = JSON.stringify({
      scope: PUNJABI_HEALTHCARE_CANADA_SCOPE,
      items: PUNJABI_HEALTHCARE_CANADA,
    }).toLowerCase();
    expect(allText).toContain("canada");
    expect(allText).not.toMatch(/native reviewed|reviewed by native|native-approved/);
  });

  it("keeps forbidden platform and scoring concepts out of the data", () => {
    const allText = JSON.stringify(PUNJABI_HEALTHCARE_CANADA);
    expect(allText).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
  });
});
