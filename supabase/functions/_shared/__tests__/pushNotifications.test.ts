// supabase/functions/_shared/__tests__/pushNotifications.test.ts

import { describe, it, expect } from "vitest";

import {
  NOTIFICATION_COPY,
  NOTIFICATION_DEFAULTS,
  NOTIFICATION_TYPES,
  buildPush,
  decideSend,
  hasUnresolvedTokens,
  interpolate,
  isWithinQuietHours,
  localTimeInZone,
  type NotificationType,
  type QuietHours,
} from "../pushNotifications";

describe("NOTIFICATION_TYPES — registry", () => {
  it("includes all five canonical types", () => {
    expect(NOTIFICATION_TYPES).toEqual([
      "daily_practice",
      "streak_grace",
      "leaderboard_position_change",
      "mercy_message",
      "trial_expiring",
    ]);
  });

  it("has VI + EN copy for every type", () => {
    for (const type of NOTIFICATION_TYPES) {
      expect(NOTIFICATION_COPY[type]).toBeDefined();
      expect(NOTIFICATION_COPY[type].vi.title).toBeTruthy();
      expect(NOTIFICATION_COPY[type].vi.body).toBeTruthy();
      expect(NOTIFICATION_COPY[type].en.title).toBeTruthy();
      expect(NOTIFICATION_COPY[type].en.body).toBeTruthy();
    }
  });

  it("has a default boolean for every type", () => {
    for (const type of NOTIFICATION_TYPES) {
      expect(typeof NOTIFICATION_DEFAULTS[type]).toBe("boolean");
    }
  });

  it("daily_practice is the only opt-in default (false)", () => {
    expect(NOTIFICATION_DEFAULTS.daily_practice).toBe(false);
    for (const type of NOTIFICATION_TYPES) {
      if (type === "daily_practice") continue;
      expect(NOTIFICATION_DEFAULTS[type]).toBe(true);
    }
  });
});

describe("interpolate", () => {
  it("substitutes a single token", () => {
    expect(interpolate("Hi {{name}}", { name: "Lan" })).toBe("Hi Lan");
  });

  it("substitutes multiple tokens including numbers", () => {
    expect(
      interpolate("rank #{{rank}} ({{streak}}d)", { rank: 3, streak: 10 }),
    ).toBe("rank #3 (10d)");
  });

  it("leaves unknown tokens in place", () => {
    expect(interpolate("Hi {{name}} {{missing}}", { name: "Lan" })).toBe(
      "Hi Lan {{missing}}",
    );
  });

  it("leaves the template intact when no vars match", () => {
    expect(interpolate("Plain string", { unused: "x" })).toBe("Plain string");
  });

  it("treats undefined and null values as missing", () => {
    expect(
      interpolate("Hi {{a}} {{b}}", { a: undefined, b: "ok" }),
    ).toBe("Hi {{a}} ok");
  });
});

describe("hasUnresolvedTokens", () => {
  it("detects bare {{token}} placeholders", () => {
    expect(hasUnresolvedTokens("Hello {{name}}")).toBe(true);
  });

  it("returns false for resolved or token-free strings", () => {
    expect(hasUnresolvedTokens("Hello Lan")).toBe(false);
    expect(hasUnresolvedTokens("")).toBe(false);
  });
});

describe("isWithinQuietHours", () => {
  const standardQuiet: QuietHours = { start: "22:00", end: "07:00" };

  it("returns true for late-night times in a wrapping window", () => {
    expect(isWithinQuietHours("23:30", standardQuiet)).toBe(true);
  });

  it("returns true for early-morning times in a wrapping window", () => {
    expect(isWithinQuietHours("06:30", standardQuiet)).toBe(true);
  });

  it("returns false for daytime in a wrapping window", () => {
    expect(isWithinQuietHours("12:00", standardQuiet)).toBe(false);
  });

  it("treats the start boundary as inside, the end boundary as outside", () => {
    expect(isWithinQuietHours("22:00", standardQuiet)).toBe(true);
    expect(isWithinQuietHours("07:00", standardQuiet)).toBe(false);
  });

  it("handles non-wrapping windows correctly", () => {
    const lunch: QuietHours = { start: "12:00", end: "13:00" };
    expect(isWithinQuietHours("12:30", lunch)).toBe(true);
    expect(isWithinQuietHours("13:00", lunch)).toBe(false);
    expect(isWithinQuietHours("11:59", lunch)).toBe(false);
  });

  it("returns false for an empty window (start == end)", () => {
    const empty: QuietHours = { start: "08:00", end: "08:00" };
    expect(isWithinQuietHours("08:00", empty)).toBe(false);
    expect(isWithinQuietHours("12:00", empty)).toBe(false);
  });

  it("returns false on malformed input rather than throwing", () => {
    expect(isWithinQuietHours("nope", standardQuiet)).toBe(false);
    expect(
      isWithinQuietHours("12:00", { start: "x", end: "y" }),
    ).toBe(false);
  });
});

