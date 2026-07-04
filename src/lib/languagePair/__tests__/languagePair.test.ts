import { describe, expect, it } from "vitest";
import { parseLanguagePair, withPrimary } from "../languagePair";
import { LANGUAGES } from "@/store/languageProgress";
import { NATIVE_OPTIONS, TARGET_META } from "@/lib/onboarding/types";
import type { TargetLang } from "@/lib/onboarding/types";

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

  it("accepts every native language exposed by onboarding options", () => {
    for (const option of NATIVE_OPTIONS) {
      expect(
        parseLanguagePair({
          native_language: option.value,
          target_languages: ["en"],
        }).nativeLanguage,
      ).toBe(option.value);
    }
  });

  it("preserves every target language code declared in TARGET_META", () => {
    const targetCodes = Object.keys(TARGET_META) as TargetLang[];

    expect(parseLanguagePair({ target_languages: targetCodes }).targets).toEqual(targetCodes);
  });

  it("drops malformed target values without treating array-like data as targets", () => {
    expect(parseLanguagePair({ target_languages: { 0: "en", length: 1 } }).targets).toEqual([]);
    expect(parseLanguagePair({ target_languages: "ja" }).targets).toEqual([]);
    expect(parseLanguagePair({ target_languages: ["xx", null, "ko", "ko", 42, "fr"] }).targets).toEqual([
      "ko",
      "fr",
    ]);
  });

  it("derives primaryTarget from the first valid deduped target", () => {
    expect(
      parseLanguagePair({
        native_language: "vi",
        target_languages: ["xx", "ja", "ja", "en"],
      }),
    ).toEqual({
      nativeLanguage: "vi",
      targets: ["ja", "en"],
      primaryTarget: "ja",
    });
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

  it("does not mutate the caller-owned targets array", () => {
    const targets: TargetLang[] = ["en", "ja", "ko"];
    const original = [...targets];

    expect(withPrimary(targets, "ko")).toEqual(["ko", "en", "ja"]);
    expect(targets).toEqual(original);
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


describe("parseLanguagePair — Japanese-native English pilot", () => {
  it("accepts Japanese as a native language", () => {
    expect(
      parseLanguagePair({ native_language: "ja", target_languages: ["en"] }),
    ).toEqual({ nativeLanguage: "ja", targets: ["en"], primaryTarget: "en" });
  });
});

describe("parseLanguagePair — Indonesian-native English foundation", () => {
  it("accepts Indonesian as a native language", () => {
    expect(
      parseLanguagePair({ native_language: "id", target_languages: ["en"] }),
    ).toEqual({ nativeLanguage: "id", targets: ["en"], primaryTarget: "en" });
  });
});
