import { describe, expect, it } from "vitest";

import punjabiA1RetentionBoosters, {
  punjabiA1RetentionBoosters as namedRetentionBoosters,
  retentionBoostersScriptAwareness,
  type PunjabiRetentionBoosterDomain,
  type PunjabiRetentionBoosterStyle,
} from "@/languages/punjabi/retentionBoostersA1";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 retention boosters", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(punjabiA1RetentionBoosters).toBe(namedRetentionBoosters);
    expect(Array.isArray(punjabiA1RetentionBoosters)).toBe(true);
  });

  it("is compact and covers the required retention domains", () => {
    expect(punjabiA1RetentionBoosters.length).toBeGreaterThanOrEqual(10);
    expect(punjabiA1RetentionBoosters.length).toBeLessThanOrEqual(14);

    const requiredDomains: PunjabiRetentionBoosterDomain[] = [
      "greetings",
      "identity",
      "family",
      "numbers",
      "food",
      "directions",
      "help",
      "politeness",
      "gurmukhi_recognition",
      "canada_service",
    ];
    const domains = new Set(punjabiA1RetentionBoosters.map((item) => item.domain));

    for (const domain of requiredDomains) {
      expect(domains, `missing domain ${domain}`).toContain(domain);
    }
  });

  it("includes retention booster, stress test, final risk, and final QA styles", () => {
    const requiredStyles: PunjabiRetentionBoosterStyle[] = [
      "retention_booster",
      "stress_test",
      "final_risk",
      "final_qa",
    ];
    const styles = new Set(punjabiA1RetentionBoosters.map((item) => item.style));

    for (const style of requiredStyles) {
      expect(styles, `missing style ${style}`).toContain(style);
    }
  });

  it("uses Gurmukhi primary with bilingual support and compact review links", () => {
    for (const item of punjabiA1RetentionBoosters) {
      expect(item.id).toMatch(/^pa_a1_booster_/);
      expect(item.cue_pa).toMatch(GURMUKHI_SCRIPT);
      expect(item.prompt_vi.trim().length).toBeGreaterThan(0);
      expect(item.prompt_en.trim().length).toBeGreaterThan(0);
      expect(item.meaning_vi.trim().length).toBeGreaterThan(0);
      expect(item.meaning_en.trim().length).toBeGreaterThan(0);
      expect(item.answer_pa.trim().length).toBeGreaterThan(0);
      expect(item.answer_hint_vi.trim().length).toBeGreaterThan(0);
      expect(item.answer_hint_en.trim().length).toBeGreaterThan(0);
      expect(item.why_it_matters_vi.trim().length).toBeGreaterThan(0);
      expect(item.why_it_matters_en.trim().length).toBeGreaterThan(0);
      expect(item.review_links.length).toBeGreaterThanOrEqual(2);

      for (const reviewId of item.review_links) {
        expect(reviewId).toMatch(/^pa_a1_/);
      }
      if (item.romanization) {
        expect(item.romanization).toMatch(LATIN);
      }
    }
  });

  it("includes traps and Canada-practical retention boosters", () => {
    const traps = punjabiA1RetentionBoosters.flatMap((item) => item.trap ? [item.trap] : []);
    const trapAudiences = new Set(traps.map((trap) => trap.audience));
    const canadaItems = punjabiA1RetentionBoosters.filter((item) => item.canada_practical);

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(trapAudiences.has("vi") || trapAudiences.has("both")).toBe(true);
    expect(trapAudiences.has("en") || trapAudiences.has("both")).toBe(true);
    expect(canadaItems.length).toBeGreaterThanOrEqual(5);
    expect(JSON.stringify(canadaItems)).toMatch(/ਫਾਰਮ|ਪਛਾਣ|ਬੱਸ|ਡਾਲਰ|ਟਿਕਟਾਂ|ਮਦਦ|ਦੁਬਾਰਾ/);
  });

  it("proves the A1 retention set across key survival phrases", () => {
    const allText = JSON.stringify(punjabiA1RetentionBoosters);

    expect(allText).toMatch(/ਸਤ ਸ੍ਰੀ ਅਕਾਲ/);
    expect(allText).toMatch(/ਮੇਰਾ ਨਾਮ|ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ/);
    expect(allText).toMatch(/ਮੇਰੀ ਮਾਂ|ਮੇਰੇ ਕੋਲ ਇੱਕ ਭਰਾ/);
    expect(allText).toMatch(/ਦੋ ਟਿਕਟਾਂ|ਪੰਜ ਡਾਲਰ/);
    expect(allText).toMatch(/ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ/);
    expect(allText).toMatch(/ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ/);
    expect(allText).toMatch(/ਮਦਦ ਕਰੋ|ਸਮਝ ਨਹੀਂ/);
    expect(allText).toMatch(/ਮਾਫ਼ ਕਰਨਾ|ਦੁਬਾਰਾ ਕਹੋ/);
    expect(allText).toMatch(/ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ/);
    expect(allText).toMatch(/ਪਛਾਣ ਹੈ|ਅਪਾਇੰਟਮੈਂਟ|ਫਾਰਮ/);
  });

  it("mentions Shahmukhi only as awareness and avoids disallowed claims/systems", () => {
    const allText = `${retentionBoostersScriptAwareness} ${JSON.stringify(punjabiA1RetentionBoosters)}`;

    expect(retentionBoostersScriptAwareness).toContain("Shahmukhi");
    expect(retentionBoostersScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure|auth|billing|RLS|Supabase|CI config|A11 integration/i);
  });
});