describe("localTimeInZone", () => {
  it("returns HH:MM for a known instant in ICT", () => {
    // 2026-04-27T00:00:00Z → 07:00 ICT (UTC+7).
    const result = localTimeInZone(
      new Date("2026-04-27T00:00:00Z"),
      "Asia/Ho_Chi_Minh",
    );
    expect(result).toBe("07:00");
  });

  it("returns HH:MM for a midday-UTC instant in PT during DST", () => {
    // 2026-07-01T19:00:00Z → 12:00 PDT (UTC-7).
    const result = localTimeInZone(
      new Date("2026-07-01T19:00:00Z"),
      "America/Los_Angeles",
    );
    expect(result).toBe("12:00");
  });

  it("falls back gracefully on an invalid timezone string", () => {
    const result = localTimeInZone(
      new Date("2026-04-27T03:14:00Z"),
      "Not/AReal_Zone",
    );
    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });
});

describe("decideSend", () => {
  const baseQuiet: QuietHours = { start: "22:00", end: "07:00" };

  function input(overrides: Partial<Parameters<typeof decideSend>[0]> = {}) {
    return {
      type: "daily_practice" as NotificationType,
      preference_enabled: true,
      active_token_count: 1,
      current_local_time: "12:00",
      quiet: baseQuiet,
      ...overrides,
    };
  }

  it("returns send when all gates pass", () => {
    expect(decideSend(input())).toEqual({ kind: "send" });
  });

  it("skips on disabled preference", () => {
    expect(decideSend(input({ preference_enabled: false })))
      .toEqual({ kind: "skipped_pref" });
  });

  it("skips when there are no active tokens", () => {
    expect(decideSend(input({ active_token_count: 0 })))
      .toEqual({ kind: "skipped_no_token" });
  });

  it("skips during quiet hours", () => {
    expect(decideSend(input({ current_local_time: "23:30" })))
      .toEqual({ kind: "skipped_quiet_hours" });
  });

  it("preference check beats quiet-hours check (deterministic order)", () => {
    expect(
      decideSend(
        input({ preference_enabled: false, current_local_time: "23:30" }),
      ),
    ).toEqual({ kind: "skipped_pref" });
  });
});

describe("buildPush", () => {
  it("builds the daily_practice copy in Vietnamese", () => {
    const out = buildPush("daily_practice", "vi", {});
    expect(out).not.toBeNull();
    expect(out!.title).toContain("Mercy");
    expect(out!.body.length).toBeGreaterThan(10);
    expect(out!.data.type).toBe("daily_practice");
    expect(out!.data.locale).toBe("vi");
  });

  it("interpolates variables for streak_grace", () => {
    const out = buildPush("streak_grace", "en", { streak: 12 });
    expect(out).not.toBeNull();
    expect(out!.title).toContain("12-day");
    expect(out!.title).not.toMatch(/\{\{\w+\}\}/);
  });

  it("interpolates variables for leaderboard_position_change", () => {
    const out = buildPush("leaderboard_position_change", "vi", { rank: 4 });
    expect(out).not.toBeNull();
    expect(out!.title).toContain("4");
  });

  it("returns null when a required variable is missing", () => {
    expect(buildPush("streak_grace", "vi", {})).toBeNull();
    expect(buildPush("mercy_message", "vi", {})).toBeNull();
  });

  it("merges caller-supplied data without dropping type/locale", () => {
    const out = buildPush(
      "mercy_message",
      "en",
      { preview: "Try this!" },
      { deeplink: "/chat/abc" },
    );
    expect(out).not.toBeNull();
    expect(out!.data.deeplink).toBe("/chat/abc");
    expect(out!.data.type).toBe("mercy_message");
    expect(out!.data.locale).toBe("en");
  });
});
