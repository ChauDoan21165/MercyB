// src/languages/thai/__tests__/thaiWrittenContrastDrills.test.ts
//
// Structural guards for the Thai written contrast (minimal pair) drills
// (A9, Wave 4). Pins shape, the four required components, and the no-audio /
// no-pronunciation-scoring scope. Does NOT assert linguistic correctness
// (native review is deferred).

import { describe, it, expect } from "vitest";

import {
  THAI_WRITTEN_CONTRAST_DRILLS,
} from "@/languages/thai/writtenContrastDrills";
import type { ThaiWrittenContrastDrill } from "@/languages/thai/writtenContrastDrills";

const THAI_RANGE = /[฀-๿]/;
const KINDS = new Set(["tone", "spelling"]);
const TONES = new Set(["mid", "low", "falling", "high", "rising"]);

const TOP_LEVEL_KEYS = new Set([
  "id", "kind", "a", "b",
  "writtenContrast_vi", "writtenContrast_en",
  "meaningContrast_vi", "meaningContrast_en",
  "learnerWarning_vi", "learnerWarning_en",
  "practicePrompt_vi", "practicePrompt_en",
]);
const WORD_KEYS = new Set(["th", "rom", "tone", "vi", "en"]);

function bothNonEmpty(d: ThaiWrittenContrastDrill, base: "writtenContrast" | "meaningContrast" | "learnerWarning" | "practicePrompt") {
  expect((d as unknown as Record<string, string>)[`${base}_vi`].trim().length, `${base}_vi ${d.id}`).toBeGreaterThan(0);
  expect((d as unknown as Record<string, string>)[`${base}_en`].trim().length, `${base}_en ${d.id}`).toBeGreaterThan(0);
}

describe("Thai written contrast drills", () => {
  it("has 40–80 compact drills", () => {
    expect(THAI_WRITTEN_CONTRAST_DRILLS.length).toBeGreaterThanOrEqual(40);
    expect(THAI_WRITTEN_CONTRAST_DRILLS.length).toBeLessThanOrEqual(80);
  });

  it("every drill has a unique id and a known kind", () => {
    const seen = new Set<string>();
    for (const d of THAI_WRITTEN_CONTRAST_DRILLS) {
      expect(d.id.trim().length).toBeGreaterThan(0);
      expect(seen.has(d.id), `duplicate id: ${d.id}`).toBe(false);
      seen.add(d.id);
      expect(KINDS.has(d.kind), `kind ${d.kind}`).toBe(true);
    }
  });

  it("each word in the pair has Thai script, romanization, a tone, and bilingual glosses", () => {
    for (const d of THAI_WRITTEN_CONTRAST_DRILLS) {
      for (const word of [d.a, d.b]) {
        expect(THAI_RANGE.test(word.th), `Thai script ${d.id}: ${word.th}`).toBe(true);
        expect(word.rom.trim().length, `rom ${d.id}`).toBeGreaterThan(0);
        expect(TONES.has(word.tone), `tone ${word.tone} ${d.id}`).toBe(true);
        expect(word.vi.trim().length, `vi ${d.id}`).toBeGreaterThan(0);
        expect(word.en.trim().length, `en ${d.id}`).toBeGreaterThan(0);
      }
      // the pair must be a genuine contrast: different spelling AND meaning
      expect(d.a.th, `a/b same spelling ${d.id}`).not.toBe(d.b.th);
      expect(d.a.vi, `a/b same VI meaning ${d.id}`).not.toBe(d.b.vi);
      expect(d.a.en, `a/b same EN meaning ${d.id}`).not.toBe(d.b.en);
    }
  });

  it("tone-kind drills genuinely differ in tone", () => {
    for (const d of THAI_WRITTEN_CONTRAST_DRILLS) {
      if (d.kind !== "tone") continue;
      expect(d.a.tone, `tone pair should differ ${d.id}`).not.toBe(d.b.tone);
    }
  });

  it("includes all four required components, bilingual and non-empty", () => {
    for (const d of THAI_WRITTEN_CONTRAST_DRILLS) {
      bothNonEmpty(d, "writtenContrast");
      bothNonEmpty(d, "meaningContrast");
      bothNonEmpty(d, "learnerWarning");
      bothNonEmpty(d, "practicePrompt");
    }
  });

  it("learner warnings state the no-audio / no-scoring limit", () => {
    for (const d of THAI_WRITTEN_CONTRAST_DRILLS) {
      const blob = `${d.learnerWarning_vi} ${d.learnerWarning_en}`.toLowerCase();
      expect(blob, `warning scope ${d.id}`).toMatch(/no audio|no pronunciation scoring|không âm thanh|không chấm phát âm/);
    }
  });

  it("includes both tone and spelling contrast kinds", () => {
    const kinds = new Set(THAI_WRITTEN_CONTRAST_DRILLS.map((d) => d.kind));
    expect(kinds.has("tone")).toBe(true);
    expect(kinds.has("spelling")).toBe(true);
  });

  it("carries no audio/scoring fields (no-audio scope)", () => {
    for (const d of THAI_WRITTEN_CONTRAST_DRILLS) {
      for (const k of Object.keys(d)) {
        expect(TOP_LEVEL_KEYS.has(k), `unexpected key "${k}" in ${d.id}`).toBe(true);
      }
      for (const word of [d.a, d.b]) {
        for (const k of Object.keys(word)) {
          expect(WORD_KEYS.has(k), `unexpected word key "${k}" in ${d.id}`).toBe(true);
        }
      }
    }
    const blob = JSON.stringify(THAI_WRITTEN_CONTRAST_DRILLS).toLowerCase();
    for (const banned of ["audiourl", "playaudio", "ttsurl", "micrecord", "pronunciationscore", "azure"]) {
      expect(blob.includes(banned), `banned token ${banned}`).toBe(false);
    }
  });

  it("practice prompts reference both words of the pair", () => {
    for (const d of THAI_WRITTEN_CONTRAST_DRILLS) {
      expect(d.practicePrompt_vi.includes(d.a.th) && d.practicePrompt_vi.includes(d.b.th), `VI prompt ${d.id}`).toBe(true);
      expect(d.practicePrompt_en.includes(d.a.th) && d.practicePrompt_en.includes(d.b.th), `EN prompt ${d.id}`).toBe(true);
    }
  });
});
