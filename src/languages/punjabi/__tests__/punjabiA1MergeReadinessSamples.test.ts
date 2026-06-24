import { describe, expect, it } from "vitest";

import punjabiA1MergeReadinessSamples, {
  mergeReadinessScriptAwareness,
  punjabiA1MergeReadinessSamples as namedMergeReadinessSamples,
  type PunjabiA1MergeReadinessDomain,
  type PunjabiA1MergeReadinessStyle,
} from "@/languages/punjabi/a1MergeReadinessSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 merge-readiness samples", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(punjabiA1MergeReadinessSamples).toBe(namedMergeReadinessSamples);
    expect(Array.isArray(punjabiA1MergeReadinessSamples)).toBe(true);
  });

  it("is compact and covers the required merge-readiness domains", () => {
    expect(punjabiA1MergeReadinessSamples.length).toBeGreaterThanOrEqual(11);
    expect(punjabiA1MergeReadinessSamples.length).toBeLessThanOrEqual(14);

    const requiredDomains: PunjabiA1MergeReadinessDomain[] = [
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
      "canada_service",
    ];
    const domains = new Set(punjabiA1MergeReadinessSamples.map((item) => item.domain));

    for (const domain of requiredDomains) {
      expect(domains, `missing domain ${domain}`).toContain(domain);
    }
  });

  it("includes merge-readiness, final-regression, pre-integration, checkpoint, qa, and selector styles", () => {
    const requiredStyles: PunjabiA1MergeReadinessStyle[] = [
      "merge_readiness",
      "final_regression",
      "pre_integration",
      "checkpoint",
      "qa",
      "selector",
    ];
    const styles = new Set(punjabiA1MergeReadinessSamples.map((item) => item.style));

    for (const style of requiredStyles) {
      expect(styles, `missing style ${style}`).toContain(style);
    }
  });

  it("uses Gurmukhi primary with bilingual support and review links", () => {
    for (const item of punjabiA1MergeReadinessSamples) {
      expect(item.id).toMatch(/^pa_a1_merge_/);
      expect(item.cue_pa).toMatch(GURMUKHI_SCRIPT);
      expect(item.expected_pa).toMatch(GURMUKHI_SCRIPT);
      expect(item.prompt_vi.trim().length).toBeGreaterThan(0);
      expect(item.prompt_en.trim().length).toBeGreaterThan(0);
      expect(item.meaning_vi.trim().length).toBeGreaterThan(0);
      expect(item.meaning_en.trim().length).toBeGreaterThan(0);
      expect(item.merge_hint_vi.trim().length).toBeGreaterThan(0);
      expect(item.merge_hint_en.trim().length).toBeGreaterThan(0);
      expect(item.why_merge_vi.trim().length).toBeGreaterThan(0);
      expect(item.why_merge_en.trim().length).toBeGreaterThan(0);
      expect(item.review_links.length).toBeGreaterThanOrEqual(2);

      for (const reviewId of item.review_links) {
        expect(reviewId).toMatch(/^pa_a1_/);
      }

      if (item.romanization) {
        expect(item.romanization).toMatch(LATIN);
      }
    }
  });

  it("includes traps and Canada-practical merge-readiness items", () => {
    const traps = punjabiA1MergeReadinessSamples.flatMap((item) => (item.trap ? [item.trap] : []));
    const trapAudiences = new Set(traps.map((trap) => trap.audience));
    const canadaItems = punjabiA1MergeReadinessSamples.filter((item) => item.canada_practical);

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(trapAudiences.has("vi") || trapAudiences.has("both")).toBe(true);
    expect(trapAudiences.has("en") || trapAudiences.has("both")).toBe(true);
    expect(canadaItems.length).toBeGreaterThanOrEqual(8);
    expect(JSON.stringify(canadaItems)).toMatch(/ਫਾਰਮ|ਪਛਾਣ|ਬੱਸ|ਮਦਦ|ਦੁਬਾਰਾ|ਧੰਨਵਾਦ/);
  });

  it("connects greetings, identity, family, numbers, prices, food, directions, help, repetition, politeness, Gurmukhi, and Canada service", () => {
    const allText = JSON.stringify(punjabiA1MergeReadinessSamples);

    expect(allText).toMatch(/ਸਤ ਸ੍ਰੀ ਅਕਾਲ/);
    expect(allText).toMatch(/ਮੇਰਾ ਨਾਮ|ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ/);
    expect(allText).toMatch(/ਮੇਰੀ ਮਾਂ|ਮੇਰੇ ਕੋਲ ਇੱਕ ਭਰਾ/);
    expect(allText).toMatch(/ਦੋ ਟਿਕਟਾਂ/);
    expect(allText).toMatch(/ਪੰਜ ਡਾਲਰ/);
    expect(allText).toMatch(/ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ/);
    expect(allText).toMatch(/ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ/);
    expect(allText).toMatch(/ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ/);
    expect(allText).toMatch(/ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ/);
    expect(allText).toMatch(/ਧੰਨਵਾਦ/);
    expect(allText).toMatch(/ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ/);
    expect(allText).toMatch(/ਪਛਾਣ ਹੈ|ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ/);
  });

  it("mentions Shahmukhi only as awareness and avoids disallowed claims and systems", () => {
    const allText = `${mergeReadinessScriptAwareness} ${JSON.stringify(punjabiA1MergeReadinessSamples)}`;

    expect(mergeReadinessScriptAwareness).toContain("Shahmukhi");
    expect(mergeReadinessScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure|auth|billing|RLS|Supabase|CI config|A11 integration/i);
  });
});
