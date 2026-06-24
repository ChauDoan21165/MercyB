import { describe, expect, it } from "vitest";
import {
  punjabiB1CommunityTasks,
  type PunjabiB1CommunityFocus,
  type PunjabiCommunityPhrase,
} from "../communityTasksB1";

const GURMUKHI_RE = /[\u0A00-\u0A7F]/;
const LATIN_RE = /[a-z]/i;

const REQUIRED_FOCUSES: PunjabiB1CommunityFocus[] = [
  "ask_local_help",
  "community_center_needs",
  "join_event",
  "school_community_staff",
  "describe_problem",
  "ask_next_steps",
];

function expectPhrase(phrase: PunjabiCommunityPhrase) {
  expect(GURMUKHI_RE.test(phrase.pa)).toBe(true);
  expect(LATIN_RE.test(phrase.romanization)).toBe(true);
  expect(phrase.en.trim().length).toBeGreaterThan(0);
  expect(phrase.vi.trim().length).toBeGreaterThan(0);
}

describe("Punjabi B1 community tasks - batch", () => {
  it("has a compact useful set of B1 community tasks", () => {
    expect(punjabiB1CommunityTasks.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1CommunityTasks.length).toBeLessThanOrEqual(16);
  });

  it("has unique ids and marks every task B1", () => {
    const ids = punjabiB1CommunityTasks.map((task) => task.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const task of punjabiB1CommunityTasks) {
      expect(task.level).toBe("B1");
    }
  });

  it("covers all required community focus areas", () => {
    const seen = new Set(punjabiB1CommunityTasks.map((task) => task.focus));

    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus)).toBe(true);
    }
  });
});

describe("Punjabi B1 community tasks - learner content", () => {
  for (const task of punjabiB1CommunityTasks) {
    describe(task.id, () => {
      it("has bilingual title, context, goal, and Canada context", () => {
        expect(task.title_en.trim().length).toBeGreaterThan(0);
        expect(task.title_vi.trim().length).toBeGreaterThan(0);
        expect(task.communityContext_en.trim().length).toBeGreaterThan(0);
        expect(task.communityContext_vi.trim().length).toBeGreaterThan(0);
        expect(task.learnerGoal_en.trim().length).toBeGreaterThan(0);
        expect(task.learnerGoal_vi.trim().length).toBeGreaterThan(0);
        expect(task.canadaContext.trim().length).toBeGreaterThan(0);
      });

      it("has useful phrases with Gurmukhi, romanization, English, and Vietnamese", () => {
        expect(task.usefulPhrases.length).toBeGreaterThanOrEqual(3);

        for (const phrase of task.usefulPhrases) {
          expectPhrase(phrase);
        }
      });

      it("has a model response and next-step question", () => {
        expectPhrase(task.modelResponse);
        expectPhrase(task.nextStepQuestion);
      });

      it("has bilingual practice prompts and common learner traps", () => {
        expect(task.practicePrompt_en.trim().length).toBeGreaterThan(0);
        expect(task.practicePrompt_vi.trim().length).toBeGreaterThan(0);
        expect(task.commonTraps.length).toBeGreaterThanOrEqual(1);

        for (const trap of task.commonTraps) {
          expect(trap.trap_en.trim().length).toBeGreaterThan(0);
          expect(trap.trap_vi.trim().length).toBeGreaterThan(0);
          expectPhrase(trap.better);
        }
      });
    });
  }
});
