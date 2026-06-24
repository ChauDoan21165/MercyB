import { describe, expect, it } from "vitest";

import schoolChildcareCanada, {
  PUNJABI_SCHOOL_CHILDCARE_CANADA,
  PUNJABI_SCHOOL_CHILDCARE_CANADA_SCOPE,
  PUNJABI_SCHOOL_CHILDCARE_CANADA_TOPICS,
  type PunjabiSchoolChildcareCanadaTopic,
} from "@/languages/punjabi/schoolChildcareCanada";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const REQUIRED_TOPICS: PunjabiSchoolChildcareCanadaTopic[] = [
  "absence_notice",
  "pickup_change",
  "forms_support",
  "teacher_meeting",
  "lunch_note",
  "allergy_note",
  "school_bus",
  "homework_help",
  "daycare_communication",
  "interpreter_request",
];

describe("Punjabi Canada school and childcare pack", () => {
  it("exports compact app-consumable TypeScript data", () => {
    expect(schoolChildcareCanada).toBe(PUNJABI_SCHOOL_CHILDCARE_CANADA);
    expect(PUNJABI_SCHOOL_CHILDCARE_CANADA.length).toBeGreaterThanOrEqual(REQUIRED_TOPICS.length);
    expect(PUNJABI_SCHOOL_CHILDCARE_CANADA.length).toBeLessThanOrEqual(14);
    expect(PUNJABI_SCHOOL_CHILDCARE_CANADA_SCOPE.name).toContain("School and Childcare Pack");
  });

  it("declares scope, script policy, and deferred review without overclaiming", () => {
    const scope = `${PUNJABI_SCHOOL_CHILDCARE_CANADA_SCOPE.scriptPolicy} ${PUNJABI_SCHOOL_CHILDCARE_CANADA_SCOPE.reviewStatus} ${PUNJABI_SCHOOL_CHILDCARE_CANADA_SCOPE.boundary}`.toLowerCase();
    expect(scope).toContain("gurmukhi is primary");
    expect(scope).toContain("shahmukhi is awareness only");
    expect(scope).toContain("not a full course");
    expect(scope).toContain("native review is deferred");
    expect(scope).toContain("not legal or medical advice");
  });

  it("covers the required Canada school and childcare topics", () => {
    expect(new Set(PUNJABI_SCHOOL_CHILDCARE_CANADA_TOPICS)).toEqual(new Set(REQUIRED_TOPICS));

    const present = new Set(PUNJABI_SCHOOL_CHILDCARE_CANADA.map((item) => item.topic));
    for (const topic of REQUIRED_TOPICS) {
      expect(present.has(topic), `missing topic: ${topic}`).toBe(true);
    }
  });

  it("keeps stable ids and Gurmukhi primary", () => {
    const ids = PUNJABI_SCHOOL_CHILDCARE_CANADA.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => id.startsWith("pa-ca-school-childcare-"))).toBe(true);

    for (const item of PUNJABI_SCHOOL_CHILDCARE_CANADA) {
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
    for (const item of PUNJABI_SCHOOL_CHILDCARE_CANADA) {
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

  it("includes Canada-practical school and childcare vocabulary with learner traps", () => {
    const traps = PUNJABI_SCHOOL_CHILDCARE_CANADA.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(8);

    const allText = JSON.stringify(PUNJABI_SCHOOL_CHILDCARE_CANADA).toLowerCase();
    for (const term of [
      "absent",
      "pick up",
      "form",
      "teacher",
      "lunch",
      "allergy",
      "bus",
      "homework",
      "daycare",
      "interpreter",
    ]) {
      expect(allText).toContain(term);
    }
  });

  it("keeps forbidden integration and scoring concepts out of the data", () => {
    const allText = JSON.stringify(PUNJABI_SCHOOL_CHILDCARE_CANADA);
    expect(allText).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
    expect(allText).not.toMatch(/native reviewed|reviewed by native|native-approved|full Shahmukhi course|Shahmukhi lesson/i);
  });
});
