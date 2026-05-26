import { describe, expect, it } from "vitest";
import { pickChrome } from "../chromeLanguage";

describe("pickChrome", () => {
  const slots = { vi: "Tiếng mẹ đẻ", en: "Native language" };

  it("returns the Vietnamese form for a vi-native", () => {
    expect(pickChrome(slots, "vi")).toBe("Tiếng mẹ đẻ");
  });

  it("returns the English form for an en-native", () => {
    expect(pickChrome(slots, "en")).toBe("Native language");
  });

  it("never returns both (no bilingual side-by-side)", () => {
    expect(pickChrome(slots, "vi")).not.toMatch(/Native language/);
    expect(pickChrome(slots, "en")).not.toMatch(/Tiếng mẹ đẻ/);
  });
});
