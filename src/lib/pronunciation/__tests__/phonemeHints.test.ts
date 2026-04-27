import { describe, expect, it } from "vitest";
import {
  GENERIC_LOW_HINT,
  LOW_PHONEME_THRESHOLD,
  getPhonemeHint,
} from "../phonemeHints";

describe("getPhonemeHint", () => {
  it("returns the canonical hint for known phonemes", () => {
    expect(getPhonemeHint("th").en).toMatch(/tongue/i);
    expect(getPhonemeHint("th").vi).toMatch(/lưỡi/i);
  });

  it("matches case-insensitively", () => {
    expect(getPhonemeHint("TH")).toEqual(getPhonemeHint("th"));
    expect(getPhonemeHint(" Sh ")).toEqual(getPhonemeHint("sh"));
  });

  it("resolves IPA aliases to canonical hints", () => {
    expect(getPhonemeHint("θ")).toEqual(getPhonemeHint("th"));
    expect(getPhonemeHint("ð")).toEqual(getPhonemeHint("dh"));
    expect(getPhonemeHint("ŋ")).toEqual(getPhonemeHint("ng"));
    expect(getPhonemeHint("æ")).toEqual(getPhonemeHint("ae"));
  });

  it("falls back to GENERIC_LOW_HINT for unknown symbols", () => {
    expect(getPhonemeHint("zzz")).toEqual(GENERIC_LOW_HINT);
    expect(getPhonemeHint("")).toEqual(GENERIC_LOW_HINT);
  });

  it("exposes a sane low-phoneme threshold", () => {
    expect(LOW_PHONEME_THRESHOLD).toBeGreaterThan(60);
    expect(LOW_PHONEME_THRESHOLD).toBeLessThanOrEqual(90);
  });
});
