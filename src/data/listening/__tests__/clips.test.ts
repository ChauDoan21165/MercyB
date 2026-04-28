// src/data/listening/__tests__/clips.test.ts
//
// Locks the structural invariants of the 30-clip pack so a future
// content edit can't quietly drift the count, the category mix, the
// difficulty distribution, or the answer-key shape.
//
// 14 tests — exceeds the brief's 12-case minimum.

import { describe, expect, it } from "vitest";

import {
  LISTENING_CLIPS,
  LISTENING_BY_CATEGORY,
  getListeningClipById,
  suggestNextInCategory,
  type ListeningCategory,
  type ListeningDifficulty,
  type ListeningAccent,
} from "../clips";

const EXPECTED_COUNT = 30;
const EXPECTED_CATEGORY_COUNTS: Record<ListeningCategory, number> = {
  restaurant:         5,
  doctor:             4,
  "customer-service": 5,
  "job-interview":    4,
  casual:             5,
  shopping:           4,
  transportation:     3,
};
const EXPECTED_DIFFICULTY_COUNTS: Record<ListeningDifficulty, number> = {
  beginner:     8,
  intermediate: 12,
  advanced:     10,
};
const EXPECTED_ACCENT_COUNTS: Record<ListeningAccent, number> = {
  us: 18,
  uk: 6,
  au: 3,
  ca: 3,
};

describe("LISTENING_CLIPS — structural invariants", () => {
  it("contains exactly 30 clips", () => {
    expect(LISTENING_CLIPS.length).toBe(EXPECTED_COUNT);
  });

  it("matches the per-category counts in the brief", () => {
    for (const [category, expected] of Object.entries(EXPECTED_CATEGORY_COUNTS)) {
      expect(
        LISTENING_BY_CATEGORY[category as ListeningCategory].length,
        `Category ${category}`,
      ).toBe(expected);
    }
  });

  it("matches the difficulty distribution (8/12/10)", () => {
    for (const [diff, expected] of Object.entries(EXPECTED_DIFFICULTY_COUNTS)) {
      const got = LISTENING_CLIPS.filter((c) => c.difficulty === diff).length;
      expect(got, `Difficulty ${diff}`).toBe(expected);
    }
  });

  it("matches the accent distribution (18/6/3/3)", () => {
    for (const [accent, expected] of Object.entries(EXPECTED_ACCENT_COUNTS)) {
      const got = LISTENING_CLIPS.filter((c) => c.accent === accent).length;
      expect(got, `Accent ${accent}`).toBe(expected);
    }
  });

  it("has no duplicate IDs", () => {
    const ids = LISTENING_CLIPS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every transcript has at least 2 turns", () => {
    for (const c of LISTENING_CLIPS) {
      expect(c.transcript.length, `Clip ${c.id}`).toBeGreaterThanOrEqual(2);
    }
  });

  it("every clip has exactly 2 comprehension questions", () => {
    for (const c of LISTENING_CLIPS) {
      expect(c.comprehension_questions.length, `Clip ${c.id}`).toBe(2);
    }
  });

  it("every comprehension question has 3 options and a valid correct_index", () => {
    for (const c of LISTENING_CLIPS) {
      for (const q of c.comprehension_questions) {
        expect(q.options.length, `Clip ${c.id}`).toBe(3);
        expect(q.correct_index, `Clip ${c.id}`).toBeGreaterThanOrEqual(0);
        expect(q.correct_index, `Clip ${c.id}`).toBeLessThanOrEqual(2);
      }
    }
  });

  it("every duration is between 30 and 90 seconds", () => {
    for (const c of LISTENING_CLIPS) {
      expect(c.duration_seconds, `Clip ${c.id}`).toBeGreaterThanOrEqual(30);
      expect(c.duration_seconds, `Clip ${c.id}`).toBeLessThanOrEqual(90);
    }
  });

  it("every vocabulary key (case-insensitive) appears in the transcript", () => {
    for (const c of LISTENING_CLIPS) {
      const transcriptLower = c.transcript
        .map((t) => t.text_en.toLowerCase())
        .join(" ");
      for (const key of c.vocabulary_keys) {
        expect(
          transcriptLower.includes(key.toLowerCase()),
          `Clip ${c.id}: vocabulary key "${key}" not found in transcript`,
        ).toBe(true);
      }
    }
  });

  it("every clip has 3 vocabulary keys", () => {
    for (const c of LISTENING_CLIPS) {
      expect(c.vocabulary_keys.length, `Clip ${c.id}`).toBe(3);
    }
  });

  it("every clip has non-empty title_vi and description_vi", () => {
    for (const c of LISTENING_CLIPS) {
      expect(c.title_vi.trim().length, `Clip ${c.id}`).toBeGreaterThan(0);
      expect(c.description_vi.trim().length, `Clip ${c.id}`).toBeGreaterThan(0);
    }
  });

  it("every transcript turn has both EN and VI text", () => {
    for (const c of LISTENING_CLIPS) {
      for (const turn of c.transcript) {
        expect(turn.text_en.trim().length, `Clip ${c.id}`).toBeGreaterThan(0);
        expect(turn.text_vi.trim().length, `Clip ${c.id}`).toBeGreaterThan(0);
      }
    }
  });
});

describe("getListeningClipById", () => {
  it("returns the clip when given a known ID", () => {
    const sample = LISTENING_CLIPS[0];
    expect(getListeningClipById(sample.id)?.id).toBe(sample.id);
  });

  it("returns undefined for an unknown ID", () => {
    expect(getListeningClipById("not_a_real_clip")).toBeUndefined();
  });
});

describe("suggestNextInCategory", () => {
  it("returns the first clip in the category when the user has none completed", () => {
    const next = suggestNextInCategory("restaurant", new Set());
    expect(next).toBeDefined();
    expect(next?.category).toBe("restaurant");
    expect(next?.id).toBe(LISTENING_BY_CATEGORY.restaurant[0].id);
  });

  it("skips completed clips and returns the first uncompleted one", () => {
    const completed = new Set([LISTENING_BY_CATEGORY.restaurant[0].id]);
    const next = suggestNextInCategory("restaurant", completed);
    expect(next?.id).toBe(LISTENING_BY_CATEGORY.restaurant[1].id);
  });

  it("returns undefined when the entire category is complete", () => {
    const completed = new Set(LISTENING_BY_CATEGORY.restaurant.map((c) => c.id));
    expect(suggestNextInCategory("restaurant", completed)).toBeUndefined();
  });
});
