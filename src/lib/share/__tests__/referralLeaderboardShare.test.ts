// @vitest-environment node
//
// Pure-helper tests for the referral leaderboard share-card lib.
// We don't paint a real canvas under jsdom — the painters are tested
// indirectly via the caption helpers and the sanitiser that they rely
// on.

import { describe, expect, it } from "vitest";

import {
  CARD_WIDTH,
  CARD_HEIGHT,
  formatReferralCaption,
  formatReferralCaptionEn,
  sanitizeDisplayNameForCard,
} from "../referralLeaderboardShare";

describe("layout constants", () => {
  it("matches Facebook OG card dimensions (1200x630)", () => {
    expect(CARD_WIDTH).toBe(1200);
    expect(CARD_HEIGHT).toBe(630);
  });
});

describe("formatReferralCaption (Vietnamese)", () => {
  it("includes rank and count", () => {
    const caption = formatReferralCaption(7, 12);
    expect(caption).toContain("#7");
    expect(caption).toContain("12");
  });

  it("renders the canonical Vietnamese phrasing", () => {
    expect(formatReferralCaption(1, 5)).toBe(
      "Tôi đang hạng #1 người mời tháng này — đã mời 5 người dùng MercyBlade",
    );
  });

  it("clamps rank to 1..9999", () => {
    expect(formatReferralCaption(0, 1)).toContain("#1");
    expect(formatReferralCaption(99999, 1)).toContain("#9999");
  });

  it("clamps negative count to 0", () => {
    expect(formatReferralCaption(1, -10)).toContain("0 người dùng");
  });

  it("rounds non-integer rank/count to integers", () => {
    expect(formatReferralCaption(3.7, 5.4)).toContain("#4");
    expect(formatReferralCaption(3.7, 5.4)).toContain("5 người dùng");
  });

  it("handles non-finite values without throwing", () => {
    expect(() => formatReferralCaption(NaN, NaN)).not.toThrow();
    expect(formatReferralCaption(NaN, NaN)).toContain("#1");
  });
});

describe("formatReferralCaptionEn", () => {
  it("emits English secondary line", () => {
    expect(formatReferralCaptionEn(3, 9)).toBe(
      "I'm referrer #3 on MercyBlade this month — invited 9 learners",
    );
  });
});

describe("sanitizeDisplayNameForCard", () => {
  it("preserves whitelisted emoji", () => {
    expect(sanitizeDisplayNameForCard("Linh ✨💎🏆")).toBe("Linh ✨💎🏆");
  });

  it("strips disallowed emoji", () => {
    expect(sanitizeDisplayNameForCard("Linh 🔥😎")).toBe("Linh");
  });

  it("trims whitespace + bounds at 30 codepoints", () => {
    const long = "  " + "a".repeat(50) + "  ";
    const result = sanitizeDisplayNameForCard(long);
    expect(Array.from(result).length).toBe(30);
    expect(result.startsWith("a")).toBe(true);
  });

  it("returns empty string on empty input", () => {
    expect(sanitizeDisplayNameForCard("")).toBe("");
    expect(sanitizeDisplayNameForCard("   ")).toBe("");
  });
});
