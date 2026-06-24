import { describe, expect, it } from "vitest";

import punjabiA1CrossCheckSamples, {
  crossCheckScriptAwareness,
  punjabiA1CrossCheckSamples as namedCrossCheckSamples,
  type PunjabiA1CrossCheckDomain,
  type PunjabiA1CrossCheckStyle,
} from "@/languages/punjabi/a1CrossCheckSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 cross-check samples", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(punjabiA1CrossCheckSamples).toBe(namedCrossCheckSamples);
    expect(Array.isArray(punjabiA1CrossCheckSamples)).toBe(true);
  });

  it("is compact and covers the required cross-check domains", () => {
    expect(punjabiA1CrossCheckSamples.length).toBeGreaterThanOrEqual(12);
    expect(punjabiA1CrossCheckSamples.length).toBeLessThanOrEqual(14);

    const requiredDomains: PunjabiA1CrossCheckDomain[] = [
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
    const domains = new Set(punjabiA1CrossCheckSamples.map((item) => item.domain));

    for (const domain of requiredDomains) {
      expect(domains, `missing domain ${domain}`).toContain(domain);
    }
  });

  it("includes cross-check, verification, pre-integration, connected-set, qa, and selector styles", () => {
    const requiredStyles: PunjabiA1CrossCheckStyle[] = [
      "cross_check",
      "verification",
      "pre_integration",
      "connected_set",
      "qa",
      "selector",
    ];
    const styles = new Set(punjabiA1CrossCheckSamples.map((item) => item.style));

    for (const style of requiredStyles) {
      expect(styles, `missing style ${style}`).toContain(style);
    }
  });

  it("uses Gurmukhi primary with bilingual support and review links", () => {
    for (const item of punjabiA1CrossCheckSamples) {
      expect(item.id).toMatch(/^pa_a1_cross_/);
      expect(item.cue_pa).toMatch(GURMUKHI_SCRIPT);
      expect(item.expected_pa).toMatch(GURMUKHI_SCRIPT);
      expect(item.prompt_vi.trim().length).toBeGreaterThan(0);
      expect(item.prompt_en.trim().length).toBeGreaterThan(0);
      expect(item.meaning_vi.trim().length).toBeGreaterThan(0);
      expect(item.meaning_en.trim().length).toBeGreaterThan(0);
      expect(item.cross_check_vi.trim().length).toBeGreaterThan(0);
      expect(item.cross_check_en.trim().length).toBeGreaterThan(0);
      expect(item.why_connected_vi.trim().length).toBeGreaterThan(0);
      expect(item.why_connected_en.trim().length).toBeGreaterThan(0);
      expect(item.review_links.length).toBeGreaterThanOrEqual(2);

      for (const reviewId of item.review_links) {
        expect(reviewId).toMatch(/^pa_a1_/);
      }

      if (item.romanization) {
        expect(item.romanization).toMatch(LATIN);
      }
    }
  });

  it("includes traps, romanization bridge, and Canada-practical cross-check items", () => {
    const traps = punjabiA1CrossCheckSamples.flatMap((item) => (item.trap ? [item.trap] : []));
    const trapAudiences = new Set(traps.map((trap) => trap.audience));
    const canadaItems = punjabiA1CrossCheckSamples.filter((item) => item.canada_practical);
    const romanizationBridge = punjabiA1CrossCheckSamples.find((item) => item.domain === "romanization_bridge");

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(trapAudiences.has("vi") || trapAudiences.has("both")).toBe(true);
    expect(trapAudiences.has("en") || trapAudiences.has("both")).toBe(true);
    expect(canadaItems.length).toBeGreaterThanOrEqual(8);
    expect(JSON.stringify(canadaItems)).toMatch(/ਫਾਰਮ|ਪਛਾਣ|ਬੱਸ|ਮਦਦ|ਦੁਬਾਰਾ|ਧੰਨਵਾਦ/);
    expect(romanizationBridge?.romanization).toMatch(LATIN);
    expect(JSON.stringify(romanizationBridge)).toMatch(/Gurmukhi|Romanization|romanization/);
  });

  it("verifies the beginner samples work as a connected set, not isolated lines", () => {
    const allText = JSON.stringify(punjabiA1CrossCheckSamples);

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
    expect(allText).toMatch(/Romanization|romanization/);
    expect(allText).toMatch(/ਪਛਾਣ ਹੈ|ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ/);
    expect(allText).toMatch(/connect|nối|chuỗi|connected/i);
  });

  it("mentions Shahmukhi only as awareness and avoids disallowed claims and systems", () => {
    const allText = `${crossCheckScriptAwareness} ${JSON.stringify(punjabiA1CrossCheckSamples)}`;

    expect(crossCheckScriptAwareness).toContain("Shahmukhi");
    expect(crossCheckScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure|auth|billing|RLS|Supabase|CI config|A11 integration/i);
  });
});
