// src/data/mock-interviews/__tests__/professional-scenarios.test.ts

import { describe, expect, it } from "vitest";

import {
  ALL_PRO_SCENARIO_IDS,
  PRO_SCENARIOS,
  PRO_VERTICALS,
  getProScenarioById,
  listProScenarios,
  listProScenariosByVertical,
  type ProInterviewQuestion,
  type ProInterviewScenario,
} from "../professional-scenarios";

const REQUIRED_TOP_LEVEL_KEYS: ReadonlyArray<keyof ProInterviewScenario> = [
  "id",
  "vertical",
  "role",
  "level",
  "title_vi",
  "title_en",
  "context",
  "typical_questions",
  "vietnamese_speaker_pitfalls",
  "sample_strong_answer",
  "common_weak_phrasings",
  "estimated_time_minutes",
  "interviewer_system_prompt",
];

const REQUIRED_QUESTION_KEYS: ReadonlyArray<keyof ProInterviewQuestion> = [
  "question_en",
  "question_vi",
  "depth",
];

const VALID_VERTICALS = [
  "software",
  "university",
  "visa",
  "promotion",
  "sales",
];
const VALID_LEVELS = ["entry", "mid", "senior"];
const VALID_DEPTHS = ["surface", "follow-up", "stress test"];

describe("PRO_SCENARIOS — registry", () => {
  it("ships exactly 30 scenarios", () => {
    expect(PRO_SCENARIOS.length).toBe(30);
    expect(ALL_PRO_SCENARIO_IDS.length).toBe(30);
  });

  it("covers all five verticals with six scenarios each", () => {
    for (const vertical of PRO_VERTICALS) {
      const inVertical = listProScenariosByVertical(vertical);
      expect(inVertical.length).toBe(6);
    }
  });

  it("ids are unique", () => {
    const set = new Set(ALL_PRO_SCENARIO_IDS);
    expect(set.size).toBe(ALL_PRO_SCENARIO_IDS.length);
  });

  it("ids are URL-safe (lowercase + underscores + alphanumerics)", () => {
    for (const id of ALL_PRO_SCENARIO_IDS) {
      expect(id).toMatch(/^[a-z][a-z0-9_]*$/);
    }
  });

  it("listProScenarios returns the same items as PRO_SCENARIOS", () => {
    const list = listProScenarios();
    expect(list.length).toBe(PRO_SCENARIOS.length);
    for (const s of list) {
      expect(getProScenarioById(s.id)).toBe(s);
    }
  });

  it("getProScenarioById returns null for unknown ids", () => {
    expect(getProScenarioById("does_not_exist")).toBeNull();
  });
});

describe("PRO_SCENARIOS — shape", () => {
  it.each(PRO_SCENARIOS)(
    "$id has every required top-level field",
    (scenario) => {
      for (const key of REQUIRED_TOP_LEVEL_KEYS) {
        expect(scenario[key]).toBeDefined();
      }
    },
  );

  it.each(PRO_SCENARIOS)(
    "$id has 5–7 typical_questions",
    (scenario) => {
      expect(scenario.typical_questions.length).toBeGreaterThanOrEqual(5);
      expect(scenario.typical_questions.length).toBeLessThanOrEqual(7);
    },
  );

  it.each(PRO_SCENARIOS)(
    "$id vertical and level are valid",
    (scenario) => {
      expect(VALID_VERTICALS).toContain(scenario.vertical);
      expect(VALID_LEVELS).toContain(scenario.level);
    },
  );

  it.each(PRO_SCENARIOS)(
    "$id has at least 5 vietnamese_speaker_pitfalls",
    (scenario) => {
      expect(scenario.vietnamese_speaker_pitfalls.length).toBeGreaterThanOrEqual(5);
      for (const tip of scenario.vietnamese_speaker_pitfalls) {
        expect(tip.trim().length).toBeGreaterThan(0);
      }
    },
  );

  it.each(PRO_SCENARIOS)(
    "$id has at least 3 common_weak_phrasings, each with all three fields",
    (scenario) => {
      expect(scenario.common_weak_phrasings.length).toBeGreaterThanOrEqual(3);
      for (const wp of scenario.common_weak_phrasings) {
        expect(wp.what_not_to_say.trim().length).toBeGreaterThan(0);
        expect(wp.why.trim().length).toBeGreaterThan(0);
        expect(wp.better_alternative.trim().length).toBeGreaterThan(0);
      }
    },
  );

  it.each(PRO_SCENARIOS)(
    "$id has VN+EN populated for every text field",
    (scenario) => {
      expect(scenario.title_vi.trim().length).toBeGreaterThan(0);
      expect(scenario.title_en.trim().length).toBeGreaterThan(0);
      expect(scenario.context.trim().length).toBeGreaterThan(0);
      expect(scenario.sample_strong_answer.trim().length).toBeGreaterThan(0);
      expect(scenario.interviewer_system_prompt.trim().length).toBeGreaterThan(0);
    },
  );

  it.each(PRO_SCENARIOS)(
    "$id estimated_time_minutes is a positive number under 60",
    (scenario) => {
      expect(scenario.estimated_time_minutes).toBeGreaterThan(0);
      expect(scenario.estimated_time_minutes).toBeLessThanOrEqual(60);
    },
  );
});

describe("PRO_SCENARIOS — typical_questions are bilingual with valid depth", () => {
  for (const scenario of PRO_SCENARIOS) {
    for (let i = 0; i < scenario.typical_questions.length; i += 1) {
      const q = scenario.typical_questions[i];
      const path = `${scenario.id}[Q${i + 1}]`;

      it(`${path} has every required field`, () => {
        for (const key of REQUIRED_QUESTION_KEYS) {
          expect(q[key]).toBeDefined();
        }
      });

      it(`${path} has non-empty bilingual text`, () => {
        expect(q.question_vi.trim().length).toBeGreaterThan(0);
        expect(q.question_en.trim().length).toBeGreaterThan(0);
      });

      it(`${path} has a valid depth tag`, () => {
        expect(VALID_DEPTHS).toContain(q.depth);
      });
    }
  }
});
