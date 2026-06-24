import { describe, expect, it } from "vitest";

import punjabiFinalReviewDeckB2, {
  punjabiFinalReviewDeckB2 as named,
  type PunjabiFinalReviewB2Card,
} from "../finalReviewDeckB2";

const GURMUKHI_RE = /[ਗ-ੴ]/u;
const hasGurmukhi = (value: string) => GURMUKHI_RE.test(value);

const REQUIRED_FOCUS = [
  "structured_opinion",
  "compare_options",
  "counterpoint",
  "workplace_fairness",
  "settlement",
  "education",
  "healthcare_access",
  "public_service",
] as const;

const serialized = JSON.stringify(punjabiFinalReviewDeckB2);

describe("Punjabi B2 final review deck", () => {
  it("exports the same app-consumable array by default and name", () => {
    expect(punjabiFinalReviewDeckB2).toBe(named);
    expect(Array.isArray(punjabiFinalReviewDeckB2)).toBe(true);
  });

  it("ships compact but useful B2 final review cards", () => {
    expect(punjabiFinalReviewDeckB2.length).toBeGreaterThanOrEqual(16);
    expect(punjabiFinalReviewDeckB2.length).toBeLessThanOrEqual(32);
    expect(punjabiFinalReviewDeckB2.every((card) => card.level === "B2")).toBe(true);
  });

  it("uses unique ids and covers required final-review focus areas", () => {
    const ids = punjabiFinalReviewDeckB2.map((card) => card.id);
    expect(new Set(ids).size).toBe(ids.length);

    const focusAreas = new Set(punjabiFinalReviewDeckB2.map((card) => card.focus));
    for (const focus of REQUIRED_FOCUS) expect(focusAreas.has(focus)).toBe(true);
  });

  it.each(punjabiFinalReviewDeckB2.map((card) => [card.id, card] as const))(
    "%s includes QA review content, Gurmukhi, romanization, bilingual answer, checks, and traps",
    (_id, card: PunjabiFinalReviewB2Card) => {
      expect(card.checkpointTitle_vi.trim().length).toBeGreaterThan(8);
      expect(card.checkpointTitle_en.trim().length).toBeGreaterThan(8);
      expect(hasGurmukhi(card.question_gurmukhi)).toBe(true);
      expect(card.question_romanization.trim().length).toBeGreaterThan(8);
      expect(hasGurmukhi(card.question_romanization)).toBe(false);
      expect(card.question_vi.trim().length).toBeGreaterThan(8);
      expect(card.question_en.trim().length).toBeGreaterThan(8);
      expect(card.answerFrame_gurmukhi.length).toBeGreaterThanOrEqual(3);
      expect(card.answerFrame_romanization.length).toBe(card.answerFrame_gurmukhi.length);
      expect(card.answerFrame_vi.length).toBe(card.answerFrame_gurmukhi.length);
      expect(card.answerFrame_en.length).toBe(card.answerFrame_gurmukhi.length);
      expect(card.answerFrame_gurmukhi.every(hasGurmukhi)).toBe(true);
      expect(hasGurmukhi(card.sampleAnswer_gurmukhi)).toBe(true);
      expect(card.sampleAnswer_romanization.trim().length).toBeGreaterThan(30);
      expect(card.sampleAnswer_vi.trim().length).toBeGreaterThan(30);
      expect(card.sampleAnswer_en.trim().length).toBeGreaterThan(30);
      expect(card.quickCheck_vi.length).toBeGreaterThanOrEqual(3);
      expect(card.quickCheck_en.length).toBe(card.quickCheck_vi.length);
      expect(card.learnerTraps_vi.length).toBeGreaterThan(0);
      expect(card.learnerTraps_en.length).toBe(card.learnerTraps_vi.length);
    },
  );

  it("supports Vietnamese-speaking and English-speaking learners with Canada-practical examples", () => {
    expect(serialized).toMatch(/Vietnamese|English|Việt|Anh|Canada|Canadian/i);
    expect(punjabiFinalReviewDeckB2.filter((card) => card.canadaPracticalExample_en).length).toBeGreaterThanOrEqual(7);
  });

  it("includes final-review, checkpoint, and QA style content", () => {
    expect(serialized).toMatch(/Final review/i);
    expect(serialized).toMatch(/question|answer|quickCheck|QA/i);
  });

  it("mentions Shahmukhi only as awareness and defers native review without claiming it", () => {
    const shahmukhiMatches = serialized.match(/Shahmukhi/g) ?? [];
    expect(shahmukhiMatches.length).toBeLessThanOrEqual(1);
    expect(serialized).toMatch(/awareness only/i);
    expect(serialized).toMatch(/deferred/i);
    expect(serialized).not.toMatch(/native[- ](?:certified|verified|approved|reviewed)|verified by native|native speaker approved/i);
  });

  it("does not include unrelated product claims", () => {
    expect(serialized).not.toMatch(/pronunciation score|Azure|Supabase|billing|RLS|auth|audio/i);
  });
});
