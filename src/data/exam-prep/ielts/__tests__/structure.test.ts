// src/data/exam-prep/ielts/__tests__/structure.test.ts
//
// Sanity tests on the IELTS structure constants — protects the band
// estimator + UI from drift if the durations or counts are edited.

import { describe, it, expect } from "vitest";
import {
  getSection,
  IELTS_SECTIONS,
  IELTS_SPEAKING_PARTS,
  IELTS_WRITING_TASKS,
  secondsToMinutes,
} from "../structure";

describe("IELTS_SECTIONS", () => {
  it("exposes exactly the four canonical sections", () => {
    const ids = IELTS_SECTIONS.map((s) => s.id).sort();
    expect(ids).toEqual(["listening", "reading", "speaking", "writing"]);
  });

  it("listening is 30 minutes / 40 questions", () => {
    const s = getSection("listening");
    expect(s?.durationSec).toBe(30 * 60);
    expect(s?.questionCount).toBe(40);
  });

  it("reading is 60 minutes / 40 questions", () => {
    const s = getSection("reading");
    expect(s?.durationSec).toBe(60 * 60);
    expect(s?.questionCount).toBe(40);
  });

  it("writing is 60 minutes / 2 tasks", () => {
    const s = getSection("writing");
    expect(s?.durationSec).toBe(60 * 60);
    expect(s?.questionCount).toBe(2);
  });

  it("speaking is 11–14 minutes (we model 14)", () => {
    const s = getSection("speaking");
    expect(s?.durationSec).toBe(14 * 60);
    expect(s?.questionCount).toBeNull();
  });
});

describe("IELTS_WRITING_TASKS", () => {
  it("Task 1 wants 150 words / 20 minutes", () => {
    const t = IELTS_WRITING_TASKS.find((x) => x.id === "writing_task_1");
    expect(t?.minWords).toBe(150);
    expect(t?.recommendedSec).toBe(20 * 60);
  });

  it("Task 2 wants 250 words / 40 minutes", () => {
    const t = IELTS_WRITING_TASKS.find((x) => x.id === "writing_task_2");
    expect(t?.minWords).toBe(250);
    expect(t?.recommendedSec).toBe(40 * 60);
  });
});

describe("IELTS_SPEAKING_PARTS", () => {
  it("exposes three parts in order", () => {
    expect(IELTS_SPEAKING_PARTS.map((p) => p.id)).toEqual([
      "speaking_part_1",
      "speaking_part_2",
      "speaking_part_3",
    ]);
  });
});

describe("secondsToMinutes", () => {
  it("rounds to nearest minute", () => {
    expect(secondsToMinutes(60)).toBe(1);
    expect(secondsToMinutes(89)).toBe(1);
    expect(secondsToMinutes(90)).toBe(2);
    expect(secondsToMinutes(0)).toBe(0);
  });
});
