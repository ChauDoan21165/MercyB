import { describe, expect, it } from "vitest";

import punjabiComparativeReasoningB2, {
  punjabiComparativeReasoningB2 as named,
  type PunjabiComparativeReasoningB2Item,
} from "../comparativeReasoningB2";

const GURMUKHI_RE = /[ਗ-ੴ]/u;
const hasGurmukhi = (value: string) => GURMUKHI_RE.test(value);

const REQUIRED_TOPICS = ["settlement", "workplace", "education", "healthcare", "housing", "transport", "public_service"] as const;
const REQUIRED_PURPOSES = ["compare", "weigh_pros_cons", "justify_recommendation", "respond_to_counterpoint"] as const;

const serialized = JSON.stringify(punjabiComparativeReasoningB2);

describe("Punjabi B2 comparative reasoning", () => {
  it("exports the same app-consumable array by default and name", () => {
    expect(punjabiComparativeReasoningB2).toBe(named);
    expect(Array.isArray(punjabiComparativeReasoningB2)).toBe(true);
  });

  it("ships compact but useful B2 comparative reasoning items", () => {
    expect(punjabiComparativeReasoningB2.length).toBeGreaterThanOrEqual(12);
    expect(punjabiComparativeReasoningB2.length).toBeLessThanOrEqual(24);
    expect(punjabiComparativeReasoningB2.every((item) => item.level === "B2")).toBe(true);
  });

  it("uses unique ids and covers required topics and reasoning purposes", () => {
    const ids = punjabiComparativeReasoningB2.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);

    const topics = new Set(punjabiComparativeReasoningB2.map((item) => item.topic));
    for (const topic of REQUIRED_TOPICS) expect(topics.has(topic)).toBe(true);

    const purposes = new Set(punjabiComparativeReasoningB2.flatMap((item) => item.reasoningFrame.map((frame) => frame.purpose)));
    for (const purpose of REQUIRED_PURPOSES) expect(purposes.has(purpose)).toBe(true);
  });

  it.each(punjabiComparativeReasoningB2.map((item) => [item.id, item] as const))(
    "%s includes options, Gurmukhi prompt, romanization, reasoning frame, model, remediation, and traps",
    (_id, item: PunjabiComparativeReasoningB2Item) => {
      expect(hasGurmukhi(item.optionA_gurmukhi)).toBe(true);
      expect(hasGurmukhi(item.optionB_gurmukhi)).toBe(true);
      expect(item.optionA_romanization.trim().length).toBeGreaterThan(3);
      expect(item.optionB_romanization.trim().length).toBeGreaterThan(3);
      expect(hasGurmukhi(item.optionA_romanization)).toBe(false);
      expect(hasGurmukhi(item.optionB_romanization)).toBe(false);
      expect(item.optionA_vi.trim().length).toBeGreaterThan(3);
      expect(item.optionA_en.trim().length).toBeGreaterThan(3);
      expect(hasGurmukhi(item.prompt_gurmukhi)).toBe(true);
      expect(item.prompt_romanization.trim().length).toBeGreaterThan(8);
      expect(hasGurmukhi(item.prompt_romanization)).toBe(false);
      expect(item.reasoningFrame.length).toBeGreaterThanOrEqual(3);
      for (const frame of item.reasoningFrame) {
        expect(hasGurmukhi(frame.phrase_gurmukhi)).toBe(true);
        expect(frame.romanization.trim().length).toBeGreaterThan(4);
        expect(frame.vi.trim().length).toBeGreaterThan(4);
        expect(frame.en.trim().length).toBeGreaterThan(4);
      }
      expect(hasGurmukhi(item.modelReasoning_gurmukhi)).toBe(true);
      expect(item.modelReasoning_romanization.trim().length).toBeGreaterThan(30);
      expect(item.modelReasoning_vi.trim().length).toBeGreaterThan(30);
      expect(item.modelReasoning_en.trim().length).toBeGreaterThan(30);
      expect(item.remediation_vi.trim().length).toBeGreaterThan(10);
      expect(item.remediation_en.trim().length).toBeGreaterThan(10);
      expect(item.learnerTraps_vi.length).toBeGreaterThan(0);
      expect(item.learnerTraps_en.length).toBe(item.learnerTraps_vi.length);
    },
  );

  it("supports Vietnamese-speaking and English-speaking learners with Canada-practical examples", () => {
    expect(serialized).toMatch(/Vietnamese|English|Việt|Anh|Canada|Canadian/i);
    expect(punjabiComparativeReasoningB2.filter((item) => item.canadaPracticalExample_en).length).toBeGreaterThanOrEqual(7);
  });

  it("includes navigation, review, remediation, and readiness style content", () => {
    expect(serialized).toMatch(/route|review|remediation|ready|quay lại|ôn/i);
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
