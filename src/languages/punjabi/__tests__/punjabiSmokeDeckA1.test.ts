import { describe, expect, it } from "vitest";

import punjabiA1SmokeDeck, {
  punjabiA1SmokeDeck as namedSmokeDeck,
  smokeDeckScriptAwareness,
  type PunjabiSmokeDeckDomain,
  type PunjabiSmokeDeckTaskType,
} from "@/languages/punjabi/smokeDeckA1";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 smoke deck", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(punjabiA1SmokeDeck).toBe(namedSmokeDeck);
    expect(Array.isArray(punjabiA1SmokeDeck)).toBe(true);
  });

  it("is compact and covers required representative smoke domains", () => {
    expect(punjabiA1SmokeDeck.length).toBeGreaterThanOrEqual(10);
    expect(punjabiA1SmokeDeck.length).toBeLessThanOrEqual(18);

    const requiredDomains: PunjabiSmokeDeckDomain[] = [
      "greeting",
      "identity",
      "family",
      "numbers",
      "food",
      "directions",
      "help_request",
      "polite_phrase",
      "gurmukhi_recognition",
      "canada_service",
    ];
    const domains = new Set(punjabiA1SmokeDeck.map((item) => item.domain));

    for (const domain of requiredDomains) {
      expect(domains, `missing domain ${domain}`).toContain(domain);
    }
  });

  it("includes smoke-check, final-QA, recognition, and integration-readiness styles", () => {
    const requiredTypes: PunjabiSmokeDeckTaskType[] = [
      "smoke_check",
      "final_qa",
      "recognition",
      "integration_readiness",
    ];
    const taskTypes = new Set(punjabiA1SmokeDeck.map((item) => item.task_type));

    for (const taskType of requiredTypes) {
      expect(taskTypes, `missing task type ${taskType}`).toContain(taskType);
    }
  });

  it("uses Gurmukhi primary, romanization where useful, and bilingual explanations", () => {
    for (const item of punjabiA1SmokeDeck) {
      expect(item.id).toMatch(/^pa_a1_smoke_/);
      expect(item.expected_pa).toMatch(GURMUKHI_SCRIPT);
      expect(item.prompt_vi.trim().length).toBeGreaterThan(0);
      expect(item.prompt_en.trim().length).toBeGreaterThan(0);
      expect(item.meaning_vi.trim().length).toBeGreaterThan(0);
      expect(item.meaning_en.trim().length).toBeGreaterThan(0);
      expect(item.explanation_vi.trim().length).toBeGreaterThan(0);
      expect(item.explanation_en.trim().length).toBeGreaterThan(0);
      expect(item.pass_signal_vi.trim().length).toBeGreaterThan(0);
      expect(item.pass_signal_en.trim().length).toBeGreaterThan(0);
      expect(item.review_if_missed.length).toBeGreaterThanOrEqual(2);

      if (item.romanization) {
        expect(item.romanization).toMatch(LATIN);
      }
    }
  });

  it("includes learner traps and Canada-practical smoke checks", () => {
    const traps = punjabiA1SmokeDeck.flatMap((item) => item.learner_trap ? [item.learner_trap] : []);
    const trapAudiences = new Set(traps.map((trap) => trap.audience));
    const canadaItems = punjabiA1SmokeDeck.filter((item) => item.canada_practical);

    expect(traps.length).toBeGreaterThanOrEqual(7);
    expect(trapAudiences.has("vi") || trapAudiences.has("both")).toBe(true);
    expect(trapAudiences.has("en") || trapAudiences.has("both")).toBe(true);
    expect(canadaItems.length).toBeGreaterThanOrEqual(8);
    expect(JSON.stringify(canadaItems)).toMatch(/ਫਾਰਮ|ਟਿਕਟ|ਪਛਾਣ|ਬੱਸ|ਮਦਦ|ਦੁਬਾਰਾ/);
  });

  it("checks representative A1 coverage across language and service use", () => {
    const allText = JSON.stringify(punjabiA1SmokeDeck);

    expect(allText).toMatch(/ਸਤ ਸ੍ਰੀ ਅਕਾਲ/);
    expect(allText).toMatch(/ਮੇਰਾ ਨਾਮ/);
    expect(allText).toMatch(/ਮੇਰੀ ਮਾਂ/);
    expect(allText).toMatch(/ਦੋ ਟਿਕਟਾਂ/);
    expect(allText).toMatch(/ਮੈਨੂੰ ਪਾਣੀ/);
    expect(allText).toMatch(/ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ/);
    expect(allText).toMatch(/ਮਦਦ ਕਰੋ/);
    expect(allText).toMatch(/ਮਾਫ਼ ਕਰਨਾ/);
    expect(allText).toMatch(/ਪਾਣੀ, ਮਦਦ, ਬੱਸ/);
    expect(allText).toMatch(/ਮੈਨੂੰ ਫਾਰਮ|ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਪਛਾਣ ਹੈ|ਦੁਬਾਰਾ ਕਹੋ/);
  });

  it("mentions Shahmukhi only as awareness and does not claim native review or unrelated systems", () => {
    const allText = `${smokeDeckScriptAwareness} ${JSON.stringify(punjabiA1SmokeDeck)}`;

    expect(smokeDeckScriptAwareness).toContain("Shahmukhi");
    expect(smokeDeckScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure|auth|billing|RLS|Supabase|CI config|A11 integration/i);
  });
});
