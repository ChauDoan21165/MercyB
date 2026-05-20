import { describe, expect, it } from "vitest";

import {
  buildLessonPracticePath,
  resolveLessonPracticeSession,
  resolveStandalonePracticeText,
  roomIdForLessonPractice,
} from "../lessonPractice";

describe("lessonPractice", () => {
  it("builds a Speak route for IELTS speaking lesson practice", () => {
    expect(
      buildLessonPracticePath({
        source: "ielts-speaking",
        lessonId: "ielts_speaking_part1_hometown",
      }),
    ).toBe("/speak?lessonSource=ielts-speaking&lessonId=ielts_speaking_part1_hometown");
  });

  it("resolves IELTS speaking samples into a guided sentence queue", () => {
    const params = new URLSearchParams(
      "lessonSource=ielts-speaking&lessonId=ielts_speaking_part1_hometown",
    );

    const session = resolveLessonPracticeSession(params);

    expect(session?.roomId).toBe(
      roomIdForLessonPractice("ielts-speaking", "ielts_speaking_part1_hometown"),
    );
    expect(session?.title).toContain("Hometown");
    expect(session?.sentences.length).toBeGreaterThan(2);
    expect(session?.sentences[0].target_en).toContain("Đà Nẵng");
    expect(session?.sentences[0].context).toBe("ielts_band_7_sample");
  });

  it("keeps the legacy practice text param usable on /speak", () => {
    const sentences = resolveStandalonePracticeText(
      new URLSearchParams("practice=Hello%20there.%20How%20are%20you%3F"),
    );

    expect(sentences?.map((s) => s.target_en)).toEqual([
      "Hello there.",
      "How are you?",
    ]);
  });
});
