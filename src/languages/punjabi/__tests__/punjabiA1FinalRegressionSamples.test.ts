import { describe, expect, it } from "vitest";

import punjabiA1FinalRegressionSamples, {
  finalRegressionScriptAwareness,
  punjabiA1FinalRegressionSamples as namedFinalRegressionSamples,
  type PunjabiA1FinalRegressionDomain,
  type PunjabiA1FinalRegressionStyle,
} from "@/languages/punjabi/a1FinalRegressionSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 final regression samples", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(punjabiA1FinalRegressionSamples).toBe(namedFinalRegressionSamples);
    expect(Array.isArray(punjabiA1FinalRegressionSamples)).toBe(true);
  });

  it("is compact and covers the required regression domains", () => {
    expect(punjabiA1FinalRegressionSamples.length).toBeGreaterThanOrEqual(11);
    expect(punjabiA1FinalRegressionSamples.length).toBeLessThanOrEqual(14);

    const requiredDomains: PunjabiA1FinalRegressionDomain[] = [
      "greetings",
      "identity",
      "family",
      "numbers",
      "prices",
      "food",
      "directions",
      "help",
      "repetition",
      "politeness",
      "gurmukhi_recognition",
      "romanization_bridge",
      "canada_service",
    ];
    const domains = new Set(punjabiA1FinalRegressionSamples.map((item) => item.domain));

    for (const domain of requiredDomains) {
      expect(domains, `missing domain ${domain}`).toContain(domain);
    }
  });

  it("includes final-regression, sanity, pre-integration, checkpoint, qa, and selector styles", () => {
    const requiredStyles: PunjabiA1FinalRegressionStyle[] = [
      "final_regression",
      "sanity",
      "pre_integration",
      "checkpoint",
      "qa",
      "selector",
    ];
    const styles = new Set(punjabiA1FinalRegressionSamples.map((item) => item.style));

    for (const style of requiredStyles) {
      expect(styles, `missing style ${style}`).toContain(style);
    }
  });

  it("uses Gurmukhi primary with bilingual support and review links", () => {
    for (const item of punjabiA1FinalRegressionSamples) {
      expect(item.id).toMatch(/^pa_a1_regression_/);
      expect(item.cue_pa).toMatch(GURMUKHI_SCRIPT);
      expect(item.prompt_vi.trim().length).toBeGreaterThan(0);
      expect(item.prompt_en.trim().length).toBeGreaterThan(0);
      expect(item.meaning_vi.trim().length).toBeGreaterThan(0);
      expect(item.meaning_en.trim().length).toBeGreaterThan(0);
      expect(item.answer_pa.trim().length).toBeGreaterThan(0);
      expect(item.answer_hint_vi.trim().length).toBeGreaterThan(0);
      expect(item.answer_hint_en.trim().length).toBeGreaterThan(0);
      expect(item.why_regression_vi.trim().length).toBeGreaterThan(0);
      expect(item.why_regression_en.trim().length).toBeGreaterThan(0);
      expect(item.review_links.length).toBeGreaterThanOrEqual(2);

      for (const reviewId of item.review_links) {
        expect(reviewId).toMatch(/^pa_a1_/);
      }

      if (item.romanization) {
        expect(item.romanization).toMatch(LATIN);
      }
    }
  });

  it("includes traps and Canada-practical regression items", () => {
    const traps = punjabiA1FinalRegressionSamples.flatMap((item) => (item.trap ? [item.trap] : []));
    const trapAudiences = new Set(traps.map((trap) => trap.audience));
    const canadaItems = punjabiA1FinalRegressionSamples.filter((item) => item.canada_practical);

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(trapAudiences.has("vi") || trapAudiences.has("both")).toBe(true);
    expect(trapAudiences.has("en") || trapAudiences.has("both")).toBe(true);
    expect(canadaItems.length).toBeGreaterThanOrEqual(8);
    expect(JSON.stringify(canadaItems)).toMatch(/ਫਾਰਮ|ਪਛਾਣ|ਬੱਸ|ਮਦਦ|ਦੁਬਾਰਾ|ਧੰਨਵਾਦ/);
  });

  it("covers greeting, identity, family, numbers, prices, food, directions, help, repetition, politeness, Gurmukhi, romanization bridge, and Canada service", () => {
    const allText = JSON.stringify(punjabiA1FinalRegressionSamples);

    expect(allText).toMatch(/ਸਤ ਸ੍ਰੀ ਅਕਾਲ/);
    expect(allText).toMatch(/ਮੇਰਾ ਨਾਮ|ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ/);
    expect(allText).toMatch(/ਮੇਰੀ ਮਾਂ|ਮੇਰੇ ਕੋਲ ਇੱਕ ਭਰਾ/);
    expect(allText).toMatch(/ਦੋ ਟਿਕਟਾਂ|ਪੰਜ ਡਾਲਰ/);
    expect(allText).toMatch(/ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ/);
    expect(allText).toMatch(/ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ/);
    expect(allText).toMatch(/ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ/);
    expect(allText).toMatch(/ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ/);
    expect(allText).toMatch(/ਧੰਨਵਾਦ/);
    expect(allText).toMatch(/ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ/);
    expect(allText).toMatch(/Romanization|romanization/);
    expect(allText).toMatch(/ਪਛਾਣ ਹੈ|ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ/);
  });

  it("mentions Shahmukhi only as awareness and avoids disallowed claims and systems", () => {
    const allText = `${finalRegressionScriptAwareness} ${JSON.stringify(punjabiA1FinalRegressionSamples)}`;

    expect(finalRegressionScriptAwareness).toContain("Shahmukhi");
    expect(finalRegressionScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure|auth|billing|RLS|Supabase|CI config|A11 integration/i);
  });
});
