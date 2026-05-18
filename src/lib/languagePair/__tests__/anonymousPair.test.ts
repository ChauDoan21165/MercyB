// @vitest-environment jsdom
//
// Anonymous (localStorage) language-pair store — the persistence layer
// that lets a returning anonymous visitor skip the picker and lets
// Home render the right surface before signup.

import { describe, expect, it, beforeEach } from "vitest";
import {
  readAnonymousPair,
  writeAnonymousPair,
  hasAnonymousPair,
  clearAnonymousPair,
} from "../anonymousPair";

const PAIR_KEY = "mercyblade.languagePair";
const NATIVE_KEY = "mercyblade.nativeLang";

beforeEach(() => {
  window.localStorage.clear();
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
});
