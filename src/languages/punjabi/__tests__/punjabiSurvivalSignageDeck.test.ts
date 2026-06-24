// src/languages/punjabi/__tests__/punjabiSurvivalSignageDeck.test.ts
//
// Structural guards for the Punjabi survival signage deck.
// These tests do not assert native-level linguistic review; that is deferred.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_SURVIVAL_SIGNAGE_DECK,
  PUNJABI_SURVIVAL_SIGNAGE_ENTRIES,
  PUNJABI_SURVIVAL_SIGNAGE_SCOPE,
  type PunjabiSurvivalSignageDomain,
} from "@/languages/punjabi/survivalSignageDeck";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const REQUIRED_DOMAINS: ReadonlyArray<PunjabiSurvivalSignageDomain> = [
  "clinic",
  "school",
  "transport",
  "housing",
  "workplace_safety",
  "bank_service_counter",
  "public_office",
  "gurmukhi_romanization_bridge",
  "shahmukhi_awareness",
];

describe("Punjabi survival signage deck", () => {
  it("is app-consumable sectioned TypeScript data", () => {
    expect(PUNJABI_SURVIVAL_SIGNAGE_DECK.length).toBe(REQUIRED_DOMAINS.length);
    for (const section of PUNJABI_SURVIVAL_SIGNAGE_DECK) {
      expect(section.title_vi.trim().length).toBeGreaterThan(0);
      expect(section.title_en.trim().length).toBeGreaterThan(0);
      expect(section.purpose_vi.trim().length).toBeGreaterThan(20);
      expect(section.purpose_en.trim().length).toBeGreaterThan(20);
      expect(section.entries.length).toBeGreaterThan(0);
    }
  });

  it("covers all Wave 9 signage domains", () => {
    const domains = new Set(PUNJABI_SURVIVAL_SIGNAGE_DECK.map((section) => section.domain));
    for (const domain of REQUIRED_DOMAINS) {
      expect(domains.has(domain), `missing ${domain}`).toBe(true);
    }
  });

  it("has enough compact entries to be useful", () => {
    expect(PUNJABI_SURVIVAL_SIGNAGE_ENTRIES.length).toBeGreaterThanOrEqual(45);
    expect(PUNJABI_SURVIVAL_SIGNAGE_ENTRIES.length).toBeLessThanOrEqual(100);
  });

  it("uses Gurmukhi primary with romanization and bilingual practical guidance", () => {
    for (const entry of PUNJABI_SURVIVAL_SIGNAGE_ENTRIES) {
      expect(GURMUKHI_RANGE.test(entry.gurmukhi), `Gurmukhi for ${entry.id}`).toBe(true);
      expect(entry.romanization.trim().length, `romanization for ${entry.id}`).toBeGreaterThan(0);
      expect(entry.vi.trim().length, `vi for ${entry.id}`).toBeGreaterThan(0);
      expect(entry.en.trim().length, `en for ${entry.id}`).toBeGreaterThan(0);
      expect(entry.whereSeen_vi.trim().length, `where vi for ${entry.id}`).toBeGreaterThan(15);
      expect(entry.whereSeen_en.trim().length, `where en for ${entry.id}`).toBeGreaterThan(15);
      expect(entry.action_vi.trim().length, `action vi for ${entry.id}`).toBeGreaterThan(15);
      expect(entry.action_en.trim().length, `action en for ${entry.id}`).toBeGreaterThan(15);
    }
  });

  it("keeps ids unique and domains aligned", () => {
    const ids = new Set<string>();
    for (const section of PUNJABI_SURVIVAL_SIGNAGE_DECK) {
      for (const entry of section.entries) {
        expect(ids.has(entry.id), `duplicate id: ${entry.id}`).toBe(false);
        expect(entry.domain).toBe(section.domain);
        ids.add(entry.id);
      }
    }
  });

  it("includes common learner traps and Canada-practical signs", () => {
    const traps = PUNJABI_SURVIVAL_SIGNAGE_ENTRIES.filter((entry) => entry.learnerTrap);
    const canada = PUNJABI_SURVIVAL_SIGNAGE_ENTRIES.filter((entry) => entry.canadaPractical);
    expect(traps.length).toBeGreaterThanOrEqual(10);
    expect(canada.length).toBeGreaterThanOrEqual(45);
    expect(canada.some((entry) => entry.gurmukhi === "ਫਾਰਮੇਸੀ")).toBe(true);
    expect(canada.some((entry) => entry.gurmukhi === "ਬੱਸ ਅੱਡਾ")).toBe(true);
    expect(canada.some((entry) => entry.gurmukhi === "ਐਮਰਜੈਂਸੀ ਨਿਕਾਸ")).toBe(true);
  });

  it("includes Gurmukhi and romanization bridge material", () => {
    const bridge = PUNJABI_SURVIVAL_SIGNAGE_ENTRIES.filter((entry) => entry.domain === "gurmukhi_romanization_bridge");
    expect(bridge.length).toBeGreaterThanOrEqual(6);
    const blob = bridge.map((entry) => `${entry.gurmukhi} ${entry.romanization} ${entry.learnerTrap?.vi ?? ""} ${entry.learnerTrap?.en ?? ""}`).join(" ");
    expect(blob).toMatch(/pharmacy\/farmacy|vancouver\/wancouver|ki\/kii/);
    expect(blob).toMatch(/romanization|Gurmukhi|Latin/);
  });

  it("keeps Shahmukhi as awareness only and avoids native-review claims", () => {
    const shahmukhi = PUNJABI_SURVIVAL_SIGNAGE_ENTRIES.filter((entry) => entry.domain === "shahmukhi_awareness");
    expect(shahmukhi.length).toBe(1);
    const blob = [
      PUNJABI_SURVIVAL_SIGNAGE_SCOPE.vi,
      PUNJABI_SURVIVAL_SIGNAGE_SCOPE.en,
      ...shahmukhi.map((entry) => `${entry.learnerTrap?.vi ?? ""} ${entry.learnerTrap?.en ?? ""}`),
    ].join(" ").toLowerCase();
    expect(blob).toMatch(/not a full shahmukhi course|không phải khóa shahmukhi đầy đủ/);
    expect(blob).toMatch(/native review .*deferred|native review được hoãn/);
    expect(blob).not.toMatch(/native reviewed|reviewed by native/);
  });

  it("states no pronunciation scoring", () => {
    const blob = `${PUNJABI_SURVIVAL_SIGNAGE_SCOPE.vi} ${PUNJABI_SURVIVAL_SIGNAGE_SCOPE.en}`.toLowerCase();
    expect(blob).toMatch(/not pronunciation scoring|không phải phát âm chấm điểm/);
  });
});
