import { describe, expect, it } from "vitest";

import {
  PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_SAMPLE_ITEMS,
  PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_SAMPLES,
  PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_SAMPLES_SCOPE,
  type PunjabiScriptVocabularyIntegrationArea,
} from "@/languages/punjabi/scriptVocabularyIntegrationSamples";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const REQUIRED_AREAS: ReadonlyArray<PunjabiScriptVocabularyIntegrationArea> = [
  "gurmukhi_recognition",
  "vowel_signs",
  "addak_tippi_bindi",
  "survival_signage",
  "service_words",
  "thematic_vocabulary",
  "high_frequency_verbs",
  "collocations",
  "romanization_bridge",
  "shahmukhi_awareness",
];

describe("Punjabi script vocabulary integration samples", () => {
  it("is app-consumable sectioned TypeScript data", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_SAMPLES.length).toBe(REQUIRED_AREAS.length);
    for (const section of PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_SAMPLES) {
      expect(section.title_vi.trim().length).toBeGreaterThan(0);
      expect(section.title_en.trim().length).toBeGreaterThan(0);
      expect(section.sampleGoal_vi.trim().length).toBeGreaterThan(25);
      expect(section.sampleGoal_en.trim().length).toBeGreaterThan(25);
      expect(section.samples.length).toBeGreaterThan(0);
    }
  });

  it("covers all required integration areas", () => {
    const areas = new Set(PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_SAMPLES.map((section) => section.area));
    for (const area of REQUIRED_AREAS) {
      expect(areas.has(area), `missing ${area}`).toBe(true);
    }
  });

  it("has enough compact integration samples to be useful", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_SAMPLE_ITEMS.length).toBeGreaterThanOrEqual(28);
    expect(PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_SAMPLE_ITEMS.length).toBeLessThanOrEqual(70);
  });

  it("uses Gurmukhi primary with bilingual sample, expectation, and QA prompt", () => {
    for (const item of PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_SAMPLE_ITEMS) {
      expect(GURMUKHI_RANGE.test(item.gurmukhi), `Gurmukhi for ${item.id}`).toBe(true);
      expect(item.sample_vi.trim().length, `sample vi for ${item.id}`).toBeGreaterThan(20);
      expect(item.sample_en.trim().length, `sample en for ${item.id}`).toBeGreaterThan(20);
      expect(item.expected_vi.trim().length, `expected vi for ${item.id}`).toBeGreaterThan(20);
      expect(item.expected_en.trim().length, `expected en for ${item.id}`).toBeGreaterThan(20);
      expect(item.qaPrompt_vi.trim().length, `qa vi for ${item.id}`).toBeGreaterThan(15);
      expect(item.qaPrompt_en.trim().length, `qa en for ${item.id}`).toBeGreaterThan(15);
    }
  });

  it("keeps ids unique and areas aligned", () => {
    const ids = new Set<string>();
    for (const section of PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_SAMPLES) {
      for (const item of section.samples) {
        expect(ids.has(item.id), `duplicate id: ${item.id}`).toBe(false);
        expect(item.area).toBe(section.area);
        ids.add(item.id);
      }
    }
  });

  it("includes romanization, traps, Canada examples, final evidence, and final QA", () => {
    const romanized = PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_SAMPLE_ITEMS.filter((item) => item.romanization);
    const traps = PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_SAMPLE_ITEMS.filter((item) => item.learnerTrap);
    const canada = PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_SAMPLE_ITEMS.filter((item) => item.canadaPractical);
    const evidence = PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_SAMPLE_ITEMS.filter((item) => item.finalEvidence);
    const finalQA = PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_SAMPLE_ITEMS.filter((item) => item.finalQA);
    const integration = PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_SAMPLE_ITEMS.filter((item) => item.integrationReady);
    expect(romanized.length).toBeGreaterThanOrEqual(25);
    expect(traps.length).toBeGreaterThanOrEqual(10);
    expect(canada.length).toBeGreaterThanOrEqual(10);
    expect(evidence.length).toBeGreaterThanOrEqual(8);
    expect(finalQA.length).toBeGreaterThanOrEqual(8);
    expect(integration.length).toBeGreaterThanOrEqual(2);
  });

  it("covers the requested script and vocabulary sample domains", () => {
    const blob = PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_SAMPLE_ITEMS
      .map((item) => `${item.area} ${item.gurmukhi} ${item.romanization ?? ""} ${item.sample_vi} ${item.sample_en} ${item.expected_vi} ${item.expected_en}`)
      .join(" ");
    expect(blob).toMatch(/ਕ \/ ਖ|ਤ \/ ਟ|ਸ਼ਹਿਰ/);
    expect(blob).toMatch(/ਕਿ \/ ਕੀ|ਕੁ \/ ਕੂ|ਕੇ \/ ਕੈ \/ ਕੌ/);
    expect(blob).toMatch(/ਬੱਸ ਅੱਡਾ|ਮਾਂ|ਪੰਜਾਬ/);
    expect(blob).toMatch(/ਐਮਰਜੈਂਸੀ|ਨਿਕਾਸ|ਫਾਰਮੇਸੀ/);
    expect(blob).toMatch(/ਫਾਰਮ|ਐਪਾਇੰਟਮੈਂਟ|ਸਕੂਲ/);
    expect(blob).toMatch(/ਪਰਿਵਾਰ|ਦਵਾਈ|ਕਿਰਾਇਆ/);
    expect(blob).toMatch(/ਕਰਨਾ|ਲੈਣਾ|ਸਮਝ ਨਹੀਂ ਆਈ/);
    expect(blob).toMatch(/ਮਦਦ ਚਾਹੀਦੀ ਹੈ|ਫਾਰਮ ਭਰਨਾ|ਗਲਤੀ ਠੀਕ ਕਰਨਾ/);
    expect(blob).toMatch(/phal\/fal|vadda\/wadda|shahir\/shehar/);
  });

  it("uses integration-sample, final-evidence, and final-QA sample types", () => {
    const uses = new Set(PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_SAMPLE_ITEMS.map((item) => item.use));
    expect(uses.has("integration_sample")).toBe(true);
    expect(uses.has("final_evidence")).toBe(true);
    expect(uses.has("final_qa")).toBe(true);
  });

  it("keeps Shahmukhi awareness only and native review deferred", () => {
    const shahmukhi = PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_SAMPLE_ITEMS.filter((item) => item.area === "shahmukhi_awareness");
    expect(shahmukhi.length).toBe(1);
    const blob = [
      PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_SAMPLES_SCOPE.vi,
      PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_SAMPLES_SCOPE.en,
      ...shahmukhi.map((item) => `${item.expected_vi} ${item.expected_en} ${item.qaPrompt_vi} ${item.qaPrompt_en}`),
    ].join(" ").toLowerCase();
    expect(blob).toMatch(/not a full shahmukhi course|không phải khóa shahmukhi đầy đủ/);
    expect(blob).toMatch(/native review .*deferred|native review được hoãn/);
    expect(blob).not.toMatch(/native reviewed|reviewed by native|đã được native review/);
  });

  it("does not introduce forbidden integration or scoring concepts", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_SAMPLES_SCOPE.noAudioScoringOrIntegration).toBe(true);
    const blob = JSON.stringify(PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_SAMPLES).toLowerCase();
    expect(blob).not.toMatch(/azure|supabase|auth|billing|rls|pronunciation scoring|audio/);
  });
});
