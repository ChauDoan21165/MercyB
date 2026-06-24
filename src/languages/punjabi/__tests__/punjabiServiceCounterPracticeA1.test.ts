import { describe, expect, it } from "vitest";

import punjabiA1ServiceCounterPractice, {
  punjabiA1ServiceCounterPractice as namedServiceCounterPractice,
  serviceCounterScriptAwareness,
  type PunjabiServiceCounterPracticeType,
  type PunjabiServiceCounterSetting,
  type PunjabiServiceCounterSkill,
} from "@/languages/punjabi/serviceCounterPracticeA1";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 service-counter practice", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(punjabiA1ServiceCounterPractice).toBe(namedServiceCounterPractice);
    expect(Array.isArray(punjabiA1ServiceCounterPractice)).toBe(true);
  });

  it("is compact and covers required service settings and skills", () => {
    expect(punjabiA1ServiceCounterPractice.length).toBeGreaterThanOrEqual(12);
    expect(punjabiA1ServiceCounterPractice.length).toBeLessThanOrEqual(24);

    const requiredSettings: PunjabiServiceCounterSetting[] = [
      "general_counter",
      "store",
      "transit",
      "clinic",
      "school",
      "public_counter",
    ];
    const settings = new Set(punjabiA1ServiceCounterPractice.map((item) => item.setting));
    for (const setting of requiredSettings) {
      expect(settings, `missing setting ${setting}`).toContain(setting);
    }

    const requiredSkills: PunjabiServiceCounterSkill[] = [
      "greeting",
      "price",
      "location",
      "help",
      "repetition",
      "need",
      "appointment",
      "identification",
    ];
    const skills = new Set(punjabiA1ServiceCounterPractice.map((item) => item.skill));
    for (const skill of requiredSkills) {
      expect(skills, `missing skill ${skill}`).toContain(skill);
    }
  });

  it("includes navigation, review, remediation, and readiness practice styles", () => {
    const requiredTypes: PunjabiServiceCounterPracticeType[] = [
      "phrase_recall",
      "choice",
      "mini_roleplay",
      "navigation",
      "remediation",
      "readiness_check",
    ];
    const practiceTypes = new Set(punjabiA1ServiceCounterPractice.map((item) => item.practice_type));

    for (const practiceType of requiredTypes) {
      expect(practiceTypes, `missing practice type ${practiceType}`).toContain(practiceType);
    }
  });

  it("uses Gurmukhi primary, romanization where useful, and bilingual explanations", () => {
    for (const item of punjabiA1ServiceCounterPractice) {
      expect(item.id).toMatch(/^pa_a1_counter_/);
      expect(JSON.stringify(item.answer_pa)).toMatch(GURMUKHI_SCRIPT);
      expect(item.scenario_vi.trim().length).toBeGreaterThan(0);
      expect(item.scenario_en.trim().length).toBeGreaterThan(0);
      expect(item.prompt_vi.trim().length).toBeGreaterThan(0);
      expect(item.prompt_en.trim().length).toBeGreaterThan(0);
      expect(item.meaning_vi.trim().length).toBeGreaterThan(0);
      expect(item.meaning_en.trim().length).toBeGreaterThan(0);
      expect(item.explanation_vi.trim().length).toBeGreaterThan(0);
      expect(item.explanation_en.trim().length).toBeGreaterThan(0);
      expect(item.remediation_vi.trim().length).toBeGreaterThan(0);
      expect(item.remediation_en.trim().length).toBeGreaterThan(0);
      expect(item.readiness_signal_vi.trim().length).toBeGreaterThan(0);
      expect(item.readiness_signal_en.trim().length).toBeGreaterThan(0);
      expect(item.review_targets.length).toBeGreaterThanOrEqual(2);

      if (item.cue_pa) {
        expect(item.cue_pa).toMatch(GURMUKHI_SCRIPT);
      }
      if (item.options_pa) {
        expect(item.options_pa.length).toBeGreaterThanOrEqual(3);
        expect(JSON.stringify(item.options_pa)).toMatch(GURMUKHI_SCRIPT);
      }
      if (item.romanization) {
        expect(item.romanization).toMatch(LATIN);
      }
    }
  });

  it("includes learner traps and Canada-practical service counter phrases", () => {
    const traps = punjabiA1ServiceCounterPractice.flatMap((item) => item.learner_trap ? [item.learner_trap] : []);
    const trapAudiences = new Set(traps.map((trap) => trap.audience));
    const canadaItems = punjabiA1ServiceCounterPractice.filter((item) => item.canada_practical);

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(trapAudiences.has("vi") || trapAudiences.has("both")).toBe(true);
    expect(trapAudiences.has("en") || trapAudiences.has("both")).toBe(true);
    expect(canadaItems.length).toBeGreaterThanOrEqual(10);
    expect(JSON.stringify(canadaItems)).toMatch(/ਫਾਰਮ|ਟਿਕਟ|ਡਾਲਰ|ਕਲਿਨਿਕ|ਅਪਾਇੰਟਮੈਂਟ|ਪਛਾਣ|ਬੱਸ|ਮਦਦ|ਬੈਗ/);
  });

  it("covers greeting, price, location, help, repetition, clinic, school, store, public counter, and Gurmukhi support", () => {
    const allText = JSON.stringify(punjabiA1ServiceCounterPractice);

    expect(allText).toMatch(/ਸਤ ਸ੍ਰੀ ਅਕਾਲ/);
    expect(allText).toMatch(/ਕਿੰਨੇ ਦਾ|ਪੰਜ ਡਾਲਰ/);
    expect(allText).toMatch(/ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ|ਕਲਿਨਿਕ ਕਿੱਥੇ ਹੈ/);
    expect(allText).toMatch(/ਮਦਦ ਕਰੋ|ਸਮਝ ਨਹੀਂ/);
    expect(allText).toMatch(/ਦੁਬਾਰਾ ਕਹੋ/);
    expect(allText).toMatch(/ਮੈਨੂੰ ਫਾਰਮ|ਅਪਾਇੰਟਮੈਂਟ|ਪਛਾਣ/);
    expect(allText).toMatch(/ਮੈਨੂੰ ਇੱਕ ਬੈਗ/);
    expect(allText).toMatch(/ਫਾਰਮ|ਪਛਾਣ|ਅਪਾਇੰਟਮੈਂਟ/);
  });

  it("mentions Shahmukhi only as awareness and does not claim native review or unrelated systems", () => {
    const allText = `${serviceCounterScriptAwareness} ${JSON.stringify(punjabiA1ServiceCounterPractice)}`;

    expect(serviceCounterScriptAwareness).toContain("Shahmukhi");
    expect(serviceCounterScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure|auth|billing|RLS|Supabase|CI config|A11 integration/i);
  });
});
