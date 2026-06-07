// src/notificationEngine/__tests__/localScheduler.test.ts
//
// ON-path safety for the local-notifications ADAPTER — the layer the
// orchestrator trusts to be fail-soft. Two guarantees the instant
// FEATURE_NOTIFICATIONS flips on:
//
//   - web/CI (non-native) never touch the plugin → schedule/cancel no-op.
//   - on a real device a plugin error is SWALLOWED: a missed schedule must
//     never break the learner action that triggered it.
//
// Also pins the device-local schedule shape (repeating `on:{hour,minute}` vs
// one-shot `at`), which the planners depend on.

import { vi, describe, it, expect, beforeEach } from "vitest";

const h = vi.hoisted(() => ({
  isNative: true as boolean,
  schedule: vi.fn(async (..._a: unknown[]) => {}),
  cancelFn: vi.fn(async (..._a: unknown[]) => {}),
}));

vi.mock("@capacitor/core", () => ({
  Capacitor: { isNativePlatform: () => h.isNative },
}));
vi.mock("@capacitor/local-notifications", () => ({
  LocalNotifications: { schedule: h.schedule, cancel: h.cancelFn },
}));

import {
  scheduleRepeatingDaily,
  scheduleOneShotLocal,
  cancel,
} from "../localScheduler";

beforeEach(() => {
  h.isNative = true;
  h.schedule.mockReset();
  h.schedule.mockResolvedValue(undefined);
  h.cancelFn.mockReset();
  h.cancelFn.mockResolvedValue(undefined);
});

describe("localScheduler — non-native is inert", () => {
  it("schedule/cancel never touch the plugin on web/CI", async () => {
    h.isNative = false;
    await scheduleRepeatingDaily({ id: 1001, hour: 8, minute: 0, title: "t", body: "b" });
    await scheduleOneShotLocal({ id: 1002, at: new Date("2026-06-02T13:00:00Z"), title: "t", body: "b" });
    await cancel([1001, 1002]);
    expect(h.schedule).not.toHaveBeenCalled();
    expect(h.cancelFn).not.toHaveBeenCalled();
  });
});

describe("localScheduler — fail-soft on device", () => {
  it("swallows a throwing plugin (schedule) — never rejects", async () => {
    h.schedule.mockRejectedValueOnce(new Error("plugin boom"));
    await expect(
      scheduleRepeatingDaily({ id: 1001, hour: 8, minute: 0, title: "t", body: "b" }),
    ).resolves.toBeUndefined();
  });

  it("swallows a throwing plugin (cancel) — never rejects", async () => {
    h.cancelFn.mockRejectedValueOnce(new Error("plugin boom"));
    await expect(cancel([1001])).resolves.toBeUndefined();
  });

  it("cancel with an empty id list is a no-op", async () => {
    await cancel([]);
    expect(h.cancelFn).not.toHaveBeenCalled();
  });
});

describe("localScheduler — device-local schedule shape", () => {
  it("repeating daily uses on:{hour,minute} + allowWhileIdle (inexact)", async () => {
    await scheduleRepeatingDaily({ id: 1001, hour: 19, minute: 30, title: "T", body: "B" });
    const arg = h.schedule.mock.calls[0][0] as { notifications: Array<Record<string, unknown>> };
    const n = arg.notifications[0] as { id: number; schedule: { on: unknown; allowWhileIdle: boolean } };
    expect(n.id).toBe(1001);
    expect(n.schedule.on).toEqual({ hour: 19, minute: 30 });
    expect(n.schedule.allowWhileIdle).toBe(true);
  });

  it("one-shot uses an absolute `at` instant", async () => {
    const at = new Date("2026-06-02T13:00:00Z");
    await scheduleOneShotLocal({ id: 1002, at, title: "T", body: "B" });
    const arg = h.schedule.mock.calls[0][0] as { notifications: Array<Record<string, unknown>> };
    const n = arg.notifications[0] as { id: number; schedule: { at: Date } };
    expect(n.id).toBe(1002);
    expect(n.schedule.at).toBe(at);
  });

  it("cancel maps ids to the plugin's {id} shape", async () => {
    await cancel([1001, 1003]);
    expect(h.cancelFn).toHaveBeenCalledWith({ notifications: [{ id: 1001 }, { id: 1003 }] });
  });
});
