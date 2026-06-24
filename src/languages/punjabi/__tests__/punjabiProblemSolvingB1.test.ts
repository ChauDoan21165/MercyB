import { describe, expect, it } from "vitest";
import {
  punjabiB1ProblemSolvingTasks,
  type PunjabiB1ProblemDomain,
  type PunjabiB1ProblemStep,
  type PunjabiProblemPhrase,
} from "../problemSolvingB1";

const GURMUKHI_RE = /[\u0A00-\u0A7F]/;
const LATIN_RE = /[a-z]/i;

const REQUIRED_DOMAINS: PunjabiB1ProblemDomain[] = [
  "service",
  "workplace",
  "housing",
  "healthcare",
  "school",
];

const REQUIRED_STEPS: PunjabiB1ProblemStep[] = [
  "explain_issue",
  "ask_options",
  "propose_solution",
  "clarify_next_steps",
];

function expectPhrase(phrase: PunjabiProblemPhrase) {
  expect(GURMUKHI_RE.test(phrase.pa)).toBe(true);
  expect(LATIN_RE.test(phrase.romanization)).toBe(true);
  expect(phrase.en.trim().length).toBeGreaterThan(0);
  expect(phrase.vi.trim().length).toBeGreaterThan(0);
}

describe("Punjabi B1 problem-solving tasks - batch", () => {
  it("has a compact but useful set of B1 problem-solving tasks", () => {
    expect(punjabiB1ProblemSolvingTasks.length).toBeGreaterThanOrEqual(10);
    expect(punjabiB1ProblemSolvingTasks.length).toBeLessThanOrEqual(18);
  });

  it("has unique ids and marks every task B1", () => {
    const ids = punjabiB1ProblemSolvingTasks.map((task) => task.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const task of punjabiB1ProblemSolvingTasks) {
      expect(task.level).toBe("B1");
    }
  });

  it("covers required practical domains", () => {
    const seen = new Set(punjabiB1ProblemSolvingTasks.map((task) => task.domain));

    for (const domain of REQUIRED_DOMAINS) {
      expect(seen.has(domain)).toBe(true);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const canadaContexts = punjabiB1ProblemSolvingTasks.filter((task) =>
      task.canadaContext?.trim(),
    );

    expect(canadaContexts.length).toBeGreaterThanOrEqual(6);
  });
});

describe("Punjabi B1 problem-solving tasks - learner content", () => {
  for (const task of punjabiB1ProblemSolvingTasks) {
    describe(task.id, () => {
      it("has all required problem-solving steps", () => {
        for (const step of REQUIRED_STEPS) {
          expect(task.steps).toContain(step);
        }
      });

      it("has bilingual title, situation, and learner goal", () => {
        expect(task.title_en.trim().length).toBeGreaterThan(0);
        expect(task.title_vi.trim().length).toBeGreaterThan(0);
        expect(task.situation_en.trim().length).toBeGreaterThan(0);
        expect(task.situation_vi.trim().length).toBeGreaterThan(0);
        expect(task.learnerGoal_en.trim().length).toBeGreaterThan(0);
        expect(task.learnerGoal_vi.trim().length).toBeGreaterThan(0);
      });

      it("has Gurmukhi problem, option, solution, and next-step phrases", () => {
        expectPhrase(task.issuePhrase);
        expectPhrase(task.optionQuestion);
        expectPhrase(task.proposedSolution);
        expectPhrase(task.nextStepClarifier);
      });

      it("has a model dialogue with bilingual Gurmukhi lines", () => {
        expect(task.modelDialogue.length).toBeGreaterThanOrEqual(3);

        for (const line of task.modelDialogue) {
          expectPhrase(line);
        }
      });

      it("includes common learner traps with better alternatives", () => {
        expect(task.commonTraps.length).toBeGreaterThanOrEqual(1);

        for (const trap of task.commonTraps) {
          expect(trap.trap_en.trim().length).toBeGreaterThan(0);
          expect(trap.trap_vi.trim().length).toBeGreaterThan(0);
          expectPhrase(trap.better);
        }
      });

      it("marks healthcare examples as language support only", () => {
        if (task.domain !== "healthcare") return;

        expect(task.learnerGoal_en).toMatch(/language support only/i);
        expect(task.learnerGoal_vi).toMatch(/Chỉ hỗ trợ ngôn ngữ/i);
      });
    });
  }
});
