import { describe, expect, it } from "vitest";

import punjabiStructuredSpeakingB2Prompts, {
  punjabiStructuredSpeakingB2Prompts as named,
  type PunjabiStructuredSpeakingB2Prompt,
} from "../structuredSpeakingB2";

const GURMUKHI_RE = /[ਗ-ੴ]/u;
const hasGurmukhi = (value: string) => GURMUKHI_RE.test(value);

const REQUIRED_TASK_TYPES = [
  "explain_viewpoint",
  "compare_options",
  "defend_recommendation",
  "respond_to_counterpoint",
] as const;

const REQUIRED_TOPICS = ["workplace", "community", "education", "health", "public_service"] as const;

const serialized = JSON.stringify(punjabiStructuredSpeakingB2Prompts);

describe("Punjabi B2 structured speaking prompts", () => {
  it("exports the same app-consumable array by default and name", () => {
    expect(punjabiStructuredSpeakingB2Prompts).toBe(named);
    expect(Array.isArray(punjabiStructuredSpeakingB2Prompts)).toBe(true);
  });

  it("ships compact but useful B2 text-only speaking prompts", () => {
    expect(punjabiStructuredSpeakingB2Prompts.length).toBeGreaterThanOrEqual(16);
    expect(punjabiStructuredSpeakingB2Prompts.length).toBeLessThanOrEqual(32);
    expect(punjabiStructuredSpeakingB2Prompts.every((prompt) => prompt.level === "B2")).toBe(true);
  });

  it("uses unique ids and covers required task types and topics", () => {
    const ids = punjabiStructuredSpeakingB2Prompts.map((prompt) => prompt.id);
    expect(new Set(ids).size).toBe(ids.length);

    const taskTypes = new Set(punjabiStructuredSpeakingB2Prompts.map((prompt) => prompt.taskType));
    for (const type of REQUIRED_TASK_TYPES) expect(taskTypes.has(type)).toBe(true);

    const topics = new Set(punjabiStructuredSpeakingB2Prompts.map((prompt) => prompt.topic));
    for (const topic of REQUIRED_TOPICS) expect(topics.has(topic)).toBe(true);
  });

  it.each(punjabiStructuredSpeakingB2Prompts.map((prompt) => [prompt.id, prompt] as const))(
    "%s includes Gurmukhi prompt, romanization, structured frame, bilingual model, and traps",
    (_id, prompt: PunjabiStructuredSpeakingB2Prompt) => {
      expect(hasGurmukhi(prompt.prompt_gurmukhi)).toBe(true);
      expect(prompt.prompt_romanization.trim().length).toBeGreaterThan(8);
      expect(hasGurmukhi(prompt.prompt_romanization)).toBe(false);
      expect(prompt.prompt_vi.trim().length).toBeGreaterThan(8);
      expect(prompt.prompt_en.trim().length).toBeGreaterThan(8);

      expect(prompt.speakingFrame.length).toBeGreaterThanOrEqual(3);
      for (const step of prompt.speakingFrame) {
        expect(hasGurmukhi(step.step_gurmukhi)).toBe(true);
        expect(step.romanization.trim().length).toBeGreaterThan(4);
        expect(step.vi.trim().length).toBeGreaterThan(4);
        expect(step.en.trim().length).toBeGreaterThan(4);
      }

      expect(hasGurmukhi(prompt.modelResponse_gurmukhi)).toBe(true);
      expect(prompt.modelResponse_romanization.trim().length).toBeGreaterThan(20);
      expect(prompt.modelResponse_vi.trim().length).toBeGreaterThan(20);
      expect(prompt.modelResponse_en.trim().length).toBeGreaterThan(20);
      expect(prompt.learnerTraps_vi.length).toBeGreaterThan(0);
      expect(prompt.learnerTraps_en.length).toBe(prompt.learnerTraps_vi.length);
    },
  );

  it("supports Vietnamese-speaking and English-speaking learners with Canada-practical examples", () => {
    expect(serialized).toMatch(/Vietnamese|English|Việt|Anh|Canada|Canadian/i);
    expect(punjabiStructuredSpeakingB2Prompts.filter((prompt) => prompt.canadaPracticalExample_en).length).toBeGreaterThanOrEqual(5);
  });

  it("mentions Shahmukhi only as awareness and defers native review without claiming it", () => {
    const shahmukhiMatches = serialized.match(/Shahmukhi/g) ?? [];
    expect(shahmukhiMatches.length).toBeLessThanOrEqual(1);
    expect(serialized).toMatch(/awareness only/i);
    expect(serialized).toMatch(/deferred/i);
    expect(serialized).not.toMatch(/native[- ](?:certified|verified|approved|reviewed)|verified by native|native speaker approved/i);
  });

  it("is text-only and does not include unrelated product claims", () => {
    expect(serialized).not.toMatch(/pronunciation score|Azure|Supabase|billing|RLS|auth|audio/i);
  });
});
