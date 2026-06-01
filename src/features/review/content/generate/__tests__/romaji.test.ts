import { describe, it, expect } from "vitest";
import { deriveRomaji } from "../romaji";

describe("deriveRomaji", () => {
  it("pure hiragana → certain=true with romaji", () => {
    const { romaji, certain } = deriveRomaji("ねこ");
    expect(romaji).toBe("neko");
    expect(certain).toBe(true);
  });

  it("pure katakana → certain=true", () => {
    const { romaji, certain } = deriveRomaji("テスト");
    expect(certain).toBe(true);
    expect(romaji).toBe("tesuto");
  });

  it("contains kanji → certain=false (reading ambiguous)", () => {
    const { romaji, certain } = deriveRomaji("猫");
    expect(certain).toBe(false);
    // wanakana leaves kanji as-is.
    expect(romaji).toContain("猫");
  });

  it("mixed kana+kanji → certain=false", () => {
    const { certain } = deriveRomaji("食べる");
    expect(certain).toBe(false);
  });

  it("empty string → certain=false", () => {
    const { romaji, certain } = deriveRomaji("");
    expect(romaji).toBe("");
    expect(certain).toBe(false);
  });
});
