import { describe, it, expect } from "vitest";
import {
  categorizeForReengagement,
  categorizeUsersForReengagement,
  reengagementCampaignFor,
  REENGAGEMENT_BUCKET_TO_CAMPAIGN,
  REENGAGEMENT_THRESHOLDS,
  type ReengagementUserRow,
  type RecentActivity,
} from "../categorizeUsers";

const NOW = new Date("2026-04-26T12:00:00Z");
const DAY_MS = 24 * 60 * 60 * 1000;

const daysAgo = (n: number, base: Date = NOW): string =>
  new Date(base.getTime() - n * DAY_MS).toISOString();

const row = (overrides: Partial<ReengagementUserRow> = {}): ReengagementUserRow => ({
  id: "00000000-0000-0000-0000-000000000001",
  email: "user@example.com",
  last_active_at: null,
  trial_started_at: null,
  trial_ends_at: null,
  current_period_start_at: null,
  current_period_end_at: null,
  subscription_status: null,
  tier: 0,
  ...overrides,
});

describe("categorizeForReengagement — skipped guards", () => {
  it("returns 'skipped' when email is null", () => {
    expect(
      categorizeForReengagement(
        row({ email: null, last_active_at: daysAgo(10) }),
        NOW,
      ),
    ).toBe("skipped");
  });

  it("returns 'skipped' when last_active_at is null and no trial/sub state", () => {
    expect(categorizeForReengagement(row(), NOW)).toBe("skipped");
  });

  it("returns 'skipped' for users active in the last 7 days (free)", () => {
    expect(
      categorizeForReengagement(row({ last_active_at: daysAgo(3) }), NOW),
    ).toBe("skipped");
  });
});

describe("categorizeForReengagement — active_then_silent", () => {
  it("buckets a free user silent for 7–30 days", () => {
    expect(
      categorizeForReengagement(row({ last_active_at: daysAgo(10) }), NOW),
    ).toBe("active_then_silent");
    expect(
      categorizeForReengagement(row({ last_active_at: daysAgo(7) }), NOW),
    ).toBe("active_then_silent");
    expect(
      categorizeForReengagement(row({ last_active_at: daysAgo(29.9) }), NOW),
    ).toBe("active_then_silent");
  });

  it("does not bucket a free user silent for 30+ days as active_then_silent", () => {
    // Out of the recent-activity window — those are dead leads, not recoverable.
    expect(
      categorizeForReengagement(row({ last_active_at: daysAgo(45) }), NOW),
    ).toBe("skipped");
  });
});

describe("categorizeForReengagement — trial_completed_no_subscribe", () => {
  it("buckets a user whose trial ended 14+ days ago, never paid, silent 14+ days", () => {
    expect(
      categorizeForReengagement(
        row({
          last_active_at: daysAgo(20),
          trial_ends_at: daysAgo(20),
          tier: 0,
        }),
        NOW,
      ),
    ).toBe("trial_completed_no_subscribe");
  });

  it("does NOT bucket if the user paid (tier > 0) — handled by post_subscribe path", () => {
    expect(
      categorizeForReengagement(
        row({
          last_active_at: daysAgo(20),
          trial_ends_at: daysAgo(20),
          tier: 1,
          subscription_status: "active",
          current_period_start_at: daysAgo(10),
        }),
        NOW,
      ),
    ).toBe("post_subscribe_disengaged");
  });

  it("respects 14-day silence threshold — 5 days post-trial does not qualify", () => {
    expect(
      categorizeForReengagement(
        row({
          last_active_at: daysAgo(5),
          trial_ends_at: daysAgo(5),
          tier: 0,
        }),
        NOW,
      ),
    ).toBe("skipped");
  });

  it("falls back to current_period_end_at when status='trialing'", () => {
    expect(
      categorizeForReengagement(
        row({
          last_active_at: daysAgo(20),
          subscription_status: "trialing",
          current_period_end_at: daysAgo(20),
          tier: 0,
        }),
        NOW,
      ),
    ).toBe("trial_completed_no_subscribe");
  });
});

describe("categorizeForReengagement — post_subscribe_disengaged", () => {
  it("buckets a paid user silent for 7+ days", () => {
    expect(
      categorizeForReengagement(
        row({
          last_active_at: daysAgo(8),
          tier: 1,
          subscription_status: "active",
          current_period_start_at: daysAgo(10),
        }),
        NOW,
      ),
    ).toBe("post_subscribe_disengaged");
  });

  it("treats 'past_due' subscribers as paid (recoverable)", () => {
    expect(
      categorizeForReengagement(
        row({
          last_active_at: daysAgo(10),
          tier: 0,
          subscription_status: "past_due",
          current_period_start_at: daysAgo(10),
        }),
        NOW,
      ),
    ).toBe("post_subscribe_disengaged");
  });

  it("does NOT bucket 'canceled' users", () => {
    expect(
      categorizeForReengagement(
        row({
          last_active_at: daysAgo(10),
          tier: 0,
          subscription_status: "canceled",
        }),
        NOW,
      ),
    ).toBe("active_then_silent");
  });
});

