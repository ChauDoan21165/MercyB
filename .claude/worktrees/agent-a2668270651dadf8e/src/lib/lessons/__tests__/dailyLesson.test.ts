import { describe, it, expect, beforeEach } from "vitest";

import {
  getDailyLesson,
  isDailyLessonCompletedToday,
  markDailyLessonStarted,
  todayISO,
} from "@/lib/lessons/dailyLesson";
import {
  ANONYMOUS_STARTER_LESSON,
  DAILY_LESSONS,
} from "@/data/dailyLessons";

describe("getDailyLesson", () => {
  it("returns the static starter lesson for anonymous users", () => {
    expect(getDailyLesson(undefined)).toBe(ANONYMOUS_STARTER_LESSON);
    expect(getDailyLesson(null)).toBe(ANONYMOUS_STARTER_LESSON);
  });

  it("returns the same lesson for the same user on the same day", () => {
    const day = new Date("2026-04-26T10:00:00");
    const a = getDailyLesson("user-123", day);
    const b = getDailyLesson("user-123", day);
    expect(a.roomId).toBe(b.roomId);
  });

  it("returns a different lesson on a different day for the same user", () => {
    const userId = "user-123";
    const seen = new Set<string>();
    for (let d = 1; d <= 14; d++) {
      const day = new Date(`2026-04-${String(d).padStart(2, "0")}T10:00:00`);
      seen.add(getDailyLesson(userId, day).roomId);
    }
    // 14 days should produce more than one distinct lesson.
    expect(seen.size).toBeGreaterThan(1);
  });

  it("returns different rotations for different users on the same day", () => {
    const day = new Date("2026-04-26T10:00:00");
    const seen = new Set<string>();
    for (let i = 0; i < 30; i++) {
      seen.add(getDailyLesson(`user-${i}`, day).roomId);
    }
    expect(seen.size).toBeGreaterThan(1);
  });

  it("only ever returns curated rooms or the anonymous starter", () => {
    const validIds = new Set([
      ...DAILY_LESSONS.map((l) => l.roomId),
      ANONYMOUS_STARTER_LESSON.roomId,
    ]);
    const day = new Date("2026-04-26T10:00:00");
    for (let i = 0; i < 50; i++) {
      const lesson = getDailyLesson(`user-${i}`, day);
      expect(validIds.has(lesson.roomId)).toBe(true);
    }
  });
});

describe("DAILY_LESSONS curation", () => {
  it("has at least 30 entries", () => {
    expect(DAILY_LESSONS.length).toBeGreaterThanOrEqual(30);
  });

  it("has bilingual title and description on every entry", () => {
    for (const entry of DAILY_LESSONS) {
      expect(entry.title_vi).toBeTruthy();
      expect(entry.title_en).toBeTruthy();
      expect(entry.description_vi).toBeTruthy();
      expect(entry.description_en).toBeTruthy();
      expect(entry.duration_minutes).toBeGreaterThan(0);
    }
  });

  it("uses unique room ids (no duplicates in rotation)", () => {
    const ids = DAILY_LESSONS.map((l) => l.roomId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("markDailyLessonStarted / isDailyLessonCompletedToday", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns false before the user starts today's lesson", () => {
    expect(isDailyLessonCompletedToday("user-1")).toBe(false);
  });

  it("returns true after marking started for the same user/day", () => {
    markDailyLessonStarted("user-1");
    expect(isDailyLessonCompletedToday("user-1")).toBe(true);
  });

  it("isolates state per user", () => {
    markDailyLessonStarted("user-1");
    expect(isDailyLessonCompletedToday("user-2")).toBe(false);
  });

  it("does not bleed across days", () => {
    const yesterday = new Date("2026-04-25T10:00:00");
    const today = new Date("2026-04-26T10:00:00");
    markDailyLessonStarted("user-1", yesterday);
    expect(isDailyLessonCompletedToday("user-1", today)).toBe(false);
  });
});

describe("todayISO", () => {
  it("formats as YYYY-MM-DD with zero-padded month and day", () => {
    expect(todayISO(new Date("2026-04-06T03:00:00"))).toBe("2026-04-06");
    expect(todayISO(new Date("2026-12-31T23:59:00"))).toBe("2026-12-31");
  });
});
