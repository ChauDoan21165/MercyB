import { describe, expect, it } from "vitest";

import punjabiA1PolitenessGuards, {
  politenessGuardsScriptAwareness,
  punjabiA1PolitenessGuards as namedPolitenessGuards,
  type PunjabiPolitenessGuardDomain,
  type PunjabiPolitenessGuardStyle,
} from "@/languages/punjabi/politenessGuardsA1";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 politeness guards", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(punjabiA1PolitenessGuards).toBe(namedPolitenessGuards);
    expect(Array.isArray(punjabiA1PolitenessGuards)).toBe(true);
  });

  it("is compact and covers the required guard domains", () => {
    expect(punjabiA1PolitenessGuards.length).toBeGreaterThanOrEqual(9);
    expect(punjabiA1PolitenessGuards.length).toBeLessThanOrEqual(13);

    const requiredDomains: PunjabiPolitenessGuardDomain[] = [
      "greeting",
      "help",
      "price",
      "location",
      "apology",
      "thanks",
      "repeat_request",
      "service_counter",
    ];
    const domains = new Set(punjabiA1PolitenessGuards.map((item) => item.domain));

    for (const domain of requiredDomains) {
      expect(domains, `missing domain ${domain}`).toContain(domain);
    }
  });

  it("includes final-safety, quality-check, export-readiness, and regression-guard styles", () => {
    const requiredStyles: PunjabiPolitenessGuardStyle[] = [
      "politeness_guard",
      "final_safety",
      "quality_check",
      "export_readiness",
      "regression_guard",
    ];
    const styles = new Set(punjabiA1PolitenessGuards.map((item) => item.style));

    for (const style of requiredStyles) {
      expect(styles, `missing style ${style}`).toContain(style);
    }
  });

  it("uses Gurmukhi primary with bilingual support and review links", () => {
    for (const item of punjabiA1PolitenessGuards) {
      expect(item.id).toMatch(/^pa_a1_guard_/);
      expect(item.cue_pa).toMatch(GURMUKHI_SCRIPT);
      expect(item.prompt_vi.trim().length).toBeGreaterThan(0);
      expect(item.prompt_en.trim().length).toBeGreaterThan(0);
      expect(item.meaning_vi.trim().length).toBeGreaterThan(0);
      expect(item.meaning_en.trim().length).toBeGreaterThan(0);
      expect(item.answer_pa.trim().length).toBeGreaterThan(0);
      expect(item.answer_hint_vi.trim().length).toBeGreaterThan(0);
      expect(item.answer_hint_en.trim().length).toBeGreaterThan(0);
      expect(item.why_it_works_vi.trim().length).toBeGreaterThan(0);
      expect(item.why_it_works_en.trim().length).toBeGreaterThan(0);
      expect(item.review_links.length).toBeGreaterThanOrEqual(2);

      for (const reviewId of item.review_links) {
        expect(reviewId).toMatch(/^pa_a1_/);
      }
      if (item.romanization) {
        expect(item.romanization).toMatch(LATIN);
      }
    }
  });

  it("includes traps and Canada-practical service phrases", () => {
    const traps = punjabiA1PolitenessGuards.flatMap((item) => item.trap ? [item.trap] : []);
    const trapAudiences = new Set(traps.map((trap) => trap.audience));
    const canadaItems = punjabiA1PolitenessGuards.filter((item) => item.canada_practical);

    expect(traps.length).toBeGreaterThanOrEqual(7);
    expect(trapAudiences.has("vi") || trapAudiences.has("both")).toBe(true);
    expect(trapAudiences.has("en") || trapAudiences.has("both")).toBe(true);
    expect(canadaItems.length).toBeGreaterThanOrEqual(7);
    expect(JSON.stringify(canadaItems)).toMatch(/ਫਾਰਮ|ਪਛਾਣ|ਬੱਸ|ਮਦਦ|ਦੁਬਾਰਾ|ਧੰਨਵਾਦ|ਮਾਫ਼ ਕਰਨਾ/);
  });

  it("proves the A1 politeness set across key survival phrases", () => {
    const allText = JSON.stringify(punjabiA1PolitenessGuards);

    expect(allText).toMatch(/ਸਤ ਸ੍ਰੀ ਅਕਾਲ/);
    expect(allText).toMatch(/ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ/);
    expect(allText).toMatch(/ਇਹ ਕਿੰਨਾ ਹੈ/);
    expect(allText).toMatch(/ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ/);
    expect(allText).toMatch(/ਮਾਫ਼ ਕਰਨਾ/);
    expect(allText).toMatch(/ਧੰਨਵਾਦ/);
    expect(allText).toMatch(/ਦੁਬਾਰਾ ਕਹੋ/);
    expect(allText).toMatch(/ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ/);
    expect(allText).toMatch(/ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ/);
  });

  it("mentions Shahmukhi only as awareness and avoids disallowed claims/systems", () => {
    const allText = `${politenessGuardsScriptAwareness} ${JSON.stringify(punjabiA1PolitenessGuards)}`;

    expect(politenessGuardsScriptAwareness).toContain("Shahmukhi");
    expect(politenessGuardsScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure|auth|billing|RLS|Supabase|CI config|A11 integration/i);
  });
});
