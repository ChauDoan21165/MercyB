// src/languages/thai/__tests__/thaiToneDrills.test.ts
//
// Structural guards for the non-audio Thai tone-awareness drills
// (A9, Wave 2). These pin shape, answer validity, and the no-audio /
// no-pronunciation-scoring scope. They do NOT assert linguistic
// correctness (native review is deferred).

import { describe, it, expect } from "vitest";

import { THAI_TONE_DRILLS } from "@/languages/thai/toneDrills";
import type { ThaiToneDrill, ThaiToneDrillType } from "@/languages/thai/toneDrills";

const THAI_RANGE = /[฀-๿]/;

const TYPES = new Set<ThaiToneDrillType>([
  "identify-tone-mark",
  "choose-meaning",
  "match-romanization",
  "tone-warning",
  "written-contrast",
]);

// Drill types that must present a multiple-choice / true-false answer.
const CHOICE_TYPES = new Set<ThaiToneDrillType>([
  "identify-tone-mark",
  "choose-meaning",
  "match-romanization",
  "tone-warning",
  "written-contrast",
]);

// The ONLY keys a drill may carry. This is the structural guarantee that
// no audio / mic / TTS / scoring field can sneak in.
const ALLOWED_KEYS = new Set([
  "id", "type", "prompt_vi", "prompt_en", "th", "rom",
  "toneLabel", "toneMark", "options", "answerIndex",
  "explanation_vi", "explanation_en",
]);

describe("Thai tone drills", () => {
  it("has 40–80 compact drills", () => {
    expect(THAI_TONE_DRILLS.length).toBeGreaterThanOrEqual(40);
    expect(THAI_TONE_DRILLS.length).toBeLessThanOrEqual(80);
  });

  it("every drill has a unique id and a known type", () => {
    const seen = new Set<string>();
    for (const d of THAI_TONE_DRILLS) {
      expect(d.id.trim().length, "id non-empty").toBeGreaterThan(0);
      expect(seen.has(d.id), `duplicate id: ${d.id}`).toBe(false);
      seen.add(d.id);
      expect(TYPES.has(d.type), `unknown type: ${d.type}`).toBe(true);
    }
  });

  it("every drill is bilingual (VI + EN prompt and explanation)", () => {
    for (const d of THAI_TONE_DRILLS) {
      expect(d.prompt_vi.trim().length, `prompt_vi ${d.id}`).toBeGreaterThan(0);
      expect(d.prompt_en.trim().length, `prompt_en ${d.id}`).toBeGreaterThan(0);
      expect(d.explanation_vi.trim().length, `explanation_vi ${d.id}`).toBeGreaterThan(0);
      expect(d.explanation_en.trim().length, `explanation_en ${d.id}`).toBeGreaterThan(0);
    }
  });

  it("choice drills have >=2 options and a valid answerIndex", () => {
    for (const d of THAI_TONE_DRILLS) {
      if (!CHOICE_TYPES.has(d.type)) continue;
      expect(Array.isArray(d.options), `options for ${d.id}`).toBe(true);
      expect(d.options!.length, `>=2 options for ${d.id}`).toBeGreaterThanOrEqual(2);
      expect(typeof d.answerIndex, `answerIndex for ${d.id}`).toBe("number");
      expect(d.answerIndex!).toBeGreaterThanOrEqual(0);
      expect(d.answerIndex!).toBeLessThan(d.options!.length);
      // options are non-empty strings
      for (const o of d.options!) {
        expect(o.trim().length, `non-empty option in ${d.id}`).toBeGreaterThan(0);
      }
    }
  });

  it("word-based drills carry Thai script in th, options, or prompt", () => {
    // identify-tone-mark / choose-meaning / match-romanization show a word;
    // written-contrast puts the Thai in the options.
    for (const d of THAI_TONE_DRILLS) {
      if (d.type === "tone-warning") continue; // warnings are conceptual
      const blob = [d.th ?? "", d.prompt_vi, d.prompt_en, ...(d.options ?? [])].join(" ");
      expect(THAI_RANGE.test(blob), `Thai script present in ${d.id}`).toBe(true);
    }
  });

  it("includes all five drill types", () => {
    const used = new Set<ThaiToneDrillType>(THAI_TONE_DRILLS.map((d) => d.type));
    for (const t of TYPES) {
      expect(used.has(t), `missing drill type: ${t}`).toBe(true);
    }
  });

  it("carries no audio / mic / TTS / scoring fields (no-audio scope)", () => {
    for (const d of THAI_TONE_DRILLS) {
      for (const k of Object.keys(d)) {
        expect(ALLOWED_KEYS.has(k), `unexpected key "${k}" in ${d.id}`).toBe(true);
      }
    }
    // belt-and-braces: no field text advertises audio/scoring capability
    const blob = JSON.stringify(THAI_TONE_DRILLS).toLowerCase();
    for (const banned of ["audiourl", "playaudio", "ttsurl", "micrecord", "pronunciationscore"]) {
      expect(blob.includes(banned), `banned token ${banned}`).toBe(false);
    }
  });

  it("tone-warning drills make the no-pronunciation-scoring limit explicit somewhere", () => {
    const warnings = THAI_TONE_DRILLS.filter((d: ThaiToneDrill) => d.type === "tone-warning");
    expect(warnings.length).toBeGreaterThanOrEqual(3);
    const blob = warnings
      .map((d) => `${d.prompt_vi} ${d.prompt_en} ${d.explanation_vi} ${d.explanation_en}`)
      .join(" ")
      .toLowerCase();
    expect(blob).toMatch(/no mic|no audio|pronunciation scoring|written recognition/);
  });

  it("written contrasts differ in meaning between the two options", () => {
    const contrasts = THAI_TONE_DRILLS.filter((d) => d.type === "written-contrast");
    expect(contrasts.length).toBeGreaterThanOrEqual(4);
    for (const d of contrasts) {
      // both options should be distinct Thai spellings
      expect(d.options![0]).not.toBe(d.options![1]);
    }
  });
});
