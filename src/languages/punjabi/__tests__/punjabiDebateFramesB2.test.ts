import { describe, expect, it } from "vitest";

import punjabiDebateFramesB2, {
  punjabiDebateFramesB2 as named,
  type PunjabiDebateFrameB2,
} from "../debateFramesB2";

const GURMUKHI_RE = /[ਗ-ੴ]/u;
const hasGurmukhi = (value: string) => GURMUKHI_RE.test(value);

const REQUIRED_FUNCTIONS = [
  "agree",
  "disagree",
  "qualify",
  "give_reasons",
  "contrast",
  "challenge_politely",
  "summarize_positions",
] as const;

const REQUIRED_TOPICS = ["community", "workplace", "public_service"] as const;

const serialized = JSON.stringify(punjabiDebateFramesB2);

describe("Punjabi B2 debate frames", () => {
  it("exports the same app-consumable array by default and name", () => {
    expect(punjabiDebateFramesB2).toBe(named);
    expect(Array.isArray(punjabiDebateFramesB2)).toBe(true);
  });

  it("ships compact but useful B2 debate frames", () => {
    expect(punjabiDebateFramesB2.length).toBeGreaterThanOrEqual(20);
    expect(punjabiDebateFramesB2.length).toBeLessThanOrEqual(40);
    expect(punjabiDebateFramesB2.every((frame) => frame.level === "B2")).toBe(true);
  });

  it("uses unique ids and covers required debate functions and topics", () => {
    const ids = punjabiDebateFramesB2.map((frame) => frame.id);
    expect(new Set(ids).size).toBe(ids.length);

    const functions = new Set(punjabiDebateFramesB2.map((frame) => frame.function));
    for (const fn of REQUIRED_FUNCTIONS) {
      expect(functions.has(fn)).toBe(true);
    }

    const topics = new Set(punjabiDebateFramesB2.map((frame) => frame.topic));
    for (const topic of REQUIRED_TOPICS) {
      expect(topics.has(topic)).toBe(true);
    }
  });

  it.each(punjabiDebateFramesB2.map((frame) => [frame.id, frame] as const))(
    "%s includes Gurmukhi, romanization, bilingual guidance, examples, and traps",
    (_id, frame: PunjabiDebateFrameB2) => {
      expect(hasGurmukhi(frame.frame_gurmukhi)).toBe(true);
      expect(frame.romanization.trim().length).toBeGreaterThan(6);
      expect(hasGurmukhi(frame.romanization)).toBe(false);
      expect(frame.vi.trim().length).toBeGreaterThan(4);
      expect(frame.en.trim().length).toBeGreaterThan(4);
      expect(frame.useWhen_vi.trim().length).toBeGreaterThan(10);
      expect(frame.useWhen_en.trim().length).toBeGreaterThan(10);

      expect(hasGurmukhi(frame.example_gurmukhi)).toBe(true);
      expect(frame.example_romanization.trim().length).toBeGreaterThan(12);
      expect(frame.example_vi.trim().length).toBeGreaterThan(12);
      expect(frame.example_en.trim().length).toBeGreaterThan(12);

      expect(frame.learnerTraps_vi.length).toBeGreaterThan(0);
      expect(frame.learnerTraps_en.length).toBe(frame.learnerTraps_vi.length);
    },
  );

  it("supports Vietnamese-speaking and English-speaking learners with Canada-practical examples", () => {
    expect(serialized).toMatch(/Vietnamese|English|Việt|Anh|Canada|Canadian/i);
    expect(punjabiDebateFramesB2.filter((frame) => frame.canadaPracticalExample_en).length).toBeGreaterThanOrEqual(5);
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
