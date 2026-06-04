import { vi, describe, it, expect, beforeEach } from "vitest";

const h = vi.hoisted(() => ({ record: vi.fn(), hook: vi.fn() }));

// The retention emit + dedup now live in recordActiveDay (the canonical choke
// point); pointsService just routes through it. Spy on the choke point.
vi.mock("@/lib/retention/recordActiveDay", () => ({ recordActiveDay: h.record }));
vi.mock("@/notificationEngine", () => ({ onFirstActionOfDay: h.hook }));
vi.mock("@/lib/supabaseClient", () => ({
  supabase: { auth: { getUser: async () => ({ data: { user: null } }) } },
}));

import { awardPoints } from "@/services/pointsService";

beforeEach(() => {
  h.record.mockClear();
  h.hook.mockClear();
});

describe("pointsService → recordActiveDay wiring (verified-live Path A: keyword + pronunciation)", () => {
  it("routes PRODUCTION learner reason-codes through the active-day choke point", () => {
    awardPoints("keyword_click");
    expect(h.record).toHaveBeenCalledTimes(1);
  });

  it("records for pronunciation reason-codes (speak_*)", () => {
    awardPoints("speak_attempt");
    awardPoints("speak_match_high");
    expect(h.record).toHaveBeenCalledTimes(2);
  });

  it("does NOT record an active day for zero-point events (no passive/no-op firing)", () => {
    awardPoints("streak_bonus"); // 0 pts → returns before the seam
    expect(h.record).not.toHaveBeenCalled();
  });

  it("does NOT record for NON-ZERO but PASSIVE earners — gate is an allowlist, not 'any non-zero'", () => {
    // room_open (5 pts) and audio_listen (15 pts) are non-zero yet passive.
    // Counting them was the undercount-vs-bias trap; the allowlist excludes them.
    awardPoints("room_open");
    awardPoints("audio_listen");
    expect(h.record).not.toHaveBeenCalled();
  });

  it("still fires the first-action-of-day notification hook", () => {
    awardPoints("keyword_click");
    expect(h.hook).toHaveBeenCalledTimes(1);
  });

  it("awarding still works (returns points) alongside the active-day signal", () => {
    expect(awardPoints("keyword_click")).toBeTypeOf("number");
  });
});
