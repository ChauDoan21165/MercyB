import { describe, expect, it } from "vitest";

import punjabiA1GuidedPractice, {
  guidedPracticeScriptAwareness,
  punjabiA1GuidedPractice as namedGuidedPractice,
  type PunjabiGuidedPracticeType,
} from "@/languages/punjabi/guidedPracticeA1";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 guided practice", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(punjabiA1GuidedPractice).toBe(namedGuidedPractice);
    expect(Array.isArray(punjabiA1GuidedPractice)).toBe(true);
  });

  it("covers required guided practice types", () => {
    expect(punjabiA1GuidedPractice.length).toBeGreaterThanOrEqual(18);
    expect(punjabiA1GuidedPractice.length).toBeLessThanOrEqual(32);

    const requiredTypes: PunjabiGuidedPracticeType[] = [
      "choose_phrase",
      "fill_gap",
      "reorder_sentence",
      "match_gurmukhi",
      "polite_request",
      "canada_service_task",
    ];
    const types = new Set(punjabiA1GuidedPractice.map((item) => item.type));

    for (const type of requiredTypes) {
      expect(types, `missing type ${type}`).toContain(type);
    }
  });

  it("uses Gurmukhi primary, romanization where useful, and bilingual explanations", () => {
    for (const item of punjabiA1GuidedPractice) {
      expect(item.id).toMatch(/^pa_a1_guided_/);
      expect(item.level).toBe("A1");
      expect(item.prompt_vi.trim().length).toBeGreaterThan(0);
      expect(item.prompt_en.trim().length).toBeGreaterThan(0);
      expect(JSON.stringify(item.answer)).toMatch(GURMUKHI_SCRIPT);
      expect(item.explanation_vi.trim().length).toBeGreaterThan(0);
      expect(item.explanation_en.trim().length).toBeGreaterThan(0);

      if (item.prompt_pa) {
        expect(item.prompt_pa).toMatch(GURMUKHI_SCRIPT);
      }
      if (item.romanization) {
        expect(item.romanization).toMatch(LATIN);
      }
    }
  });

  it("includes options for choice, reorder, and matching tasks", () => {
    for (const item of punjabiA1GuidedPractice) {
      if (["choose_phrase", "reorder_sentence", "match_gurmukhi", "polite_request"].includes(item.type)) {
        expect(item.options?.length ?? 0, `${item.id} missing options`).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it("includes learner traps and Canada-practical mini tasks", () => {
    const traps = punjabiA1GuidedPractice.flatMap((item) => item.learner_trap ? [item.learner_trap] : []);
    const trapAudiences = new Set(traps.map((trap) => trap.audience));
    const canadaItems = punjabiA1GuidedPractice.filter((item) => item.canada_practical);

    expect(traps.length).toBeGreaterThanOrEqual(6);
    expect(trapAudiences.has("vi") || trapAudiences.has("both")).toBe(true);
    expect(trapAudiences.has("en") || trapAudiences.has("both")).toBe(true);
    expect(canadaItems.length).toBeGreaterThanOrEqual(7);
    expect(JSON.stringify(canadaItems)).toMatch(/ਫਾਰਮ|ਟਿਕਟ|ਕਲਿਨਿਕ|ਅਪਾਇੰਟਮੈਂਟ|ਪਛਾਣ|ਬੱਸ/);
  });

  it("mentions Shahmukhi only as awareness and does not claim native review", () => {
    const allText = `${guidedPracticeScriptAwareness} ${JSON.stringify(punjabiA1GuidedPractice)}`;

    expect(guidedPracticeScriptAwareness).toContain("Shahmukhi");
    expect(guidedPracticeScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
  });
});
