import { describe, expect, it } from "vitest";

import punjabiA1SignoffSamples, {
  signoffScriptAwareness,
  punjabiA1SignoffSamples as namedSignoffSamples,
  type PunjabiA1SignoffDomain,
  type PunjabiA1SignoffStyle,
} from "@/languages/punjabi/a1SignoffSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 signoff samples", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(punjabiA1SignoffSamples).toBe(namedSignoffSamples);
    expect(Array.isArray(punjabiA1SignoffSamples)).toBe(true);
  });

  it("is compact and covers the required signoff domains", () => {
    expect(punjabiA1SignoffSamples.length).toBeGreaterThanOrEqual(12);
    expect(punjabiA1SignoffSamples.length).toBeLessThanOrEqual(14);

    const requiredDomains: PunjabiA1SignoffDomain[] = [
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
    const domains = new Set(punjabiA1SignoffSamples.map((item) => item.domain));

    for (const domain of requiredDomains) {
      expect(domains, `missing domain ${domain}`).toContain(domain);
    }
  });

  it("includes pre-A11-signoff, pre-snapshot, closure-packet, pre-merge, pre-integration, qa, and readiness styles", () => {
    const requiredStyles: PunjabiA1SignoffStyle[] = [
      "pre_a11_signoff",
      "pre_snapshot",
      "closure_packet",
      "pre_merge",
      "pre_integration",
      "qa",
      "readiness_check",
    ];
    const styles = new Set(punjabiA1SignoffSamples.map((item) => item.style));

    for (const style of requiredStyles) {
      expect(styles, `missing style ${style}`).toContain(style);
    }
  });

  it("uses Gurmukhi primary with bilingual support and review links", () => {
    for (const item of punjabiA1SignoffSamples) {
      expect(item.id).toMatch(/^pa_a1_signoff_/);
      expect(item.cue_pa).toMatch(GURMUKHI_SCRIPT);
      expect(item.expected_pa).toMatch(GURMUKHI_SCRIPT);
      expect(item.prompt_vi.trim().length).toBeGreaterThan(0);
      expect(item.prompt_en.trim().length).toBeGreaterThan(0);
      expect(item.meaning_vi.trim().length).toBeGreaterThan(0);
      expect(item.meaning_en.trim().length).toBeGreaterThan(0);
      expect(item.signoff_check_vi.trim().length).toBeGreaterThan(0);
      expect(item.signoff_check_en.trim().length).toBeGreaterThan(0);
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

  it("includes traps, romanization bridge, and Canada-practical signoff items", () => {
    const traps = punjabiA1SignoffSamples.flatMap((item) => (item.trap ? [item.trap] : []));
    const trapAudiences = new Set(traps.map((trap) => trap.audience));
    const canadaItems = punjabiA1SignoffSamples.filter((item) => item.canada_practical);
    const romanizationBridge = punjabiA1SignoffSamples.find((item) => item.domain === "romanization_bridge");

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(trapAudiences.has("vi") || trapAudiences.has("both")).toBe(true);
    expect(trapAudiences.has("en") || trapAudiences.has("both")).toBe(true);
    expect(canadaItems.length).toBeGreaterThanOrEqual(9);
    expect(JSON.stringify(canadaItems)).toMatch(/ਫਾਰਮ|ਪਛਾਣ|ਬੱਸ|ਮਦਦ|ਦੁਬਾਰਾ|ਧੰਨਵਾਦ/);
    expect(romanizationBridge?.romanization).toMatch(LATIN);
    expect(JSON.stringify(romanizationBridge)).toMatch(/Gurmukhi|Romanization|romanization/);
  });

  it("verifies beginner readiness across required signoff situations", () => {
    const allText = JSON.stringify(punjabiA1SignoffSamples);

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
    expect(allText).toMatch(/signoff|snapshot|pre_a11_signoff|pre_snapshot|closure_packet|pre_merge|pre-integration|Sẵn sàng|Ready/i);
  });

  it("mentions Shahmukhi only as awareness and avoids disallowed claims and systems", () => {
    const allText = `${signoffScriptAwareness} ${JSON.stringify(punjabiA1SignoffSamples)}`;

    expect(signoffScriptAwareness).toContain("Shahmukhi");
    expect(signoffScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure|auth|billing|RLS|Supabase|CI config|A11 integration/i);
  });
});
