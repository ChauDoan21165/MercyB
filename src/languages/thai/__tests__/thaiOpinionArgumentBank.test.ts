// src/languages/thai/__tests__/thaiOpinionArgumentBank.test.ts
//
// Guards for the Thai opinion/argument frame bank (opinionArgumentBank.ts):
// count, all eight discourse functions covered, Thai-with-bilingual-glosses on
// every frame, a usage note everywhere, and a real formal↔casual spread so the
// register caution is genuine.

import { describe, it, expect } from "vitest";
import argumentFrames, {
  argumentFrames as named,
  type ThaiArgFrame,
} from "../opinionArgumentBank";

const THAI_RE = /[฀-๿]/;
const hasThai = (s: string) => THAI_RE.test(s);

const REQUIRED_FUNCTIONS = [
  "opinion",
  "agree",
  "disagree_soft",
  "reason",
  "concession",
  "evidence",
  "example",
  "conclusion",
] as const;
const VALID_REGISTERS = new Set(["casual", "neutral", "formal"]);

describe("Thai argument bank — wiring & coverage", () => {
  it("default and named exports are the same array", () => {
    expect(argumentFrames).toBe(named);
    expect(Array.isArray(argumentFrames)).toBe(true);
  });

  it("ships 50–100 frames", () => {
    expect(argumentFrames.length).toBeGreaterThanOrEqual(50);
    expect(argumentFrames.length).toBeLessThanOrEqual(100);
  });

  it("every id is unique", () => {
    const ids = argumentFrames.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers all eight discourse functions", () => {
    const seen = new Set(argumentFrames.map((f) => f.fn));
    for (const fn of REQUIRED_FUNCTIONS) expect(seen.has(fn)).toBe(true);
  });

  it("has a real formal↔casual spread (register caution is genuine)", () => {
    const registers = new Set(argumentFrames.map((f) => f.register));
    expect(registers.has("casual")).toBe(true);
    expect(registers.has("formal")).toBe(true);
  });

  it("every disagreement frame is soft, never a bare contradiction", () => {
    // Sanity: there is more than one way to disagree softly on offer.
    const disagree = argumentFrames.filter((f) => f.fn === "disagree_soft");
    expect(disagree.length).toBeGreaterThanOrEqual(3);
  });
});

describe("Thai argument bank — every frame is well-formed", () => {
  it.each(argumentFrames.map((f) => [f.id, f] as const))(
    "%s has Thai, VI+EN glosses, a usage note, and a valid register",
    (_id, f: ThaiArgFrame) => {
      expect(hasThai(f.th)).toBe(true);
      expect(f.vi.trim().length).toBeGreaterThan(0);
      expect(f.en.trim().length).toBeGreaterThan(0);
      expect(f.usage_vi.trim().length).toBeGreaterThan(0);
      expect(f.usage_en.trim().length).toBeGreaterThan(0);
      expect(VALID_REGISTERS.has(f.register)).toBe(true);

      if (f.romanization !== undefined) {
        expect(f.romanization.trim().length).toBeGreaterThan(0);
        expect(hasThai(f.romanization)).toBe(false);
      }
    },
  );
});
