import { describe, expect, it } from "vitest";

import punjabiA1FunctionalPhrases, {
  functionalPhraseScriptAwareness,
  punjabiA1FunctionalPhrases as namedFunctionalPhrases,
  type PunjabiFunctionalPhraseCategory,
} from "@/languages/punjabi/functionalPhrasesA1";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 functional phrases", () => {
  it("exports app-consumable named and default phrase arrays", () => {
    expect(punjabiA1FunctionalPhrases).toBe(namedFunctionalPhrases);
    expect(Array.isArray(punjabiA1FunctionalPhrases)).toBe(true);
  });

  it("keeps the bank useful but compact and covers required categories", () => {
    expect(punjabiA1FunctionalPhrases.length).toBeGreaterThanOrEqual(24);
    expect(punjabiA1FunctionalPhrases.length).toBeLessThanOrEqual(40);

    const requiredCategories: PunjabiFunctionalPhraseCategory[] = [
      "greeting",
      "asking",
      "thanking",
      "apologizing",
      "basic_needs",
      "price",
      "location",
      "help",
      "repetition",
      "canada_service",
    ];
    const categories = new Set(punjabiA1FunctionalPhrases.map((phrase) => phrase.category));

    for (const category of requiredCategories) {
      expect(categories, `missing category ${category}`).toContain(category);
    }
  });

  it("uses Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const phrase of punjabiA1FunctionalPhrases) {
      expect(phrase.id).toMatch(/^pa_a1_func_/);
      expect(phrase.phrase_pa).toMatch(GURMUKHI_SCRIPT);
      expect(phrase.romanization).toMatch(LATIN);
      expect(phrase.vi.trim().length).toBeGreaterThan(0);
      expect(phrase.en.trim().length).toBeGreaterThan(0);
      expect(phrase.explanation_vi.trim().length).toBeGreaterThan(0);
      expect(phrase.explanation_en.trim().length).toBeGreaterThan(0);
      expect(["neutral", "polite", "urgent"]).toContain(phrase.register);
    }
  });

  it("includes common learner traps where useful for Vietnamese and English speakers", () => {
    const traps = punjabiA1FunctionalPhrases.flatMap((phrase) => phrase.learner_trap ? [phrase.learner_trap] : []);
    const audiences = new Set(traps.map((trap) => trap.audience));

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(audiences.has("vi") || audiences.has("both")).toBe(true);
    expect(audiences.has("en") || audiences.has("both")).toBe(true);

    for (const trap of traps) {
      expect(trap.vi.trim().length).toBeGreaterThan(0);
      expect(trap.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes Canada-practical service phrases", () => {
    const canadaPhrases = punjabiA1FunctionalPhrases.filter((phrase) => phrase.canada_practical);

    expect(canadaPhrases.length).toBeGreaterThanOrEqual(10);
    expect(JSON.stringify(canadaPhrases)).toMatch(/ਟਿਕਟ|ਫਾਰਮ|ਬੱਸ|ਕਲਿਨਿਕ|ਅਪਾਇੰਟਮੈਂਟ|ਪਛਾਣ|ਕਾਰਡ/);
  });

  it("mentions Shahmukhi only as awareness and does not claim native review", () => {
    const allText = `${functionalPhraseScriptAwareness} ${JSON.stringify(punjabiA1FunctionalPhrases)}`;

    expect(functionalPhraseScriptAwareness).toContain("Shahmukhi");
    expect(functionalPhraseScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
  });
});
