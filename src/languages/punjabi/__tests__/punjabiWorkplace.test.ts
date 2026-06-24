import { describe, expect, it } from "vitest";

import punjabiWorkplaceItems, {
  punjabiWorkplaceItems as named,
  type PunjabiWorkplaceItem,
} from "../workplace";

const GURMUKHI_RE = /[ਗ-ੴ]/u;
const hasGurmukhi = (value: string) => GURMUKHI_RE.test(value);

const LEVELS = ["A2", "B1", "B2", "C1", "C2"] as const;
const TOPICS = [
  "first_day",
  "schedule",
  "task_clarification",
  "safety",
  "apology",
  "delay",
  "handoff",
  "supervisor",
  "customer",
  "disagreement",
  "meeting",
  "formal_message",
  "negotiation",
] as const;

const serialized = JSON.stringify(punjabiWorkplaceItems);

describe("Punjabi workplace/professional pack", () => {
  it("exports the same app-ready array by default and name", () => {
    expect(punjabiWorkplaceItems).toBe(named);
    expect(Array.isArray(punjabiWorkplaceItems)).toBe(true);
  });

  it("ships 40-80 compact workplace items across A2-C2", () => {
    expect(punjabiWorkplaceItems.length).toBeGreaterThanOrEqual(40);
    expect(punjabiWorkplaceItems.length).toBeLessThanOrEqual(80);

    const seenLevels = new Set(punjabiWorkplaceItems.map((item) => item.level));
    for (const level of LEVELS) {
      expect(seenLevels.has(level)).toBe(true);
    }
  });

  it("uses unique ids and covers all required professional topics", () => {
    const ids = punjabiWorkplaceItems.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);

    const seenTopics = new Set(punjabiWorkplaceItems.map((item) => item.topic));
    for (const topic of TOPICS) {
      expect(seenTopics.has(topic)).toBe(true);
    }
  });

  it.each(punjabiWorkplaceItems.map((item) => [item.id, item] as const))(
    "%s includes Gurmukhi, romanization, bilingual explanations, and register notes",
    (_id, item: PunjabiWorkplaceItem) => {
      expect(hasGurmukhi(item.phrase_gurmukhi)).toBe(true);
      expect(item.romanization.trim().length).toBeGreaterThan(8);
      expect(hasGurmukhi(item.romanization)).toBe(false);
      expect(item.vi.trim().length).toBeGreaterThan(8);
      expect(item.en.trim().length).toBeGreaterThan(8);
      expect(item.explanation_vi.trim().length).toBeGreaterThan(8);
      expect(item.explanation_en.trim().length).toBeGreaterThan(8);
      expect(item.politeNote_vi.trim().length).toBeGreaterThan(8);
      expect(item.politeNote_en.trim().length).toBeGreaterThan(8);
      expect(item.casualNote_vi.trim().length).toBeGreaterThan(8);
      expect(item.casualNote_en.trim().length).toBeGreaterThan(8);
    },
  );

  it("keeps Gurmukhi primary and supports Vietnamese and English learners", () => {
    expect(hasGurmukhi(serialized)).toBe(true);
    expect(serialized).toMatch(/Vietnamese|English|tiếng|Anh|Việt/i);
    expect(serialized).toMatch(/romanization|Gurmukhi/i);
  });

  it("mentions Shahmukhi only as awareness and defers native review without claiming it", () => {
    const shahmukhiMatches = serialized.match(/Shahmukhi/g) ?? [];
    expect(shahmukhiMatches.length).toBeLessThanOrEqual(1);
    expect(serialized).toMatch(/Native review is deferred|deferred/i);
    expect(serialized).not.toMatch(/native[- ](?:certified|verified|approved|reviewed)|verified by native|native speaker approved/i);
  });

  it("does not touch unrelated product areas in content claims", () => {
    expect(serialized).not.toMatch(/pronunciation score|Azure|Supabase|billing|RLS|audio/i);
  });
});
