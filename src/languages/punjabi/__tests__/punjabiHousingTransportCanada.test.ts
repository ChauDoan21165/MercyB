import { describe, expect, it } from "vitest";

import housingTransportCanada, {
  PUNJABI_HOUSING_TRANSPORT_CANADA,
  PUNJABI_HOUSING_TRANSPORT_CANADA_SCOPE,
  PUNJABI_HOUSING_TRANSPORT_CANADA_TOPICS,
  type PunjabiHousingTransportCanadaTopic,
} from "@/languages/punjabi/housingTransportCanada";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const REQUIRED_TOPICS: PunjabiHousingTransportCanadaTopic[] = [
  "repair_request",
  "rent_question",
  "viewing_request",
  "address_confirmation",
  "bus_train_help",
  "lost_item",
  "route_question",
  "delay_update",
  "customer_service",
  "safety_boundary",
];

describe("Punjabi Canada housing and transport pack", () => {
  it("exports compact app-consumable TypeScript data", () => {
    expect(housingTransportCanada).toBe(PUNJABI_HOUSING_TRANSPORT_CANADA);
    expect(PUNJABI_HOUSING_TRANSPORT_CANADA.length).toBeGreaterThanOrEqual(REQUIRED_TOPICS.length);
    expect(PUNJABI_HOUSING_TRANSPORT_CANADA.length).toBeLessThanOrEqual(14);
    expect(PUNJABI_HOUSING_TRANSPORT_CANADA_SCOPE.name).toContain("Housing and Transport Pack");
  });

  it("declares scope, script policy, and deferred review without overclaiming", () => {
    const scope = `${PUNJABI_HOUSING_TRANSPORT_CANADA_SCOPE.scriptPolicy} ${PUNJABI_HOUSING_TRANSPORT_CANADA_SCOPE.reviewStatus} ${PUNJABI_HOUSING_TRANSPORT_CANADA_SCOPE.boundary}`.toLowerCase();
    expect(scope).toContain("gurmukhi is primary");
    expect(scope).toContain("shahmukhi is awareness only");
    expect(scope).toContain("not a full course");
    expect(scope).toContain("native review is deferred");
    expect(scope).toContain("not legal advice");
  });

  it("covers the required Canada housing and transport topics", () => {
    expect(new Set(PUNJABI_HOUSING_TRANSPORT_CANADA_TOPICS)).toEqual(new Set(REQUIRED_TOPICS));

    const present = new Set(PUNJABI_HOUSING_TRANSPORT_CANADA.map((item) => item.topic));
    for (const topic of REQUIRED_TOPICS) {
      expect(present.has(topic), `missing topic: ${topic}`).toBe(true);
    }
  });

  it("keeps stable ids and Gurmukhi primary", () => {
    const ids = PUNJABI_HOUSING_TRANSPORT_CANADA.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => id.startsWith("pa-ca-housing-transport-"))).toBe(true);

    for (const item of PUNJABI_HOUSING_TRANSPORT_CANADA) {
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
    for (const item of PUNJABI_HOUSING_TRANSPORT_CANADA) {
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

  it("includes Canada-practical housing and transport vocabulary with learner traps", () => {
    const traps = PUNJABI_HOUSING_TRANSPORT_CANADA.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(8);

    const allText = JSON.stringify(PUNJABI_HOUSING_TRANSPORT_CANADA).toLowerCase();
    for (const term of [
      "repair",
      "rent",
      "viewing",
      "address",
      "bus",
      "train",
      "lost",
      "route",
      "delayed",
      "customer service",
      "safe",
    ]) {
      expect(allText).toContain(term);
    }
  });

  it("keeps forbidden integration and scoring concepts out of the data", () => {
    const allText = JSON.stringify(PUNJABI_HOUSING_TRANSPORT_CANADA);
    expect(allText).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
    expect(allText).not.toMatch(/native reviewed|reviewed by native|native-approved|full Shahmukhi course|Shahmukhi lesson/i);
  });
});
