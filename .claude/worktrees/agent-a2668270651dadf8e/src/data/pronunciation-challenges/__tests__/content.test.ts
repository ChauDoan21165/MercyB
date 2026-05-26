import { describe, it, expect } from "vitest";

import {
  DAILY_CHALLENGES,
  getChallengeById,
  getChallengesByPhoneme,
  getChallengesByType,
} from "../index";

describe("DAILY_CHALLENGES — totals + categories", () => {
  it("ships exactly 60 challenges", () => {
    expect(DAILY_CHALLENGES).toHaveLength(60);
  });

  it("breaks down 20 / 20 / 20 by type", () => {
    expect(getChallengesByType("tongue_twister")).toHaveLength(20);
    expect(getChallengesByType("minimal_pair")).toHaveLength(20);
    expect(getChallengesByType("phoneme_targeted")).toHaveLength(20);
  });

  it("every id is unique", () => {
    const ids = DAILY_CHALLENGES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("ids carry their type as a stable prefix", () => {
    for (const c of DAILY_CHALLENGES) {
      const expectedPrefix =
        c.type === "tongue_twister"
          ? "tt_"
          : c.type === "minimal_pair"
            ? "mp_"
            : "pt_";
      expect(c.id.startsWith(expectedPrefix), c.id).toBe(true);
    }
  });
});

describe("DAILY_CHALLENGES — schema", () => {
  it("every challenge has bilingual content_en + Vietnamese explanation", () => {
    for (const c of DAILY_CHALLENGES) {
      expect(c.content_en.length, c.id).toBeGreaterThan(0);
      expect(c.content_vi_explanation.length, c.id).toBeGreaterThan(20);
    }
  });

  it("every challenge declares at least one target phoneme", () => {
    for (const c of DAILY_CHALLENGES) {
      expect(Array.isArray(c.target_phonemes), c.id).toBe(true);
      expect(c.target_phonemes.length, c.id).toBeGreaterThan(0);
    }
  });

  it("difficulty is one of easy / medium / hard", () => {
    const valid = new Set(["easy", "medium", "hard"]);
    for (const c of DAILY_CHALLENGES) {
      expect(valid.has(c.difficulty), c.id).toBe(true);
    }
  });

  it("phoneme keys are lowercase canonical forms", () => {
    for (const c of DAILY_CHALLENGES) {
      for (const p of c.target_phonemes) {
        expect(p, `${c.id} → ${p}`).toBe(p.toLowerCase());
        expect(p.length, c.id).toBeGreaterThan(0);
      }
    }
  });

  it("covers the four headline VN problem phonemes", () => {
    const allPhonemes = new Set(
      DAILY_CHALLENGES.flatMap((c) => c.target_phonemes),
    );
    for (const p of ["th", "r", "v", "w"]) {
      expect(allPhonemes.has(p), `expected coverage for /${p}/`).toBe(true);
    }
    // Final-/s/ and final-/z/ are also called out in the brief.
    expect(allPhonemes.has("s")).toBe(true);
    expect(allPhonemes.has("z")).toBe(true);
  });
});

describe("getChallengeById / getChallengesByPhoneme", () => {
  it("getChallengeById returns the matching challenge", () => {
    const c = getChallengeById("tt_seashells");
    expect(c).toBeDefined();
    expect(c?.type).toBe("tongue_twister");
  });

  it("getChallengeById returns undefined for unknown ids", () => {
    expect(getChallengeById("does_not_exist")).toBeUndefined();
  });

  it("getChallengesByPhoneme is case-insensitive and returns hits", () => {
    const lower = getChallengesByPhoneme("th");
    const upper = getChallengesByPhoneme("TH");
    expect(lower.length).toBeGreaterThan(0);
    expect(upper.map((c) => c.id)).toEqual(lower.map((c) => c.id));
    for (const c of lower) {
      expect(c.target_phonemes.map((p) => p.toLowerCase())).toContain("th");
    }
  });
});
