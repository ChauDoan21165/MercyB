import { describe, expect, test } from "vitest";
import {
  CEFR_LEVELS,
  CEFR_SUBSKILLS,
  KNOWN_L1_INTERFERENCE_IDS,
  PLACEMENT_V3_PROMPTS,
} from "../prompts";
import {
  PLACEMENT_V3_CALIBRATION_CORPUS,
  WRITING_CALIBRATION_CORPUS,
  SPEAKING_CALIBRATION_CORPUS,
  READING_CALIBRATION_CORPUS,
  LISTENING_CALIBRATION_CORPUS,
  type CalibrationEntry,
} from "../calibration";

const VALID_CEFR_LEVELS = new Set<string>(CEFR_LEVELS);
const VALID_SUBSKILLS = new Set<string>(CEFR_SUBSKILLS);
const VALID_L1_IDS = new Set<string>(KNOWN_L1_INTERFERENCE_IDS);
const PROMPTS_BY_ID = new Map(PLACEMENT_V3_PROMPTS.map((prompt) => [prompt.id, prompt]));

function expectCalibrationShape(entry: CalibrationEntry) {
  expect(entry.id, entry.id).toMatch(/^cal-[a-z0-9]+(?:-[a-z0-9]+)*$/);
  expect(entry.promptId.trim().length, entry.id).toBeGreaterThan(0);
  expect(entry.modality.trim().length, entry.id).toBeGreaterThan(0);
  expect(VALID_CEFR_LEVELS.has(entry.expectedLevel), entry.id).toBe(true);
  expect(Object.keys(entry.expectedSubskills).length, entry.id).toBeGreaterThan(0);
  expect(entry.userResponse.trim().length, entry.id).toBeGreaterThan(0);
  expect(entry.expertNotes.trim().length, entry.id).toBeGreaterThan(0);
  expect(["clear", "borderline", "tricky"], entry.id).toContain(entry.difficulty);

  Object.entries(entry.expectedSubskills).forEach(([subskill, level]) => {
    expect(VALID_SUBSKILLS.has(subskill), `${entry.id} -> ${subskill}`).toBe(true);
    expect(VALID_CEFR_LEVELS.has(level), `${entry.id} -> ${subskill}:${level}`).toBe(true);
  });

  entry.expectedL1Flags.forEach((patternId) => {
    expect(VALID_L1_IDS.has(patternId), `${entry.id} -> ${patternId}`).toBe(true);
  });
}

describe("Placement V3 calibration corpus", () => {
  test("has the expected minimum entry counts", () => {
    expect(WRITING_CALIBRATION_CORPUS.length).toBeGreaterThanOrEqual(12);
    expect(SPEAKING_CALIBRATION_CORPUS.length).toBeGreaterThanOrEqual(12);
    expect(READING_CALIBRATION_CORPUS.length).toBeGreaterThanOrEqual(8);
    expect(LISTENING_CALIBRATION_CORPUS.length).toBeGreaterThanOrEqual(8);
    expect(PLACEMENT_V3_CALIBRATION_CORPUS.length).toBeGreaterThanOrEqual(40);
  });

  test("every entry has required fields", () => {
    PLACEMENT_V3_CALIBRATION_CORPUS.forEach(expectCalibrationShape);
  });

  test("every calibration ID is unique", () => {
    const ids = PLACEMENT_V3_CALIBRATION_CORPUS.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("promptId references an existing prompt with matching modality and acceptable level", () => {
    PLACEMENT_V3_CALIBRATION_CORPUS.forEach((entry) => {
      const prompt = PROMPTS_BY_ID.get(entry.promptId);
      expect(prompt, entry.id).toBeDefined();
      expect(prompt?.modality, entry.id).toBe(entry.modality);
      expect(prompt?.acceptableLevels, entry.id).toContain(entry.expectedLevel);
    });
  });

  test("each calibrated modality has borderline and tricky entries", () => {
    const corpora = [
      WRITING_CALIBRATION_CORPUS,
      SPEAKING_CALIBRATION_CORPUS,
      READING_CALIBRATION_CORPUS,
      LISTENING_CALIBRATION_CORPUS,
    ];

    corpora.forEach((corpus) => {
      expect(corpus.some((entry) => entry.difficulty === "borderline")).toBe(true);
      expect(corpus.some((entry) => entry.difficulty === "tricky")).toBe(true);
    });
  });

  test("writing and speaking calibration cover every CEFR level twice", () => {
    for (const level of CEFR_LEVELS) {
      expect(
        WRITING_CALIBRATION_CORPUS.filter((entry) => entry.expectedLevel === level).length,
        `writing ${level}`,
      ).toBeGreaterThanOrEqual(2);
      expect(
        SPEAKING_CALIBRATION_CORPUS.filter((entry) => entry.expectedLevel === level).length,
        `speaking ${level}`,
      ).toBeGreaterThanOrEqual(2);
    }
  });

  test("corpus includes rich Vietnamese L1 interference examples", () => {
    const richEntries = PLACEMENT_V3_CALIBRATION_CORPUS.filter(
      (entry) => entry.expectedL1Flags.length >= 3,
    );
    expect(richEntries.length).toBeGreaterThanOrEqual(3);
  });
});
