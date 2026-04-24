import { describe, it, expect } from "vitest";

import {
  emptyState,
  formatStreakTooltip,
  graceMessage,
  labels,
  splitBilingual,
  statusPills,
  streakTooltip,
} from "../streakCopy";

/**
 * These tests pin Chau's review-approved strings. If any of these fail,
 * a copy change has slipped in without an intentional update to the
 * dictionary.
 */

describe("streakCopy — exact strings (Chau-approved)", () => {
  it("streakTooltip.en / vi match the PR #32 review", () => {
    expect(streakTooltip.en).toBe(
      "You're on a {{count}}-day streak! Keep it going 🔥",
    );
    expect(streakTooltip.vi).toBe(
      "Bạn đang có chuỗi {{count}} ngày! Cố lên nhé 🔥",
    );
  });

  it("labels match the dictionary", () => {
    expect(labels.myProgress).toBe("My Progress · Tiến độ của tôi");
    expect(labels.currentStreak).toBe("Current streak · Chuỗi hiện tại");
    expect(labels.longestStreak).toBe("Longest streak · Chuỗi dài nhất");
    expect(labels.lastStudied).toBe("Last studied · Học lần cuối");
  });

  it("statusPills match the dictionary", () => {
    expect(statusPills.active).toBe("Active · Đang duy trì");
    expect(statusPills.grace).toBe("Grace period · Còn ân hạn");
    expect(statusPills.warning).toBe("Almost lost · Sắp mất chuỗi");
    expect(statusPills.reset).toBe("Reset · Đã reset");
  });

  it("graceMessage matches the dictionary", () => {
    expect(graceMessage.en).toBe(
      "You have 1 day of grace left. Study anything today to protect your streak!",
    );
    expect(graceMessage.vi).toBe(
      "Bạn còn 1 ngày ân hạn. Học bất kỳ gì hôm nay là giữ được chuỗi ngay!",
    );
  });

  it("emptyState matches the dictionary", () => {
    expect(emptyState.en).toBe("Start learning today to build your streak!");
    expect(emptyState.vi).toBe(
      "Học hôm nay để bắt đầu xây dựng chuỗi của bạn nhé!",
    );
  });
});

describe("formatStreakTooltip", () => {
  it("interpolates {{count}} on both sides", () => {
    const r = formatStreakTooltip(7);
    expect(r.en).toBe("You're on a 7-day streak! Keep it going 🔥");
    expect(r.vi).toBe("Bạn đang có chuỗi 7 ngày! Cố lên nhé 🔥");
  });

  it("coerces non-integer counts via String()", () => {
    expect(formatStreakTooltip(0).en).toContain("0-day");
    expect(formatStreakTooltip(100).vi).toContain("100 ngày");
  });
});

describe("splitBilingual", () => {
  it("splits on the ' · ' separator", () => {
    expect(splitBilingual("Active · Đang duy trì")).toEqual({
      en: "Active",
      vi: "Đang duy trì",
    });
  });

  it("returns the whole string as EN + empty VI when no separator", () => {
    expect(splitBilingual("Hello world")).toEqual({
      en: "Hello world",
      vi: "",
    });
  });
});
