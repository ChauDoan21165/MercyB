import { describe, expect, it } from "vitest";

import punjabiOpinionExpansionB2Items, {
  punjabiOpinionExpansionB2Items as named,
  type PunjabiOpinionExpansionB2Item,
} from "../opinionExpansionB2";

const GURMUKHI_RE = /[ਗ-ੴ]/u;
const hasGurmukhi = (value: string) => GURMUKHI_RE.test(value);

const REQUIRED_MOVES = [
  "support_claim",
  "give_example",
  "qualify_opinion",
  "compare_options",
  "respond_to_counterpoint",
] as const;

const REQUIRED_TOPICS = ["settlement", "work", "education", "health", "public_service"] as const;

const serialized = JSON.stringify(punjabiOpinionExpansionB2Items);

describe("Punjabi B2 opinion expansion pack", () => {
  it("exports the same app-consumable array by default and name", () => {
    expect(punjabiOpinionExpansionB2Items).toBe(named);
    expect(Array.isArray(punjabiOpinionExpansionB2Items)).toBe(true);
  });

  it("ships compact but useful B2 opinion expansion items", () => {
    expect(punjabiOpinionExpansionB2Items.length).toBeGreaterThanOrEqual(16);
    expect(punjabiOpinionExpansionB2Items.length).toBeLessThanOrEqual(32);
    expect(punjabiOpinionExpansionB2Items.every((item) => item.level === "B2")).toBe(true);
  });

  it("uses unique ids and covers required moves and topics", () => {
    const ids = punjabiOpinionExpansionB2Items.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);

    const moves = new Set(punjabiOpinionExpansionB2Items.map((item) => item.move));
    for (const move of REQUIRED_MOVES) {
      expect(moves.has(move)).toBe(true);
    }

    const topics = new Set(punjabiOpinionExpansionB2Items.map((item) => item.topic));
    for (const topic of REQUIRED_TOPICS) {
      expect(topics.has(topic)).toBe(true);
    }
  });

  it.each(punjabiOpinionExpansionB2Items.map((item) => [item.id, item] as const))(
    "%s includes Gurmukhi starter, romanization, bilingual guidance, expanded opinion, and traps",
    (_id, item: PunjabiOpinionExpansionB2Item) => {
      expect(hasGurmukhi(item.starter_gurmukhi)).toBe(true);
      expect(item.romanization.trim().length).toBeGreaterThan(6);
      expect(hasGurmukhi(item.romanization)).toBe(false);
      expect(item.vi.trim().length).toBeGreaterThan(4);
      expect(item.en.trim().length).toBeGreaterThan(4);
      expect(item.useWhen_vi.trim().length).toBeGreaterThan(10);
      expect(item.useWhen_en.trim().length).toBeGreaterThan(10);

      expect(hasGurmukhi(item.expandedOpinion_gurmukhi)).toBe(true);
      expect(item.expandedOpinion_romanization.trim().length).toBeGreaterThan(18);
      expect(item.expandedOpinion_vi.trim().length).toBeGreaterThan(18);
      expect(item.expandedOpinion_en.trim().length).toBeGreaterThan(18);
      expect(item.learnerTraps_vi.length).toBeGreaterThan(0);
      expect(item.learnerTraps_en.length).toBe(item.learnerTraps_vi.length);
    },
  );

  it("supports Vietnamese-speaking and English-speaking learners with Canada-practical examples", () => {
    expect(serialized).toMatch(/Vietnamese|English|Việt|Anh|Canada|Canadian/i);
    expect(punjabiOpinionExpansionB2Items.filter((item) => item.canadaPracticalExample_en).length).toBeGreaterThanOrEqual(5);
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
