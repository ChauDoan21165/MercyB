import { describe, expect, it } from "vitest";

import punjabiDiscussionB2Prompts, {
  punjabiDiscussionB2Prompts as named,
  type PunjabiDiscussionB2Prompt,
} from "../discussionB2";

const GURMUKHI_RE = /[ਗ-ੴ]/u;
const hasGurmukhi = (value: string) => GURMUKHI_RE.test(value);

const REQUIRED_TOPICS = [
  "work_life_balance",
  "immigration",
  "settlement",
  "education",
  "healthcare_access",
  "technology",
  "family_community_expectations",
  "workplace_fairness",
  "public_services",
] as const;

const serialized = JSON.stringify(punjabiDiscussionB2Prompts);

describe("Punjabi B2 discussion practice", () => {
  it("exports the same app-consumable array by default and name", () => {
    expect(punjabiDiscussionB2Prompts).toBe(named);
    expect(Array.isArray(punjabiDiscussionB2Prompts)).toBe(true);
  });

  it("ships compact but useful B2 discussion prompts", () => {
    expect(punjabiDiscussionB2Prompts.length).toBeGreaterThanOrEqual(16);
    expect(punjabiDiscussionB2Prompts.length).toBeLessThanOrEqual(30);
    expect(punjabiDiscussionB2Prompts.every((prompt) => prompt.level === "B2")).toBe(true);
  });

  it("uses unique ids and covers all Wave 4 topics", () => {
    const ids = punjabiDiscussionB2Prompts.map((prompt) => prompt.id);
    expect(new Set(ids).size).toBe(ids.length);

    const topics = new Set(punjabiDiscussionB2Prompts.map((prompt) => prompt.topic));
    for (const topic of REQUIRED_TOPICS) {
      expect(topics.has(topic)).toBe(true);
    }
  });

  it.each(punjabiDiscussionB2Prompts.map((prompt) => [prompt.id, prompt] as const))(
    "%s includes Gurmukhi prompt, romanization, bilingual model answer, moves, and traps",
    (_id, prompt: PunjabiDiscussionB2Prompt) => {
      expect(hasGurmukhi(prompt.prompt_gurmukhi)).toBe(true);
      expect(prompt.prompt_romanization.trim().length).toBeGreaterThan(8);
      expect(hasGurmukhi(prompt.prompt_romanization)).toBe(false);
      expect(prompt.prompt_vi.trim().length).toBeGreaterThan(8);
      expect(prompt.prompt_en.trim().length).toBeGreaterThan(8);

      expect(prompt.usefulFrames.length).toBeGreaterThanOrEqual(2);
      for (const frame of prompt.usefulFrames) {
        expect(hasGurmukhi(frame.gurmukhi)).toBe(true);
        expect(frame.romanization.trim().length).toBeGreaterThan(4);
        expect(frame.vi.trim().length).toBeGreaterThan(4);
        expect(frame.en.trim().length).toBeGreaterThan(4);
      }

      expect(hasGurmukhi(prompt.modelAnswer_gurmukhi)).toBe(true);
      expect(prompt.modelAnswer_romanization.trim().length).toBeGreaterThan(20);
      expect(prompt.modelAnswer_vi.trim().length).toBeGreaterThan(20);
      expect(prompt.modelAnswer_en.trim().length).toBeGreaterThan(20);
      expect(prompt.discussionMoves_vi.length).toBeGreaterThan(0);
      expect(prompt.discussionMoves_en.length).toBe(prompt.discussionMoves_vi.length);
      expect(prompt.learnerTraps_vi.length).toBeGreaterThan(0);
      expect(prompt.learnerTraps_en.length).toBe(prompt.learnerTraps_vi.length);
    },
  );

  it("supports Vietnamese-speaking and English-speaking learners with Canada-practical examples", () => {
    expect(serialized).toMatch(/Vietnamese|English|Canada|Canadian|Canada-practical|Việt|Anh|Canada/i);
    expect(punjabiDiscussionB2Prompts.filter((prompt) => prompt.canadaPracticalExample_en).length).toBeGreaterThanOrEqual(5);
  });

  it("mentions Shahmukhi only as awareness and marks native review deferred without claiming review", () => {
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
