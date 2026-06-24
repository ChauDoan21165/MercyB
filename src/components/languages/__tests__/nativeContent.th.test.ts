import { describe, expect, it } from "vitest";

import {
  getNativeContent,
  getNativeFallbackLanguage,
  isNativeFallback,
  type NativeLang,
  type NativeSlots,
} from "../nativeContent";

describe("Thai-native English native content foundation", () => {
  it("accepts th as a native language code", () => {
    const lang: NativeLang = "th";
    expect(lang).toBe("th");
  });

  it("selects Thai content when available", () => {
    const slots: NativeSlots<string> = {
      vi: "Vietnamese explanation",
      en: "English explanation",
      th: "คำอธิบายภาษาไทย",
    };

    expect(getNativeContent(slots, "th")).toBe("คำอธิบายภาษาไทย");
    expect(isNativeFallback(slots, "th")).toBe(false);
  });

  it("falls back from Thai to English, then Vietnamese", () => {
    expect(getNativeContent({ en: "English explanation", vi: "Giải thích tiếng Việt" }, "th")).toBe(
      "English explanation",
    );
    expect(getNativeFallbackLanguage({ en: "English explanation", vi: "Giải thích tiếng Việt" }, "th")).toBe(
      "en",
    );

    expect(getNativeContent({ vi: "Giải thích tiếng Việt" }, "th")).toBe("Giải thích tiếng Việt");
    expect(getNativeFallbackLanguage({ vi: "Giải thích tiếng Việt" }, "th")).toBe("vi");
  });

  it("keeps Vietnamese, English, Japanese, and Indonesian behavior unchanged", () => {
    const slots: NativeSlots<string> = {
      vi: "VI",
      en: "EN",
      ja: "JA",
      id: "ID",
      th: "TH",
    };

    expect(getNativeContent(slots, "vi")).toBe("VI");
    expect(getNativeContent(slots, "en")).toBe("EN");
    expect(getNativeContent(slots, "ja")).toBe("JA");
    expect(getNativeContent(slots, "id")).toBe("ID");
  });
});
