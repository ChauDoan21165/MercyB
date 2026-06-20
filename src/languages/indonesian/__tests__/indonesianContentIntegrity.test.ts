import { describe, expect, it } from "vitest";

import {
  INDONESIAN_LESSONS_BY_LEVEL,
  allIndonesianLessons,
  indonesianExtraLessonModules,
} from "../index";

describe("Indonesian content integrity", () => {
  it("registers A1 through C2 core lessons", () => {
    const levels = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

    expect(Object.keys(INDONESIAN_LESSONS_BY_LEVEL)).toEqual(levels);

    const totalByLevel = levels.reduce((sum, level) => {
      const lessons = INDONESIAN_LESSONS_BY_LEVEL[level];
      expect(lessons.length).toBeGreaterThan(0);
      return sum + lessons.length;
    }, 0);

    expect(allIndonesianLessons.length).toBe(totalByLevel);
  });

  it("keeps Indonesian extra lesson modules discoverable", () => {
    const extraPaths = Object.keys(indonesianExtraLessonModules);

    expect(extraPaths.length).toBeGreaterThan(100);
    expect(extraPaths.some((path) => path.includes("medical-vocabulary"))).toBe(true);
    expect(extraPaths.some((path) => path.includes("workplace-culture"))).toBe(true);
  });
});
