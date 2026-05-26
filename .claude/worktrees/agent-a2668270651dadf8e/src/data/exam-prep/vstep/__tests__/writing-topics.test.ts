// src/data/exam-prep/vstep/__tests__/writing-topics.test.ts

import { describe, it, expect } from "vitest";
import { VSTEP_WRITING_TOPICS } from "../writing-topics";

describe("VSTEP_WRITING_TOPICS", () => {
  it("has at least 6 topics", () => {
    expect(VSTEP_WRITING_TOPICS.length).toBeGreaterThanOrEqual(6);
  });

  it("every topic has a valid id matching vstep_b[12]_writing_*", () => {
    for (const t of VSTEP_WRITING_TOPICS) {
      expect(t.id).toMatch(/^vstep_b[12]_writing_[a-z0-9_]+$/);
    }
  });

  it("every topic has level B1 or B2", () => {
    for (const t of VSTEP_WRITING_TOPICS) {
      expect(["B1", "B2"]).toContain(t.level);
    }
  });

  it("every topic has a valid task type", () => {
    const valid = ["task1_email", "task1_letter", "task2_essay"];
    for (const t of VSTEP_WRITING_TOPICS) {
      expect(valid).toContain(t.task);
    }
  });

  it("every topic has non-empty prompt_en and prompt_vi", () => {
    for (const t of VSTEP_WRITING_TOPICS) {
      expect(t.prompt_en.length).toBeGreaterThan(20);
      expect(t.prompt_vi.length).toBeGreaterThan(20);
    }
  });

  it("every topic has valid wordCount range", () => {
    for (const t of VSTEP_WRITING_TOPICS) {
      expect(t.wordCount.min).toBeGreaterThan(0);
      expect(t.wordCount.max).toBeGreaterThan(t.wordCount.min);
    }
  });

  it("every topic has a non-empty sampleAnswer", () => {
    for (const t of VSTEP_WRITING_TOPICS) {
      expect(t.sampleAnswer.length).toBeGreaterThan(50);
    }
  });

  it("every topic has at least 2 bandDescriptors", () => {
    for (const t of VSTEP_WRITING_TOPICS) {
      expect(t.bandDescriptors.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("every bandDescriptor has band B1, B2, or C1", () => {
    const validBands = ["B1", "B2", "C1"];
    for (const t of VSTEP_WRITING_TOPICS) {
      for (const d of t.bandDescriptors) {
        expect(validBands).toContain(d.band);
        expect(d.description_en.length).toBeGreaterThan(10);
        expect(d.description_vi.length).toBeGreaterThan(10);
      }
    }
  });

  it("every topic has at least 3 vietnameseLearnerTips", () => {
    for (const t of VSTEP_WRITING_TOPICS) {
      expect(t.vietnameseLearnerTips.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("every topic has a positive estimatedTimeMinutes", () => {
    for (const t of VSTEP_WRITING_TOPICS) {
      expect(t.estimatedTimeMinutes).toBeGreaterThan(0);
    }
  });
});
