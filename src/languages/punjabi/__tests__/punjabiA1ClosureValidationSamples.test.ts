import { describe, expect, it } from "vitest";

import punjabiA1ClosureValidationSamples, {
  closureValidationScriptAwareness,
  punjabiA1ClosureValidationSamples as namedClosureValidationSamples,
  type PunjabiA1ClosureValidationDomain,
  type PunjabiA1ClosureValidationStyle,
} from "@/languages/punjabi/a1ClosureValidationSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 closure validation samples", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(punjabiA1ClosureValidationSamples).toBe(namedClosureValidationSamples);
    expect(Array.isArray(punjabiA1ClosureValidationSamples)).toBe(true);
  });

  it("is compact and covers the required closure-validation domains", () => {
    expect(punjabiA1ClosureValidationSamples.length).toBeGreaterThanOrEqual(9);
    expect(punjabiA1ClosureValidationSamples.length).toBeLessThanOrEqual(12);

    const requiredDomains: PunjabiA1ClosureValidationDomain[] = [
      "greeting",
      "identity",
      "numbers_prices",
      "help",
      "polite_repetition",
      "gurmukhi_recognition",
      "romanization_bridge",
      "canada_service_counter",
    ];
    const domains = new Set(punjabiA1ClosureValidationSamples.map((item) => item.domain));

    for (const domain of requiredDomains) {
      expect(domains, `missing domain ${domain}`).toContain(domain);
    }
  });

  it("includes closure-validation, final-cross-check, pre-integration, survival-flow, qa, and selector styles", () => {
    const requiredStyles: PunjabiA1ClosureValidationStyle[] = [
      "closure_validation",
      "final_cross_check",
      "pre_integration",
      "survival_flow",
      "qa",
      "selector",
    ];
    const styles = new Set(punjabiA1ClosureValidationSamples.map((item) => item.style));

    for (const style of requiredStyles) {
      expect(styles, `missing style ${style}`).toContain(style);
    }
  });

  it("uses Gurmukhi primary with bilingual support and review links", () => {
    for (const item of punjabiA1ClosureValidationSamples) {
      expect(item.id).toMatch(/^pa_a1_closure_/);
      expect(item.cue_pa).toMatch(GURMUKHI_SCRIPT);
      expect(item.expected_pa).toMatch(GURMUKHI_SCRIPT);
      expect(item.prompt_vi.trim().length).toBeGreaterThan(0);
      expect(item.prompt_en.trim().length).toBeGreaterThan(0);
      expect(item.meaning_vi.trim().length).toBeGreaterThan(0);
      expect(item.meaning_en.trim().length).toBeGreaterThan(0);
      expect(item.closure_check_vi.trim().length).toBeGreaterThan(0);
      expect(item.closure_check_en.trim().length).toBeGreaterThan(0);
      expect(item.survival_use_vi.trim().length).toBeGreaterThan(0);
      expect(item.survival_use_en.trim().length).toBeGreaterThan(0);
      expect(item.review_links.length).toBeGreaterThanOrEqual(2);

      for (const reviewId of item.review_links) {
        expect(reviewId).toMatch(/^pa_a1_/);
      }

      if (item.romanization) {
        expect(item.romanization).toMatch(LATIN);
      }
    }
  });

  it("includes traps, romanization bridge, and Canada-practical closure items", () => {
    const traps = punjabiA1ClosureValidationSamples.flatMap((item) => (item.trap ? [item.trap] : []));
    const trapAudiences = new Set(traps.map((trap) => trap.audience));
    const canadaItems = punjabiA1ClosureValidationSamples.filter((item) => item.canada_practical);
    const romanizationBridge = punjabiA1ClosureValidationSamples.find((item) => item.domain === "romanization_bridge");

    expect(traps.length).toBeGreaterThanOrEqual(7);
    expect(trapAudiences.has("vi") || trapAudiences.has("both")).toBe(true);
    expect(trapAudiences.has("en") || trapAudiences.has("both")).toBe(true);
    expect(canadaItems.length).toBeGreaterThanOrEqual(7);
    expect(JSON.stringify(canadaItems)).toMatch(/ਫਾਰਮ|ਪਛਾਣ|ਬੱਸ|ਮਦਦ|ਦੁਬਾਰਾ|ਧੰਨਵਾਦ/);
    expect(romanizationBridge?.romanization).toMatch(LATIN);
    expect(JSON.stringify(romanizationBridge)).toMatch(/Gurmukhi|Romanization|romanization/);
  });

  it("verifies the requested beginner survival flow", () => {
    const allText = JSON.stringify(punjabiA1ClosureValidationSamples);

    expect(allText).toMatch(/ਸਤ ਸ੍ਰੀ ਅਕਾਲ/);
    expect(allText).toMatch(/ਮੇਰਾ ਨਾਮ|ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ/);
    expect(allText).toMatch(/ਦੋ ਟਿਕਟਾਂ|ਪੰਜ ਡਾਲਰ/);
    expect(allText).toMatch(/ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ/);
    expect(allText).toMatch(/ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ/);
    expect(allText).toMatch(/ਧੰਨਵਾਦ/);
    expect(allText).toMatch(/ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ/);
    expect(allText).toMatch(/Romanization|romanization/);
    expect(allText).toMatch(/ਪਛਾਣ ਹੈ|ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ/);
    expect(allText).toMatch(/survival|sống còn|closure|đóng/i);
  });

  it("mentions Shahmukhi only as awareness and avoids disallowed claims and systems", () => {
    const allText = `${closureValidationScriptAwareness} ${JSON.stringify(punjabiA1ClosureValidationSamples)}`;

    expect(closureValidationScriptAwareness).toContain("Shahmukhi");
    expect(closureValidationScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure|auth|billing|RLS|Supabase|CI config|A11 integration/i);
  });
});
