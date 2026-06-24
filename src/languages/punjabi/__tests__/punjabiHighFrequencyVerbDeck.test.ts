// src/languages/punjabi/__tests__/punjabiHighFrequencyVerbDeck.test.ts
//
// Structural guards for the Punjabi high-frequency verb deck.
// These tests do not assert native-level linguistic review; that is deferred.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_HIGH_FREQUENCY_VERB_DECK,
  PUNJABI_HIGH_FREQUENCY_VERB_ENTRIES,
  PUNJABI_HIGH_FREQUENCY_VERB_SCOPE,
  type PunjabiVerbDomain,
} from "@/languages/punjabi/highFrequencyVerbDeck";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const REQUIRED_DOMAINS: ReadonlyArray<PunjabiVerbDomain> = [
  "daily_actions",
  "service_needs",
  "workplace_actions",
  "health_descriptions",
  "public_service_requests",
  "gurmukhi_romanization_bridge",
  "shahmukhi_awareness",
];

describe("Punjabi high-frequency verb deck", () => {
  it("is app-consumable sectioned TypeScript data", () => {
    expect(PUNJABI_HIGH_FREQUENCY_VERB_DECK.length).toBe(REQUIRED_DOMAINS.length);
    for (const section of PUNJABI_HIGH_FREQUENCY_VERB_DECK) {
      expect(section.title_vi.trim().length).toBeGreaterThan(0);
      expect(section.title_en.trim().length).toBeGreaterThan(0);
      expect(section.purpose_vi.trim().length).toBeGreaterThan(20);
      expect(section.purpose_en.trim().length).toBeGreaterThan(20);
      expect(section.entries.length).toBeGreaterThan(0);
    }
  });

  it("covers all Wave 7 verb domains", () => {
    const domains = new Set(PUNJABI_HIGH_FREQUENCY_VERB_DECK.map((section) => section.domain));
    for (const domain of REQUIRED_DOMAINS) {
      expect(domains.has(domain), `missing ${domain}`).toBe(true);
    }
  });

  it("has enough compact A1-B2 entries to be useful", () => {
    expect(PUNJABI_HIGH_FREQUENCY_VERB_ENTRIES.length).toBeGreaterThanOrEqual(45);
    expect(PUNJABI_HIGH_FREQUENCY_VERB_ENTRIES.length).toBeLessThanOrEqual(90);
    expect(new Set(PUNJABI_HIGH_FREQUENCY_VERB_ENTRIES.map((entry) => entry.level))).toEqual(new Set(["A1", "A2", "B1", "B2"]));
  });

  it("uses Gurmukhi primary with romanization and bilingual explanations", () => {
    for (const entry of PUNJABI_HIGH_FREQUENCY_VERB_ENTRIES) {
      expect(GURMUKHI_RANGE.test(entry.gurmukhi), `Gurmukhi for ${entry.id}`).toBe(true);
      expect(entry.romanization.trim().length, `romanization for ${entry.id}`).toBeGreaterThan(0);
      expect(entry.vi.trim().length, `vi for ${entry.id}`).toBeGreaterThan(0);
      expect(entry.en.trim().length, `en for ${entry.id}`).toBeGreaterThan(0);
      expect(GURMUKHI_RANGE.test(entry.exampleGurmukhi), `example for ${entry.id}`).toBe(true);
      expect(entry.exampleRomanization.trim().length, `example romanization for ${entry.id}`).toBeGreaterThan(0);
      expect(entry.example_vi.trim().length, `example vi for ${entry.id}`).toBeGreaterThan(0);
      expect(entry.example_en.trim().length, `example en for ${entry.id}`).toBeGreaterThan(0);
    }
  });

  it("keeps ids unique and domains aligned", () => {
    const ids = new Set<string>();
    for (const section of PUNJABI_HIGH_FREQUENCY_VERB_DECK) {
      for (const entry of section.entries) {
        expect(ids.has(entry.id), `duplicate id: ${entry.id}`).toBe(false);
        expect(entry.domain).toBe(section.domain);
        ids.add(entry.id);
      }
    }
  });

  it("includes common learner traps and Canada-practical examples", () => {
    const traps = PUNJABI_HIGH_FREQUENCY_VERB_ENTRIES.filter((entry) => entry.learnerTrap);
    const canada = PUNJABI_HIGH_FREQUENCY_VERB_ENTRIES.filter((entry) => entry.canadaPractical);
    expect(traps.length).toBeGreaterThanOrEqual(10);
    expect(canada.length).toBeGreaterThanOrEqual(24);
    expect(canada.some((entry) => entry.gurmukhi === "ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ")).toBe(true);
    expect(canada.some((entry) => entry.gurmukhi === "ਫਾਰਮ ਭਰਨਾ" || entry.exampleGurmukhi.includes("ਫਾਰਮ"))).toBe(true);
  });

  it("includes Gurmukhi and romanization bridge material", () => {
    const bridge = PUNJABI_HIGH_FREQUENCY_VERB_ENTRIES.filter((entry) => entry.domain === "gurmukhi_romanization_bridge");
    expect(bridge.length).toBeGreaterThanOrEqual(6);
    const blob = bridge.map((entry) => `${entry.gurmukhi} ${entry.romanization} ${entry.learnerTrap?.vi ?? ""} ${entry.learnerTrap?.en ?? ""}`).join(" ");
    expect(blob).toMatch(/ਵੇਖਣਾ/);
    expect(blob).toMatch(/romanization|Gurmukhi/);
  });

  it("keeps Shahmukhi as awareness only and avoids native-review claims", () => {
    const shahmukhi = PUNJABI_HIGH_FREQUENCY_VERB_ENTRIES.filter((entry) => entry.domain === "shahmukhi_awareness");
    expect(shahmukhi.length).toBe(1);
    const blob = [
      PUNJABI_HIGH_FREQUENCY_VERB_SCOPE.vi,
      PUNJABI_HIGH_FREQUENCY_VERB_SCOPE.en,
      ...shahmukhi.map((entry) => `${entry.learnerTrap?.vi ?? ""} ${entry.learnerTrap?.en ?? ""}`),
    ].join(" ").toLowerCase();
    expect(blob).toMatch(/not a full shahmukhi course|không phải khóa shahmukhi đầy đủ/);
    expect(blob).toMatch(/native review .*deferred|native review được hoãn/);
    expect(blob).not.toMatch(/native reviewed|reviewed by native/);
  });

  it("states no pronunciation scoring", () => {
    const blob = `${PUNJABI_HIGH_FREQUENCY_VERB_SCOPE.vi} ${PUNJABI_HIGH_FREQUENCY_VERB_SCOPE.en}`.toLowerCase();
    expect(blob).toMatch(/not pronunciation scoring|không phải phát âm chấm điểm/);
  });
});
