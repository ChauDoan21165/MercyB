import { describe, expect, it } from "vitest";

import punjabiLearnerJourneyB2, {
  punjabiLearnerJourneyB2 as named,
  type PunjabiLearnerJourneyB2Step,
} from "../learnerJourneyB2";

const GURMUKHI_RE = /[ਗ-ੴ]/u;
const hasGurmukhi = (value: string) => GURMUKHI_RE.test(value);

const REQUIRED_SKILLS = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "public_issue",
  "workplace_fairness",
] as const;

const REQUIRED_TOPICS = ["settlement", "housing", "work", "education", "healthcare", "transport", "public_service"] as const;

const serialized = JSON.stringify(punjabiLearnerJourneyB2);

describe("Punjabi B2 learner journey", () => {
  it("exports the same app-consumable array by default and name", () => {
    expect(punjabiLearnerJourneyB2).toBe(named);
    expect(Array.isArray(punjabiLearnerJourneyB2)).toBe(true);
  });

  it("ships compact but useful ordered B2 journey steps", () => {
    expect(punjabiLearnerJourneyB2.length).toBeGreaterThanOrEqual(12);
    expect(punjabiLearnerJourneyB2.length).toBeLessThanOrEqual(24);
    expect(punjabiLearnerJourneyB2.every((step) => step.level === "B2")).toBe(true);
    expect(punjabiLearnerJourneyB2.map((step) => step.stepNumber)).toEqual(
      [...punjabiLearnerJourneyB2].map((_, index) => index + 1),
    );
  });

  it("uses unique ids and covers required skills, topics, and journey stages", () => {
    const ids = punjabiLearnerJourneyB2.map((step) => step.id);
    expect(new Set(ids).size).toBe(ids.length);

    const skills = new Set(punjabiLearnerJourneyB2.map((step) => step.skill));
    for (const skill of REQUIRED_SKILLS) expect(skills.has(skill)).toBe(true);

    const topics = new Set(punjabiLearnerJourneyB2.map((step) => step.topic));
    for (const topic of REQUIRED_TOPICS) expect(topics.has(topic)).toBe(true);

    const stages = new Set(punjabiLearnerJourneyB2.map((step) => step.journeyStage));
    expect(stages).toEqual(new Set(["build", "practice", "handoff", "readiness"]));
  });

  it.each(punjabiLearnerJourneyB2.map((step) => [step.id, step] as const))(
    "%s includes Gurmukhi goal, romanization, bilingual task, success signals, handoff, and traps",
    (_id, step: PunjabiLearnerJourneyB2Step) => {
      expect(hasGurmukhi(step.learnerGoal_gurmukhi)).toBe(true);
      expect(step.learnerGoal_romanization.trim().length).toBeGreaterThan(8);
      expect(hasGurmukhi(step.learnerGoal_romanization)).toBe(false);
      expect(step.learnerGoal_vi.trim().length).toBeGreaterThan(8);
      expect(step.learnerGoal_en.trim().length).toBeGreaterThan(8);
      expect(hasGurmukhi(step.checkpointTask_gurmukhi)).toBe(true);
      expect(step.checkpointTask_romanization.trim().length).toBeGreaterThan(8);
      expect(hasGurmukhi(step.checkpointTask_romanization)).toBe(false);
      expect(step.checkpointTask_vi.trim().length).toBeGreaterThan(8);
      expect(step.checkpointTask_en.trim().length).toBeGreaterThan(8);
      expect(step.successSignals_vi.length).toBeGreaterThanOrEqual(3);
      expect(step.successSignals_en.length).toBe(step.successSignals_vi.length);
      expect(step.handoff_vi.trim().length).toBeGreaterThan(20);
      expect(step.handoff_en.trim().length).toBeGreaterThan(20);
      expect(step.learnerTraps_vi.length).toBeGreaterThan(0);
      expect(step.learnerTraps_en.length).toBe(step.learnerTraps_vi.length);
    },
  );

  it("supports Vietnamese-speaking and English-speaking learners with Canada-practical examples", () => {
    expect(serialized).toMatch(/Vietnamese|English|Việt|Anh|Canada|Canadian/i);
    expect(punjabiLearnerJourneyB2.filter((step) => step.canadaPracticalExample_en).length).toBeGreaterThanOrEqual(7);
  });

  it("includes learner-journey, handoff, and readiness style content", () => {
    expect(serialized).toMatch(/handoff|route|chuyển|sẵn sàng|ready|readiness/i);
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
