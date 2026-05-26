import { describe, expect, it } from "vitest";
import { parseLanguagePair, withPrimary } from "../languagePair";
import { LANGUAGES } from "@/store/languageProgress";

describe("parseLanguagePair", () => {
  it("returns nulls/empties for an absent or NULL row", () => {
    expect(parseLanguagePair(null)).toEqual({
      nativeLanguage: null,
      targets: [],
      primaryTarget: null,
    });
    expect(parseLanguagePair({})).toEqual({
      nativeLanguage: null,
      targets: [],
      primaryTarget: null,
    });
    expect(
      parseLanguagePair({ native_language: null, target_languages: null }),
    ).toEqual({ nativeLanguage: null, targets: [], primaryTarget: null });
  });

  it("parses a valid pair and derives the primary from index 0", () => {
    const p = parseLanguagePair({
      native_language: "vi",
      target_languages: ["ja", "en"],
    });
    expect(p.nativeLanguage).toBe("vi");
    expect(p.targets).toEqual(["ja", "en"]);
    expect(p.primaryTarget).toBe("ja");
  });

  it("rejects an unknown native and dedupes/drops unknown targets", () => {
    const p = parseLanguagePair({
      native_language: "zz",
      target_languages: ["en", "en", "ja", "klingon"],
    });
    expect(p.nativeLanguage).toBeNull();
    expect(p.targets).toEqual(["en", "ja"]); // deduped, unknown dropped
    expect(p.primaryTarget).toBe("en");
  });

  it("tolerates a non-array target_languages without throwing", () => {
    expect(parseLanguagePair({ target_languages: "en" }).targets).toEqual([]);
  });
});

describe("withPrimary", () => {
  it("moves the chosen target to index 0, preserving the rest", () => {
    expect(withPrimary(["en", "ja", "ko"], "ja")).toEqual(["ja", "en", "ko"]);
  });
  it("is a no-op when the target is absent or already primary", () => {
    expect(withPrimary(["en", "ja"], "ko")).toEqual(["en", "ja"]);
    expect(withPrimary(["en", "ja"], "en")).toEqual(["en", "ja"]);
  });
});

describe("LANGUAGES meta — stale lesson counts fixed (decision 5)", () => {
  it("spanish totalLessons is the canonical 109 (was a stale 110)", () => {
    expect(
      LANGUAGES.find((l) => l.id === "spanish")?.totalLessons,
    ).toBe(109);
  });
  it("vietnamese totalLessons is the canonical 536 (was a stale 47)", () => {
    expect(
      LANGUAGES.find((l) => l.id === "vietnamese")?.totalLessons,
    ).toBe(536);
  });
});
