import { describe, expect, it } from "vitest";

import punjabiA1ShipCandidateSamples, {
  shipCandidateScriptAwareness,
  punjabiA1ShipCandidateSamples as namedShipCandidateSamples,
  type PunjabiA1ShipCandidateDomain,
  type PunjabiA1ShipCandidateStyle,
} from "@/languages/punjabi/a1ShipCandidateSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 ship-candidate samples", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(punjabiA1ShipCandidateSamples).toBe(namedShipCandidateSamples);
    expect(Array.isArray(punjabiA1ShipCandidateSamples)).toBe(true);
  });

  it("is compact and covers the required ship-candidate domains", () => {
    expect(punjabiA1ShipCandidateSamples.length).toBeGreaterThanOrEqual(12);
    expect(punjabiA1ShipCandidateSamples.length).toBeLessThanOrEqual(14);

    const requiredDomains: PunjabiA1ShipCandidateDomain[] = [
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
    const domains = new Set(punjabiA1ShipCandidateSamples.map((item) => item.domain));

    for (const domain of requiredDomains) {
      expect(domains, `missing domain ${domain}`).toContain(domain);
    }
  });

  it("includes ship-candidate, go-no-go, release-candidate, pre-integration, qa, and selector styles", () => {
    const requiredStyles: PunjabiA1ShipCandidateStyle[] = [
      "ship_candidate",
      "go_no_go",
      "release_candidate",
      "pre_integration",
      "qa",
      "selector",
    ];
    const styles = new Set(punjabiA1ShipCandidateSamples.map((item) => item.style));

    for (const style of requiredStyles) {
      expect(styles, `missing style ${style}`).toContain(style);
    }
  });

  it("uses Gurmukhi primary with bilingual support and review links", () => {
    for (const item of punjabiA1ShipCandidateSamples) {
      expect(item.id).toMatch(/^pa_a1_ship_candidate_/);
      expect(item.cue_pa).toMatch(GURMUKHI_SCRIPT);
      expect(item.expected_pa).toMatch(GURMUKHI_SCRIPT);
      expect(item.prompt_vi.trim().length).toBeGreaterThan(0);
      expect(item.prompt_en.trim().length).toBeGreaterThan(0);
      expect(item.meaning_vi.trim().length).toBeGreaterThan(0);
      expect(item.meaning_en.trim().length).toBeGreaterThan(0);
      expect(item.ship_candidate_check_vi.trim().length).toBeGreaterThan(0);
      expect(item.ship_candidate_check_en.trim().length).toBeGreaterThan(0);
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

  it("includes traps, romanization bridge, and Canada-practical ship-candidate items", () => {
    const traps = punjabiA1ShipCandidateSamples.flatMap((item) => (item.trap ? [item.trap] : []));
    const trapAudiences = new Set(traps.map((trap) => trap.audience));
    const canadaItems = punjabiA1ShipCandidateSamples.filter((item) => item.canada_practical);
    const romanizationBridge = punjabiA1ShipCandidateSamples.find((item) => item.domain === "romanization_bridge");

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(trapAudiences.has("vi") || trapAudiences.has("both")).toBe(true);
    expect(trapAudiences.has("en") || trapAudiences.has("both")).toBe(true);
    expect(canadaItems.length).toBeGreaterThanOrEqual(8);
    expect(JSON.stringify(canadaItems)).toMatch(/ਫਾਰਮ|ਪਛਾਣ|ਬੱਸ|ਮਦਦ|ਦੁਬਾਰਾ|ਧੰਨਵਾਦ/);
    expect(romanizationBridge?.romanization).toMatch(LATIN);
    expect(JSON.stringify(romanizationBridge)).toMatch(/Gurmukhi|Romanization|romanization/);
  });

  it("verifies beginner readiness across the required ship-candidate situations", () => {
    const allText = JSON.stringify(punjabiA1ShipCandidateSamples);

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
    expect(allText).toMatch(/ship-candidate|Go\/no-go|Sẵn sàng|Ready/i);
  });

  it("mentions Shahmukhi only as awareness and avoids disallowed claims and systems", () => {
    const allText = `${shipCandidateScriptAwareness} ${JSON.stringify(punjabiA1ShipCandidateSamples)}`;

    expect(shipCandidateScriptAwareness).toContain("Shahmukhi");
    expect(shipCandidateScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure|auth|billing|RLS|Supabase|CI config|A11 integration/i);
  });
});
