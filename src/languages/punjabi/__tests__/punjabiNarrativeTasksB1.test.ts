import { describe, expect, it } from "vitest";
import {
  punjabiB1NarrativeTasks,
  type PunjabiB1NarrativeFocus,
  type PunjabiNarrativeLine,
} from "../narrativeTasksB1";

const GURMUKHI_RE = /[\u0A00-\u0A7F]/;
const LATIN_RE = /[a-z]/i;

const REQUIRED_FOCUSES: PunjabiB1NarrativeFocus[] = [
  "retell_events",
  "explain_sequence",
  "cause_effect",
  "workplace_incident",
  "health_service_problem",
  "before_after_comparison",
];

function expectNarrativeLine(line: PunjabiNarrativeLine) {
  expect(GURMUKHI_RE.test(line.pa)).toBe(true);
  expect(LATIN_RE.test(line.romanization)).toBe(true);
  expect(line.en.trim().length).toBeGreaterThan(0);
  expect(line.vi.trim().length).toBeGreaterThan(0);
}

describe("Punjabi B1 narrative tasks - batch", () => {
  it("has a compact but useful set of B1 narrative tasks", () => {
    expect(punjabiB1NarrativeTasks.length).toBeGreaterThanOrEqual(10);
    expect(punjabiB1NarrativeTasks.length).toBeLessThanOrEqual(18);
  });

  it("has unique ids and marks every task B1", () => {
    const ids = punjabiB1NarrativeTasks.map((task) => task.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const task of punjabiB1NarrativeTasks) {
      expect(task.level).toBe("B1");
    }
  });

  it("covers required narrative focus areas", () => {
    const seen = new Set(punjabiB1NarrativeTasks.map((task) => task.focus));

    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus)).toBe(true);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const canadaContexts = punjabiB1NarrativeTasks.filter((task) =>
      task.canadaContext?.trim(),
    );

    expect(canadaContexts.length).toBeGreaterThanOrEqual(6);
  });
});

describe("Punjabi B1 narrative tasks - learner content", () => {
  for (const task of punjabiB1NarrativeTasks) {
    describe(task.id, () => {
      it("has bilingual title, context, narrative goal, and expansion prompt", () => {
        expect(task.title_en.trim().length).toBeGreaterThan(0);
        expect(task.title_vi.trim().length).toBeGreaterThan(0);
        expect(task.context_en.trim().length).toBeGreaterThan(0);
        expect(task.context_vi.trim().length).toBeGreaterThan(0);
        expect(task.narrativeGoal_en.trim().length).toBeGreaterThan(0);
        expect(task.narrativeGoal_vi.trim().length).toBeGreaterThan(0);
        expect(task.expansionPrompt_en.trim().length).toBeGreaterThan(0);
        expect(task.expansionPrompt_vi.trim().length).toBeGreaterThan(0);
      });

      it("has sequence markers with Gurmukhi, romanization, English, and Vietnamese", () => {
        expect(task.sequenceMarkers.length).toBeGreaterThanOrEqual(3);

        for (const marker of task.sequenceMarkers) {
          expectNarrativeLine(marker);
        }
      });

      it("has a model narrative with at least three bilingual Gurmukhi lines", () => {
        expect(task.modelNarrative.length).toBeGreaterThanOrEqual(3);

        for (const line of task.modelNarrative) {
          expectNarrativeLine(line);
        }
      });

      it("includes common learner traps with repaired examples", () => {
        expect(task.commonTraps.length).toBeGreaterThanOrEqual(1);

        for (const trap of task.commonTraps) {
          expect(trap.trap_en.trim().length).toBeGreaterThan(0);
          expect(trap.trap_vi.trim().length).toBeGreaterThan(0);
          expectNarrativeLine(trap.repair);
        }
      });

      it("marks medical and legal/service examples as language support only", () => {
        const shouldMark =
          task.id.includes("health") || task.id.includes("document");

        if (!shouldMark) return;

        expect(task.narrativeGoal_en).toMatch(/language support only/i);
        expect(task.narrativeGoal_vi).toMatch(/Chỉ hỗ trợ ngôn ngữ/i);
      });
    });
  }
});
