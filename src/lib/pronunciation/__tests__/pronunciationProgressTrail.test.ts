import { describe, expect, it } from "vitest";

import {
  appendPronunciationProgress,
  buildPronunciationProgressDisplay,
  PRONUNCIATION_PROGRESS_MAX_ENTRIES,
  type PronunciationProgressEntry,
} from "../pronunciationProgressTrail";

describe("appendPronunciationProgress", () => {
  it("appends without mutating the previous array", () => {
    const previous: PronunciationProgressEntry[] = [
      { status: "try_again", score: 40 },
    ];
    const next = appendPronunciationProgress(previous, {
      status: "correct",
      score: 88,
    });

    expect(next).toHaveLength(2);
    expect(previous).toHaveLength(1);
    expect(next[1]).toEqual({ status: "correct", score: 88 });
  });

  it("keeps only the most recent entries up to the cap", () => {
    let trail: PronunciationProgressEntry[] = [];
    for (let i = 0; i < PRONUNCIATION_PROGRESS_MAX_ENTRIES + 3; i += 1) {
      trail = appendPronunciationProgress(trail, {
        status: "try_again",
        score: i,
      });
    }

    expect(trail).toHaveLength(PRONUNCIATION_PROGRESS_MAX_ENTRIES);
    // Oldest entries dropped; the last appended score survives.
    expect(trail[trail.length - 1].score).toBe(
      PRONUNCIATION_PROGRESS_MAX_ENTRIES + 2,
    );
    expect(trail[0].score).toBe(3);
  });
});

describe("buildPronunciationProgressDisplay", () => {
  it("returns null until there are at least two supported attempts", () => {
    expect(buildPronunciationProgressDisplay([])).toBeNull();
    expect(
      buildPronunciationProgressDisplay([{ status: "correct", score: 90 }]),
    ).toBeNull();
  });

  it("marks crossing from try_again to correct as improving", () => {
    const display = buildPronunciationProgressDisplay([
      { status: "try_again", score: 50 },
      { status: "correct", score: 70 },
    ]);

    expect(display?.trend).toBe("improving");
    expect(display?.latestStatus).toBe("correct");
    expect(display?.attemptCount).toBe(2);
    expect(display?.headlineVi).toContain("tiến bộ");
  });

  it("treats two correct attempts as steady", () => {
    const display = buildPronunciationProgressDisplay([
      { status: "correct", score: 88 },
      { status: "correct", score: 91 },
    ]);

    expect(display?.trend).toBe("steady");
    expect(display?.headlineVi).toContain("giữ phong độ");
  });

  it("uses score delta when both attempts are try_again", () => {
    const improving = buildPronunciationProgressDisplay([
      { status: "try_again", score: 40 },
      { status: "try_again", score: 55 },
    ]);
    expect(improving?.trend).toBe("improving");

    const steady = buildPronunciationProgressDisplay([
      { status: "try_again", score: 50 },
      { status: "try_again", score: 51 },
    ]);
    expect(steady?.trend).toBe("steady");
  });

  it("frames a dip as keep_going, never as a regression or failure", () => {
    const display = buildPronunciationProgressDisplay([
      { status: "correct", score: 80 },
      { status: "try_again", score: 60 },
    ]);

    expect(display?.trend).toBe("keep_going");
    const text = `${display?.headlineVi} ${display?.headlineEn}`.toLowerCase();
    expect(text).not.toContain("worse");
    expect(text).not.toContain("fail");
    expect(text).not.toContain("thất bại");
    expect(text).not.toContain("kém");
  });

  it("falls back to keep_going for correct -> try_again without scores", () => {
    const display = buildPronunciationProgressDisplay([
      { status: "correct", score: null },
      { status: "try_again", score: null },
    ]);

    expect(display?.trend).toBe("keep_going");
  });
});
