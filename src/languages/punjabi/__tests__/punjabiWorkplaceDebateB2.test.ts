import { describe, expect, it } from "vitest";

import punjabiWorkplaceDebateB2Items, {
  punjabiWorkplaceDebateB2Items as named,
  type PunjabiWorkplaceDebateB2Item,
} from "../workplaceDebateB2";

const GURMUKHI_RE = /[ਗ-ੴ]/u;
const hasGurmukhi = (value: string) => GURMUKHI_RE.test(value);

const REQUIRED_TOPICS = [
  "fairness",
  "scheduling",
  "safety",
  "customer_service",
  "training",
  "teamwork",
  "conflict",
  "respectful_disagreement",
  "evidence_based_opinion",
] as const;

const serialized = JSON.stringify(punjabiWorkplaceDebateB2Items);

describe("Punjabi B2 workplace debate pack", () => {
  it("exports the same app-consumable array by default and name", () => {
    expect(punjabiWorkplaceDebateB2Items).toBe(named);
    expect(Array.isArray(punjabiWorkplaceDebateB2Items)).toBe(true);
  });

  it("ships compact but useful B2 workplace debate items", () => {
    expect(punjabiWorkplaceDebateB2Items.length).toBeGreaterThanOrEqual(16);
    expect(punjabiWorkplaceDebateB2Items.length).toBeLessThanOrEqual(32);
    expect(punjabiWorkplaceDebateB2Items.every((item) => item.level === "B2")).toBe(true);
  });

  it("uses unique ids and covers all required workplace debate topics", () => {
    const ids = punjabiWorkplaceDebateB2Items.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);

    const topics = new Set(punjabiWorkplaceDebateB2Items.map((item) => item.topic));
    for (const topic of REQUIRED_TOPICS) {
      expect(topics.has(topic)).toBe(true);
    }
  });

  it.each(punjabiWorkplaceDebateB2Items.map((item) => [item.id, item] as const))(
    "%s includes Gurmukhi debate content, romanization, bilingual explanations, counterpoint, and traps",
    (_id, item: PunjabiWorkplaceDebateB2Item) => {
      expect(hasGurmukhi(item.debatePrompt_gurmukhi)).toBe(true);
      expect(item.debatePrompt_romanization.trim().length).toBeGreaterThan(8);
      expect(hasGurmukhi(item.debatePrompt_romanization)).toBe(false);
      expect(item.debatePrompt_vi.trim().length).toBeGreaterThan(8);
      expect(item.debatePrompt_en.trim().length).toBeGreaterThan(8);

      expect(hasGurmukhi(item.opinionFrame.gurmukhi)).toBe(true);
      expect(item.opinionFrame.romanization.trim().length).toBeGreaterThan(6);
      expect(item.opinionFrame.vi.trim().length).toBeGreaterThan(4);
      expect(item.opinionFrame.en.trim().length).toBeGreaterThan(4);

      expect(hasGurmukhi(item.modelPosition_gurmukhi)).toBe(true);
      expect(item.modelPosition_romanization.trim().length).toBeGreaterThan(16);
      expect(item.modelPosition_vi.trim().length).toBeGreaterThan(16);
      expect(item.modelPosition_en.trim().length).toBeGreaterThan(16);
      expect(hasGurmukhi(item.counterpoint_gurmukhi)).toBe(true);
      expect(item.counterpoint_romanization.trim().length).toBeGreaterThan(12);
      expect(item.counterpoint_vi.trim().length).toBeGreaterThan(12);
      expect(item.counterpoint_en.trim().length).toBeGreaterThan(12);
      expect(item.learnerTraps_vi.length).toBeGreaterThan(0);
      expect(item.learnerTraps_en.length).toBe(item.learnerTraps_vi.length);
    },
  );

  it("supports Vietnamese-speaking and English-speaking learners with Canada-practical examples", () => {
    expect(serialized).toMatch(/Vietnamese|English|Việt|Anh|Canada|Canadian/i);
    expect(punjabiWorkplaceDebateB2Items.filter((item) => item.canadaPracticalExample_en).length).toBeGreaterThanOrEqual(5);
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
