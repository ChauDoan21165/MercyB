import { describe, expect, it } from "vitest";

import punjabiRecommendationTasksB2, {
  punjabiRecommendationTasksB2 as named,
  type PunjabiRecommendationB2Task,
} from "../recommendationTasksB2";

const GURMUKHI_RE = /[ਗ-ੴ]/u;
const hasGurmukhi = (value: string) => GURMUKHI_RE.test(value);

const REQUIRED_SCENARIOS = ["settlement", "housing", "work", "education", "healthcare", "transport", "public_service"] as const;
const REQUIRED_FOCUS = ["recommend_option", "justify_reasons", "compare_tradeoffs", "address_concerns"] as const;
const REQUIRED_MOVES = ["recommend", "reason", "tradeoff", "concern", "final_quality"] as const;

const serialized = JSON.stringify(punjabiRecommendationTasksB2);

describe("Punjabi B2 recommendation tasks", () => {
  it("exports the same app-consumable array by default and name", () => {
    expect(punjabiRecommendationTasksB2).toBe(named);
    expect(Array.isArray(punjabiRecommendationTasksB2)).toBe(true);
  });

  it("ships compact but useful B2 recommendation tasks", () => {
    expect(punjabiRecommendationTasksB2.length).toBeGreaterThanOrEqual(10);
    expect(punjabiRecommendationTasksB2.length).toBeLessThanOrEqual(24);
    expect(punjabiRecommendationTasksB2.every((task) => task.level === "B2")).toBe(true);
  });

  it("uses unique ids and covers required scenarios, focus areas, and recommendation moves", () => {
    const ids = punjabiRecommendationTasksB2.map((task) => task.id);
    expect(new Set(ids).size).toBe(ids.length);

    const scenarios = new Set(punjabiRecommendationTasksB2.map((task) => task.scenario));
    for (const scenario of REQUIRED_SCENARIOS) expect(scenarios.has(scenario)).toBe(true);

    const focus = new Set(punjabiRecommendationTasksB2.map((task) => task.recommendationFocus));
    for (const item of REQUIRED_FOCUS) expect(focus.has(item)).toBe(true);

    const moves = new Set(punjabiRecommendationTasksB2.flatMap((task) => task.recommendationFrame.map((frame) => frame.move)));
    for (const move of REQUIRED_MOVES) expect(moves.has(move)).toBe(true);
  });

  it.each(punjabiRecommendationTasksB2.map((task) => [task.id, task] as const))(
    "%s includes Gurmukhi prompt, romanization, recommendation frame, model, final quality, remediation, and traps",
    (_id, task: PunjabiRecommendationB2Task) => {
      expect(hasGurmukhi(task.prompt_gurmukhi)).toBe(true);
      expect(task.prompt_romanization.trim().length).toBeGreaterThan(8);
      expect(hasGurmukhi(task.prompt_romanization)).toBe(false);
      expect(task.prompt_vi.trim().length).toBeGreaterThan(8);
      expect(task.prompt_en.trim().length).toBeGreaterThan(8);
      expect(task.recommendationFrame.length).toBeGreaterThanOrEqual(4);
      const moves = new Set(task.recommendationFrame.map((frame) => frame.move));
      expect(moves.has("recommend")).toBe(true);
      expect(moves.has("reason")).toBe(true);
      for (const frame of task.recommendationFrame) {
        expect(hasGurmukhi(frame.phrase_gurmukhi)).toBe(true);
        expect(frame.romanization.trim().length).toBeGreaterThan(4);
        expect(frame.vi.trim().length).toBeGreaterThan(4);
        expect(frame.en.trim().length).toBeGreaterThan(4);
      }
      expect(hasGurmukhi(task.modelRecommendation_gurmukhi)).toBe(true);
      expect(task.modelRecommendation_romanization.trim().length).toBeGreaterThan(30);
      expect(task.modelRecommendation_vi.trim().length).toBeGreaterThan(30);
      expect(task.modelRecommendation_en.trim().length).toBeGreaterThan(30);
      expect(task.finalQualityCheck_vi.length).toBeGreaterThanOrEqual(3);
      expect(task.finalQualityCheck_en.length).toBe(task.finalQualityCheck_vi.length);
      expect(task.remediation_vi.trim().length).toBeGreaterThan(10);
      expect(task.remediation_en.trim().length).toBeGreaterThan(10);
      expect(task.learnerTraps_vi.length).toBeGreaterThan(0);
      expect(task.learnerTraps_en.length).toBe(task.learnerTraps_vi.length);
    },
  );

  it("supports Vietnamese-speaking and English-speaking learners with Canada-practical examples", () => {
    expect(serialized).toMatch(/Vietnamese|English|Việt|Anh|Canada|Canadian/i);
    expect(punjabiRecommendationTasksB2.filter((task) => task.canadaPracticalExample_en).length).toBeGreaterThanOrEqual(7);
  });

  it("includes final-quality, review, remediation, and readiness style content", () => {
    expect(serialized).toMatch(/finalQualityCheck|final-quality|review|remediation|ready|quay lại|thực tế/i);
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
