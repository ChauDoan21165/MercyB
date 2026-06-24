import { describe, expect, it } from "vitest";

import canDoStatements, {
  PUNJABI_CANADA_SERVICE_CAN_DO_DOMAINS,
  PUNJABI_CANADA_SERVICE_CAN_DO_SCOPE,
  PUNJABI_CANADA_SERVICE_CAN_DO_STATEMENTS,
  type PunjabiCanadaServiceCanDoDomain,
} from "@/languages/punjabi/canadaServiceCanDoStatements";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const REQUIRED_DOMAINS: PunjabiCanadaServiceCanDoDomain[] = [
  "clinic",
  "pharmacy",
  "school_childcare",
  "bank",
  "housing",
  "transport",
  "workplace_safety",
  "interpreter_request",
  "public_office",
  "emergency_boundary",
];

describe("Punjabi Canada service can-do statements", () => {
  it("exports compact app-consumable TypeScript data", () => {
    expect(canDoStatements).toBe(PUNJABI_CANADA_SERVICE_CAN_DO_STATEMENTS);
    expect(PUNJABI_CANADA_SERVICE_CAN_DO_STATEMENTS.length).toBeGreaterThanOrEqual(REQUIRED_DOMAINS.length);
    expect(PUNJABI_CANADA_SERVICE_CAN_DO_STATEMENTS.length).toBeLessThanOrEqual(14);
    expect(PUNJABI_CANADA_SERVICE_CAN_DO_SCOPE.name).toContain("Can-Do Statements");
  });

  it("declares scope, script policy, and deferred review without overclaiming", () => {
    const scope = `${PUNJABI_CANADA_SERVICE_CAN_DO_SCOPE.scriptPolicy} ${PUNJABI_CANADA_SERVICE_CAN_DO_SCOPE.reviewStatus} ${PUNJABI_CANADA_SERVICE_CAN_DO_SCOPE.boundary}`.toLowerCase();
    expect(scope).toContain("gurmukhi is primary");
    expect(scope).toContain("shahmukhi is awareness only");
    expect(scope).toContain("not a full course");
    expect(scope).toContain("native review is deferred");
    expect(scope).toContain("not a11 integration");
    expect(scope).toContain("not legal, medical, or financial advice");
  });

  it("covers required Canada service can-do domains", () => {
    expect(new Set(PUNJABI_CANADA_SERVICE_CAN_DO_DOMAINS)).toEqual(new Set(REQUIRED_DOMAINS));

    const present = new Set(PUNJABI_CANADA_SERVICE_CAN_DO_STATEMENTS.map((item) => item.domain));
    for (const domain of REQUIRED_DOMAINS) {
      expect(present.has(domain), `missing domain: ${domain}`).toBe(true);
    }
  });

  it("keeps stable ids, can-do levels, checkpoints, and Gurmukhi primary", () => {
    const ids = PUNJABI_CANADA_SERVICE_CAN_DO_STATEMENTS.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => id.startsWith("pa-ca-can-do-"))).toBe(true);

    const levels = new Set(PUNJABI_CANADA_SERVICE_CAN_DO_STATEMENTS.map((item) => item.level));
    expect(levels.has("ready")).toBe(true);
    expect(levels.has("needs_review")).toBe(true);
    expect(levels.has("emergency_only")).toBe(true);

    for (const item of PUNJABI_CANADA_SERVICE_CAN_DO_STATEMENTS) {
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

  it("includes romanization plus Vietnamese and English can-do context", () => {
    for (const item of PUNJABI_CANADA_SERVICE_CAN_DO_STATEMENTS) {
      expect(item.romanization.length).toBeGreaterThan(4);
      expect(item.can_do_vi.length).toBeGreaterThan(20);
      expect(item.can_do_en.length).toBeGreaterThan(20);
      expect(item.meaning_vi.length).toBeGreaterThan(3);
      expect(item.meaning_en.length).toBeGreaterThan(3);
      expect(item.readiness_note_vi.length).toBeGreaterThan(20);
      expect(item.readiness_note_en.length).toBeGreaterThan(20);
      expect(item.canada_example_vi).toMatch(/Canada|Ở Canada|Dùng/u);
      expect(item.canada_example_en).toMatch(/Canada|Canadian|In Canada|Use/u);
    }
  });

  it("includes Canada-practical can-do coverage and learner traps", () => {
    const traps = PUNJABI_CANADA_SERVICE_CAN_DO_STATEMENTS.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(8);

    const allText = JSON.stringify(PUNJABI_CANADA_SERVICE_CAN_DO_STATEMENTS).toLowerCase();
    for (const term of [
      "clinic",
      "pharmacy",
      "school",
      "bank",
      "repair",
      "bus",
      "workplace",
      "interpreter",
      "documents",
      "emergency",
      "can",
      "checkpoint",
    ]) {
      expect(allText).toContain(term);
    }
  });

  it("keeps forbidden integration and scoring concepts out of the data", () => {
    const allText = JSON.stringify(PUNJABI_CANADA_SERVICE_CAN_DO_STATEMENTS);
    expect(allText).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
    expect(allText).not.toMatch(/native reviewed|reviewed by native|native-approved|full Shahmukhi course|Shahmukhi lesson/i);
  });
});
