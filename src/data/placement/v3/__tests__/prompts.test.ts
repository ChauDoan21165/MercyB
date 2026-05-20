import { describe, expect, test } from "vitest";
import {
  CEFR_LEVELS,
  KNOWN_L1_INTERFERENCE_IDS,
  PLACEMENT_V3_PROMPTS,
  READING_PLACEMENT_PROMPTS,
  WRITING_PLACEMENT_PROMPTS,
  SPEAKING_PLACEMENT_PROMPTS,
  LISTENING_PLACEMENT_PROMPTS,
  CONVERSATION_PLACEMENT_PROMPTS,
  type CEFRLevel,
  type PlacementPrompt,
} from "../prompts";

const VALID_CEFR_LEVELS = new Set<string>(CEFR_LEVELS);
const VALID_L1_IDS = new Set<string>(KNOWN_L1_INTERFERENCE_IDS);
const LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

function expectBasePromptShape(prompt: PlacementPrompt) {
  expect(prompt.id, prompt.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  expect(prompt.modality.trim().length, prompt.id).toBeGreaterThan(0);
  expect(VALID_CEFR_LEVELS.has(prompt.targetLevel), prompt.id).toBe(true);
  expect(prompt.acceptableLevels.length, prompt.id).toBeGreaterThan(0);
  expect(prompt.acceptableLevels, prompt.id).toContain(prompt.targetLevel);
  expect(prompt.promptText.trim().length, prompt.id).toBeGreaterThan(0);
  expect(prompt.promptTextVi.trim().length, prompt.id).toBeGreaterThan(0);
  expect(prompt.expectedDurationSec, prompt.id).toBeGreaterThan(0);
  expect(prompt.minResponseLength, prompt.id).toBeGreaterThan(0);
  expect(prompt.rubricFocus.length, prompt.id).toBeGreaterThan(0);
  expect(prompt.l1InterferenceTriggers.length, prompt.id).toBeGreaterThan(0);

  prompt.acceptableLevels.forEach((level) => {
    expect(VALID_CEFR_LEVELS.has(level), `${prompt.id} -> ${level}`).toBe(true);
  });

  prompt.rubricFocus.forEach((focus) => {
    expect(focus.trim().length, `${prompt.id} rubricFocus`).toBeGreaterThan(0);
  });

  prompt.l1InterferenceTriggers.forEach((patternId) => {
    expect(VALID_L1_IDS.has(patternId), `${prompt.id} -> ${patternId}`).toBe(true);
  });
}

describe("Placement V3 prompt library", () => {
  test("has the expected prompt counts by modality", () => {
    expect(WRITING_PLACEMENT_PROMPTS).toHaveLength(12);
    expect(SPEAKING_PLACEMENT_PROMPTS).toHaveLength(12);
    expect(READING_PLACEMENT_PROMPTS).toHaveLength(8);
    expect(LISTENING_PLACEMENT_PROMPTS).toHaveLength(6);
    expect(CONVERSATION_PLACEMENT_PROMPTS).toHaveLength(6);
    expect(PLACEMENT_V3_PROMPTS).toHaveLength(44);
  });

  test("every prompt ID is unique", () => {
    const ids = PLACEMENT_V3_PROMPTS.map((prompt) => prompt.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("every prompt has required fields and valid L1 trigger IDs", () => {
    PLACEMENT_V3_PROMPTS.forEach(expectBasePromptShape);
  });

  test("writing and speaking have at least 2 prompts per CEFR level", () => {
    for (const level of LEVELS) {
      expect(
        WRITING_PLACEMENT_PROMPTS.filter((prompt) => prompt.targetLevel === level).length,
        `writing ${level}`,
      ).toBeGreaterThanOrEqual(2);
      expect(
        SPEAKING_PLACEMENT_PROMPTS.filter((prompt) => prompt.targetLevel === level).length,
        `speaking ${level}`,
      ).toBeGreaterThanOrEqual(2);
    }
  });

  test("reading prompts include passages and comprehension questions", () => {
    READING_PLACEMENT_PROMPTS.forEach((prompt) => {
      expect(prompt.passageText.trim().length, prompt.id).toBeGreaterThan(0);
      expect(prompt.passageTextVi.trim().length, prompt.id).toBeGreaterThan(0);
      expect(prompt.questions.length, prompt.id).toBeGreaterThanOrEqual(2);
      prompt.questions.forEach((question) => {
        expect(question.id.trim().length, prompt.id).toBeGreaterThan(0);
        expect(question.questionText.trim().length, question.id).toBeGreaterThan(0);
        expect(question.questionTextVi.trim().length, question.id).toBeGreaterThan(0);
        expect(question.correctAnswer?.trim().length, question.id).toBeGreaterThan(0);
      });
    });
  });

  test("listening prompts include future audio scripts and comprehension questions", () => {
    LISTENING_PLACEMENT_PROMPTS.forEach((prompt) => {
      expect(prompt.audioScript.trim().length, prompt.id).toBeGreaterThan(0);
      expect(prompt.audioScriptVi.trim().length, prompt.id).toBeGreaterThan(0);
      expect(prompt.questions.length, prompt.id).toBeGreaterThanOrEqual(2);
      prompt.questions.forEach((question) => {
        expect(question.id.trim().length, prompt.id).toBeGreaterThan(0);
        expect(question.questionText.trim().length, question.id).toBeGreaterThan(0);
        expect(question.questionTextVi.trim().length, question.id).toBeGreaterThan(0);
        expect(question.correctAnswer?.trim().length, question.id).toBeGreaterThan(0);
      });
    });
  });
});
