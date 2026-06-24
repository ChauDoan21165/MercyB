import { describe, expect, it } from "vitest";

import workplaceSafetyCanada, {
  PUNJABI_WORKPLACE_SAFETY_CANADA,
  PUNJABI_WORKPLACE_SAFETY_CANADA_SCOPE,
  PUNJABI_WORKPLACE_SAFETY_CANADA_TOPICS,
  type PunjabiWorkplaceSafetyCanadaTopic,
} from "@/languages/punjabi/workplaceSafetyCanada";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const REQUIRED_TOPICS: PunjabiWorkplaceSafetyCanadaTopic[] = [
  "report_injury",
  "unsafe_condition",
  "ppe_request",
  "task_clarification",
  "emergency_boundary",
  "supervisor_conversation",
  "incident_form_support",
  "first_aid_request",
  "training_question",
  "shift_followup",
];

describe("Punjabi Canada workplace safety pack", () => {
  it("exports compact app-consumable TypeScript data", () => {
    expect(workplaceSafetyCanada).toBe(PUNJABI_WORKPLACE_SAFETY_CANADA);
    expect(PUNJABI_WORKPLACE_SAFETY_CANADA.length).toBeGreaterThanOrEqual(REQUIRED_TOPICS.length);
    expect(PUNJABI_WORKPLACE_SAFETY_CANADA.length).toBeLessThanOrEqual(14);
    expect(PUNJABI_WORKPLACE_SAFETY_CANADA_SCOPE.name).toContain("Workplace Safety Pack");
  });

  it("declares scope, script policy, and deferred review without overclaiming", () => {
    const scope = `${PUNJABI_WORKPLACE_SAFETY_CANADA_SCOPE.scriptPolicy} ${PUNJABI_WORKPLACE_SAFETY_CANADA_SCOPE.reviewStatus} ${PUNJABI_WORKPLACE_SAFETY_CANADA_SCOPE.boundary}`.toLowerCase();
    expect(scope).toContain("gurmukhi is primary");
    expect(scope).toContain("shahmukhi is awareness only");
    expect(scope).toContain("not a full course");
    expect(scope).toContain("native review is deferred");
    expect(scope).toContain("not legal advice");
  });

  it("covers the required Canada workplace safety topics", () => {
    expect(new Set(PUNJABI_WORKPLACE_SAFETY_CANADA_TOPICS)).toEqual(new Set(REQUIRED_TOPICS));

    const present = new Set(PUNJABI_WORKPLACE_SAFETY_CANADA.map((item) => item.topic));
    for (const topic of REQUIRED_TOPICS) {
      expect(present.has(topic), `missing topic: ${topic}`).toBe(true);
    }
  });

  it("keeps stable ids and Gurmukhi primary", () => {
    const ids = PUNJABI_WORKPLACE_SAFETY_CANADA.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => id.startsWith("pa-ca-work-safety-"))).toBe(true);

    for (const item of PUNJABI_WORKPLACE_SAFETY_CANADA) {
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
    for (const item of PUNJABI_WORKPLACE_SAFETY_CANADA) {
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

  it("includes Canada-practical workplace safety vocabulary and learner traps", () => {
    const traps = PUNJABI_WORKPLACE_SAFETY_CANADA.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(8);

    const allText = JSON.stringify(PUNJABI_WORKPLACE_SAFETY_CANADA).toLowerCase();
    for (const term of [
      "injury",
      "safety",
      "ppe",
      "task",
      "emergency",
      "supervisor",
      "incident form",
      "first aid",
      "training",
      "next step",
    ]) {
      expect(allText).toContain(term);
    }
  });

  it("keeps forbidden integration and scoring concepts out of the data", () => {
    const allText = JSON.stringify(PUNJABI_WORKPLACE_SAFETY_CANADA);
    expect(allText).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
    expect(allText).not.toMatch(/native reviewed|reviewed by native|native-approved|full Shahmukhi course|Shahmukhi lesson/i);
  });
});
