import { describe, expect, it } from "vitest";

import punjabiA1RetentionReview, {
  punjabiA1RetentionReview as namedRetentionReview,
  retentionReviewScriptAwareness,
  type PunjabiRetentionReviewDomain,
  type PunjabiRetentionReviewStyle,
} from "@/languages/punjabi/retentionReviewA1";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 retention review", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(punjabiA1RetentionReview).toBe(namedRetentionReview);
    expect(Array.isArray(punjabiA1RetentionReview)).toBe(true);
  });

  it("is compact and covers the required review domains", () => {
    expect(punjabiA1RetentionReview.length).toBeGreaterThanOrEqual(10);
    expect(punjabiA1RetentionReview.length).toBeLessThanOrEqual(14);

    const requiredDomains: PunjabiRetentionReviewDomain[] = [
      "greetings",
      "identity",
      "family",
      "numbers_prices",
      "food",
      "directions",
      "help_repair",
      "polite_service",
      "gurmukhi_recognition",
      "canada_survival",
    ];
    const domains = new Set(punjabiA1RetentionReview.map((item) => item.domain));

    for (const domain of requiredDomains) {
      expect(domains, `missing domain ${domain}`).toContain(domain);
    }
  });

  it("includes final-hardening, export-readiness, regression-check, and final-QA styles", () => {
    const requiredStyles: PunjabiRetentionReviewStyle[] = [
      "retention_review",
      "final_hardening",
      "export_readiness",
      "regression_check",
      "final_qa",
    ];
    const styles = new Set(punjabiA1RetentionReview.map((item) => item.style));

    for (const style of requiredStyles) {
      expect(styles, `missing style ${style}`).toContain(style);
    }
  });

  it("uses Gurmukhi primary with bilingual support and review links", () => {
    for (const item of punjabiA1RetentionReview) {
      expect(item.id).toMatch(/^pa_a1_review_/);
      expect(item.cue_pa).toMatch(GURMUKHI_SCRIPT);
      expect(item.prompt_vi.trim().length).toBeGreaterThan(0);
      expect(item.prompt_en.trim().length).toBeGreaterThan(0);
      expect(item.meaning_vi.trim().length).toBeGreaterThan(0);
      expect(item.meaning_en.trim().length).toBeGreaterThan(0);
      expect(item.expected_pa.trim().length).toBeGreaterThan(0);
      expect(item.expected_hint_vi.trim().length).toBeGreaterThan(0);
      expect(item.expected_hint_en.trim().length).toBeGreaterThan(0);
      expect(item.why_review_vi.trim().length).toBeGreaterThan(0);
      expect(item.why_review_en.trim().length).toBeGreaterThan(0);
      expect(item.review_links.length).toBeGreaterThanOrEqual(2);

      for (const reviewId of item.review_links) {
        expect(reviewId).toMatch(/^pa_a1_/);
      }
      if (item.romanization) {
        expect(item.romanization).toMatch(LATIN);
      }
    }
  });

  it("includes traps and Canada-practical review items", () => {
    const traps = punjabiA1RetentionReview.flatMap((item) => item.review_trap ? [item.review_trap] : []);
    const trapAudiences = new Set(traps.map((trap) => trap.audience));
    const canadaItems = punjabiA1RetentionReview.filter((item) => item.canada_practical);

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(trapAudiences.has("vi") || trapAudiences.has("both")).toBe(true);
    expect(trapAudiences.has("en") || trapAudiences.has("both")).toBe(true);
    expect(canadaItems.length).toBeGreaterThanOrEqual(7);
    expect(JSON.stringify(canadaItems)).toMatch(/ਫਾਰਮ|ਪਛਾਣ|ਬੱਸ|ਮਦਦ|ਡਾਲਰ|ਟਿਕਟਾਂ|ਦੁਬਾਰਾ/);
  });

  it("proves the A1 review set across key survival phrases", () => {
    const allText = JSON.stringify(punjabiA1RetentionReview);

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
    const allText = `${retentionReviewScriptAwareness} ${JSON.stringify(punjabiA1RetentionReview)}`;

    expect(retentionReviewScriptAwareness).toContain("Shahmukhi");
    expect(retentionReviewScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure|auth|billing|RLS|Supabase|CI config|A11 integration/i);
  });
});
