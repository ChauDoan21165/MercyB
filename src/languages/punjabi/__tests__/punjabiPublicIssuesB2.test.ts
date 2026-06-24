import { describe, expect, it } from "vitest";

import punjabiPublicIssuesB2Items, {
  punjabiPublicIssuesB2Items as named,
  type PunjabiPublicIssueB2Item,
} from "../publicIssuesB2";

const GURMUKHI_RE = /[ਗ-ੴ]/u;
const hasGurmukhi = (value: string) => GURMUKHI_RE.test(value);

const REQUIRED_TOPICS = [
  "housing",
  "healthcare_access",
  "education",
  "transport",
  "employment",
  "technology",
  "community_support",
  "settlement_services",
  "public_service_fairness",
] as const;

const serialized = JSON.stringify(punjabiPublicIssuesB2Items);

describe("Punjabi B2 public issues pack", () => {
  it("exports the same app-consumable array by default and name", () => {
    expect(punjabiPublicIssuesB2Items).toBe(named);
    expect(Array.isArray(punjabiPublicIssuesB2Items)).toBe(true);
  });

  it("ships compact but useful B2 public issue items", () => {
    expect(punjabiPublicIssuesB2Items.length).toBeGreaterThanOrEqual(18);
    expect(punjabiPublicIssuesB2Items.length).toBeLessThanOrEqual(36);
    expect(punjabiPublicIssuesB2Items.every((item) => item.level === "B2")).toBe(true);
  });

  it("uses unique ids and covers required public issue topics", () => {
    const ids = punjabiPublicIssuesB2Items.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);

    const topics = new Set(punjabiPublicIssuesB2Items.map((item) => item.topic));
    for (const topic of REQUIRED_TOPICS) {
      expect(topics.has(topic)).toBe(true);
    }
  });

  it.each(punjabiPublicIssuesB2Items.map((item) => [item.id, item] as const))(
    "%s includes Gurmukhi issue prompt, romanization, bilingual discussion support, vocabulary, and traps",
    (_id, item: PunjabiPublicIssueB2Item) => {
      expect(hasGurmukhi(item.issuePrompt_gurmukhi)).toBe(true);
      expect(item.issuePrompt_romanization.trim().length).toBeGreaterThan(8);
      expect(hasGurmukhi(item.issuePrompt_romanization)).toBe(false);
      expect(item.issuePrompt_vi.trim().length).toBeGreaterThan(8);
      expect(item.issuePrompt_en.trim().length).toBeGreaterThan(8);

      expect(item.keyVocabulary.length).toBeGreaterThanOrEqual(3);
      for (const word of item.keyVocabulary) {
        expect(hasGurmukhi(word.gurmukhi)).toBe(true);
        expect(word.romanization.trim().length).toBeGreaterThan(2);
        expect(word.vi.trim().length).toBeGreaterThan(1);
        expect(word.en.trim().length).toBeGreaterThan(1);
      }

      expect(hasGurmukhi(item.discussionFrame_gurmukhi)).toBe(true);
      expect(item.discussionFrame_romanization.trim().length).toBeGreaterThan(8);
      expect(item.discussionFrame_vi.trim().length).toBeGreaterThan(8);
      expect(item.discussionFrame_en.trim().length).toBeGreaterThan(8);
      expect(hasGurmukhi(item.modelResponse_gurmukhi)).toBe(true);
      expect(item.modelResponse_romanization.trim().length).toBeGreaterThan(20);
      expect(item.modelResponse_vi.trim().length).toBeGreaterThan(20);
      expect(item.modelResponse_en.trim().length).toBeGreaterThan(20);
      expect(item.learnerTraps_vi.length).toBeGreaterThan(0);
      expect(item.learnerTraps_en.length).toBe(item.learnerTraps_vi.length);
    },
  );

  it("supports Vietnamese-speaking and English-speaking learners with Canada-practical examples", () => {
    expect(serialized).toMatch(/Vietnamese|English|Việt|Anh|Canada|Canadian/i);
    expect(punjabiPublicIssuesB2Items.filter((item) => item.canadaPracticalExample_en).length).toBeGreaterThanOrEqual(7);
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
