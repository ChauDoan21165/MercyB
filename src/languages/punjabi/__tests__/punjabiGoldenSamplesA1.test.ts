import { describe, expect, it } from "vitest";

import punjabiA1GoldenSamples, {
  goldenSamplesScriptAwareness,
  punjabiA1GoldenSamples as namedGoldenSamples,
  type PunjabiGoldenSampleDomain,
  type PunjabiGoldenSampleTaskType,
} from "@/languages/punjabi/goldenSamplesA1";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 golden samples", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(punjabiA1GoldenSamples).toBe(namedGoldenSamples);
    expect(Array.isArray(punjabiA1GoldenSamples)).toBe(true);
  });

  it("is compact and covers required A1 golden sample domains", () => {
    expect(punjabiA1GoldenSamples.length).toBeGreaterThanOrEqual(18);
    expect(punjabiA1GoldenSamples.length).toBeLessThanOrEqual(30);

    const requiredDomains: PunjabiGoldenSampleDomain[] = [
      "greetings",
      "identity",
      "family",
      "numbers",
      "food",
      "directions",
      "help",
      "service_counter",
      "gurmukhi_recognition",
      "canada_survival",
    ];
    const domains = new Set(punjabiA1GoldenSamples.map((item) => item.domain));

    for (const domain of requiredDomains) {
      expect(domains, `missing domain ${domain}`).toContain(domain);
    }
  });

  it("includes golden-sample, final-QA, mini-task, recognition, and readiness styles", () => {
    const requiredTaskTypes: PunjabiGoldenSampleTaskType[] = [
      "golden_sample",
      "final_qa",
      "mini_task",
      "recognition",
      "integration_readiness",
    ];
    const taskTypes = new Set(punjabiA1GoldenSamples.map((item) => item.task_type));

    for (const taskType of requiredTaskTypes) {
      expect(taskTypes, `missing task type ${taskType}`).toContain(taskType);
    }
  });

  it("uses Gurmukhi primary, romanization where useful, and bilingual explanations", () => {
    for (const item of punjabiA1GoldenSamples) {
      expect(item.id).toMatch(/^pa_a1_golden_/);
      expect(item.sample_pa).toMatch(GURMUKHI_SCRIPT);
      expect(item.title_vi.trim().length).toBeGreaterThan(0);
      expect(item.title_en.trim().length).toBeGreaterThan(0);
      expect(item.prompt_vi.trim().length).toBeGreaterThan(0);
      expect(item.prompt_en.trim().length).toBeGreaterThan(0);
      expect(item.meaning_vi.trim().length).toBeGreaterThan(0);
      expect(item.meaning_en.trim().length).toBeGreaterThan(0);
      expect(item.explanation_vi.trim().length).toBeGreaterThan(0);
      expect(item.explanation_en.trim().length).toBeGreaterThan(0);
      expect(item.final_check_vi.trim().length).toBeGreaterThan(0);
      expect(item.final_check_en.trim().length).toBeGreaterThan(0);

      if (item.romanization) {
        expect(item.romanization).toMatch(LATIN);
      }
    }
  });

  it("includes learner traps and Canada-practical survival samples", () => {
    const traps = punjabiA1GoldenSamples.flatMap((item) => item.learner_trap ? [item.learner_trap] : []);
    const trapAudiences = new Set(traps.map((trap) => trap.audience));
    const canadaItems = punjabiA1GoldenSamples.filter((item) => item.canada_practical);

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(trapAudiences.has("vi") || trapAudiences.has("both")).toBe(true);
    expect(trapAudiences.has("en") || trapAudiences.has("both")).toBe(true);
    expect(canadaItems.length).toBeGreaterThanOrEqual(10);
    expect(JSON.stringify(canadaItems)).toMatch(/ਫਾਰਮ|ਟਿਕਟ|ਡਾਲਰ|ਕਲਿਨਿਕ|ਅਪਾਇੰਟਮੈਂਟ|ਪਛਾਣ|ਬੱਸ|ਮਦਦ/);
  });

  it("covers greetings, identity, family, numbers, food, directions, help, service counter, Gurmukhi, and Canada survival", () => {
    const allText = JSON.stringify(punjabiA1GoldenSamples);

    expect(allText).toMatch(/ਸਤ ਸ੍ਰੀ ਅਕਾਲ|ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ/);
    expect(allText).toMatch(/ਮੇਰਾ ਨਾਮ|ਤੁਹਾਡਾ ਨਾਮ/);
    expect(allText).toMatch(/ਮੇਰੀ ਮਾਂ|ਮੇਰੇ ਕੋਲ ਇੱਕ ਭੈਣ/);
    expect(allText).toMatch(/ਦੋ ਟਿਕਟਾਂ|ਪੰਜ ਡਾਲਰ/);
    expect(allText).toMatch(/ਮੈਨੂੰ ਪਾਣੀ|ਸ਼ਾਕਾਹਾਰੀ/);
    expect(allText).toMatch(/ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ|ਸੱਜੇ|ਖੱਬੇ/);
    expect(allText).toMatch(/ਮਦਦ ਕਰੋ|ਸਮਝ ਨਹੀਂ/);
    expect(allText).toMatch(/ਮੈਨੂੰ ਫਾਰਮ|ਅਪਾਇੰਟਮੈਂਟ/);
    expect(allText).toMatch(/ਪਾਣੀ|ਮਦਦ|ਬੱਸ/);
    expect(allText).toMatch(/ਪਛਾਣ|ਦੁਬਾਰਾ ਕਹੋ/);
  });

  it("mentions Shahmukhi only as awareness and does not claim native review or unrelated systems", () => {
    const allText = `${goldenSamplesScriptAwareness} ${JSON.stringify(punjabiA1GoldenSamples)}`;

    expect(goldenSamplesScriptAwareness).toContain("Shahmukhi");
    expect(goldenSamplesScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure|auth|billing|RLS|Supabase|CI config|A11 integration/i);
  });
});
