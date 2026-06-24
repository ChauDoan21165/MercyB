import { describe, expect, it } from "vitest";

import punjabiA1RecognitionDrills, {
  punjabiA1RecognitionDrills as namedRecognitionDrills,
  recognitionDrillsScriptAwareness,
  type PunjabiRecognitionDrillFocus,
  type PunjabiRecognitionDrillType,
  type PunjabiRecognitionQualityTag,
} from "@/languages/punjabi/recognitionDrillsA1";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 recognition drills", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(punjabiA1RecognitionDrills).toBe(namedRecognitionDrills);
    expect(Array.isArray(punjabiA1RecognitionDrills)).toBe(true);
  });

  it("is compact and covers required recognition focuses", () => {
    expect(punjabiA1RecognitionDrills.length).toBeGreaterThanOrEqual(12);
    expect(punjabiA1RecognitionDrills.length).toBeLessThanOrEqual(24);

    const requiredFocuses: PunjabiRecognitionDrillFocus[] = [
      "gurmukhi_to_meaning",
      "polite_phrase",
      "numbers_prices",
      "help_request",
      "canada_service_situation",
    ];
    const focuses = new Set(punjabiA1RecognitionDrills.map((item) => item.focus));

    for (const focus of requiredFocuses) {
      expect(focuses, `missing focus ${focus}`).toContain(focus);
    }
  });

  it("includes final-quality, review, remediation, and readiness styles", () => {
    const requiredTypes: PunjabiRecognitionDrillType[] = [
      "match",
      "choose_meaning",
      "choose_phrase",
      "situation_match",
      "remediation",
      "readiness_check",
    ];
    const drillTypes = new Set(punjabiA1RecognitionDrills.map((item) => item.drill_type));
    for (const drillType of requiredTypes) {
      expect(drillTypes, `missing drill type ${drillType}`).toContain(drillType);
    }

    const requiredQualityTags: PunjabiRecognitionQualityTag[] = [
      "final_quality",
      "review",
      "remediation",
      "readiness",
    ];
    const qualityTags = new Set(punjabiA1RecognitionDrills.map((item) => item.quality_tag));
    for (const qualityTag of requiredQualityTags) {
      expect(qualityTags, `missing quality tag ${qualityTag}`).toContain(qualityTag);
    }
  });

  it("uses Gurmukhi primary, romanization where useful, and bilingual explanations", () => {
    for (const item of punjabiA1RecognitionDrills) {
      expect(item.id).toMatch(/^pa_a1_recognition_/);
      expect(item.stimulus_pa).toMatch(GURMUKHI_SCRIPT);
      expect(`${item.correct_answer_pa ?? ""} ${item.stimulus_pa}`).toMatch(GURMUKHI_SCRIPT);
      expect(item.prompt_vi.trim().length).toBeGreaterThan(0);
      expect(item.prompt_en.trim().length).toBeGreaterThan(0);
      expect(item.correct_answer_vi.trim().length).toBeGreaterThan(0);
      expect(item.correct_answer_en.trim().length).toBeGreaterThan(0);
      expect(item.explanation_vi.trim().length).toBeGreaterThan(0);
      expect(item.explanation_en.trim().length).toBeGreaterThan(0);
      expect(item.remediation_vi.trim().length).toBeGreaterThan(0);
      expect(item.remediation_en.trim().length).toBeGreaterThan(0);
      expect(item.readiness_signal_vi.trim().length).toBeGreaterThan(0);
      expect(item.readiness_signal_en.trim().length).toBeGreaterThan(0);
      expect(item.review_targets.length).toBeGreaterThanOrEqual(2);

      if (item.options_pa) {
        expect(item.options_pa.length).toBeGreaterThanOrEqual(3);
        expect(JSON.stringify(item.options_pa)).toMatch(GURMUKHI_SCRIPT);
      }
      if (item.options_vi) {
        expect(item.options_vi.length).toBeGreaterThanOrEqual(3);
      }
      if (item.options_en) {
        expect(item.options_en.length).toBeGreaterThanOrEqual(3);
      }
      if (item.romanization) {
        expect(item.romanization).toMatch(LATIN);
      }
    }
  });

  it("includes learner traps and Canada-practical situation recognition", () => {
    const traps = punjabiA1RecognitionDrills.flatMap((item) => item.learner_trap ? [item.learner_trap] : []);
    const trapAudiences = new Set(traps.map((trap) => trap.audience));
    const canadaItems = punjabiA1RecognitionDrills.filter((item) => item.canada_practical);

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(trapAudiences.has("vi") || trapAudiences.has("both")).toBe(true);
    expect(trapAudiences.has("en") || trapAudiences.has("both")).toBe(true);
    expect(canadaItems.length).toBeGreaterThanOrEqual(10);
    expect(JSON.stringify(canadaItems)).toMatch(/ਫਾਰਮ|ਟਿਕਟ|ਡਾਲਰ|ਕਲਿਨਿਕ|ਅਪਾਇੰਟਮੈਂਟ|ਪਛਾਣ|ਬੱਸ|ਮਦਦ|ਬੈਗ/);
  });

  it("recognizes meanings, polite phrases, numbers/prices, help requests, and Canada service situations", () => {
    const allText = JSON.stringify(punjabiA1RecognitionDrills);

    expect(allText).toMatch(/ਪਾਣੀ|ਫਾਰਮ|ਪਛਾਣ|ਅਪਾਇੰਟਮੈਂਟ/);
    expect(allText).toMatch(/ਸਤ ਸ੍ਰੀ ਅਕਾਲ|ਮਾਫ਼ ਕਰਨਾ|ਧੰਨਵਾਦ|ਕਿਰਪਾ ਕਰਕੇ/);
    expect(allText).toMatch(/ਪੰਜ ਡਾਲਰ|ਦੋ ਟਿਕਟਾਂ/);
    expect(allText).toMatch(/ਮਦਦ ਕਰੋ|ਸਮਝ ਨਹੀਂ|ਦੁਬਾਰਾ ਕਹੋ/);
    expect(allText).toMatch(/ਮੈਨੂੰ ਫਾਰਮ|ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ|ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਪਛਾਣ ਹੈ/);
    expect(allText).toMatch(/ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ|ਕਲਿਨਿਕ ਕਿੱਥੇ ਹੈ|ਮੈਨੂੰ ਇੱਕ ਬੈਗ/);
  });

  it("mentions Shahmukhi only as awareness and does not claim native review or unrelated systems", () => {
    const allText = `${recognitionDrillsScriptAwareness} ${JSON.stringify(punjabiA1RecognitionDrills)}`;

    expect(recognitionDrillsScriptAwareness).toContain("Shahmukhi");
    expect(recognitionDrillsScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure|auth|billing|RLS|Supabase|CI config|A11 integration/i);
  });
});
