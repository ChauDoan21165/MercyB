import { describe, expect, it } from "vitest";

import smokeDeck, {
  PUNJABI_CANADA_SURVIVAL_SMOKE_DECK,
  PUNJABI_CANADA_SURVIVAL_SMOKE_DOMAINS,
  PUNJABI_CANADA_SURVIVAL_SMOKE_SCOPE,
  type PunjabiCanadaSurvivalSmokeDomain,
} from "@/languages/punjabi/canadaSurvivalSmokeDeck";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const REQUIRED_DOMAINS: PunjabiCanadaSurvivalSmokeDomain[] = [
  "clinic",
  "pharmacy",
  "school_childcare",
  "bank",
  "housing",
  "transport",
  "public_office",
  "service_desk",
  "interpreter_request",
  "emergency_boundary",
  "workplace_safety",
];

describe("Punjabi Canada survival smoke deck", () => {
  it("exports compact app-consumable TypeScript data", () => {
    expect(smokeDeck).toBe(PUNJABI_CANADA_SURVIVAL_SMOKE_DECK);
    expect(PUNJABI_CANADA_SURVIVAL_SMOKE_DECK.length).toBeGreaterThanOrEqual(REQUIRED_DOMAINS.length);
    expect(PUNJABI_CANADA_SURVIVAL_SMOKE_DECK.length).toBeLessThanOrEqual(13);
    expect(PUNJABI_CANADA_SURVIVAL_SMOKE_SCOPE.name).toContain("Smoke Deck");
  });

  it("declares script policy, smoke scope, and deferred review without overclaiming", () => {
    const scope = `${PUNJABI_CANADA_SURVIVAL_SMOKE_SCOPE.scriptPolicy} ${PUNJABI_CANADA_SURVIVAL_SMOKE_SCOPE.reviewStatus} ${PUNJABI_CANADA_SURVIVAL_SMOKE_SCOPE.smokeBoundary}`.toLowerCase();

    expect(scope).toContain("gurmukhi is primary");
    expect(scope).toContain("shahmukhi is awareness only");
    expect(scope).toContain("not a full course");
    expect(scope).toContain("native review is deferred");
    expect(scope).toContain("not a11 integration");
    expect(scope).toContain("not legal advice");
    expect(scope).toContain("not medical advice");
    expect(scope).toContain("not financial advice");
  });

  it("covers representative Canada survival smoke deck domains", () => {
    expect(new Set(PUNJABI_CANADA_SURVIVAL_SMOKE_DOMAINS)).toEqual(new Set(REQUIRED_DOMAINS));

    const present = new Set(PUNJABI_CANADA_SURVIVAL_SMOKE_DECK.map((item) => item.domain));
    for (const domain of REQUIRED_DOMAINS) {
      expect(present.has(domain), `missing domain: ${domain}`).toBe(true);
    }
  });

  it("keeps stable ids, check types, Gurmukhi primary text, and Shahmukhi awareness only", () => {
    const ids = PUNJABI_CANADA_SURVIVAL_SMOKE_DECK.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => id.startsWith("pa-ca-smoke-"))).toBe(true);

    const checks = new Set(PUNJABI_CANADA_SURVIVAL_SMOKE_DECK.map((item) => item.check));
    expect(checks.has("smoke_check")).toBe(true);
    expect(checks.has("final_qa")).toBe(true);
    expect(checks.has("integration_readiness")).toBe(true);
    expect(checks.has("repair")).toBe(true);

    for (const item of PUNJABI_CANADA_SURVIVAL_SMOKE_DECK) {
      expect(item.phrase_pa).toMatch(GURMUKHI);
      expect(item.phrase_pa).not.toMatch(SHAHMUKHI);
      expect(item.support_pa.length).toBeGreaterThanOrEqual(2);
      for (const line of item.support_pa) {
        expect(line).toMatch(GURMUKHI);
        expect(line).not.toMatch(SHAHMUKHI);
      }
    }
  });

  it("includes romanization plus Vietnamese and English smoke-check guidance", () => {
    for (const item of PUNJABI_CANADA_SURVIVAL_SMOKE_DECK) {
      expect(item.romanization.length).toBeGreaterThan(8);
      expect(item.task_vi.length).toBeGreaterThan(15);
      expect(item.task_en.length).toBeGreaterThan(15);
      expect(item.meaning_vi.length).toBeGreaterThan(12);
      expect(item.meaning_en.length).toBeGreaterThan(12);
      expect(item.canada_context_vi).toMatch(/Canada|Ở Canada|Dùng/u);
      expect(item.canada_context_en).toMatch(/Canada|In Canada|Use/u);
      expect(item.smoke_expectation_vi.length).toBeGreaterThan(25);
      expect(item.smoke_expectation_en.length).toBeGreaterThan(25);
      expect(item.readiness_note_vi.length).toBeGreaterThan(25);
      expect(item.readiness_note_en.length).toBeGreaterThan(25);
      expect(item.boundary_vi.length).toBeGreaterThan(20);
      expect(item.boundary_en.length).toBeGreaterThan(20);
    }
  });

  it("includes smoke-check, final-QA, integration-readiness, and survival task coverage", () => {
    const allText = JSON.stringify(PUNJABI_CANADA_SURVIVAL_SMOKE_DECK).toLowerCase();
    for (const term of [
      "clinic",
      "pharmacy",
      "school",
      "bank",
      "housing",
      "transit",
      "public office",
      "service desk",
      "interpreter",
      "emergency",
      "workplace",
      "smoke check",
      "final qa",
      "integration-readiness",
      "repair",
    ]) {
      expect(allText).toContain(term);
    }

    const traps = PUNJABI_CANADA_SURVIVAL_SMOKE_DECK.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(9);
  });

  it("keeps restricted integration and scoring concepts out of the data", () => {
    const allText = JSON.stringify(PUNJABI_CANADA_SURVIVAL_SMOKE_DECK);
    expect(allText).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
    expect(allText).not.toMatch(/native reviewed|reviewed by native|native-approved|full Shahmukhi course|Shahmukhi lesson/i);
  });
});
