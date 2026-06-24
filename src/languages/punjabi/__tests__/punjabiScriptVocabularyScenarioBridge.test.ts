// src/languages/punjabi/__tests__/punjabiScriptVocabularyScenarioBridge.test.ts
//
// Structural guards for Punjabi script vocabulary scenario bridge.
// Native linguistic review is intentionally deferred.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_SCRIPT_VOCABULARY_SCENARIO_BRIDGE,
  PUNJABI_SCRIPT_VOCABULARY_SCENARIO_BRIDGE_ITEMS,
  PUNJABI_SCRIPT_VOCABULARY_SCENARIO_BRIDGE_SCOPE,
  type PunjabiScenarioBridgeDomain,
} from "@/languages/punjabi/scriptVocabularyScenarioBridge";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const REQUIRED_DOMAINS: ReadonlyArray<PunjabiScenarioBridgeDomain> = [
  "signage",
  "service_counters",
  "workplace_safety",
  "school_notes",
  "clinic_words",
  "transport_words",
  "high_frequency_verbs",
  "collocations",
  "romanization_bridge",
  "shahmukhi_awareness",
];

describe("Punjabi script vocabulary scenario bridge", () => {
  it("is app-consumable sectioned TypeScript data", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_SCENARIO_BRIDGE.length).toBe(REQUIRED_DOMAINS.length);
    for (const section of PUNJABI_SCRIPT_VOCABULARY_SCENARIO_BRIDGE) {
      expect(section.title_vi.trim().length).toBeGreaterThan(0);
      expect(section.title_en.trim().length).toBeGreaterThan(0);
      expect(section.bridgeGoal_vi.trim().length).toBeGreaterThan(30);
      expect(section.bridgeGoal_en.trim().length).toBeGreaterThan(30);
      expect(section.items.length).toBeGreaterThan(0);
    }
  });

  it("covers all Wave 14 scenario domains", () => {
    const domains = new Set(PUNJABI_SCRIPT_VOCABULARY_SCENARIO_BRIDGE.map((section) => section.domain));
    for (const domain of REQUIRED_DOMAINS) {
      expect(domains.has(domain), `missing ${domain}`).toBe(true);
    }
  });

  it("has enough compact scenario entries to be useful", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_SCENARIO_BRIDGE_ITEMS.length).toBeGreaterThanOrEqual(22);
    expect(PUNJABI_SCRIPT_VOCABULARY_SCENARIO_BRIDGE_ITEMS.length).toBeLessThanOrEqual(60);
  });

  it("uses Gurmukhi primary with bilingual scenario, meaning, response, and routing", () => {
    for (const item of PUNJABI_SCRIPT_VOCABULARY_SCENARIO_BRIDGE_ITEMS) {
      expect(GURMUKHI_RANGE.test(item.gurmukhi), `Gurmukhi for ${item.id}`).toBe(true);
      expect(item.scenario_vi.trim().length, `scenario vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.scenario_en.trim().length, `scenario en for ${item.id}`).toBeGreaterThan(25);
      expect(item.meaning_vi.trim().length, `meaning vi for ${item.id}`).toBeGreaterThan(15);
      expect(item.meaning_en.trim().length, `meaning en for ${item.id}`).toBeGreaterThan(15);
      expect(item.learnerResponse_vi.trim().length, `response vi for ${item.id}`).toBeGreaterThan(25);
      expect(item.learnerResponse_en.trim().length, `response en for ${item.id}`).toBeGreaterThan(25);
      expect(item.routing_vi.trim().length, `routing vi for ${item.id}`).toBeGreaterThan(20);
      expect(item.routing_en.trim().length, `routing en for ${item.id}`).toBeGreaterThan(20);
    }
  });

  it("keeps ids unique and domains aligned", () => {
    const ids = new Set<string>();
    for (const section of PUNJABI_SCRIPT_VOCABULARY_SCENARIO_BRIDGE) {
      for (const item of section.items) {
        expect(ids.has(item.id), `duplicate id: ${item.id}`).toBe(false);
        expect(item.domain).toBe(section.domain);
        ids.add(item.id);
      }
    }
  });

  it("includes romanization, traps, Canada examples, readiness, review, and routing actions", () => {
    const romanized = PUNJABI_SCRIPT_VOCABULARY_SCENARIO_BRIDGE_ITEMS.filter((item) => item.romanization);
    const traps = PUNJABI_SCRIPT_VOCABULARY_SCENARIO_BRIDGE_ITEMS.filter((item) => item.learnerTrap);
    const canada = PUNJABI_SCRIPT_VOCABULARY_SCENARIO_BRIDGE_ITEMS.filter((item) => item.canadaPractical);
    const readiness = PUNJABI_SCRIPT_VOCABULARY_SCENARIO_BRIDGE_ITEMS.filter((item) => item.integrationReadiness);
    const review = PUNJABI_SCRIPT_VOCABULARY_SCENARIO_BRIDGE_ITEMS.filter((item) => item.review);
    const routeActions = PUNJABI_SCRIPT_VOCABULARY_SCENARIO_BRIDGE_ITEMS.filter((item) => item.action === "route_to_review");
    expect(romanized.length).toBeGreaterThanOrEqual(20);
    expect(traps.length).toBeGreaterThanOrEqual(10);
    expect(canada.length).toBeGreaterThanOrEqual(15);
    expect(readiness.length).toBeGreaterThanOrEqual(5);
    expect(review.length).toBeGreaterThanOrEqual(5);
    expect(routeActions.length).toBeGreaterThanOrEqual(2);
  });

  it("bridges the requested real-world scenarios", () => {
    const blob = PUNJABI_SCRIPT_VOCABULARY_SCENARIO_BRIDGE_ITEMS
      .map((item) => `${item.domain} ${item.gurmukhi} ${item.romanization ?? ""} ${item.scenario_vi} ${item.scenario_en} ${item.meaning_vi} ${item.meaning_en}`)
      .join(" ");
    expect(blob).toMatch(/ਨਿਕਾਸ|ਐਮਰਜੈਂਸੀ|ਫਾਰਮੇਸੀ/);
    expect(blob).toMatch(/ਫਾਰਮ ਭਰਨਾ|ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ|ਗਲਤੀ ਠੀਕ ਕਰਨਾ/);
    expect(blob).toMatch(/ਖਤਰਾ|ਸੁਰੱਖਿਆ/);
    expect(blob).toMatch(/ਸਕੂਲ|ਪਰਿਵਾਰ/);
    expect(blob).toMatch(/ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ|ਦਵਾਈ/);
    expect(blob).toMatch(/ਬੱਸ ਅੱਡਾ|ਰੇਲਵੇ ਸਟੇਸ਼ਨ ਨਿਕਾਸ/);
    expect(blob).toMatch(/ਅਨੁਵਾਦ ਕਰਨਾ|ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ/);
    expect(blob).toMatch(/ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ/);
  });

  it("includes romanization bridge variants while keeping Gurmukhi primary", () => {
    const bridge = PUNJABI_SCRIPT_VOCABULARY_SCENARIO_BRIDGE_ITEMS.filter((item) => item.domain === "romanization_bridge");
    const blob = bridge.map((item) => `${item.gurmukhi} ${item.romanization} ${item.learnerResponse_vi} ${item.learnerResponse_en} ${item.routing_vi} ${item.routing_en}`).join(" ");
    expect(bridge.length).toBeGreaterThanOrEqual(3);
    expect(blob).toMatch(/phal\/fal|vadda\/wadda|shahir\/shehar/);
    expect(blob).toMatch(/Gurmukhi|ਗੁਰਮੁਖੀ/);
  });

  it("keeps Shahmukhi awareness only and native review deferred", () => {
    const shahmukhi = PUNJABI_SCRIPT_VOCABULARY_SCENARIO_BRIDGE_ITEMS.filter((item) => item.domain === "shahmukhi_awareness");
    expect(shahmukhi.length).toBe(1);
    const blob = [
      PUNJABI_SCRIPT_VOCABULARY_SCENARIO_BRIDGE_SCOPE.vi,
      PUNJABI_SCRIPT_VOCABULARY_SCENARIO_BRIDGE_SCOPE.en,
      ...shahmukhi.map((item) => `${item.learnerResponse_vi} ${item.learnerResponse_en}`),
    ].join(" ").toLowerCase();
    expect(blob).toMatch(/not a full shahmukhi course|không phải khóa shahmukhi đầy đủ/);
    expect(blob).toMatch(/native review .*deferred|native review được hoãn/);
    expect(blob).not.toMatch(/native reviewed|reviewed by native|đã được native review/);
  });

  it("does not introduce forbidden integration or scoring concepts", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_SCENARIO_BRIDGE_SCOPE.noAudioScoringOrIntegration).toBe(true);
    const blob = JSON.stringify(PUNJABI_SCRIPT_VOCABULARY_SCENARIO_BRIDGE).toLowerCase();
    expect(blob).not.toMatch(/azure|supabase|auth|billing|rls|pronunciation scoring|audio/);
  });
});
