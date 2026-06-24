import { describe, expect, it } from "vitest";

import punjabiA1IntegrationSamples, {
  integrationSamplesScriptAwareness,
  punjabiA1IntegrationSamples as namedIntegrationSamples,
  type PunjabiIntegrationSampleDomain,
  type PunjabiIntegrationSampleKind,
} from "@/languages/punjabi/integrationSamplesA1";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 integration samples", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(punjabiA1IntegrationSamples).toBe(namedIntegrationSamples);
    expect(Array.isArray(punjabiA1IntegrationSamples)).toBe(true);
  });

  it("is compact and covers required integration domains", () => {
    expect(punjabiA1IntegrationSamples.length).toBeGreaterThanOrEqual(10);
    expect(punjabiA1IntegrationSamples.length).toBeLessThanOrEqual(18);

    const requiredDomains: PunjabiIntegrationSampleDomain[] = [
      "greetings",
      "identity",
      "family",
      "numbers",
      "food",
      "directions",
      "help_request",
      "polite_service_counter",
      "gurmukhi_recognition",
      "canada_survival",
    ];
    const domains = new Set(punjabiA1IntegrationSamples.map((item) => item.domain));

    for (const domain of requiredDomains) {
      expect(domains, `missing domain ${domain}`).toContain(domain);
    }
  });

  it("includes integration-sample, final-evidence, and final-QA styles", () => {
    const requiredKinds: PunjabiIntegrationSampleKind[] = [
      "integration_sample",
      "final_evidence",
      "final_qa",
    ];
    const kinds = new Set(punjabiA1IntegrationSamples.map((item) => item.kind));

    for (const kind of requiredKinds) {
      expect(kinds, `missing kind ${kind}`).toContain(kind);
    }
  });

  it("uses Gurmukhi primary, romanization where useful, bilingual explanations, and source links", () => {
    for (const item of punjabiA1IntegrationSamples) {
      expect(item.id).toMatch(/^pa_a1_integration_/);
      expect(item.integration_slot.trim().length).toBeGreaterThan(0);
      expect(item.sample_pa).toMatch(GURMUKHI_SCRIPT);
      expect(item.prompt_vi.trim().length).toBeGreaterThan(0);
      expect(item.prompt_en.trim().length).toBeGreaterThan(0);
      expect(item.meaning_vi.trim().length).toBeGreaterThan(0);
      expect(item.meaning_en.trim().length).toBeGreaterThan(0);
      expect(item.explanation_vi.trim().length).toBeGreaterThan(0);
      expect(item.explanation_en.trim().length).toBeGreaterThan(0);
      expect(item.evidence_vi.trim().length).toBeGreaterThan(0);
      expect(item.evidence_en.trim().length).toBeGreaterThan(0);
      expect(item.suggested_sources.length).toBeGreaterThanOrEqual(2);

      for (const source of item.suggested_sources) {
        expect(source).toMatch(/^pa_a1_/);
      }
      if (item.romanization) {
        expect(item.romanization).toMatch(LATIN);
      }
    }
  });

  it("includes learner traps and Canada-practical integration examples", () => {
    const traps = punjabiA1IntegrationSamples.flatMap((item) => item.learner_trap ? [item.learner_trap] : []);
    const trapAudiences = new Set(traps.map((trap) => trap.audience));
    const canadaItems = punjabiA1IntegrationSamples.filter((item) => item.canada_practical);

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(trapAudiences.has("vi") || trapAudiences.has("both")).toBe(true);
    expect(trapAudiences.has("en") || trapAudiences.has("both")).toBe(true);
    expect(canadaItems.length).toBeGreaterThanOrEqual(8);
    expect(JSON.stringify(canadaItems)).toMatch(/ਫਾਰਮ|ਟਿਕਟ|ਡਾਲਰ|ਕਲਿਨਿਕ|ਅਪਾਇੰਟਮੈਂਟ|ਪਛਾਣ|ਬੱਸ|ਮਦਦ|ਬੈਗ|ਦੁਬਾਰਾ/);
  });

  it("covers the representative A1 integration surface for later wiring", () => {
    const allText = JSON.stringify(punjabiA1IntegrationSamples);

    expect(allText).toMatch(/ਸਤ ਸ੍ਰੀ ਅਕਾਲ|ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ/);
    expect(allText).toMatch(/ਮੇਰਾ ਨਾਮ|ਤੁਹਾਡਾ ਨਾਮ/);
    expect(allText).toMatch(/ਮੇਰੀ ਮਾਂ|ਮੇਰੇ ਕੋਲ ਇੱਕ ਭੈਣ/);
    expect(allText).toMatch(/ਦੋ ਟਿਕਟਾਂ|ਪੰਜ ਡਾਲਰ/);
    expect(allText).toMatch(/ਮੈਨੂੰ ਪਾਣੀ|ਸ਼ਾਕਾਹਾਰੀ/);
    expect(allText).toMatch(/ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ|ਸੱਜੇ/);
    expect(allText).toMatch(/ਮਦਦ ਕਰੋ|ਸਮਝ ਨਹੀਂ/);
    expect(allText).toMatch(/ਮਾਫ਼ ਕਰਨਾ|ਦੁਬਾਰਾ ਕਹੋ/);
    expect(allText).toMatch(/ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ/);
    expect(allText).toMatch(/ਮੈਨੂੰ ਫਾਰਮ|ਅਪਾਇੰਟਮੈਂਟ|ਪਛਾਣ|ਮੈਨੂੰ ਇੱਕ ਬੈਗ/);
  });

  it("mentions Shahmukhi only as awareness and does not claim native review or unrelated systems", () => {
    const allText = `${integrationSamplesScriptAwareness} ${JSON.stringify(punjabiA1IntegrationSamples)}`;

    expect(integrationSamplesScriptAwareness).toContain("Shahmukhi");
    expect(integrationSamplesScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure|auth|billing|RLS|Supabase|CI config|A11 integration/i);
  });
});
