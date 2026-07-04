// @vitest-environment jsdom
//
// Anonymous (localStorage) language-pair store — the persistence layer
// that lets a returning anonymous visitor skip the picker and lets
// Home render the right surface before signup.

import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import {
  readAnonymousPair,
  writeAnonymousPair,
  hasAnonymousPair,
  clearAnonymousPair,
} from "../anonymousPair";
import { NATIVE_OPTIONS } from "@/lib/onboarding/types";

const PAIR_KEY = "mercyblade.languagePair";
const NATIVE_KEY = "mercyblade.nativeLang";

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("anonymousPair — round trip", () => {
  it("returns null when nothing is stored (visitor still owes the picker)", () => {
    expect(readAnonymousPair()).toBeNull();
    expect(hasAnonymousPair()).toBe(false);
  });

  it("write then read preserves native + ordered targets", () => {
    writeAnonymousPair("vi", ["ja", "en"]);
    expect(readAnonymousPair()).toEqual({ native: "vi", targets: ["ja", "en"] });
    expect(hasAnonymousPair()).toBe(true);
  });

  it("mirrors native into NativeLanguageContext's cache key", () => {
    writeAnonymousPair("en", ["es"]);
    expect(window.localStorage.getItem(NATIVE_KEY)).toBe("en");
  });

  it("clear forgets the pair AND the native mirror (picker shows again)", () => {
    writeAnonymousPair("vi", ["en"]);
    clearAnonymousPair();
    expect(readAnonymousPair()).toBeNull();
    expect(window.localStorage.getItem(NATIVE_KEY)).toBeNull();
  });
});

describe("anonymousPair — defensive parsing (never crashes Home)", () => {
  it("tolerates malformed JSON → null", () => {
    window.localStorage.setItem(PAIR_KEY, "{not json");
    expect(readAnonymousPair()).toBeNull();
  });

  it("drops unknown / duplicate target codes, keeps order", () => {
    window.localStorage.setItem(
      PAIR_KEY,
      JSON.stringify({ native: "vi", targets: ["en", "xx", "en", "ja"] }),
    );
    expect(readAnonymousPair()).toEqual({
      native: "vi",
      targets: ["en", "ja"],
    });
  });

  it("invalid native → null (treated as 'still owes the picker')", () => {
    window.localStorage.setItem(
      PAIR_KEY,
      JSON.stringify({ native: "zz", targets: ["en"] }),
    );
    expect(readAnonymousPair()).toBeNull();
  });

  it("valid native with empty targets is still a valid stored pair", () => {
    writeAnonymousPair("vi", []);
    expect(readAnonymousPair()).toEqual({ native: "vi", targets: [] });
    expect(hasAnonymousPair()).toBe(true);
  });

  it("keeps every onboarding native valid even when targets are empty", () => {
    for (const option of NATIVE_OPTIONS) {
      window.localStorage.clear();
      writeAnonymousPair(option.value, []);
      expect(readAnonymousPair()).toEqual({ native: option.value, targets: [] });
      expect(hasAnonymousPair()).toBe(true);
    }
  });

  it("drops non-array or object-shaped target blobs", () => {
    window.localStorage.setItem(
      PAIR_KEY,
      JSON.stringify({ native: "vi", targets: { 0: "en", length: 1 } }),
    );
    expect(readAnonymousPair()).toEqual({ native: "vi", targets: [] });

    window.localStorage.setItem(
      PAIR_KEY,
      JSON.stringify({ native: "vi", targets: "en" }),
    );
    expect(readAnonymousPair()).toEqual({ native: "vi", targets: [] });
  });

  it("sanitizes mixed tampered target arrays", () => {
    window.localStorage.setItem(
      PAIR_KEY,
      JSON.stringify({ native: "en", targets: ["xx", "es", null, "es", 42, "vi"] }),
    );
    expect(readAnonymousPair()).toEqual({ native: "en", targets: ["es", "vi"] });
  });
});

describe("anonymousPair — storage failures", () => {
  it("returns null and no-ops when window is unavailable", () => {
    vi.stubGlobal("window", undefined);

    expect(readAnonymousPair()).toBeNull();
    expect(hasAnonymousPair()).toBe(false);
    expect(() => writeAnonymousPair("vi", ["en"])).not.toThrow();
    expect(() => clearAnonymousPair()).not.toThrow();
  });

  it("read returns null when localStorage getItem throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage unavailable");
    });

    expect(readAnonymousPair()).toBeNull();
    expect(hasAnonymousPair()).toBe(false);
  });

  it("write and clear swallow localStorage failures", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota exceeded");
    });
    expect(() => writeAnonymousPair("vi", ["en"])).not.toThrow();

    vi.restoreAllMocks();
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("storage unavailable");
    });
    expect(() => clearAnonymousPair()).not.toThrow();
  });

  it("mirrors every onboarding native into NativeLanguageContext's cache key", () => {
    for (const option of NATIVE_OPTIONS) {
      window.localStorage.clear();
      writeAnonymousPair(option.value, []);
      expect(window.localStorage.getItem(NATIVE_KEY)).toBe(option.value);
    }
  });
});
