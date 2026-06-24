import { describe, expect, it } from "vitest";

import punjabiA1ConsistencyReview, {
  consistencyReviewScriptAwareness,
  punjabiA1ConsistencyReview as namedConsistencyReview,
  type PunjabiConsistencyReviewDomain,
  type PunjabiConsistencyReviewStyle,
} from "@/languages/punjabi/consistencyReviewA1";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 consistency review", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(punjabiA1ConsistencyReview).toBe(namedConsistencyReview);
    expect(Array.isArray(punjabiA1ConsistencyReview)).toBe(true);
  });

  it("is compact and covers the required consistency domains", () => {
    expect(punjabiA1ConsistencyReview.length).toBeGreaterThanOrEqual(10);
    expect(punjabiA1ConsistencyReview.length).toBeLessThanOrEqual(14);

    const requiredDomains: PunjabiConsistencyReviewDomain[] = [
      "greetings",
      "identity",
      "family",
      "numbers",
      "food",
      "directions",
      "help",
      "repetition",
      "politeness",
      "gurmukhi_recognition",
      "romanization_bridge",
      "canada_service",
    ];
    const domains = new Set(punjabiA1ConsistencyReview.map((item) => item.domain));

    for (const domain of requiredDomains) {
      expect(domains, `missing domain ${domain}`).toContain(domain);
    }
  });

  it("includes consistency-review, final-guardrail, integration-readiness, regression, and checklist styles", () => {
    const requiredStyles: PunjabiConsistencyReviewStyle[] = [
      "consistency_review",
      "final_guardrail",
      "integration_readiness",
      "regression",
      "checklist",
    ];
    const styles = new Set(punjabiA1ConsistencyReview.map((item) => item.style));

    for (const style of requiredStyles) {
      expect(styles, `missing style ${style}`).toContain(style);
    }
  });

  it("uses Gurmukhi primary with bilingual support and review links", () => {
    for (const item of punjabiA1ConsistencyReview) {
      expect(item.id).toMatch(/^pa_a1_consistency_/);
      expect(item.cue_pa).toMatch(GURMUKHI_SCRIPT);
      expect(item.prompt_vi.trim().length).toBeGreaterThan(0);
      expect(item.prompt_en.trim().length).toBeGreaterThan(0);
      expect(item.meaning_vi.trim().length).toBeGreaterThan(0);
      expect(item.meaning_en.trim().length).toBeGreaterThan(0);
      expect(item.expected_pa.trim().length).toBeGreaterThan(0);
      expect(item.expected_hint_vi.trim().length).toBeGreaterThan(0);
      expect(item.expected_hint_en.trim().length).toBeGreaterThan(0);
      expect(item.why_consistency_vi.trim().length).toBeGreaterThan(0);
      expect(item.why_consistency_en.trim().length).toBeGreaterThan(0);
      expect(item.review_links.length).toBeGreaterThanOrEqual(2);

      for (const reviewId of item.review_links) {
        expect(reviewId).toMatch(/^pa_a1_/);
      }
      if (item.romanization) {
        expect(item.romanization).toMatch(LATIN);
      }
    }
  });

  it("includes traps and Canada-practical consistency items", () => {
    const traps = punjabiA1ConsistencyReview.flatMap((item) => item.trap ? [item.trap] : []);
    const trapAudiences = new Set(traps.map((trap) => trap.audience));
    const canadaItems = punjabiA1ConsistencyReview.filter((item) => item.canada_practical);

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(trapAudiences.has("vi") || trapAudiences.has("both")).toBe(true);
    expect(trapAudiences.has("en") || trapAudiences.has("both")).toBe(true);
    expect(canadaItems.length).toBeGreaterThanOrEqual(7);
    expect(JSON.stringify(canadaItems)).toMatch(/ਫਾਰਮ|ਪਛਾਣ|ਬੱਸ|ਮਦਦ|ਦੁਬਾਰਾ|ਧੰਨਵਾਦ|ਮਾਫ਼ ਕਰਨਾ/);
  });

  it("proves the A1 consistency set across key survival phrases", () => {
    const allText = JSON.stringify(punjabiA1ConsistencyReview);

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
  });

  it("mentions Shahmukhi only as awareness and avoids disallowed claims/systems", () => {
    const allText = `${consistencyReviewScriptAwareness} ${JSON.stringify(punjabiA1ConsistencyReview)}`;

    expect(consistencyReviewScriptAwareness).toContain("Shahmukhi");
    expect(consistencyReviewScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure|auth|billing|RLS|Supabase|CI config|A11 integration/i);
  });
});
