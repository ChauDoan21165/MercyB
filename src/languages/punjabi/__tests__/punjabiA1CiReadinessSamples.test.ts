import { describe, expect, it } from "vitest";

import punjabiA1CiReadinessSamples, {
  ciReadinessScriptAwareness,
  punjabiA1CiReadinessSamples as namedCiReadinessSamples,
  type PunjabiA1CiReadinessDomain,
  type PunjabiA1CiReadinessStyle,
} from "@/languages/punjabi/a1CiReadinessSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 CI-readiness samples", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(punjabiA1CiReadinessSamples).toBe(namedCiReadinessSamples);
    expect(Array.isArray(punjabiA1CiReadinessSamples)).toBe(true);
  });

  it("is compact and covers the required CI-readiness domains", () => {
    expect(punjabiA1CiReadinessSamples.length).toBeGreaterThanOrEqual(12);
    expect(punjabiA1CiReadinessSamples.length).toBeLessThanOrEqual(14);

    const requiredDomains: PunjabiA1CiReadinessDomain[] = [
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
      "canada_service_counter",
    ];
    const domains = new Set(punjabiA1CiReadinessSamples.map((item) => item.domain));

    for (const domain of requiredDomains) {
      expect(domains, `missing domain ${domain}`).toContain(domain);
    }
  });

  it("includes CI-readiness, MR-readiness, final-freeze, pre-integration, qa, and readiness styles", () => {
    const requiredStyles: PunjabiA1CiReadinessStyle[] = [
      "ci_readiness",
      "mr_readiness",
      "final_freeze",
      "pre_integration",
      "qa",
      "readiness_check",
    ];
    const styles = new Set(punjabiA1CiReadinessSamples.map((item) => item.style));

    for (const style of requiredStyles) {
      expect(styles, `missing style ${style}`).toContain(style);
    }
  });

  it("uses Gurmukhi primary with bilingual support and review links", () => {
    for (const item of punjabiA1CiReadinessSamples) {
      expect(item.id).toMatch(/^pa_a1_ci_readiness_/);
      expect(item.cue_pa).toMatch(GURMUKHI_SCRIPT);
      expect(item.expected_pa).toMatch(GURMUKHI_SCRIPT);
      expect(item.prompt_vi.trim().length).toBeGreaterThan(0);
      expect(item.prompt_en.trim().length).toBeGreaterThan(0);
      expect(item.meaning_vi.trim().length).toBeGreaterThan(0);
      expect(item.meaning_en.trim().length).toBeGreaterThan(0);
      expect(item.ci_readiness_check_vi.trim().length).toBeGreaterThan(0);
      expect(item.ci_readiness_check_en.trim().length).toBeGreaterThan(0);
      expect(item.readiness_vi.trim().length).toBeGreaterThan(0);
      expect(item.readiness_en.trim().length).toBeGreaterThan(0);
      expect(item.review_links.length).toBeGreaterThanOrEqual(2);

      for (const reviewId of item.review_links) {
        expect(reviewId).toMatch(/^pa_a1_/);
      }

      if (item.romanization) {
        expect(item.romanization).toMatch(LATIN);
      }
    }
  });

  it("includes traps, romanization bridge, and Canada-practical CI-readiness items", () => {
    const traps = punjabiA1CiReadinessSamples.flatMap((item) => (item.trap ? [item.trap] : []));
    const trapAudiences = new Set(traps.map((trap) => trap.audience));
    const canadaItems = punjabiA1CiReadinessSamples.filter((item) => item.canada_practical);
    const romanizationBridge = punjabiA1CiReadinessSamples.find((item) => item.domain === "romanization_bridge");

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(trapAudiences.has("vi") || trapAudiences.has("both")).toBe(true);
    expect(trapAudiences.has("en") || trapAudiences.has("both")).toBe(true);
    expect(canadaItems.length).toBeGreaterThanOrEqual(9);
    expect(JSON.stringify(canadaItems)).toMatch(/ਫਾਰਮ|ਪਛਾਣ|ਬੱਸ|ਮਦਦ|ਦੁਬਾਰਾ|ਧੰਨਵਾਦ/);
    expect(romanizationBridge?.romanization).toMatch(LATIN);
    expect(JSON.stringify(romanizationBridge)).toMatch(/Gurmukhi|Romanization|romanization/);
  });

  it("verifies beginner readiness across required CI-readiness situations", () => {
    const allText = JSON.stringify(punjabiA1CiReadinessSamples);

    expect(allText).toMatch(/ਸਤ ਸ੍ਰੀ ਅਕਾਲ/);
    expect(allText).toMatch(/ਮੇਰਾ ਨਾਮ|ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ/);
    expect(allText).toMatch(/ਪਿਤਾ ਜੀ|ਮੇਰੇ ਕੋਲ ਇੱਕ ਭੈਣ/);
    expect(allText).toMatch(/ਤਿੰਨ ਟਿਕਟਾਂ/);
    expect(allText).toMatch(/ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ/);
    expect(allText).toMatch(/ਮੈਨੂੰ ਚਾਹ ਚਾਹੀਦੀ ਹੈ/);
    expect(allText).toMatch(/ਬੱਸ ਸਟਾਪ ਕਿੱਥੇ ਹੈ/);
    expect(allText).toMatch(/ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ/);
    expect(allText).toMatch(/ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ/);
    expect(allText).toMatch(/ਧੰਨਵਾਦ ਜੀ/);
    expect(allText).toMatch(/ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ, ਪਛਾਣ/);
    expect(allText).toMatch(/Romanization|romanization/);
    expect(allText).toMatch(/ਪਛਾਣ ਹੈ|ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ/);
    expect(allText).toMatch(/CI-readiness|ci_readiness|mr_readiness|final_freeze|pre-integration|Sẵn sàng|Ready/i);
  });

  it("mentions Shahmukhi only as awareness and avoids disallowed claims and systems", () => {
    const allText = `${ciReadinessScriptAwareness} ${JSON.stringify(punjabiA1CiReadinessSamples)}`;

    expect(ciReadinessScriptAwareness).toContain("Shahmukhi");
    expect(ciReadinessScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure|auth|billing|RLS|Supabase|CI config|A11 integration/i);
  });
});
