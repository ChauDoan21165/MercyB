import { describe, expect, it } from "vitest";
import {
  VSTEP_B1_TOPICS,
  VSTEP_B2_TOPICS,
  VSTEP_SPEAKING_TOPICS,
  findVstepTopicById,
} from "../speaking-topics";

describe("VSTEP_SPEAKING_TOPICS catalogue shape", () => {
  it("contains exactly 30 topics (15 B1 + 15 B2)", () => {
    expect(VSTEP_SPEAKING_TOPICS).toHaveLength(30);
    expect(VSTEP_B1_TOPICS).toHaveLength(15);
    expect(VSTEP_B2_TOPICS).toHaveLength(15);
  });

  it("covers all three speaking parts at each level", () => {
    const levels = ["B1", "B2"] as const;
    for (const lvl of levels) {
      const topics = VSTEP_SPEAKING_TOPICS.filter((t) => t.level === lvl);
      const partCounts = new Map<number, number>();
      for (const t of topics) {
        partCounts.set(t.part, (partCounts.get(t.part) ?? 0) + 1);
      }
      expect(partCounts.get(1) ?? 0).toBeGreaterThan(0);
      expect(partCounts.get(2) ?? 0).toBeGreaterThan(0);
      expect(partCounts.get(3) ?? 0).toBeGreaterThan(0);
    }
  });

  it("every topic id is unique and follows the documented prefix", () => {
    const ids = new Set<string>();
    for (const t of VSTEP_SPEAKING_TOPICS) {
      expect(t.id).toMatch(/^vstep_b[12]_speaking_/);
      expect(ids.has(t.id)).toBe(false);
      ids.add(t.id);
    }
  });

  it("every topic carries bilingual title + description and sample questions", () => {
    for (const t of VSTEP_SPEAKING_TOPICS) {
      expect(t.topic_title_vi.trim().length).toBeGreaterThan(0);
      expect(t.topic_title_en.trim().length).toBeGreaterThan(0);
      expect(t.description_vi.trim().length).toBeGreaterThan(0);
      expect(t.description_en.trim().length).toBeGreaterThan(0);
      expect(t.sample_questions.length).toBeGreaterThanOrEqual(3);
      expect(t.sample_questions.length).toBeLessThanOrEqual(8);
    }
  });

  it("every topic provides at least 5 Vietnamese-speaker tips", () => {
    for (const t of VSTEP_SPEAKING_TOPICS) {
      expect(t.vietnamese_speaker_tips.length).toBeGreaterThanOrEqual(5);
    }
  });

  it("every vocabulary entry has IPA, VI translation, and CEFR level", () => {
    for (const t of VSTEP_SPEAKING_TOPICS) {
      expect(t.key_vocabulary.length).toBeGreaterThanOrEqual(3);
      for (const v of t.key_vocabulary) {
        expect(v.word.trim().length).toBeGreaterThan(0);
        expect(v.translation_vi.trim().length).toBeGreaterThan(0);
        expect(v.pronunciation_ipa).toMatch(/^\/.+\/$/);
        expect(["A2", "B1", "B2", "C1"]).toContain(v.level);
      }
    }
  });

  it("estimated time matches the typical part length", () => {
    for (const t of VSTEP_SPEAKING_TOPICS) {
      if (t.part === 1) expect(t.estimated_time_minutes).toBe(3);
      if (t.part === 2) expect(t.estimated_time_minutes).toBe(4);
      if (t.part === 3) expect(t.estimated_time_minutes).toBe(5);
    }
  });

  it("every topic has audioIntroKey matching vstep-speaking/{id}/intro.mp3", () => {
    for (const t of VSTEP_SPEAKING_TOPICS) {
      expect(t.audioIntroKey).toBe(`vstep-speaking/${t.id}/intro.mp3`);
    }
  });

  it("every topic has audioQuestionKeys matching vstep-speaking/{id}/qN.mp3 with correct count", () => {
    for (const t of VSTEP_SPEAKING_TOPICS) {
      expect(t.audioQuestionKeys).toHaveLength(t.sample_questions.length);
      for (let i = 0; i < t.sample_questions.length; i++) {
        expect(t.audioQuestionKeys[i]).toBe(`vstep-speaking/${t.id}/q${i + 1}.mp3`);
      }
    }
  });

  it("every topic provides bilingual band descriptors", () => {
    for (const t of VSTEP_SPEAKING_TOPICS) {
      expect(t.typical_band_descriptors.length).toBeGreaterThanOrEqual(3);
      for (const b of t.typical_band_descriptors) {
        expect(b.criteria_vi.trim().length).toBeGreaterThan(0);
        expect(b.criteria_en.trim().length).toBeGreaterThan(0);
        expect(b.band).toMatch(/B[12]/);
      }
    }
  });
});

describe("findVstepTopicById", () => {
  it("returns the topic when the id exists", () => {
    const t = findVstepTopicById("vstep_b1_speaking_family");
    expect(t).toBeDefined();
    expect(t?.level).toBe("B1");
    expect(t?.part).toBe(1);
  });

  it("returns undefined for unknown ids", () => {
    expect(findVstepTopicById("vstep_nope")).toBeUndefined();
  });
});
