// src/components/languages/__tests__/nativeContent.test.ts
//
// Unit test for the native-language selection seam (Phase 2 / Option C,
// PR-A1). Pins that getNativeContent/isNativeFallback semantics are
// byte-identical to the legacy pick(uiLanguage,en,vi)/isFallback — this
// equivalence is what makes PR-A2's renderer repoint provably
// behavior-preserving — and that the record (NativeSlots) shape is
// forward-compatible with the eventual Option B widening.

import { describe, it, expect } from "vitest";
import {
  getNativeContent,
  isNativeFallback,
  type NativeSlots,
} from "@/components/languages/nativeContent";

// The legacy primitive this seam must reproduce exactly
// (LessonRenderer.tsx:137-145).
function legacyPick<T>(
  uiLang: "vi" | "en",
  en: T | undefined,
  vi: T | undefined,
): T | undefined {
  return uiLang === "en" ? en ?? vi : vi ?? en;
}
function legacyIsFallback(
  uiLang: "vi" | "en",
  en: unknown,
  vi: unknown,
): boolean {
  return uiLang === "en" ? !en && !!vi : !vi && !!en;
}

describe("getNativeContent — native-language slot resolution", () => {
  it("vi prefers the vi slot, falls back to en", () => {
    expect(getNativeContent({ vi: "V", en: "E" }, "vi")).toBe("V");
    expect(getNativeContent({ en: "E" }, "vi")).toBe("E"); // fallback
    expect(getNativeContent({ vi: "V" }, "vi")).toBe("V");
  });

  it("en prefers the en slot, falls back to vi", () => {
    expect(getNativeContent({ vi: "V", en: "E" }, "en")).toBe("E");
    expect(getNativeContent({ vi: "V" }, "en")).toBe("V"); // fallback
    expect(getNativeContent({ en: "E" }, "en")).toBe("E");
  });

  it("returns undefined only when no slot has content", () => {
    expect(getNativeContent({}, "vi")).toBeUndefined();
    expect(getNativeContent({}, "en")).toBeUndefined();
    expect(getNativeContent({ vi: undefined, en: undefined }, "vi")).toBeUndefined();
  });

  it("ja prefers ja, falls back to en, then vi", () => {
    expect(getNativeContent({ vi: "V", en: "E", ja: "J" }, "ja")).toBe("J");
    expect(getNativeContent({ vi: "V", en: "E" }, "ja")).toBe("E");
    expect(getNativeContent({ vi: "V" }, "ja")).toBe("V");
  });

  it("works for non-string payloads (array fields like roleplayPrompts)", () => {
    const slots: NativeSlots<string[]> = { vi: ["a"], en: ["b"] };
    expect(getNativeContent(slots, "vi")).toEqual(["a"]);
    expect(getNativeContent(slots, "en")).toEqual(["b"]);
  });

  it("is byte-identical to the legacy pick(uiLanguage,en,vi) across all slot combos", () => {
    const combos: Array<[string | undefined, string | undefined]> = [
      ["E", "V"],
      [undefined, "V"],
      ["E", undefined],
      [undefined, undefined],
      ["", "V"], // empty string is present-but-falsy — must match legacy
      ["E", ""],
    ];
    for (const [en, vi] of combos) {
      for (const lang of ["vi", "en"] as const) {
        expect(getNativeContent({ vi, en }, lang)).toBe(
          legacyPick(lang, en, vi),
        );
      }
    }
  });
});

describe("isNativeFallback — drives the fallback badge", () => {
  it("true only when the native slot is missing but the other has content", () => {
    expect(isNativeFallback({ vi: "V", en: "E" }, "vi")).toBe(false);
    expect(isNativeFallback({ en: "E" }, "vi")).toBe(true); // showing en under vi
    expect(isNativeFallback({ vi: "V" }, "vi")).toBe(false);
    expect(isNativeFallback({}, "vi")).toBe(false); // nothing to show, not a fallback

    expect(isNativeFallback({ vi: "V", en: "E" }, "en")).toBe(false);
    expect(isNativeFallback({ vi: "V" }, "en")).toBe(true); // showing vi under en
    expect(isNativeFallback({ en: "E" }, "en")).toBe(false);

    expect(isNativeFallback({ ja: "J", en: "E", vi: "V" }, "ja")).toBe(false);
    expect(isNativeFallback({ en: "E", vi: "V" }, "ja")).toBe(true);
    expect(isNativeFallback({ vi: "V" }, "ja")).toBe(true);
  });

  it("is byte-identical to the legacy isFallback(uiLanguage,en,vi)", () => {
    const combos: Array<[string | undefined, string | undefined]> = [
      ["E", "V"],
      [undefined, "V"],
      ["E", undefined],
      [undefined, undefined],
      ["", "V"],
      ["E", ""],
    ];
    for (const [en, vi] of combos) {
      for (const lang of ["vi", "en"] as const) {
        expect(isNativeFallback({ vi, en }, lang)).toBe(
          legacyIsFallback(lang, en, vi),
        );
      }
    }
  });
});
