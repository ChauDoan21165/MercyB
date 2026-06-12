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
      "{{count}} days in a row. Nice steady practice.",
    );
    expect(streakTooltip.vi).toBe(
      "Bạn đã học {{count}} ngày liên tiếp. Nhịp học đang đều.",
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
    // Shame-audit fix (reports/streak-shame-audit-2026-04-26.md § F-1):
    // warning pill renamed away from the "Almost lost / Sắp mất chuỗi"
    // loss frame to a non-loss frame.
    expect(statusPills.warning).toBe("Grace day open · Còn ngày ân hạn");
    expect(statusPills.reset).toBe("Restarted · Bắt đầu lại");
  });

  it("warning pill never volunteers loss-framing words", () => {
    // Voice guideline: never volunteer 'lost / mất / broken / gãy'
    // in system-initiated copy. (See docs/voice-guidelines-vn.md.)
    const w = statusPills.warning.toLowerCase();
    expect(w).not.toContain("lost");
    expect(w).not.toContain("mất");
    expect(w).not.toContain("broken");
  });

  it("graceMessage matches the dictionary", () => {
    // Shame-audit fix § F-2: rewritten from the "protect your streak"
    // loss-prevention frame to permission-to-rest framing. The new
    // copy names tiredness explicitly with "Mệt thì cũng không sao."
    expect(graceMessage.en).toBe(
      "You still have a grace day — a few minutes today is enough. If you're tired, that's okay too.",
    );
    expect(graceMessage.vi).toBe(
      "Bạn còn ngày ân hạn — học vài phút hôm nay là đủ. Mệt thì cũng không sao.",
    );
  });

  it("graceMessage carries permission-to-rest framing in VN", () => {
    // Voice guideline rule 4: the highest-leverage line in the audit
    // is "Mệt thì cũng không sao." Lock it as a content invariant so
    // a future copy edit can't quietly drop it.
    expect(graceMessage.vi).toContain("Mệt thì cũng không sao");
  });

  it("emptyState matches the dictionary", () => {
    expect(emptyState.en).toBe("Start learning today to build your streak!");
    expect(emptyState.vi).toBe(
      "Học một chút hôm nay để bắt đầu nhịp học của bạn nhé.",
    );
  });
});

describe("formatStreakTooltip", () => {
  it("interpolates {{count}} on both sides", () => {
    const r = formatStreakTooltip(7);
    expect(r.en).toBe("7 days in a row. Nice steady practice.");
    expect(r.vi).toBe("Bạn đã học 7 ngày liên tiếp. Nhịp học đang đều.");
  });

  it("coerces non-integer counts via String()", () => {
    expect(formatStreakTooltip(0).en).toContain("0 days");
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
