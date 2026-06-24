import { describe, expect, it } from "vitest";
import {
  punjabiB1CommunicationTasks,
  type PunjabiB1CommunicationFocus,
  type PunjabiB1TaskPhrase,
} from "../communicationTasksB1";

const GURMUKHI_RE = /[\u0A00-\u0A7F]/;
const LATIN_RE = /[a-z]/i;

const REQUIRED_FOCUSES: PunjabiB1CommunicationFocus[] = [
  "explain_situation",
  "clarification",
  "polite_complaint",
  "work_experience",
  "health_symptoms",
  "teacher_public_service",
  "comparison",
  "retelling_events",
];

function expectPhrase(phrase: PunjabiB1TaskPhrase) {
  expect(GURMUKHI_RE.test(phrase.pa)).toBe(true);
  expect(LATIN_RE.test(phrase.romanization)).toBe(true);
  expect(phrase.en.trim().length).toBeGreaterThan(0);
  expect(phrase.vi.trim().length).toBeGreaterThan(0);
}

describe("Punjabi B1 communication tasks - batch", () => {
  it("has a compact but useful set of B1 task cards", () => {
    expect(punjabiB1CommunicationTasks.length).toBeGreaterThanOrEqual(10);
    expect(punjabiB1CommunicationTasks.length).toBeLessThanOrEqual(18);
  });

  it("has unique ids and marks every task B1", () => {
    const ids = punjabiB1CommunicationTasks.map((task) => task.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const task of punjabiB1CommunicationTasks) {
      expect(task.level).toBe("B1");
    }
  });

  it("covers required B1 communication task types", () => {
    const seen = new Set(punjabiB1CommunicationTasks.map((task) => task.focus));

    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus)).toBe(true);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const canadaContexts = punjabiB1CommunicationTasks.filter((task) =>
      task.canadaContext?.trim(),
    );

    expect(canadaContexts.length).toBeGreaterThanOrEqual(4);
  });
});

describe("Punjabi B1 communication tasks - learner content", () => {
  for (const task of punjabiB1CommunicationTasks) {
    describe(task.id, () => {
      it("has bilingual title, situation, and learner goal", () => {
        expect(task.title_en.trim().length).toBeGreaterThan(0);
        expect(task.title_vi.trim().length).toBeGreaterThan(0);
        expect(task.situation_en.trim().length).toBeGreaterThan(0);
        expect(task.situation_vi.trim().length).toBeGreaterThan(0);
        expect(task.learnerGoal_en.trim().length).toBeGreaterThan(0);
        expect(task.learnerGoal_vi.trim().length).toBeGreaterThan(0);
      });

      it("has useful phrases with Gurmukhi, romanization, English, and Vietnamese", () => {
        expect(task.usefulPhrases.length).toBeGreaterThanOrEqual(3);

        for (const phrase of task.usefulPhrases) {
          expectPhrase(phrase);
        }
      });

      it("has a model response and bilingual follow-up prompt", () => {
        expectPhrase(task.modelResponse);
        expect(task.followUpPrompt_en.trim().length).toBeGreaterThan(0);
        expect(task.followUpPrompt_vi.trim().length).toBeGreaterThan(0);
      });

      it("includes common learner traps with better Punjabi alternatives", () => {
        expect(task.learnerTraps.length).toBeGreaterThanOrEqual(1);

        for (const trap of task.learnerTraps) {
          expect(trap.trap_en.trim().length).toBeGreaterThan(0);
          expect(trap.trap_vi.trim().length).toBeGreaterThan(0);
          expectPhrase(trap.better);
        }
      });

      it("marks health and legal/public-service examples as language support only", () => {
        if (
          task.focus !== "health_symptoms" &&
          !task.id.includes("public-service")
        ) {
          return;
        }

        expect(task.learnerGoal_en).toMatch(/language support only/i);
        expect(task.learnerGoal_vi).toMatch(/Chỉ hỗ trợ ngôn ngữ|chỉ là hỗ trợ ngôn ngữ/i);
      });
    });
  }
});
