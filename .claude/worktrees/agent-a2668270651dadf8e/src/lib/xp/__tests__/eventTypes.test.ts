// src/lib/xp/__tests__/eventTypes.test.ts

import { describe, expect, it } from "vitest";

import {
  XP_EVENT_DEFS,
  defaultXPFor,
  getXPEventDef,
  labelFor,
} from "../eventTypes";

describe("XP_EVENT_DEFS — registry", () => {
  it("includes all nine canonical types from the brief", () => {
    const types = XP_EVENT_DEFS.map((d) => d.type).sort();
    expect(types).toEqual(
      [
        "challenge_complete",
        "drill_complete",
        "first_time_in_category",
        "lesson_complete",
        "listening_clip_complete",
        "perfect_score_lesson",
        "streak_day_continued",
        "streak_week_continued",
        "vocabulary_review_5_words",
      ].sort(),
    );
  });

  it("default rewards match the brief's numbers", () => {
    expect(defaultXPFor("lesson_complete")).toBe(10);
    expect(defaultXPFor("drill_complete")).toBe(5);
    expect(defaultXPFor("challenge_complete")).toBe(15);
    expect(defaultXPFor("vocabulary_review_5_words")).toBe(5);
    expect(defaultXPFor("streak_day_continued")).toBe(5);
    expect(defaultXPFor("streak_week_continued")).toBe(25);
    expect(defaultXPFor("first_time_in_category")).toBe(20);
    expect(defaultXPFor("perfect_score_lesson")).toBe(5);
    expect(defaultXPFor("listening_clip_complete")).toBe(8);
  });

  it("every entry has both VI and EN labels", () => {
    for (const def of XP_EVENT_DEFS) {
      expect(def.label_vi.trim().length).toBeGreaterThan(0);
      expect(def.label_en.trim().length).toBeGreaterThan(0);
    }
  });

  it("getXPEventDef returns the def by type", () => {
    const def = getXPEventDef("lesson_complete");
    expect(def).not.toBeNull();
    expect(def?.default_xp).toBe(10);
    expect(def?.requires_source_id).toBe(true);
  });

  it("vocabulary_review_5_words does not require source_id", () => {
    expect(getXPEventDef("vocabulary_review_5_words")?.requires_source_id).toBe(
      false,
    );
  });

  it("labelFor returns VI by default and EN when asked", () => {
    expect(labelFor("lesson_complete")).toBe("Hoàn thành bài học");
    expect(labelFor("lesson_complete", "en")).toBe("Lesson completed");
  });
});
