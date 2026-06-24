import { describe, expect, it } from "vitest";

import punjabiA1MicroCheckpointSet, {
  microCheckpointSetScriptAwareness,
  punjabiA1MicroCheckpointSet as namedMicroCheckpointSet,
  type PunjabiMicroCheckpointDomain,
  type PunjabiMicroCheckpointStyle,
} from "@/languages/punjabi/microCheckpointSetA1";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 micro checkpoint set", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(punjabiA1MicroCheckpointSet).toBe(namedMicroCheckpointSet);
    expect(Array.isArray(punjabiA1MicroCheckpointSet)).toBe(true);
  });

  it("is compact and covers the required checkpoint domains", () => {
    expect(punjabiA1MicroCheckpointSet.length).toBeGreaterThanOrEqual(10);
    expect(punjabiA1MicroCheckpointSet.length).toBeLessThanOrEqual(14);

    const requiredDomains: PunjabiMicroCheckpointDomain[] = [
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
    const domains = new Set(punjabiA1MicroCheckpointSet.map((item) => item.domain));

    for (const domain of requiredDomains) {
      expect(domains, `missing domain ${domain}`).toContain(domain);
    }
  });

  it("includes final-stability, boundary-check, checklist, export-readiness, and regression styles", () => {
    const requiredStyles: PunjabiMicroCheckpointStyle[] = [
      "micro_checkpoint",
      "final_stability",
      "boundary_check",
      "checklist",
      "regression",
    ];
    const styles = new Set(punjabiA1MicroCheckpointSet.map((item) => item.style));

    for (const style of requiredStyles) {
      expect(styles, `missing style ${style}`).toContain(style);
    }
  });

  it("uses Gurmukhi primary with bilingual support and review links", () => {
    for (const item of punjabiA1MicroCheckpointSet) {
      expect(item.id).toMatch(/^pa_a1_checkpoint_/);
      expect(item.cue_pa).toMatch(GURMUKHI_SCRIPT);
      expect(item.prompt_vi.trim().length).toBeGreaterThan(0);
      expect(item.prompt_en.trim().length).toBeGreaterThan(0);
      expect(item.meaning_vi.trim().length).toBeGreaterThan(0);
      expect(item.meaning_en.trim().length).toBeGreaterThan(0);
      expect(item.expected_pa.trim().length).toBeGreaterThan(0);
      expect(item.expected_hint_vi.trim().length).toBeGreaterThan(0);
      expect(item.expected_hint_en.trim().length).toBeGreaterThan(0);
      expect(item.why_checkpoint_vi.trim().length).toBeGreaterThan(0);
      expect(item.why_checkpoint_en.trim().length).toBeGreaterThan(0);
      expect(item.review_links.length).toBeGreaterThanOrEqual(2);

      for (const reviewId of item.review_links) {
        expect(reviewId).toMatch(/^pa_a1_/);
      }
      if (item.romanization) {
        expect(item.romanization).toMatch(LATIN);
      }
    }
  });

  it("includes traps and Canada-practical checkpoints", () => {
    const traps = punjabiA1MicroCheckpointSet.flatMap((item) => item.trap ? [item.trap] : []);
    const trapAudiences = new Set(traps.map((trap) => trap.audience));
    const canadaItems = punjabiA1MicroCheckpointSet.filter((item) => item.canada_practical);

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(trapAudiences.has("vi") || trapAudiences.has("both")).toBe(true);
    expect(trapAudiences.has("en") || trapAudiences.has("both")).toBe(true);
    expect(canadaItems.length).toBeGreaterThanOrEqual(8);
    expect(JSON.stringify(canadaItems)).toMatch(/ਫਾਰਮ|ਪਛਾਣ|ਬੱਸ|ਮਦਦ|ਦੁਬਾਰਾ|ਧੰਨਵਾਦ|ਮਾਫ਼ ਕਰਨਾ/);
  });

  it("proves the A1 checkpoint set across key survival phrases", () => {
    const allText = JSON.stringify(punjabiA1MicroCheckpointSet);

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
    const allText = `${microCheckpointSetScriptAwareness} ${JSON.stringify(punjabiA1MicroCheckpointSet)}`;

    expect(microCheckpointSetScriptAwareness).toContain("Shahmukhi");
    expect(microCheckpointSetScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure|auth|billing|RLS|Supabase|CI config|A11 integration/i);
  });
});
