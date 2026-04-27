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

  describe("example_word coverage (audio playback enablement)", () => {
    // Every dictionary phoneme should expose an example_word so the
    // tap-to-play button can speak a real word (TTS engines pronounce
    // isolated IPA symbols badly). The list below is the contract — if
    // a future change drops example_word from any of these, the audio
    // playback tooltip silently degrades.
    const REQUIRED_PHONEMES = [
      "th", "dh", "r", "l",
      "ae", "ah", "eh", "ih", "iy", "uh", "uw",
      "ey", "ay", "ow", "aw", "oy", "er",
      "sh", "zh", "ch", "jh",
      "ng", "n", "m",
      "t", "d", "k", "g", "p", "b",
      "s", "z", "f", "v",
      "ax", "w", "y", "h",
    ];

    it.each(REQUIRED_PHONEMES)("/%s/ has example_word + example_word_vi", (sym) => {
      const hint = getPhonemeHint(sym);
      expect(hint.example_word, `${sym} missing example_word`).toBeTruthy();
      expect(typeof hint.example_word).toBe("string");
      expect(hint.example_word_vi, `${sym} missing example_word_vi`).toBeTruthy();
      expect(typeof hint.example_word_vi).toBe("string");
    });

    it("aliases inherit example_word from their canonical entry (θ → think)", () => {
      const ipa = getPhonemeHint("θ");
      const canonical = getPhonemeHint("th");
      expect(ipa.example_word).toBe(canonical.example_word);
      expect(ipa.example_word).toBe("think");
    });

    it("GENERIC_LOW_HINT (fallback) does NOT include an example_word", () => {
      // Intentional: when we don't know the phoneme, we don't pretend
      // to have a canonical example. The play button hides instead.
      expect(GENERIC_LOW_HINT.example_word).toBeUndefined();
      expect(GENERIC_LOW_HINT.example_word_vi).toBeUndefined();
    });

    it("VN gloss preserves diacritics (UTF-8 sanity check)", () => {
      expect(getPhonemeHint("th").example_word_vi).toBe("nghĩ");
      expect(getPhonemeHint("ow").example_word_vi).toBe("đi");
      expect(getPhonemeHint("aw").example_word_vi).toBe("bây giờ");
    });
  });
});
