import { vi, describe, it, expect, beforeEach } from "vitest";

const h = vi.hoisted(() => ({
  flags: { FEATURE_NOTIFICATIONS: true },
  cancel: vi.fn(async () => {}),
  refresh: vi.fn(async () => {}),
  requestOnce: vi.fn(async () => false),
}));

vi.mock("@/lib/featureFlags", () => ({ FEATURE_FLAGS: h.flags }));
vi.mock("../localScheduler", () => ({ cancel: h.cancel }));
vi.mock("../lifecycle", () => ({ refreshNotificationSchedule: h.refresh }));
vi.mock("../permissions", () => ({
  requestNotificationPermissionOnce: h.requestOnce,
}));

import {
  onFirstActionOfDay,
  onFirstCompletedActivity,
  onReviewQueueChanged,
} from "../activityIntegration";
import { NOTIFICATION_IDS } from "../types";

const flush = () => new Promise((r) => setTimeout(r, 0));

beforeEach(() => {
  h.flags.FEATURE_NOTIFICATIONS = true;
  h.cancel.mockClear();
  h.refresh.mockClear();
  h.requestOnce.mockClear();
});

describe("activityIntegration — flag OFF makes every hook inert", () => {
  it("no cancel, no permission request, no refresh when feature off", async () => {
    h.flags.FEATURE_NOTIFICATIONS = false;
    onFirstActionOfDay();
    onFirstCompletedActivity({ source: "room", event: "room_completed" });
    onReviewQueueChanged();
    await flush();
    expect(h.cancel).not.toHaveBeenCalled();
    expect(h.requestOnce).not.toHaveBeenCalled();
    expect(h.refresh).not.toHaveBeenCalled();
  });
});

describe("activityIntegration — flag ON", () => {
  it("onFirstActionOfDay cancels the streak-save (1002) and refreshes", () => {
    onFirstActionOfDay();
    expect(h.cancel).toHaveBeenCalledWith([NOTIFICATION_IDS.streak_save]);
    expect(h.refresh).toHaveBeenCalledTimes(1);
  });

  it("onFirstCompletedActivity requests permission once (the only prompt site)", async () => {
    onFirstCompletedActivity({ source: "vocabulary", event: "review_completed" });
    await flush();
    expect(h.requestOnce).toHaveBeenCalledTimes(1);
  });

  it("onReviewQueueChanged refreshes the schedule", () => {
    onReviewQueueChanged();
    expect(h.refresh).toHaveBeenCalledTimes(1);
  });

  it("onFirstCompletedActivity refreshes ONLY when permission is granted", async () => {
    h.requestOnce.mockResolvedValueOnce(true);
    onFirstCompletedActivity({ source: "room", event: "room_completed" });
    await flush();
    expect(h.requestOnce).toHaveBeenCalledTimes(1);
    expect(h.refresh).toHaveBeenCalledTimes(1); // granted → schedule
  });

  it("onFirstCompletedActivity does NOT refresh when permission is denied", async () => {
    h.requestOnce.mockResolvedValueOnce(false);
    onFirstCompletedActivity({ source: "room", event: "room_completed" });
    await flush();
    expect(h.requestOnce).toHaveBeenCalledTimes(1);
    expect(h.refresh).not.toHaveBeenCalled(); // denied → nothing scheduled
  });
});
