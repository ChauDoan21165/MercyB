import { describe, expect, it } from "vitest";

import punjabiA1FinalHandoffSet, {
  finalHandoffScriptAwareness,
  punjabiA1FinalHandoffSet as namedFinalHandoffSet,
  type PunjabiA1FinalHandoffDomain,
  type PunjabiA1FinalHandoffStyle,
} from "@/languages/punjabi/a1FinalHandoffSet";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 final handoff set", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(punjabiA1FinalHandoffSet).toBe(namedFinalHandoffSet);
    expect(Array.isArray(punjabiA1FinalHandoffSet)).toBe(true);
  });

  it("is compact and covers the required handoff domains", () => {
    expect(punjabiA1FinalHandoffSet.length).toBeGreaterThanOrEqual(11);
    expect(punjabiA1FinalHandoffSet.length).toBeLessThanOrEqual(14);

    const requiredDomains: PunjabiA1FinalHandoffDomain[] = [
      "greetings",
      "identity",
      "family",
      "numbers",
      "food",
      "directions",
      "help",
      "politeness",
      "retention",
      "checkpoints",
      "service_counter_basics",
      "gurmukhi_recognition",
    ];
    const domains = new Set(punjabiA1FinalHandoffSet.map((item) => item.domain));

    for (const domain of requiredDomains) {
      expect(domains, `missing domain ${domain}`).toContain(domain);
    }
  });

  it("includes handoff, pre-integration, final-readiness, selector, quality-gate, and checkpoint styles", () => {
    const requiredStyles: PunjabiA1FinalHandoffStyle[] = [
      "handoff",
      "pre_integration",
      "final_readiness",
      "selector",
      "quality_gate",
      "checkpoint",
    ];
    const styles = new Set(punjabiA1FinalHandoffSet.map((item) => item.style));

    for (const style of requiredStyles) {
      expect(styles, `missing style ${style}`).toContain(style);
    }
  });

  it("uses Gurmukhi primary with bilingual support and review links", () => {
    for (const item of punjabiA1FinalHandoffSet) {
      expect(item.id).toMatch(/^pa_a1_handoff_/);
      expect(item.cue_pa).toMatch(GURMUKHI_SCRIPT);
      expect(item.prompt_vi.trim().length).toBeGreaterThan(0);
      expect(item.prompt_en.trim().length).toBeGreaterThan(0);
      expect(item.meaning_vi.trim().length).toBeGreaterThan(0);
      expect(item.meaning_en.trim().length).toBeGreaterThan(0);
      expect(item.selector_pa.trim().length).toBeGreaterThan(0);
      expect(item.selector_hint_vi.trim().length).toBeGreaterThan(0);
      expect(item.selector_hint_en.trim().length).toBeGreaterThan(0);
      expect(item.why_handoff_vi.trim().length).toBeGreaterThan(0);
      expect(item.why_handoff_en.trim().length).toBeGreaterThan(0);
      expect(item.review_links.length).toBeGreaterThanOrEqual(2);

      for (const reviewId of item.review_links) {
        expect(reviewId).toMatch(/^pa_a1_/);
      }

      if (item.romanization) {
        expect(item.romanization).toMatch(LATIN);
      }
    }
  });

  it("includes traps and Canada-practical handoff items", () => {
    const traps = punjabiA1FinalHandoffSet.flatMap((item) => (item.trap ? [item.trap] : []));
    const trapAudiences = new Set(traps.map((trap) => trap.audience));
    const canadaItems = punjabiA1FinalHandoffSet.filter((item) => item.canada_practical);

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(trapAudiences.has("vi") || trapAudiences.has("both")).toBe(true);
    expect(trapAudiences.has("en") || trapAudiences.has("both")).toBe(true);
    expect(canadaItems.length).toBeGreaterThanOrEqual(8);
    expect(JSON.stringify(canadaItems)).toMatch(/ਫਾਰਮ|ਪਛਾਣ|ਬੱਸ|ਮਦਦ|ਦੁਬਾਰਾ|ਧੰਨਵਾਦ|ਮਾਫ਼ ਕਰਨਾ/);
  });

  it("covers greetings, identity, family, numbers, food, directions, help, politeness, retention, checkpoints, service counters, and Gurmukhi recognition", () => {
    const allText = JSON.stringify(punjabiA1FinalHandoffSet);

    expect(allText).toMatch(/ਸਤ ਸ੍ਰੀ ਅਕਾਲ/);
    expect(allText).toMatch(/ਮੇਰਾ ਨਾਮ|ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ/);
    expect(allText).toMatch(/ਮੇਰੀ ਮਾਂ|ਮੇਰੇ ਕੋਲ ਇੱਕ ਭਰਾ/);
    expect(allText).toMatch(/ਦੋ ਟਿਕਟਾਂ|ਪੰਜ ਡਾਲਰ/);
    expect(allText).toMatch(/ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ/);
    expect(allText).toMatch(/ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ/);
    expect(allText).toMatch(/ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ/);
    expect(allText).toMatch(/ਧੰਨਵਾਦ/);
    expect(allText).toMatch(/ਮਾਫ਼ ਕਰਨਾ|ਦੁਬਾਰਾ ਕਹੋ/);
    expect(allText).toMatch(/ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ/);
    expect(allText).toMatch(/ਪਛਾਣ ਹੈ|ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ/);
  });

  it("mentions Shahmukhi only as awareness and avoids disallowed claims and systems", () => {
    const allText = `${finalHandoffScriptAwareness} ${JSON.stringify(punjabiA1FinalHandoffSet)}`;

    expect(finalHandoffScriptAwareness).toContain("Shahmukhi");
    expect(finalHandoffScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure|auth|billing|RLS|Supabase|CI config|A11 integration/i);
  });
});
