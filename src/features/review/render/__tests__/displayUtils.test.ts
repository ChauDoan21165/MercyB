// Per-language tests for D7 display utilities.

import { describe, expect, it } from "vitest";

import type { LanguageCode } from "@/features/review/types";
import {
  fontSizeClass,
  langTag,
  pronunciationLabel,
  scriptClass,
} from "../displayUtils";

const ALL_LANGS: LanguageCode[] = ["vi", "en", "de", "ja", "ko", "zh", "es"];
const LARGE_SCRIPTS: LanguageCode[] = ["zh", "ja", "ko"];
const LATIN: LanguageCode[] = ["vi", "en", "de", "es"];

describe("scriptClass", () => {
  it("returns a non-empty class string for every language", () => {
    for (const lang of ALL_LANGS) {
      const cls = scriptClass(lang);
      expect(typeof cls).toBe("string");
      expect(cls.trim().length).toBeGreaterThan(0);
    }
  });

  it("is deterministic (stable per language)", () => {
    for (const lang of ALL_LANGS) {
      expect(scriptClass(lang)).toBe(scriptClass(lang));
    }
  });

  it("gives CJK + Korean a larger size token than Latin scripts", () => {
    for (const lang of LARGE_SCRIPTS) {
      expect(scriptClass(lang)).toContain("text-2xl");
    }
    for (const lang of LATIN) {
      expect(scriptClass(lang)).toContain("text-lg");
      expect(scriptClass(lang)).not.toContain("text-2xl");
    }
  });

  it("CJK/Korean classes differ from Latin classes", () => {
    for (const big of LARGE_SCRIPTS) {
      for (const small of LATIN) {
        expect(scriptClass(big)).not.toBe(scriptClass(small));
      }
    }
  });

  it("protects diacritics with a relaxed line-height on Latin scripts", () => {
    for (const lang of LATIN) {
      expect(scriptClass(lang)).toContain("leading-relaxed");
    }
  });
});

describe("fontSizeClass", () => {
  it("shrinks a long CJK string vs a short one", () => {
    const short = fontSizeClass("zh", "你好");
    const long = fontSizeClass("zh", "我今天早上去了图书馆借了三本很厚的书回家慢慢读");
    expect(short).toBe("text-2xl");
    expect(long).toBe("text-xl");
    expect(long).not.toBe(short);
  });

  it("shrinks a long Korean string vs a short one", () => {
    expect(fontSizeClass("ko", "안녕")).toBe("text-2xl");
    expect(
      fontSizeClass("ko", "저는 오늘 아침에 도서관에 가서 두꺼운 책 세 권을 빌렸어요"),
    ).toBe("text-xl");
  });

  it("shrinks a long Latin string vs a short one", () => {
    expect(fontSizeClass("en", "hello")).toBe("text-lg");
    expect(
      fontSizeClass(
        "en",
        "this is a fairly long english sentence that should shrink down",
      ),
    ).toBe("text-base");
  });

  it("is deterministic", () => {
    expect(fontSizeClass("ja", "テスト")).toBe(fontSizeClass("ja", "テスト"));
  });

  it("handles empty text without throwing", () => {
    for (const lang of ALL_LANGS) {
      // @ts-expect-error — guarding runtime robustness for empty input
      expect(typeof fontSizeClass(lang, undefined)).toBe("string");
      expect(typeof fontSizeClass(lang, "")).toBe("string");
    }
  });
});

describe("langTag", () => {
  it("returns the correct BCP-47 tag for each language", () => {
    const expected: Record<LanguageCode, string> = {
      vi: "vi",
      en: "en",
      de: "de",
      ja: "ja",
      ko: "ko",
      zh: "zh",
      es: "es",
    };
    for (const lang of ALL_LANGS) {
      expect(langTag(lang)).toBe(expected[lang]);
    }
  });
});

describe("pronunciationLabel", () => {
  it("returns the expected Vietnamese-facing label per language", () => {
    expect(pronunciationLabel("ja")).toBe("Romaji");
    expect(pronunciationLabel("ko")).toBe("Romaja (phiên âm)");
    expect(pronunciationLabel("zh")).toBe("Pinyin");
    expect(pronunciationLabel("en")).toBe("Phiên âm (IPA)");
    expect(pronunciationLabel("de")).toBe("Phiên âm (IPA)");
    expect(pronunciationLabel("es")).toBe("Phiên âm (IPA)");
  });

  it("returns null for Vietnamese (no meaningful phonetic hint)", () => {
    expect(pronunciationLabel("vi")).toBeNull();
  });

  it("returns either a non-empty string or null for every language", () => {
    for (const lang of ALL_LANGS) {
      const label = pronunciationLabel(lang);
      if (label !== null) {
        expect(typeof label).toBe("string");
        expect(label.length).toBeGreaterThan(0);
      }
    }
  });
});
