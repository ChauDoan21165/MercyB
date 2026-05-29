import { describe, expect, it } from "vitest";
import {
  VIETLISH_CURATED_PATTERNS,
  buildLongTailLogicFallback,
  findCuratedLogicPattern,
} from "@/lib/tutor/vietlishCuratedLogic";

describe("vietlishCuratedLogic", () => {
  it("ships the starter set of eight curated patterns", () => {
    expect(VIETLISH_CURATED_PATTERNS.map((pattern) => pattern.id)).toEqual([
      "missing-articles",
      "unmarked-past-tense",
      "plural-s",
      "topic-comment-fronting",
      "preposition-in-on-at",
      "interesting-interested",
      "word-for-word-order",
      "countable-uncountable",
    ]);
  });

  it("matches missing article transfer", () => {
    const pattern = findCuratedLogicPattern("I bought hat yesterday.");

    expect(pattern?.id).toBe("missing-articles");
    expect(pattern?.explanationVi).toContain("Tiếng Việt không dùng mạo từ");
    expect(pattern?.correctExample).toBe("I bought a hat yesterday.");
    expect(pattern?.trapExample).toBe("I bought hat yesterday.");
  });

  it("matches topic-comment fronting", () => {
    expect(findCuratedLogicPattern("This book I like.")?.id).toBe("topic-comment-fronting");
  });

  it("does not force a curated match for unrelated input", () => {
    expect(findCuratedLogicPattern("My project feels ready but strange.")).toBeNull();
  });

  it("builds the long-tail fallback for unmatched sentences", () => {
    const fallback = buildLongTailLogicFallback("My project feels ready but strange.");

    expect(fallback.explanationVi).toContain("đường dự phòng");
    expect(fallback.memoryAid).toContain("nâng cấp thành thẻ curated");
  });
});
