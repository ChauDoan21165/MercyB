import { describe, expect, it } from "vitest";

import punjabiA1FinalIntegrationSelectors, {
  finalIntegrationSelectorsScriptAwareness,
  punjabiA1FinalIntegrationSelectors as namedFinalIntegrationSelectors,
  type PunjabiA1FinalIntegrationDomain,
  type PunjabiA1FinalIntegrationStyle,
} from "@/languages/punjabi/a1FinalIntegrationSelectors";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 final integration selectors", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(punjabiA1FinalIntegrationSelectors).toBe(namedFinalIntegrationSelectors);
    expect(Array.isArray(punjabiA1FinalIntegrationSelectors)).toBe(true);
  });

  it("is compact and covers the required selector domains", () => {
    expect(punjabiA1FinalIntegrationSelectors.length).toBeGreaterThanOrEqual(7);
    expect(punjabiA1FinalIntegrationSelectors.length).toBeLessThanOrEqual(12);

    const requiredDomains: PunjabiA1FinalIntegrationDomain[] = [
      "lesson_selection",
      "micro_checkpoint_selection",
      "politeness_guard_selection",
      "retention_review_selection",
      "service_counter_selection",
      "gurmukhi_recognition_selection",
      "canada_survival_selection",
    ];
    const domains = new Set(punjabiA1FinalIntegrationSelectors.map((item) => item.domain));

    for (const domain of requiredDomains) {
      expect(domains, `missing domain ${domain}`).toContain(domain);
    }
  });

  it("includes selector, pre-integration, final-readiness, handoff, and quality-gate styles", () => {
    const requiredStyles: PunjabiA1FinalIntegrationStyle[] = [
      "selector",
      "pre_integration",
      "final_readiness",
      "handoff",
      "quality_gate",
    ];
    const styles = new Set(punjabiA1FinalIntegrationSelectors.map((item) => item.style));

    for (const style of requiredStyles) {
      expect(styles, `missing style ${style}`).toContain(style);
    }
  });

  it("uses Gurmukhi primary with bilingual support and review links", () => {
    for (const item of punjabiA1FinalIntegrationSelectors) {
      expect(item.id).toMatch(/^pa_a1_selector_/);
      expect(item.cue_pa).toMatch(GURMUKHI_SCRIPT);
      expect(item.prompt_vi.trim().length).toBeGreaterThan(0);
      expect(item.prompt_en.trim().length).toBeGreaterThan(0);
      expect(item.meaning_vi.trim().length).toBeGreaterThan(0);
      expect(item.meaning_en.trim().length).toBeGreaterThan(0);
      expect(item.selector_pa.trim().length).toBeGreaterThan(0);
      expect(item.selector_hint_vi.trim().length).toBeGreaterThan(0);
      expect(item.selector_hint_en.trim().length).toBeGreaterThan(0);
      expect(item.why_selected_vi.trim().length).toBeGreaterThan(0);
      expect(item.why_selected_en.trim().length).toBeGreaterThan(0);
      expect(item.review_links.length).toBeGreaterThanOrEqual(2);

      for (const reviewId of item.review_links) {
        expect(reviewId).toMatch(/^pa_a1_/);
      }
      if (item.romanization) {
        expect(item.romanization).toMatch(LATIN);
      }
    }
  });

  it("includes traps and Canada-practical selector items", () => {
    const traps = punjabiA1FinalIntegrationSelectors.flatMap((item) => item.trap ? [item.trap] : []);
    const trapAudiences = new Set(traps.map((trap) => trap.audience));
    const canadaItems = punjabiA1FinalIntegrationSelectors.filter((item) => item.canada_practical);

    expect(traps.length).toBeGreaterThanOrEqual(6);
    expect(trapAudiences.has("vi") || trapAudiences.has("both")).toBe(true);
    expect(trapAudiences.has("en") || trapAudiences.has("both")).toBe(true);
    expect(canadaItems.length).toBeGreaterThanOrEqual(6);
    expect(JSON.stringify(canadaItems)).toMatch(/ਫਾਰਮ|ਪਛਾਣ|ਬੱਸ|ਮਦਦ|ਦੁਬਾਰਾ|ਧੰਨਵਾਦ|ਮਾਫ਼ ਕਰਨਾ/);
  });

  it("proves the A1 selector set across key survival phrases", () => {
    const allText = JSON.stringify(punjabiA1FinalIntegrationSelectors);

    expect(allText).toMatch(/ਸਤ ਸ੍ਰੀ ਅਕਾਲ/);
    expect(allText).toMatch(/ਮੇਰਾ ਨਾਮ|ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ/);
    expect(allText).toMatch(/ਮੇਰੀ ਮਾਂ|ਮੇਰੇ ਕੋਲ ਇੱਕ ਭਰਾ/);
    expect(allText).toMatch(/ਦੋ ਟਿਕਟਾਂ|ਪੰਜ ਡਾਲਰ/);
    expect(allText).toMatch(/ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ/);
    expect(allText).toMatch(/ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ/);
    expect(allText).toMatch(/ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ/);
    expect(allText).toMatch(/ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ/);
    expect(allText).toMatch(/ਧੰਨਵਾਦ|ਮਾਫ਼ ਕਰਨਾ/);
    expect(allText).toMatch(/ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ/);
    expect(allText).toMatch(/ਪਛਾਣ ਹੈ|ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ/);
  });

  it("mentions Shahmukhi only as awareness and avoids disallowed claims/systems", () => {
    const allText = `${finalIntegrationSelectorsScriptAwareness} ${JSON.stringify(punjabiA1FinalIntegrationSelectors)}`;

    expect(finalIntegrationSelectorsScriptAwareness).toContain("Shahmukhi");
    expect(finalIntegrationSelectorsScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure|auth|billing|RLS|Supabase|CI config|A11 integration/i);
  });
});
