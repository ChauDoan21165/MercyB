// Pure-function tests for the share-card module. The canvas paint
// itself isn't covered (jsdom's canvas is a no-op stub) — the bits
// that drive the visual decisions are extracted as standalone helpers
// and tested here.

import { describe, it, expect } from "vitest";

import {
  CARD_HEIGHT,
  CARD_WIDTH,
  chipColorForScore,
  formatShareHeadline,
} from "../scoreCard";

describe("CARD_WIDTH / CARD_HEIGHT", () => {
  it("matches the Facebook OG card aspect (1200×630)", () => {
    expect(CARD_WIDTH).toBe(1200);
    expect(CARD_HEIGHT).toBe(630);
  });
});

describe("chipColorForScore", () => {
  it("≥ 85 → correct (green)", () => {
    expect(chipColorForScore(85)).toBe("correct");
    expect(chipColorForScore(100)).toBe("correct");
    expect(chipColorForScore(94)).toBe("correct");
  });

  it("60..84 → close (amber)", () => {
    expect(chipColorForScore(60)).toBe("close");
    expect(chipColorForScore(72)).toBe("close");
    expect(chipColorForScore(84)).toBe("close");
  });

  it("< 60 → practice (rose)", () => {
    expect(chipColorForScore(59)).toBe("practice");
    expect(chipColorForScore(0)).toBe("practice");
    expect(chipColorForScore(30)).toBe("practice");
  });

  it("undefined / NaN / non-finite → neutral", () => {
    expect(chipColorForScore(undefined)).toBe("neutral");
    expect(chipColorForScore(Number.NaN)).toBe("neutral");
    // Infinity is not finite; treated as "no signal" rather than
    // silently passing the >= 85 branch.
    expect(chipColorForScore(Number.POSITIVE_INFINITY)).toBe("neutral");
  });
});

describe("formatShareHeadline", () => {
  it("Vietnamese template, VN diacritics intact", () => {
    expect(formatShareHeadline(94, "vi")).toBe(
      "Tôi đạt 94/100 trên MercyBlade!",
    );
  });

  it("English template", () => {
    expect(formatShareHeadline(94, "en")).toBe(
      "I scored 94/100 on MercyBlade!",
    );
  });

  it("clamps below 0 to 0", () => {
    expect(formatShareHeadline(-30, "vi")).toBe("Tôi đạt 0/100 trên MercyBlade!");
    expect(formatShareHeadline(-30, "en")).toBe("I scored 0/100 on MercyBlade!");
  });

  it("clamps above 100 to 100", () => {
    expect(formatShareHeadline(150, "vi")).toBe("Tôi đạt 100/100 trên MercyBlade!");
    expect(formatShareHeadline(150, "en")).toBe("I scored 100/100 on MercyBlade!");
  });

  it("rounds non-integer scores", () => {
    expect(formatShareHeadline(89.6, "en")).toBe("I scored 90/100 on MercyBlade!");
    expect(formatShareHeadline(72.4, "vi")).toBe("Tôi đạt 72/100 trên MercyBlade!");
  });

  it("treats NaN / non-finite as 0", () => {
    expect(formatShareHeadline(Number.NaN, "en")).toBe("I scored 0/100 on MercyBlade!");
  });
});
