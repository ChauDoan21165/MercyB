import { describe, it, expect } from "vitest";
import {
  TONE_CONTRAST_EXTRA,
  TONE_CONTRAST_EXTRA_SYLLABLES,
} from "../tone-contrast-extra";

const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const AUDIO_PATH = /^\/audio\/tones\/.+\.mp3$/;

describe("TONE_CONTRAST_EXTRA — EN→VN tone-contrast extension", () => {
  it("is non-empty", () => {
    expect(TONE_CONTRAST_EXTRA.length).toBeGreaterThan(0);
  });

  it("every pair is flagged for Chau native validation", () => {
    for (const pair of TONE_CONTRAST_EXTRA) {
      expect(pair.needsChauValidation).toBe(true);
    }
  });

  it("every below-floor pair is listen-compare only", () => {
    for (const pair of TONE_CONTRAST_EXTRA) {
      if (pair.trustFloor === "below") {
        expect(pair.listenCompareOnly).toBe(true);
      }
    }
  });

  it("above-floor pairs are not listen-compare only", () => {
    for (const pair of TONE_CONTRAST_EXTRA) {
      if (pair.trustFloor === "above") {
        expect(pair.listenCompareOnly).toBe(false);
      }
    }
  });

  it("NO pair with a hỏi or ngã target has trustFloor 'above' (trust floor is sacred)", () => {
    for (const pair of TONE_CONTRAST_EXTRA) {
      const touchesHoiOrNga = pair.contrast.some(
        (target) => target.tone === "hỏi" || target.tone === "ngã",
      );
      if (touchesHoiOrNga) {
        expect(pair.trustFloor).toBe("below");
        expect(pair.listenCompareOnly).toBe(true);
      }
    }
  });

  it("ids are unique", () => {
    const ids = TONE_CONTRAST_EXTRA.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("ids are kebab-case", () => {
    for (const pair of TONE_CONTRAST_EXTRA) {
      expect(pair.id).toMatch(KEBAB);
    }
  });

  it("trustFloor is exactly 'above' or 'below'", () => {
    for (const pair of TONE_CONTRAST_EXTRA) {
      expect(["above", "below"]).toContain(pair.trustFloor);
    }
  });

  it("each pair has exactly two contrast targets with full non-empty fields", () => {
    for (const pair of TONE_CONTRAST_EXTRA) {
      expect(pair.contrast).toHaveLength(2);
      for (const target of pair.contrast) {
        expect(target.syllable.length).toBeGreaterThan(0);
        expect(target.shapeEn.length).toBeGreaterThan(0);
        expect(target.audioPath).toMatch(AUDIO_PATH);
      }
      expect(pair.glossEn.trim().length).toBeGreaterThan(0);
      expect(pair.glossVi.trim().length).toBeGreaterThan(0);
      expect(pair.validationNote.trim().length).toBeGreaterThan(0);
    }
  });

  // Supabase Storage object keys must be ASCII, so the audio key is a
  // storage-safe `<ascii-base>-<tone>` tag, NOT the raw accented syllable.
  const STORAGE_SAFE_AUDIO_PATH = /^\/audio\/tones\/[a-z0-9]+(?:-[a-z0-9]+)*\.mp3$/;

  it("audioPath is a storage-safe ASCII tone-tag key for every target", () => {
    for (const pair of TONE_CONTRAST_EXTRA) {
      for (const target of pair.contrast) {
        expect(target.audioPath).toMatch(STORAGE_SAFE_AUDIO_PATH);
      }
    }
  });

  it("audio keys are collision-free across all targets", () => {
    const keys: string[] = [];
    for (const pair of TONE_CONTRAST_EXTRA) {
      for (const target of pair.contrast) {
        keys.push(target.audioPath);
      }
    }
    // dedupe by syllable first (same syllable → same clip), then assert
    // the distinct syllables map to distinct keys (no accent-strip collision).
    const bySyllable = new Map<string, string>();
    for (const pair of TONE_CONTRAST_EXTRA) {
      for (const target of pair.contrast) {
        bySyllable.set(target.syllable, target.audioPath);
      }
    }
    const distinctKeys = new Set(bySyllable.values());
    expect(distinctKeys.size).toBe(bySyllable.size);
  });

  it("encodes a few known syllables to the agreed ASCII scheme", () => {
    const keyOf = (syllable: string): string | undefined => {
      for (const pair of TONE_CONTRAST_EXTRA) {
        for (const target of pair.contrast) {
          if (target.syllable === syllable) return target.audioPath;
        }
      }
      return undefined;
    };
    expect(keyOf("xé")).toBe("/audio/tones/xe-sac.mp3");
    expect(keyOf("của")).toBe("/audio/tones/cua-hoi.mp3");
    expect(keyOf("cũ")).toBe("/audio/tones/cu-nga.mp3");
    expect(keyOf("lọ")).toBe("/audio/tones/lo-nang.mp3");
    expect(keyOf("cò")).toBe("/audio/tones/co-huyen.mp3");
  });
});

describe("TONE_CONTRAST_EXTRA_SYLLABLES — TTS manifest", () => {
  it("is deduplicated by syllable", () => {
    const syllables = TONE_CONTRAST_EXTRA_SYLLABLES.map((s) => s.syllable);
    expect(new Set(syllables).size).toBe(syllables.length);
  });

  it("covers every target syllable in the extension set", () => {
    const manifest = new Set(
      TONE_CONTRAST_EXTRA_SYLLABLES.map((s) => s.syllable),
    );
    for (const pair of TONE_CONTRAST_EXTRA) {
      for (const target of pair.contrast) {
        expect(manifest.has(target.syllable)).toBe(true);
      }
    }
  });

  it("contains no syllable absent from the pair set", () => {
    const pairSyllables = new Set<string>();
    for (const pair of TONE_CONTRAST_EXTRA) {
      for (const target of pair.contrast) {
        pairSyllables.add(target.syllable);
      }
    }
    for (const entry of TONE_CONTRAST_EXTRA_SYLLABLES) {
      expect(pairSyllables.has(entry.syllable)).toBe(true);
    }
  });
});
