import { describe, expect, it } from "vitest";

import {
  getNativeContent,
  getNativeFallbackLanguage,
  isNativeFallback,
  type NativeLang,
  type NativeSlots,
} from "../nativeContent";

describe("Arabic-native English native content foundation", () => {
  it("accepts ar as a native language code", () => {
    const lang: NativeLang = "ar";
    expect(lang).toBe("ar");
  });

  it("selects Arabic content when available", () => {
    const slots: NativeSlots<string> = {
      vi: "Vietnamese explanation",
      en: "English explanation",
      ar: "شرح باللغة العربية",
    };

    expect(getNativeContent(slots, "ar")).toBe("شرح باللغة العربية");
    expect(isNativeFallback(slots, "ar")).toBe(false);
  });

  it("falls back from Arabic to English, then Vietnamese", () => {
    expect(getNativeContent({ en: "English explanation", vi: "Giải thích tiếng Việt" }, "ar")).toBe(
      "English explanation",
    );
    expect(getNativeFallbackLanguage({ en: "English explanation", vi: "Giải thích tiếng Việt" }, "ar")).toBe(
      "en",
    );

    expect(getNativeContent({ vi: "Giải thích tiếng Việt" }, "ar")).toBe("Giải thích tiếng Việt");
    expect(getNativeFallbackLanguage({ vi: "Giải thích tiếng Việt" }, "ar")).toBe("vi");
  });

  it("keeps Vietnamese, English, Japanese, Indonesian, and Thai behavior unchanged", () => {
    const slots: NativeSlots<string> = {
      vi: "VI",
      en: "EN",
      ja: "JA",
      id: "ID",
      th: "TH",
      ar: "AR",
    };

    expect(getNativeContent(slots, "vi")).toBe("VI");
    expect(getNativeContent(slots, "en")).toBe("EN");
    expect(getNativeContent(slots, "ja")).toBe("JA");
    expect(getNativeContent(slots, "id")).toBe("ID");
    expect(getNativeContent(slots, "th")).toBe("TH");
  });
});
