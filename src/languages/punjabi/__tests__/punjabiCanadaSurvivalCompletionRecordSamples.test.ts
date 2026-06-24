import { describe, expect, it } from "vitest";

import completionRecordSamples, {
  PUNJABI_CANADA_SURVIVAL_COMPLETION_RECORD_DOMAINS,
  PUNJABI_CANADA_SURVIVAL_COMPLETION_RECORD_SAMPLES,
  PUNJABI_CANADA_SURVIVAL_COMPLETION_RECORD_SCOPE,
  type PunjabiCanadaSurvivalCompletionRecordDomain,
} from "@/languages/punjabi/canadaSurvivalCompletionRecordSamples";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const REQUIRED_DOMAINS: PunjabiCanadaSurvivalCompletionRecordDomain[] = [
  "clinic",
  "pharmacy",
  "school_childcare",
  "bank",
  "housing",
  "transport",
  "public_office",
  "forms",
  "interpreter_request",
  "emergency_boundary",
  "service_recovery",
  "workplace_safety",
];

describe("Punjabi Canada survival completion record samples", () => {
  it("exports compact app-consumable TypeScript data", () => {
    expect(completionRecordSamples).toBe(PUNJABI_CANADA_SURVIVAL_COMPLETION_RECORD_SAMPLES);
    expect(PUNJABI_CANADA_SURVIVAL_COMPLETION_RECORD_SAMPLES.length).toBeGreaterThanOrEqual(REQUIRED_DOMAINS.length);
    expect(PUNJABI_CANADA_SURVIVAL_COMPLETION_RECORD_SAMPLES.length).toBeLessThanOrEqual(14);
    expect(PUNJABI_CANADA_SURVIVAL_COMPLETION_RECORD_SCOPE.name).toContain("Completion Record Samples");
  });

  it("declares script policy, completion record scope, and deferred review without overclaiming", () => {
    const scope = `${PUNJABI_CANADA_SURVIVAL_COMPLETION_RECORD_SCOPE.scriptPolicy} ${PUNJABI_CANADA_SURVIVAL_COMPLETION_RECORD_SCOPE.reviewStatus} ${PUNJABI_CANADA_SURVIVAL_COMPLETION_RECORD_SCOPE.completionRecordBoundary}`.toLowerCase();

    expect(scope).toContain("gurmukhi is primary");
    expect(scope).toContain("shahmukhi is awareness only");
    expect(scope).toContain("not a full course");
    expect(scope).toContain("native review is deferred");
    expect(scope).toContain("not a11 integration");
    expect(scope).toContain("not legal advice");
    expect(scope).toContain("not medical advice");
    expect(scope).toContain("not financial advice");
  });

  it("covers required Canada survival completionRecord domains", () => {
    expect(new Set(PUNJABI_CANADA_SURVIVAL_COMPLETION_RECORD_DOMAINS)).toEqual(new Set(REQUIRED_DOMAINS));

    const present = new Set(PUNJABI_CANADA_SURVIVAL_COMPLETION_RECORD_SAMPLES.map((item) => item.domain));
    for (const domain of REQUIRED_DOMAINS) {
      expect(present.has(domain), `missing domain: ${domain}`).toBe(true);
    }
  });

  it("keeps stable ids, completion record checks, Gurmukhi primary text, and Shahmukhi awareness only", () => {
    const ids = PUNJABI_CANADA_SURVIVAL_COMPLETION_RECORD_SAMPLES.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => id.startsWith("pa-ca-completion-record-"))).toBe(true);

    const checks = new Set(PUNJABI_CANADA_SURVIVAL_COMPLETION_RECORD_SAMPLES.map((item) => item.check));
    expect(checks.has("pre_a11_completion_record")).toBe(true);
    expect(checks.has("inventory_seal")).toBe(true);
    expect(checks.has("catalog")).toBe(true);
    expect(checks.has("pre_integration")).toBe(true);

    for (const item of PUNJABI_CANADA_SURVIVAL_COMPLETION_RECORD_SAMPLES) {
      expect(item.phrase_pa).toMatch(GURMUKHI);
      expect(item.phrase_pa).not.toMatch(SHAHMUKHI);
      expect(item.support_pa.length).toBeGreaterThanOrEqual(2);
      for (const line of item.support_pa) {
        expect(line).toMatch(GURMUKHI);
        expect(line).not.toMatch(SHAHMUKHI);
      }
    }
  });

  it("includes romanization plus Vietnamese and English completionRecord guidance", () => {
    for (const item of PUNJABI_CANADA_SURVIVAL_COMPLETION_RECORD_SAMPLES) {
      expect(item.romanization.length).toBeGreaterThan(8);
      expect(item.meaning_vi.length).toBeGreaterThan(12);
      expect(item.meaning_en.length).toBeGreaterThan(12);
      expect(item.canada_context_vi).toMatch(/Canada|Ở Canada|Dùng/u);
      expect(item.canada_context_en).toMatch(/Canada|In Canada|Use/u);
      expect(item.completionRecord_note_vi.length).toBeGreaterThan(30);
      expect(item.completionRecord_note_en.length).toBeGreaterThan(30);
      expect(item.readiness_signal_vi.length).toBeGreaterThan(30);
      expect(item.readiness_signal_en.length).toBeGreaterThan(30);
      expect(item.boundary_vi.length).toBeGreaterThan(20);
      expect(item.boundary_en.length).toBeGreaterThan(20);
    }
  });

  it("includes practical content, pre-A11 completion record, inventory seal, catalog, and pre-integration coverage", () => {
    const allText = JSON.stringify({
      scope: PUNJABI_CANADA_SURVIVAL_COMPLETION_RECORD_SCOPE,
      samples: PUNJABI_CANADA_SURVIVAL_COMPLETION_RECORD_SAMPLES,
    }).toLowerCase();
    for (const term of [
      "clinic",
      "pharmacy",
      "school",
      "bank",
      "housing",
      "transit",
      "public office",
      "forms",
      "interpreter",
      "emergency",
      "service recovery",
      "workplace",
      "pre-a11-completion-record",
      "inventory_seal",
      "catalog",
      "pre-integration",
    ]) {
      expect(allText).toContain(term);
    }

    const traps = PUNJABI_CANADA_SURVIVAL_COMPLETION_RECORD_SAMPLES.filter(
      (item) => item.learner_trap_vi && item.learner_trap_en,
    );
    expect(traps.length).toBeGreaterThanOrEqual(10);
  });

  it("keeps restricted integration and scoring concepts out of the data", () => {
    const allText = JSON.stringify(PUNJABI_CANADA_SURVIVAL_COMPLETION_RECORD_SAMPLES);
    expect(allText).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
    expect(allText).not.toMatch(/native reviewed|reviewed by native|native-approved|full Shahmukhi course|Shahmukhi lesson/i);
  });
});
