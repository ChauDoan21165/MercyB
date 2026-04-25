// src/data/exam-prep/ielts/__tests__/band-descriptors.test.ts
//
// Tests for the band conversion + overall-band rounding rules.
// Pure functions; no mocks needed.

import { describe, it, expect } from "vitest";
import {
  descriptorForBand,
  listeningRawToBand,
  overallBand,
  readingRawToBand,
  rubricToBand,
  snapToBand,
} from "../band-descriptors";

describe("listeningRawToBand", () => {
  it("39+ correct → band 9", () => {
    expect(listeningRawToBand(40)).toBe(9);
    expect(listeningRawToBand(39)).toBe(9);
  });

  it("30 correct → band 7", () => {
    expect(listeningRawToBand(30)).toBe(7);
  });

  it("23 correct → band 6", () => {
    expect(listeningRawToBand(23)).toBe(6);
  });

  it("0 correct → band 0", () => {
    expect(listeningRawToBand(0)).toBe(0);
  });

  it("clamps out-of-range inputs", () => {
    expect(listeningRawToBand(99)).toBe(9);
    expect(listeningRawToBand(-5)).toBe(0);
  });
});

describe("readingRawToBand", () => {
  it("39+ correct → band 9", () => {
    expect(readingRawToBand(40)).toBe(9);
  });

  it("15 correct → band 5", () => {
    expect(readingRawToBand(15)).toBe(5);
  });

  it("4 correct → band 0", () => {
    expect(readingRawToBand(4)).toBe(0);
  });
});

describe("rubricToBand (writing/speaking estimator)", () => {
  it("0/5 maps to band 0", () => {
    expect(rubricToBand(0)).toBe(0);
  });

  it("5/5 maps to band 9", () => {
    expect(rubricToBand(5)).toBe(9);
  });

  it("2.5/5 maps to ~band 4.5", () => {
    expect(rubricToBand(2.5)).toBe(4.5);
  });

  it("clamps and snaps unusual inputs", () => {
    expect(rubricToBand(-1)).toBe(0);
    expect(rubricToBand(99)).toBe(9);
    expect(rubricToBand(Number.NaN)).toBe(0);
  });
});

describe("snapToBand", () => {
  it("snaps to the nearest 0.5 step", () => {
    expect(snapToBand(6.2)).toBe(6);
    expect(snapToBand(6.3)).toBe(6.5);
    expect(snapToBand(7.49)).toBe(7.5);
    expect(snapToBand(7.51)).toBe(7.5);
  });
});

describe("overallBand — IELTS rounding rules", () => {
  it("six 6.0s → 6.0", () => {
    expect(
      overallBand({ listening: 6, reading: 6, writing: 6, speaking: 6 }),
    ).toBe(6);
  });

  it("avg 6.25 → 6.5 (rounds UP)", () => {
    // 7 + 6 + 6 + 6 = 25 / 4 = 6.25 → round up to 6.5
    expect(
      overallBand({ listening: 7, reading: 6, writing: 6, speaking: 6 }),
    ).toBe(6.5);
  });

  it("avg 6.125 → 6.0 (rounds DOWN)", () => {
    // 6.5 + 6 + 6 + 6 = 24.5 / 4 = 6.125 → round down to 6.0
    expect(
      overallBand({ listening: 6.5, reading: 6, writing: 6, speaking: 6 }),
    ).toBe(6);
  });

  it("avg 6.75 → 7.0 (rounds UP)", () => {
    // 7.5 + 7 + 6.5 + 6 = 27 / 4 = 6.75 → round up to 7.0
    expect(
      overallBand({ listening: 7.5, reading: 7, writing: 6.5, speaking: 6 }),
    ).toBe(7);
  });

  it("avg 6.625 → 6.5 (rounds DOWN)", () => {
    // 7.5 + 6.5 + 6.5 + 6 = 26.5 / 4 = 6.625 → round down to 6.5
    expect(
      overallBand({ listening: 7.5, reading: 6.5, writing: 6.5, speaking: 6 }),
    ).toBe(6.5);
  });

  it("matches a known canonical example: 6.5/7/6/6 → 6.5", () => {
    // 6.5 + 7 + 6 + 6 = 25.5 / 4 = 6.375 → 6.5
    expect(
      overallBand({ listening: 6.5, reading: 7, writing: 6, speaking: 6 }),
    ).toBe(6.5);
  });
});

describe("descriptorForBand", () => {
  it("returns the descriptor for a whole band", () => {
    const d = descriptorForBand(7);
    expect(d?.band).toBe(7);
    expect(d?.label_en).toBe("Good user");
  });

  it("rounds half bands down to the nearest whole-band descriptor", () => {
    const d = descriptorForBand(6.5);
    expect(d?.band).toBe(6);
  });
});
