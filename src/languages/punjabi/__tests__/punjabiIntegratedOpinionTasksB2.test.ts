import { describe, expect, it } from "vitest";

import punjabiIntegratedOpinionTasksB2, {
  punjabiIntegratedOpinionTasksB2 as named,
  type PunjabiIntegratedOpinionB2Task,
} from "../integratedOpinionTasksB2";

const GURMUKHI_RE = /[ਗ-ੴ]/u;
const hasGurmukhi = (value: string) => GURMUKHI_RE.test(value);

const REQUIRED_TOPICS = ["settlement", "work", "education", "health", "public_service"] as const;

const REQUIRED_COMPONENTS = [
  "viewpoint",
  "example",
  "comparison",
  "counterpoint",
  "recommendation",
  "register_awareness",
] as const;

const serialized = JSON.stringify(punjabiIntegratedOpinionTasksB2);

describe("Punjabi B2 integrated opinion tasks", () => {
  it("exports the same app-consumable array by default and name", () => {
    expect(punjabiIntegratedOpinionTasksB2).toBe(named);
    expect(Array.isArray(punjabiIntegratedOpinionTasksB2)).toBe(true);
  });

  it("ships compact but useful B2 integrated opinion tasks", () => {
    expect(punjabiIntegratedOpinionTasksB2.length).toBeGreaterThanOrEqual(14);
    expect(punjabiIntegratedOpinionTasksB2.length).toBeLessThanOrEqual(28);
    expect(punjabiIntegratedOpinionTasksB2.every((task) => task.level === "B2")).toBe(true);
  });

  it("uses unique ids and covers required topics, routes, and opinion components", () => {
    const ids = punjabiIntegratedOpinionTasksB2.map((task) => task.id);
    expect(new Set(ids).size).toBe(ids.length);

    const topics = new Set(punjabiIntegratedOpinionTasksB2.map((task) => task.topic));
    for (const topic of REQUIRED_TOPICS) expect(topics.has(topic)).toBe(true);

    const routes = new Set(punjabiIntegratedOpinionTasksB2.map((task) => task.reviewRoute));
    expect(routes).toEqual(new Set(["integration_readiness", "final_review", "capstone_routing"]));

    const allComponents = new Set(punjabiIntegratedOpinionTasksB2.flatMap((task) => task.requiredComponents));
    for (const component of REQUIRED_COMPONENTS) expect(allComponents.has(component)).toBe(true);
  });

  it.each(punjabiIntegratedOpinionTasksB2.map((task) => [task.id, task] as const))(
    "%s includes Gurmukhi prompt, romanization, integrated frame, bilingual model, routing, and traps",
    (_id, task: PunjabiIntegratedOpinionB2Task) => {
      expect(hasGurmukhi(task.prompt_gurmukhi)).toBe(true);
      expect(task.prompt_romanization.trim().length).toBeGreaterThan(8);
      expect(hasGurmukhi(task.prompt_romanization)).toBe(false);
      expect(task.prompt_vi.trim().length).toBeGreaterThan(8);
      expect(task.prompt_en.trim().length).toBeGreaterThan(8);

      expect(task.requiredComponents.length).toBeGreaterThanOrEqual(4);
      const frameComponents = new Set(task.integratedFrame.map((frame) => frame.component));
      for (const component of task.requiredComponents) expect(frameComponents.has(component)).toBe(true);

      expect(task.integratedFrame.length).toBeGreaterThanOrEqual(task.requiredComponents.length);
      for (const frame of task.integratedFrame) {
        expect(hasGurmukhi(frame.phrase_gurmukhi)).toBe(true);
        expect(frame.romanization.trim().length).toBeGreaterThan(4);
        expect(frame.vi.trim().length).toBeGreaterThan(4);
        expect(frame.en.trim().length).toBeGreaterThan(4);
      }

      expect(hasGurmukhi(task.modelAnswer_gurmukhi)).toBe(true);
      expect(task.modelAnswer_romanization.trim().length).toBeGreaterThan(40);
      expect(task.modelAnswer_vi.trim().length).toBeGreaterThan(40);
      expect(task.modelAnswer_en.trim().length).toBeGreaterThan(40);
      expect(task.routingFeedback_vi.trim().length).toBeGreaterThan(20);
      expect(task.routingFeedback_en.trim().length).toBeGreaterThan(20);
      expect(task.learnerTraps_vi.length).toBeGreaterThan(0);
      expect(task.learnerTraps_en.length).toBe(task.learnerTraps_vi.length);
    },
  );

  it("supports Vietnamese-speaking and English-speaking learners with Canada-practical examples", () => {
    expect(serialized).toMatch(/Vietnamese|English|Việt|Anh|Canada|Canadian/i);
    expect(punjabiIntegratedOpinionTasksB2.filter((task) => task.canadaPracticalExample_en).length).toBeGreaterThanOrEqual(7);
  });

  it("includes integration-readiness, review, and routing style content", () => {
    expect(serialized).toMatch(/integration_readiness|final_review|capstone_routing/);
    expect(serialized).toMatch(/route|Route|routing|capstone|review/i);
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
