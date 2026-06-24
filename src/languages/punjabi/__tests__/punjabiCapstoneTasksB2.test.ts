import { describe, expect, it } from "vitest";

import punjabiCapstoneTasksB2, {
  punjabiCapstoneTasksB2 as named,
  type PunjabiCapstoneB2Task,
} from "../capstoneTasksB2";

const GURMUKHI_RE = /[ਗ-ੴ]/u;
const hasGurmukhi = (value: string) => GURMUKHI_RE.test(value);

const REQUIRED_TASK_TYPES = [
  "structured_opinion",
  "compare_options",
  "defend_recommendation",
  "respond_to_counterpoint",
] as const;

const REQUIRED_TOPICS = ["settlement", "work", "education", "health", "public_service"] as const;

const serialized = JSON.stringify(punjabiCapstoneTasksB2);

describe("Punjabi B2 capstone tasks", () => {
  it("exports the same app-consumable array by default and name", () => {
    expect(punjabiCapstoneTasksB2).toBe(named);
    expect(Array.isArray(punjabiCapstoneTasksB2)).toBe(true);
  });

  it("ships compact but useful B2 capstone items", () => {
    expect(punjabiCapstoneTasksB2.length).toBeGreaterThanOrEqual(16);
    expect(punjabiCapstoneTasksB2.length).toBeLessThanOrEqual(32);
    expect(punjabiCapstoneTasksB2.every((task) => task.level === "B2")).toBe(true);
  });

  it("uses unique ids and covers required capstone task types and topics", () => {
    const ids = punjabiCapstoneTasksB2.map((task) => task.id);
    expect(new Set(ids).size).toBe(ids.length);

    const taskTypes = new Set(punjabiCapstoneTasksB2.map((task) => task.taskType));
    for (const type of REQUIRED_TASK_TYPES) expect(taskTypes.has(type)).toBe(true);

    const topics = new Set(punjabiCapstoneTasksB2.map((task) => task.topic));
    for (const topic of REQUIRED_TOPICS) expect(topics.has(topic)).toBe(true);
  });

  it.each(punjabiCapstoneTasksB2.map((task) => [task.id, task] as const))(
    "%s includes Gurmukhi task text, romanization, checkpoint framing, bilingual model, and traps",
    (_id, task: PunjabiCapstoneB2Task) => {
      expect(task.checkpointTitle_vi.trim().length).toBeGreaterThan(8);
      expect(task.checkpointTitle_en.trim().length).toBeGreaterThan(8);
      expect(hasGurmukhi(task.task_gurmukhi)).toBe(true);
      expect(task.task_romanization.trim().length).toBeGreaterThan(8);
      expect(hasGurmukhi(task.task_romanization)).toBe(false);
      expect(task.task_vi.trim().length).toBeGreaterThan(8);
      expect(task.task_en.trim().length).toBeGreaterThan(8);

      expect(task.planningFrame.length).toBeGreaterThanOrEqual(3);
      for (const cue of task.planningFrame) {
        expect(hasGurmukhi(cue.cue_gurmukhi)).toBe(true);
        expect(cue.romanization.trim().length).toBeGreaterThan(4);
        expect(cue.vi.trim().length).toBeGreaterThan(4);
        expect(cue.en.trim().length).toBeGreaterThan(4);
      }

      expect(task.successCriteria_vi.length).toBeGreaterThanOrEqual(2);
      expect(task.successCriteria_en.length).toBe(task.successCriteria_vi.length);
      expect(hasGurmukhi(task.modelResponse_gurmukhi)).toBe(true);
      expect(task.modelResponse_romanization.trim().length).toBeGreaterThan(30);
      expect(task.modelResponse_vi.trim().length).toBeGreaterThan(30);
      expect(task.modelResponse_en.trim().length).toBeGreaterThan(30);
      expect(task.learnerTraps_vi.length).toBeGreaterThan(0);
      expect(task.learnerTraps_en.length).toBe(task.learnerTraps_vi.length);
    },
  );

  it("supports Vietnamese-speaking and English-speaking learners with Canada-practical examples", () => {
    expect(serialized).toMatch(/Vietnamese|English|Việt|Anh|Canada|Canadian/i);
    expect(punjabiCapstoneTasksB2.filter((task) => task.canadaPracticalExample_en).length).toBeGreaterThanOrEqual(7);
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
