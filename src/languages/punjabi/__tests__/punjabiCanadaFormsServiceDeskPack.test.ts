import { describe, expect, it } from "vitest";

import formsServiceDeskPack, {
  PUNJABI_CANADA_FORMS_SERVICE_DESK_DOMAINS,
  PUNJABI_CANADA_FORMS_SERVICE_DESK_PACK,
  PUNJABI_CANADA_FORMS_SERVICE_DESK_SCOPE,
  type PunjabiCanadaFormsServiceDeskDomain,
} from "@/languages/punjabi/canadaFormsServiceDeskPack";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const REQUIRED_DOMAINS: PunjabiCanadaFormsServiceDeskDomain[] = [
  "id",
  "address",
  "phone",
  "appointment",
  "missing_paper",
  "interpreter_request",
  "service_number",
  "waiting",
  "correction_request",
  "polite_follow_up",
  "review_remediation",
];

describe("Punjabi Canada forms and service desk pack", () => {
  it("exports compact app-consumable TypeScript data", () => {
    expect(formsServiceDeskPack).toBe(PUNJABI_CANADA_FORMS_SERVICE_DESK_PACK);
    expect(PUNJABI_CANADA_FORMS_SERVICE_DESK_PACK.length).toBeGreaterThanOrEqual(REQUIRED_DOMAINS.length);
    expect(PUNJABI_CANADA_FORMS_SERVICE_DESK_PACK.length).toBeLessThanOrEqual(13);
    expect(PUNJABI_CANADA_FORMS_SERVICE_DESK_SCOPE.name).toContain("Forms and Service Desk");
  });

  it("declares scope, script policy, and deferred review without legal overclaiming", () => {
    const scope = `${PUNJABI_CANADA_FORMS_SERVICE_DESK_SCOPE.scriptPolicy} ${PUNJABI_CANADA_FORMS_SERVICE_DESK_SCOPE.reviewStatus} ${PUNJABI_CANADA_FORMS_SERVICE_DESK_SCOPE.serviceBoundary}`.toLowerCase();

    expect(scope).toContain("gurmukhi is primary");
    expect(scope).toContain("shahmukhi is awareness only");
    expect(scope).toContain("not a full course");
    expect(scope).toContain("native review is deferred");
    expect(scope).toContain("not legal advice");
    expect(scope).toContain("not a substitute for official instructions");
  });

  it("covers required Canada forms and service desk domains", () => {
    expect(new Set(PUNJABI_CANADA_FORMS_SERVICE_DESK_DOMAINS)).toEqual(new Set(REQUIRED_DOMAINS));

    const present = new Set(PUNJABI_CANADA_FORMS_SERVICE_DESK_PACK.map((item) => item.domain));
    for (const domain of REQUIRED_DOMAINS) {
      expect(present.has(domain), `missing domain: ${domain}`).toBe(true);
    }
  });

  it("keeps stable ids, stages, Gurmukhi primary text, and Shahmukhi awareness only", () => {
    const ids = PUNJABI_CANADA_FORMS_SERVICE_DESK_PACK.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => id.startsWith("pa-ca-forms-desk-"))).toBe(true);

    const stages = new Set(PUNJABI_CANADA_FORMS_SERVICE_DESK_PACK.map((item) => item.stage));
    expect(stages.has("first_contact")).toBe(true);
    expect(stages.has("clarify")).toBe(true);
    expect(stages.has("repair")).toBe(true);
    expect(stages.has("follow_up")).toBe(true);
    expect(stages.has("readiness")).toBe(true);

    for (const item of PUNJABI_CANADA_FORMS_SERVICE_DESK_PACK) {
      expect(item.phrase_pa).toMatch(GURMUKHI);
      expect(item.phrase_pa).not.toMatch(SHAHMUKHI);
      expect(item.support_pa.length).toBeGreaterThanOrEqual(2);
      for (const line of item.support_pa) {
        expect(line).toMatch(GURMUKHI);
        expect(line).not.toMatch(SHAHMUKHI);
      }
    }
  });

  it("includes romanization plus Vietnamese and English service-desk guidance", () => {
    for (const item of PUNJABI_CANADA_FORMS_SERVICE_DESK_PACK) {
      expect(item.romanization.length).toBeGreaterThan(8);
      expect(item.meaning_vi.length).toBeGreaterThan(12);
      expect(item.meaning_en.length).toBeGreaterThan(12);
      expect(item.canada_context_vi).toMatch(/Canada|Ở Canada|Dùng/u);
      expect(item.canada_context_en).toMatch(/Canada|In Canada|Use/u);
      expect(item.desk_action_vi.length).toBeGreaterThan(25);
      expect(item.desk_action_en.length).toBeGreaterThan(25);
      expect(item.boundary_vi.length).toBeGreaterThan(25);
      expect(item.boundary_en.length).toBeGreaterThan(25);
    }
  });

  it("includes practical form topics, polite follow-up, final-quality, remediation, and traps", () => {
    const allText = JSON.stringify(PUNJABI_CANADA_FORMS_SERVICE_DESK_PACK).toLowerCase();
    for (const term of [
      "id",
      "address",
      "phone",
      "appointment",
      "missing",
      "interpreter",
      "service number",
      "waiting",
      "correction",
      "follow-up",
      "final-quality",
      "remediation",
      "readiness",
    ]) {
      expect(allText).toContain(term);
    }

    const traps = PUNJABI_CANADA_FORMS_SERVICE_DESK_PACK.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(9);
  });

  it("keeps restricted integration and scoring concepts out of the data", () => {
    const allText = JSON.stringify(PUNJABI_CANADA_FORMS_SERVICE_DESK_PACK);
    expect(allText).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
    expect(allText).not.toMatch(/native reviewed|reviewed by native|native-approved|full Shahmukhi course|Shahmukhi lesson/i);
  });
});
