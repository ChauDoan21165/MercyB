import { describe, it, expect } from "vitest";

import { buildGermanCandidates, type GermanLessonLike } from "../germanLessons";

const FAKE: GermanLessonLike[] = [
  {
    level: "A1",
    sentences: [
      { en: "Guten Morgen!", vi: "Chào buổi sáng!", pronunciation_focus: ["g → g cứng"] },
      { en: "  ", vi: "trống" }, // empty German back → skipped
    ],
    vocabulary: [
      { word: "das Büro", en: "the office", vi: "văn phòng", pronunciation_vi: "đa BUY-rô" },
    ],
  },
];

describe("buildGermanCandidates — vi→de mapping", () => {
  const cands = buildGermanCandidates(FAKE);

  it("maps sentence front=vi, back=en-field(German)", () => {
    const s = cands.find((c) => c.kind === "sentence")!;
    expect(s.front).toBe("Chào buổi sáng!");
    expect(s.back).toBe("Guten Morgen!"); // the `en` field holds German
    expect(s.flow).toBe("vi-de");
    expect(s.provenance).toBe("adapted");
    expect(s.cefr).toBe("A1");
    expect(s.id).toBe("vi-de:sentence:chao-buoi-sang");
    expect(s.noteVi).toBe("g → g cứng"); // VI pronunciation hint → noteVi
  });

  it("maps vocab front=vi, back=word(German), VI hint → noteVi", () => {
    const v = cands.find((c) => c.kind === "vocab")!;
    expect(v.front).toBe("văn phòng");
    expect(v.back).toBe("das Büro"); // `word` is German, NOT `en` (English)
    expect(v.noteVi).toBe("đa BUY-rô");
    expect(v.pronunciation).toBeUndefined(); // German is Latin — no reading
  });

  it("skips rows with an empty front or back", () => {
    expect(cands.find((c) => c.front === "trống")).toBeUndefined();
    expect(cands).toHaveLength(2); // 1 sentence + 1 vocab
  });
});
