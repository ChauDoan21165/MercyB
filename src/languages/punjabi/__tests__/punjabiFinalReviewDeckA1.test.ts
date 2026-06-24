import { describe, expect, it } from "vitest";

import punjabiA1FinalReviewDeck, {
  finalReviewDeckScriptAwareness,
  punjabiA1FinalReviewDeck as namedFinalReviewDeck,
  type PunjabiFinalReviewCardType,
  type PunjabiFinalReviewTopic,
} from "@/languages/punjabi/finalReviewDeckA1";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 final review deck", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(punjabiA1FinalReviewDeck).toBe(namedFinalReviewDeck);
    expect(Array.isArray(punjabiA1FinalReviewDeck)).toBe(true);
  });

  it("is compact and covers required final review topics", () => {
    expect(punjabiA1FinalReviewDeck.length).toBeGreaterThanOrEqual(18);
    expect(punjabiA1FinalReviewDeck.length).toBeLessThanOrEqual(30);

    const requiredTopics: PunjabiFinalReviewTopic[] = [
      "greetings",
      "identity",
      "family",
      "numbers",
      "food",
      "directions",
      "help",
      "politeness",
      "gurmukhi",
      "canada_services",
    ];
    const topics = new Set(punjabiA1FinalReviewDeck.map((card) => card.topic));

    for (const topic of requiredTopics) {
      expect(topics, `missing topic ${topic}`).toContain(topic);
    }
  });

  it("includes final-review checkpoint and QA card styles", () => {
    const requiredTypes: PunjabiFinalReviewCardType[] = [
      "qa",
      "checkpoint",
      "choose",
      "fill_gap",
      "mini_roleplay",
      "self_check",
    ];
    const cardTypes = new Set(punjabiA1FinalReviewDeck.map((card) => card.card_type));

    for (const cardType of requiredTypes) {
      expect(cardTypes, `missing card type ${cardType}`).toContain(cardType);
    }
  });

  it("uses Gurmukhi primary, romanization where useful, and bilingual explanations", () => {
    for (const card of punjabiA1FinalReviewDeck) {
      expect(card.id).toMatch(/^pa_a1_final_/);
      expect(JSON.stringify(card.answer_pa)).toMatch(GURMUKHI_SCRIPT);
      expect(card.front_vi.trim().length).toBeGreaterThan(0);
      expect(card.front_en.trim().length).toBeGreaterThan(0);
      expect(card.answer_vi.trim().length).toBeGreaterThan(0);
      expect(card.answer_en.trim().length).toBeGreaterThan(0);
      expect(card.explanation_vi.trim().length).toBeGreaterThan(0);
      expect(card.explanation_en.trim().length).toBeGreaterThan(0);
      expect(card.checkpoint_vi.trim().length).toBeGreaterThan(0);
      expect(card.checkpoint_en.trim().length).toBeGreaterThan(0);

      if (card.prompt_pa) {
        expect(card.prompt_pa).toMatch(GURMUKHI_SCRIPT);
      }
      if (card.options_pa) {
        expect(card.options_pa.length).toBeGreaterThanOrEqual(3);
        expect(JSON.stringify(card.options_pa)).toMatch(GURMUKHI_SCRIPT);
      }
      if (card.romanization) {
        expect(card.romanization).toMatch(LATIN);
      }
    }
  });

  it("includes learner traps and Canada-practical review cards", () => {
    const traps = punjabiA1FinalReviewDeck.flatMap((card) => card.learner_trap ? [card.learner_trap] : []);
    const trapAudiences = new Set(traps.map((trap) => trap.audience));
    const canadaCards = punjabiA1FinalReviewDeck.filter((card) => card.canada_practical);

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(trapAudiences.has("vi") || trapAudiences.has("both")).toBe(true);
    expect(trapAudiences.has("en") || trapAudiences.has("both")).toBe(true);
    expect(canadaCards.length).toBeGreaterThanOrEqual(9);
    expect(JSON.stringify(canadaCards)).toMatch(/ਫਾਰਮ|ਟਿਕਟ|ਡਾਲਰ|ਕਲਿਨਿਕ|ਅਪਾਇੰਟਮੈਂਟ|ਪਛਾਣ|ਬੱਸ|ਮਦਦ/);
  });

  it("reviews greetings, identity, family, numbers, food, directions, help, politeness, Gurmukhi, and services", () => {
    const allText = JSON.stringify(punjabiA1FinalReviewDeck);

    expect(allText).toMatch(/ਸਤ ਸ੍ਰੀ ਅਕਾਲ|ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ/);
    expect(allText).toMatch(/ਮੇਰਾ ਨਾਮ|ਤੁਹਾਡਾ ਨਾਮ/);
    expect(allText).toMatch(/ਮੇਰੀ ਮਾਂ|ਮੇਰੇ ਕੋਲ ਇੱਕ ਭੈਣ/);
    expect(allText).toMatch(/ਦੋ ਟਿਕਟਾਂ|ਪੰਜ/);
    expect(allText).toMatch(/ਪਾਣੀ|ਸ਼ਾਕਾਹਾਰੀ/);
    expect(allText).toMatch(/ਕਿੱਥੇ|ਸੱਜੇ|ਖੱਬੇ/);
    expect(allText).toMatch(/ਮਦਦ ਕਰੋ|ਸਮਝ ਨਹੀਂ/);
    expect(allText).toMatch(/ਧੰਨਵਾਦ|ਮਾਫ਼ ਕਰਨਾ/);
    expect(allText).toMatch(/ਫਾਰਮ|ਪਛਾਣ|ਅਪਾਇੰਟਮੈਂਟ/);
  });

  it("mentions Shahmukhi only as awareness and does not claim native review or unrelated systems", () => {
    const allText = `${finalReviewDeckScriptAwareness} ${JSON.stringify(punjabiA1FinalReviewDeck)}`;

    expect(finalReviewDeckScriptAwareness).toContain("Shahmukhi");
    expect(finalReviewDeckScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure|auth|billing|RLS|Supabase|CI config/i);
  });
});
