import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  resolveInterimEnglishBridge,
  interimBridgeComingSoonNote,
} from "@/lib/tutor/interimEnglishBridge";

const PAIR_KEY = "mercyblade.languagePair";

function storePair(native: string, targets: string[]) {
  window.localStorage.setItem(PAIR_KEY, JSON.stringify({ native, targets }));
}

beforeEach(() => {
  window.localStorage.clear();
});
afterEach(() => {
  window.localStorage.clear();
});

describe("resolveInterimEnglishBridge — URL native param", () => {
  it("resolves Thai from ?native=th&target=en", () => {
    const b = resolveInterimEnglishBridge("?native=th&target=en");
    expect(b?.code).toBe("th");
    expect(b?.englishName).toBe("Thai");
    expect(b?.endonym).toBe("ไทย");
  });

  it("accepts native aliases (thai, endonym)", () => {
    expect(resolveInterimEnglishBridge("?native=thai&target=en")?.code).toBe("th");
    expect(resolveInterimEnglishBridge("?native=ไทย&target=english")?.code).toBe("th");
  });

  it("target defaults to English when omitted", () => {
    expect(resolveInterimEnglishBridge("?native=th")?.code).toBe("th");
  });

  it("does not resolve when the URL target is not English", () => {
    expect(resolveInterimEnglishBridge("?native=th&target=ja")).toBeNull();
  });

  it("returns null for a non-bridge URL native (e.g. vi)", () => {
    expect(resolveInterimEnglishBridge("?native=vi&target=en")).toBeNull();
  });
});

describe("resolveInterimEnglishBridge — stored-pair fallback (the bug fix)", () => {
  it("resolves Thai from the stored pair when NO native param is present", () => {
    storePair("th", ["en"]);
    expect(resolveInterimEnglishBridge("")?.code).toBe("th");
    expect(resolveInterimEnglishBridge(undefined)?.code).toBe("th");
    expect(resolveInterimEnglishBridge("?foo=bar")?.code).toBe("th");
  });

  it("requires English among the stored targets", () => {
    storePair("th", ["ja"]);
    expect(resolveInterimEnglishBridge("")).toBeNull();
  });

  it("does NOT resolve a bridge for a Vietnamese stored pair (regression guard)", () => {
    storePair("vi", ["en"]);
    expect(resolveInterimEnglishBridge("")).toBeNull();
    expect(resolveInterimEnglishBridge(undefined)).toBeNull();
  });

  it("returns null when nothing is stored", () => {
    expect(resolveInterimEnglishBridge("")).toBeNull();
  });
});

describe("resolveInterimEnglishBridge — precedence: explicit URL native wins over stored pair", () => {
  it("an explicit non-bridge URL native is honored, not overridden by a Thai stored pair", () => {
    storePair("th", ["en"]);
    // The URL explicitly says Vietnamese — do not silently switch to the Thai
    // bridge just because a Thai pair sits in storage.
    expect(resolveInterimEnglishBridge("?native=vi&target=en")).toBeNull();
  });

  it("URL Thai native resolves even if a VN pair is stored", () => {
    storePair("vi", ["en"]);
    expect(resolveInterimEnglishBridge("?native=th&target=en")?.code).toBe("th");
  });
});

describe("interimBridgeComingSoonNote", () => {
  it("is honest and parametrized by the language name (not Thai-hardcoded)", () => {
    const note = interimBridgeComingSoonNote({ code: "th", endonym: "ไทย", englishName: "Thai" });
    expect(note).toBe("English coaching — a Thai-specific tutor is coming.");
    // Generalizes to any bridge native.
    expect(
      interimBridgeComingSoonNote({ code: "ja", endonym: "日本語", englishName: "Japanese" }),
    ).toContain("Japanese-specific tutor is coming");
  });
});
