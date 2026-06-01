import { describe, it, expect } from "vitest";

import { buildKoreanCandidates, type KoreanLessonLike } from "../koreanLessons";

const FAKE: KoreanLessonLike[] = [
  {
    level: "A1",
    sentences: [
      { korean: "안녕하세요", romanized: "annyeonghaseyo", en: "hello", vi: "Xin chào" },
      { korean: "  ", romanized: "x", en: "x", vi: "trống back" }, // empty hangul → skipped
      { korean: "감사합니다", romanized: "  ", en: "thanks", vi: "trống reading" }, // empty romaja → skipped
      { korean: "네", romanized: "ne", en: "yes", vi: "  " }, // empty vi front → skipped
    ],
  },
];

describe("buildKoreanCandidates — vi→ko mapping", () => {
  const cands = buildKoreanCandidates(FAKE);

  it("maps front=vi, back=korean(hangul), pronunciation=romanized(romaja)", () => {
    const c = cands.find((x) => x.front === "Xin chào")!;
    expect(c.front).toBe("Xin chào"); // Vietnamese prompt
    expect(c.back).toBe("안녕하세요"); // hangul answer
    expect(c.pronunciation).toBe("annyeonghaseyo"); // romaja reading
    expect(c.kind).toBe("sentence");
    expect(c.flow).toBe("vi-ko");
    expect(c.provenance).toBe("adapted");
    expect(c.cefr).toBe("A1");
    expect(c.source).toBe("korean/lessons");
    expect(c.id).toBe("vi-ko:sentence:xin-chao");
  });

  it("skips rows missing hangul, romaja, or vi (incomplete = skipped, never invented)", () => {
    expect(cands.find((x) => x.front === "trống back")).toBeUndefined();
    expect(cands.find((x) => x.front === "trống reading")).toBeUndefined();
    expect(cands.find((x) => x.back === "네")).toBeUndefined();
    expect(cands).toHaveLength(1); // only the complete row survives
  });

  it("uppercases the lesson level for the CEFR tag", () => {
    const c = buildKoreanCandidates([
      { level: "b1", sentences: [{ korean: "책", romanized: "chaek", en: "book", vi: "quyển sách" }] },
    ]);
    expect(c[0].cefr).toBe("B1");
  });

  it("emits NO vocab candidates (vocab has no romaja → would fail MISSING_READING)", () => {
    // KoreanLessonLike intentionally has no `vocabulary` field; even a lesson
    // carrying vocab-shaped data produces sentence candidates only.
    expect(cands.every((c) => c.kind === "sentence")).toBe(true);
  });
});
