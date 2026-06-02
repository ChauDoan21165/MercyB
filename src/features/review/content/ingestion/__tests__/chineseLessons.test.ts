import { describe, it, expect } from "vitest";

import { buildChineseCandidates, type ChineseLessonLike } from "../chineseLessons";

const FAKE: ChineseLessonLike[] = [
  {
    level: "b2",
    sentences: [
      {
        chinese: "你好",
        pinyin: "nǐ hǎo",
        english: "Hello",
        vi: "Xin chào",
      },
      // No vi → generation gap → skipped (NOT invented here).
      { chinese: "再见", pinyin: "zài jiàn", english: "Goodbye" },
      // Empty vi → skipped.
      { chinese: "谢谢", pinyin: "xiè xiè", english: "Thanks", vi: "  " },
    ],
    vocabulary: [
      { chinese: "学习", pinyin: "xué xí", english: "to study", vi: "học tập" },
      // No vi → skipped.
      { chinese: "工作", pinyin: "gōng zuò", english: "to work" },
    ],
  },
];

describe("buildChineseCandidates — vi→zh mapping", () => {
  const cands = buildChineseCandidates(FAKE);

  it("maps sentence front=vi, back=chinese(hanzi), pron=pinyin", () => {
    const s = cands.find((c) => c.kind === "sentence")!;
    expect(s.front).toBe("Xin chào"); // Vietnamese
    expect(s.back).toBe("你好"); // hanzi
    expect(s.pronunciation).toBe("nǐ hǎo"); // tone-marked pinyin
    expect(s.flow).toBe("vi-zh");
    expect(s.provenance).toBe("adapted");
    expect(s.source).toBe("chinese/lessons");
    expect(s.cefr).toBe("B2"); // level uppercased
    expect(s.id).toBe("vi-zh:sentence:xin-chao");
  });

  it("maps vocab front=vi, back=chinese(hanzi), pron=pinyin", () => {
    const v = cands.find((c) => c.kind === "vocab")!;
    expect(v.front).toBe("học tập");
    expect(v.back).toBe("学习");
    expect(v.pronunciation).toBe("xué xí");
    expect(v.cefr).toBe("B2");
    expect(v.id).toBe("vi-zh:vocab:hoc-tap");
  });

  it("skips rows without a vi gloss (the generation gap)", () => {
    // Only the 1 sentence + 1 vocab that carry `vi` survive.
    expect(cands).toHaveLength(2);
    expect(cands.find((c) => c.back === "再见")).toBeUndefined(); // no vi
    expect(cands.find((c) => c.back === "工作")).toBeUndefined(); // no vi
    expect(cands.find((c) => c.back === "谢谢")).toBeUndefined(); // empty vi
  });
});
