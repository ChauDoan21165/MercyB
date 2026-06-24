import { describe, expect, it } from "vitest";
import {
  punjabiB1CapstoneTasks,
  type PunjabiB1CapstoneFocus,
  type PunjabiCapstoneLine,
} from "../capstoneTasksB1";

const GURMUKHI_RE = /[\u0A00-\u0A7F]/;
const LATIN_RE = /[a-z]/i;

const REQUIRED_FOCUSES: PunjabiB1CapstoneFocus[] = [
  "explain_problem",
  "retell_event",
  "ask_clarification",
  "service_conversation",
  "workplace_issue",
  "school_community_task",
  "health_service_communication",
];

function expectLine(line: PunjabiCapstoneLine) {
  expect(GURMUKHI_RE.test(line.pa)).toBe(true);
  expect(LATIN_RE.test(line.romanization)).toBe(true);
  expect(line.en.trim().length).toBeGreaterThan(0);
  expect(line.vi.trim().length).toBeGreaterThan(0);
}

describe("Punjabi B1 capstone tasks - batch", () => {
  it("has a compact useful set of B1 capstone tasks", () => {
    expect(punjabiB1CapstoneTasks.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1CapstoneTasks.length).toBeLessThanOrEqual(16);
  });

  it("has unique ids and marks every task B1", () => {
    const ids = punjabiB1CapstoneTasks.map((task) => task.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const task of punjabiB1CapstoneTasks) {
      expect(task.level).toBe("B1");
    }
  });

  it("covers required capstone focus areas", () => {
    const seen = new Set(punjabiB1CapstoneTasks.map((task) => task.focus));

    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus)).toBe(true);
    }
  });
});

describe("Punjabi B1 capstone tasks - learner content", () => {
  for (const task of punjabiB1CapstoneTasks) {
    describe(task.id, () => {
      it("has bilingual task framing and Canada-practical context", () => {
        expect(task.title_en.trim().length).toBeGreaterThan(0);
        expect(task.title_vi.trim().length).toBeGreaterThan(0);
        expect(task.checkpointSkill_en.trim().length).toBeGreaterThan(0);
        expect(task.checkpointSkill_vi.trim().length).toBeGreaterThan(0);
        expect(task.scenario_en.trim().length).toBeGreaterThan(0);
        expect(task.scenario_vi.trim().length).toBeGreaterThan(0);
        expect(task.learnerGoal_en.trim().length).toBeGreaterThan(0);
        expect(task.learnerGoal_vi.trim().length).toBeGreaterThan(0);
        expect(task.canadaContext.trim().length).toBeGreaterThan(0);
      });

      it("has bilingual capstone/checkpoint success criteria", () => {
        expect(task.successCriteria_en.length).toBeGreaterThanOrEqual(3);
        expect(task.successCriteria_vi.length).toBe(task.successCriteria_en.length);

        for (const criterion of task.successCriteria_en) {
          expect(criterion.trim().length).toBeGreaterThan(0);
        }

        for (const criterion of task.successCriteria_vi) {
          expect(criterion.trim().length).toBeGreaterThan(0);
        }
      });

      it("has useful Gurmukhi language and a model answer", () => {
        expect(task.usefulLanguage.length).toBeGreaterThanOrEqual(3);

        for (const phrase of task.usefulLanguage) {
          expectLine(phrase);
        }

        expectLine(task.modelAnswer);
      });

      it("has a self-check prompt and common learner traps", () => {
        expect(task.selfCheckPrompt_en.trim().length).toBeGreaterThan(0);
        expect(task.selfCheckPrompt_vi.trim().length).toBeGreaterThan(0);
        expect(task.commonTraps.length).toBeGreaterThanOrEqual(1);

        for (const trap of task.commonTraps) {
          expect(trap.trap_en.trim().length).toBeGreaterThan(0);
          expect(trap.trap_vi.trim().length).toBeGreaterThan(0);
          expectLine(trap.better);
        }
      });

      it("marks health and public-service legal examples as language support only", () => {
        const requiresSupportNote =
          task.focus === "health_service_communication" ||
          task.id.includes("service-visit");

        if (!requiresSupportNote) return;

        expect(`${task.checkpointSkill_en} ${task.learnerGoal_en}`).toMatch(
          /language support only/i,
        );
        expect(`${task.checkpointSkill_vi} ${task.learnerGoal_vi}`).toMatch(
          /Chỉ hỗ trợ ngôn ngữ/i,
        );
      });
    });
  }
});
