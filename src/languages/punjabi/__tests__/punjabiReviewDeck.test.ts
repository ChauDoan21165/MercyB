import { describe, expect, it } from "vitest";

import reviewDeck, {
  PUNJABI_REVIEW_DECK,
  PUNJABI_REVIEW_DECK_SCOPE,
  PUNJABI_REVIEW_TOPICS,
  type PunjabiReviewLevel,
  type PunjabiReviewTopic,
} from "@/languages/punjabi/reviewDeck";

const GURMUKHI_BLOCK = /[਀-੿]/;

const REQUIRED_TOPICS: PunjabiReviewTopic[] = [
  "survival",
  "health",
  "work",
  "public_services",
  "food",
  "housing",
  "school",
  "family",
  "transit",
];

const VALID_LEVELS: PunjabiReviewLevel[] = ["A1", "A2", "B1", "B2"];

describe("Punjabi review deck", () => {
  it("exports app-consumable TypeScript data", () => {
    expect(reviewDeck).toBe(PUNJABI_REVIEW_DECK);
    expect(Array.isArray(reviewDeck)).toBe(true);
    expect(PUNJABI_REVIEW_DECK_SCOPE.name).toContain("Punjabi Review Deck");
    expect([...PUNJABI_REVIEW_TOPICS].sort()).toEqual([...REQUIRED_TOPICS].sort());
  });

  it("covers the required topics with a 150-300 card seed deck", () => {
    expect(reviewDeck.length).toBeGreaterThanOrEqual(150);
    expect(reviewDeck.length).toBeLessThanOrEqual(300);

    const perTopic = new Map<PunjabiReviewTopic, number>();
    for (const card of reviewDeck) {
      perTopic.set(card.topic, (perTopic.get(card.topic) ?? 0) + 1);
    }

    for (const topic of REQUIRED_TOPICS) {
      expect(perTopic.get(topic), `missing topic: ${topic}`).toBeDefined();
      expect(perTopic.get(topic)!, `too few cards in topic: ${topic}`).toBeGreaterThanOrEqual(12);
    }
  });

  it("keeps Gurmukhi primary with romanization, Vietnamese, and English", () => {
    const ids = reviewDeck.map((card) => card.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const card of reviewDeck) {
      expect(card.answer_pa).toMatch(GURMUKHI_BLOCK);
      expect(card.answer_romanization.length).toBeGreaterThan(0);
      expect(card.answer_vi.length).toBeGreaterThan(0);
      expect(card.answer_en.length).toBeGreaterThan(0);
      expect(card.prompt_vi.length).toBeGreaterThan(0);
      expect(card.prompt_en.length).toBeGreaterThan(0);
      expect(card.hint_vi.length).toBeGreaterThan(0);
      expect(card.hint_en.length).toBeGreaterThan(0);
      expect(card.common_mistake_vi.length).toBeGreaterThan(0);
      expect(card.common_mistake_en.length).toBeGreaterThan(0);
      expect(card.topic_vi.length).toBeGreaterThan(0);
      expect(card.topic_en.length).toBeGreaterThan(0);
      expect(VALID_LEVELS).toContain(card.level);
    }
  });

  it("includes all required topic areas and practical Canada-focused cues", () => {
    const allContent = JSON.stringify(reviewDeck);
    expect(allContent).toMatch(/Canada|Canadian|Ở Canada|trường|ngân hàng|xe buýt|dược sĩ|chủ nhà|thông dịch viên/u);
    expect(PUNJABI_REVIEW_DECK_SCOPE.scriptPolicy).toMatch(/Shahmukhi is awareness only/i);
    expect(PUNJABI_REVIEW_DECK_SCOPE.reviewStatus).toBe("Native review is deferred.");
    expect(allContent).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
  });
});
