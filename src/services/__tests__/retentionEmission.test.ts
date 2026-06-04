import { vi, describe, it, expect, beforeEach } from "vitest";

const h = vi.hoisted(() => ({ emit: vi.fn(), hook: vi.fn() }));

// B's outcome-event emitter (dark behind RETENTION_OUTCOME_EVENTS) — spy on it.
vi.mock("@/lib/analytics", () => ({ emitFeatureOutcome: h.emit }));
vi.mock("@/notificationEngine", () => ({ onFirstActionOfDay: h.hook }));
vi.mock("@/lib/supabaseClient", () => ({
  supabase: { auth: { getUser: async () => ({ data: { user: null } }) } },
}));

import { awardPoints } from "@/services/pointsService";

beforeEach(() => {
  h.emit.mockClear();
  h.hook.mockClear();
  // localStorage reset by the canonical storage mock in global setup.
});

describe("pointsService → retention-loop outcome emission", () => {
  it("emits one 'completed' for the retention_loop on the first action of the local day", () => {
    awardPoints("keyword_click");
    awardPoints("keyword_click");
    expect(h.emit).toHaveBeenCalledTimes(1);
    expect(h.emit).toHaveBeenCalledWith("retention_loop", "completed");
  });

  it("is wired to the same first-action-of-day gate as the notification hook", () => {
    awardPoints("keyword_click");
    expect(h.hook).toHaveBeenCalledTimes(1);
    expect(h.emit).toHaveBeenCalledTimes(1);
  });

  it("never throws into the award path even if the emitter rejects", () => {
    h.emit.mockImplementationOnce(() => Promise.reject(new Error("telemetry down")));
    expect(() => awardPoints("keyword_click")).not.toThrow();
    expect(awardPoints("keyword_click")).toBeTypeOf("number"); // awarding still works
  });
});
