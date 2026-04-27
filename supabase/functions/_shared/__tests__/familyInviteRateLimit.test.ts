// supabase/functions/_shared/__tests__/familyInviteRateLimit.test.ts

import { describe, it, expect, vi } from "vitest";

import {
  FAMILY_INVITE_DAILY_LIMIT,
  FAMILY_INVITE_HOURLY_LIMIT,
  buildFamilyInviteRateLimitErrorBody,
  checkFamilyInviteRateLimit,
} from "../familyInviteRateLimit";

function makeDeps(hourlyUsed: number, dailyUsed: number) {
  return {
    countInWindow: vi
      .fn()
      .mockImplementation(async (_userId: string, windowSeconds: number) =>
        windowSeconds <= 60 * 60 ? hourlyUsed : dailyUsed,
      ),
  };
}

describe("checkFamilyInviteRateLimit", () => {
  it("allows a fresh user with batch under both caps", async () => {
    const r = await checkFamilyInviteRateLimit("u-1", 5, makeDeps(0, 0));
    expect(r.allowed).toBe(true);
    expect(r.hourly_remaining).toBe(FAMILY_INVITE_HOURLY_LIMIT);
    expect(r.daily_remaining).toBe(FAMILY_INVITE_DAILY_LIMIT);
    expect(r.remaining).toBe(FAMILY_INVITE_HOURLY_LIMIT);
  });

  it("blocks when batch exceeds the hourly remaining quota", async () => {
    const r = await checkFamilyInviteRateLimit(
      "u-1",
      5,
      makeDeps(FAMILY_INVITE_HOURLY_LIMIT - 2, 0),
    );
    expect(r.allowed).toBe(false);
    expect(r.exceeded).toBe("hour");
    expect(r.hourly_remaining).toBe(2);
  });

  it("blocks when hourly_remaining is exactly 0 even on a 1-recipient batch", async () => {
    const r = await checkFamilyInviteRateLimit(
      "u-1",
      1,
      makeDeps(FAMILY_INVITE_HOURLY_LIMIT, 50),
    );
    expect(r.allowed).toBe(false);
    expect(r.exceeded).toBe("hour");
  });

  it("blocks when batch fits the hour but trips the daily cap", async () => {
    const r = await checkFamilyInviteRateLimit(
      "u-1",
      5,
      makeDeps(0, FAMILY_INVITE_DAILY_LIMIT - 2),
    );
    expect(r.allowed).toBe(false);
    expect(r.exceeded).toBe("day");
  });

  it("returns hour-most-restrictive remaining for the UI display", async () => {
    const r = await checkFamilyInviteRateLimit("u-1", 0, makeDeps(15, 70));
    expect(r.hourly_remaining).toBe(FAMILY_INVITE_HOURLY_LIMIT - 15);
    expect(r.daily_remaining).toBe(FAMILY_INVITE_DAILY_LIMIT - 70);
    expect(r.remaining).toBe(FAMILY_INVITE_HOURLY_LIMIT - 15);
  });

  it("treats batchSize <= 0 as a quota query (always allowed)", async () => {
    const r = await checkFamilyInviteRateLimit(
      "u-1",
      0,
      makeDeps(FAMILY_INVITE_HOURLY_LIMIT, FAMILY_INVITE_DAILY_LIMIT),
    );
    expect(r.allowed).toBe(true);
    expect(r.hourly_remaining).toBe(0);
  });
});

describe("buildFamilyInviteRateLimitErrorBody", () => {
  it("renders bilingual VI/EN with hourly numbers when hour was the trigger", () => {
    const body = buildFamilyInviteRateLimitErrorBody({
      allowed: false,
      hourly_used: 20,
      hourly_limit: 20,
      hourly_remaining: 0,
      daily_used: 30,
      daily_limit: 100,
      daily_remaining: 70,
      exceeded: "hour",
      remaining: 0,
    });
    expect(body.error_code).toBe("FAMILY_INVITE_RATE_LIMIT_EXCEEDED");
    expect(body.error_message_vi).toContain("20 lời mời");
    expect(body.error_message_en).toContain("20 invitations");
    expect(body.exceeded).toBe("hour");
  });

  it("renders the daily-cap message when day was the trigger", () => {
    const body = buildFamilyInviteRateLimitErrorBody({
      allowed: false,
      hourly_used: 5,
      hourly_limit: 20,
      hourly_remaining: 15,
      daily_used: 100,
      daily_limit: 100,
      daily_remaining: 0,
      exceeded: "day",
      remaining: 0,
    });
    expect(body.error_message_vi).toContain("ngày");
    expect(body.error_message_en).toContain("today");
  });
});