describe("categorizeForReengagement — almost_lapsed", () => {
  const baseAlmostLapsed = (): ReengagementUserRow =>
    row({
      last_active_at: daysAgo(2),
      tier: 1,
      subscription_status: "active",
      current_period_start_at: daysAgo(26),
    });

  it("buckets a paid user 25+ days into period with low engagement (<3 active days)", () => {
    expect(
      categorizeForReengagement(baseAlmostLapsed(), NOW, {
        activeDaysLast30: 1,
      }),
    ).toBe("almost_lapsed");
  });

  it("does NOT bucket a paid user 25+ days in if engagement is healthy", () => {
    expect(
      categorizeForReengagement(baseAlmostLapsed(), NOW, {
        activeDaysLast30: 12,
      }),
    ).toBe("skipped");
  });

  it("does NOT bucket a paid user only 10 days into period (too early)", () => {
    expect(
      categorizeForReengagement(
        row({
          ...baseAlmostLapsed(),
          current_period_start_at: daysAgo(10),
        }),
        NOW,
        { activeDaysLast30: 1 },
      ),
    ).toBe("skipped");
  });

  it("falls back to post_subscribe_disengaged when activity signal is missing", () => {
    // No `activity` arg — almost_lapsed cannot fire (it needs the count).
    // The user is paid + silent 8 days, so the next priority bucket wins.
    expect(
      categorizeForReengagement(
        row({
          last_active_at: daysAgo(8),
          tier: 1,
          subscription_status: "active",
          current_period_start_at: daysAgo(26),
        }),
        NOW,
      ),
    ).toBe("post_subscribe_disengaged");
  });
});

describe("categorizeForReengagement — priority ordering", () => {
  it("almost_lapsed beats post_subscribe_disengaged when both apply", () => {
    expect(
      categorizeForReengagement(
        row({
          last_active_at: daysAgo(8),
          tier: 1,
          subscription_status: "active",
          current_period_start_at: daysAgo(26),
        }),
        NOW,
        { activeDaysLast30: 1 },
      ),
    ).toBe("almost_lapsed");
  });
});

describe("reengagementCampaignFor", () => {
  it("maps each emailable bucket to its campaign string", () => {
    expect(reengagementCampaignFor("active_then_silent")).toBe(
      "reengagement_active_then_silent",
    );
    expect(reengagementCampaignFor("trial_completed_no_subscribe")).toBe(
      "reengagement_trial_completed_d_plus_14",
    );
    expect(reengagementCampaignFor("post_subscribe_disengaged")).toBe(
      "reengagement_post_subscribe_d_plus_7",
    );
    expect(reengagementCampaignFor("almost_lapsed")).toBe(
      "reengagement_almost_lapsed",
    );
  });

  it("returns null for skipped", () => {
    expect(reengagementCampaignFor("skipped")).toBeNull();
  });

  it("REENGAGEMENT_BUCKET_TO_CAMPAIGN agrees with reengagementCampaignFor", () => {
    expect(REENGAGEMENT_BUCKET_TO_CAMPAIGN.active_then_silent).toBe(
      "reengagement_active_then_silent",
    );
    expect(REENGAGEMENT_BUCKET_TO_CAMPAIGN.almost_lapsed).toBe(
      "reengagement_almost_lapsed",
    );
  });

  it("threshold constants match the documented behavior bucket spec", () => {
    expect(REENGAGEMENT_THRESHOLDS).toEqual({
      silentDaysMin: 7,
      activityWindowDays: 30,
      trialCompletedSilenceDays: 14,
      paidSilenceDays: 7,
      almostLapsedDaysIntoPeriod: 25,
      almostLapsedActivityCeiling: 3,
    });
  });
});

describe("categorizeUsersForReengagement", () => {
  it("partitions a mixed list into all five buckets including skipped", () => {
    const rows: ReengagementUserRow[] = [
      row({ id: "a", last_active_at: daysAgo(2) }), // skipped (active)
      row({ id: "b", last_active_at: daysAgo(10) }), // active_then_silent
      row({
        id: "c",
        last_active_at: daysAgo(20),
        trial_ends_at: daysAgo(20),
      }), // trial_completed_no_subscribe
      row({
        id: "d",
        last_active_at: daysAgo(8),
        tier: 1,
        subscription_status: "active",
        current_period_start_at: daysAgo(10),
      }), // post_subscribe_disengaged
      row({
        id: "e",
        last_active_at: daysAgo(2),
        tier: 1,
        subscription_status: "active",
        current_period_start_at: daysAgo(26),
      }), // almost_lapsed (with activity hint)
    ];

    const activity = new Map<string, RecentActivity>();
    activity.set("e", { activeDaysLast30: 1 });

    const result = categorizeUsersForReengagement(rows, NOW, activity);

    expect(result.skipped.map((r) => r.id)).toEqual(["a"]);
    expect(result.active_then_silent.map((r) => r.id)).toEqual(["b"]);
    expect(result.trial_completed_no_subscribe.map((r) => r.id)).toEqual(["c"]);
    expect(result.post_subscribe_disengaged.map((r) => r.id)).toEqual(["d"]);
    expect(result.almost_lapsed.map((r) => r.id)).toEqual(["e"]);
  });
});
