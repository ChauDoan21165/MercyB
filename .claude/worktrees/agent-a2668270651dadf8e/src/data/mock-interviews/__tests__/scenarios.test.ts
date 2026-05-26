// src/data/mock-interviews/__tests__/scenarios.test.ts

import { describe, expect, it } from "vitest";

import {
  ALL_SCENARIO_SLUGS,
  SCENARIOS,
  getScenarioBySlug,
  listScenarios,
  type InterviewQuestion,
  type InterviewScenario,
} from "../scenarios";

const REQUIRED_TOP_LEVEL_KEYS: ReadonlyArray<keyof InterviewScenario> = [
  "slug",
  "title_vi",
  "title_en",
  "industry",
  "difficulty",
  "intro_vi",
  "intro_en",
  "questions",
  "evaluation_criteria",
];

const REQUIRED_QUESTION_KEYS: ReadonlyArray<keyof InterviewQuestion> = [
  "prompt_en",
  "prompt_vi",
  "sample_answer_en",
  "sample_answer_vi",
  "what_to_listen_for",
  "common_mistakes_vi",
];

const VALID_INDUSTRIES = ["tech", "service", "retail", "medical", "general"];
const VALID_DIFFICULTIES = ["A2", "B1", "B2"];

describe("SCENARIOS — registry", () => {
  it("ships exactly five hand-crafted scenarios", () => {
    expect(ALL_SCENARIO_SLUGS.length).toBe(5);
  });

  it("includes all five required diaspora roles", () => {
    expect(ALL_SCENARIO_SLUGS).toEqual(
      expect.arrayContaining([
        "tech-support-helpdesk",
        "restaurant-server",
        "nail-salon-technician",
        "tutor-teaching-assistant",
        "office-admin-receptionist",
      ]),
    );
  });

  it("listScenarios returns the same items as the SCENARIOS map", () => {
    const list = listScenarios();
    expect(list.length).toBe(ALL_SCENARIO_SLUGS.length);
    for (const s of list) {
      expect(SCENARIOS[s.slug]).toBe(s);
    }
  });

  it("getScenarioBySlug returns null for unknown slugs", () => {
    expect(getScenarioBySlug("not-a-real-slug")).toBeNull();
  });

  it("slugs are URL-safe (kebab-case, lowercase, no spaces)", () => {
    for (const slug of ALL_SCENARIO_SLUGS) {
      expect(slug).toMatch(/^[a-z][a-z0-9-]*$/);
    }
  });
});

describe("SCENARIOS — shape", () => {
  it.each(Object.values(SCENARIOS))(
    "$slug has every required top-level field",
    (scenario) => {
      for (const key of REQUIRED_TOP_LEVEL_KEYS) {
        expect(scenario[key]).toBeDefined();
      }
    },
  );

  it.each(Object.values(SCENARIOS))(
    "$slug has 5–8 questions",
    (scenario) => {
      expect(scenario.questions.length).toBeGreaterThanOrEqual(5);
      expect(scenario.questions.length).toBeLessThanOrEqual(8);
    },
  );

  it.each(Object.values(SCENARIOS))(
    "$slug industry and difficulty are valid",
    (scenario) => {
      expect(VALID_INDUSTRIES).toContain(scenario.industry);
      expect(VALID_DIFFICULTIES).toContain(scenario.difficulty);
    },
  );

  it.each(Object.values(SCENARIOS))(
    "$slug evaluation_criteria is a non-empty list of non-empty strings",
    (scenario) => {
      expect(scenario.evaluation_criteria.length).toBeGreaterThan(0);
      for (const item of scenario.evaluation_criteria) {
        expect(item.trim().length).toBeGreaterThan(0);
      }
    },
  );

  it.each(Object.values(SCENARIOS))(
    "$slug has VN+EN populated for every text field",
    (scenario) => {
      expect(scenario.title_vi.trim().length).toBeGreaterThan(0);
      expect(scenario.title_en.trim().length).toBeGreaterThan(0);
      expect(scenario.intro_vi.trim().length).toBeGreaterThan(0);
      expect(scenario.intro_en.trim().length).toBeGreaterThan(0);
    },
  );
});

describe("SCENARIOS — every question has full bilingual coverage", () => {
  for (const scenario of Object.values(SCENARIOS)) {
    for (let i = 0; i < scenario.questions.length; i += 1) {
      const q = scenario.questions[i];
      const path = `${scenario.slug}[Q${i + 1}]`;

      it(`${path} has every required question field`, () => {
        for (const key of REQUIRED_QUESTION_KEYS) {
          expect(q[key]).toBeDefined();
        }
      });

      it(`${path} text fields are non-empty in both languages`, () => {
        expect(q.prompt_vi.trim().length).toBeGreaterThan(0);
        expect(q.prompt_en.trim().length).toBeGreaterThan(0);
        expect(q.sample_answer_vi.trim().length).toBeGreaterThan(0);
        expect(q.sample_answer_en.trim().length).toBeGreaterThan(0);
      });

      it(`${path} coaching arrays are non-empty`, () => {
        expect(q.what_to_listen_for.length).toBeGreaterThan(0);
        expect(q.common_mistakes_vi.length).toBeGreaterThan(0);
        for (const tip of q.what_to_listen_for) {
          expect(tip.trim().length).toBeGreaterThan(0);
        }
        for (const mistake of q.common_mistakes_vi) {
          expect(mistake.trim().length).toBeGreaterThan(0);
        }
      });
    }
  }
});
