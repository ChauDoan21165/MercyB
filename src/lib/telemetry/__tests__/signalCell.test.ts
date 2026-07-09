import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/monitoring/captureException", () => ({
  addBreadcrumb: vi.fn(),
  captureActionFailure: vi.fn(),
}));

import { addBreadcrumb, captureActionFailure } from "@/lib/monitoring/captureException";
import { openSignal, track } from "../signalCell";

const breadcrumb = vi.mocked(addBreadcrumb);
const failure = vi.mocked(captureActionFailure);

/** Deterministic timer + clock so no test depends on wall time. */
function harness() {
  let now = 0;
  const timers: Array<{ fn: () => void; at: number; cleared: boolean }> = [];
  return {
    deps: {
      now: () => now,
      setTimer: (fn: () => void, ms: number) => {
        timers.push({ fn, at: now + ms, cleared: false });
        return (timers.length - 1) as unknown as ReturnType<typeof setTimeout>;
      },
      clearTimer: (handle: ReturnType<typeof setTimeout>) => {
        const entry = timers[handle as unknown as number];
        if (entry) entry.cleared = true;
      },
    },
    advance(ms: number) {
      now += ms;
      for (const t of timers) {
        if (!t.cleared && t.at <= now) {
          t.cleared = true;
          t.fn();
        }
      }
    },
  };
}

beforeEach(() => {
  breadcrumb.mockClear();
  failure.mockClear();
});

describe("openSignal", () => {
  it("emits a started breadcrumb immediately", () => {
    const h = harness();
    openSignal("PLACEMENT_LOAD_AUDIO", h.deps);
    expect(breadcrumb).toHaveBeenCalledTimes(1);
    expect(breadcrumb.mock.calls[0][0].data).toMatchObject({
      action_code: "PLACEMENT_LOAD_AUDIO",
      outcome: "started",
    });
  });

  it("emits failed{timeout} when the action never settles", () => {
    const h = harness();
    openSignal("PLACEMENT_RENDER_RESULTS", { ...h.deps, timeoutMs: 10_000 });

    h.advance(9_999);
    expect(failure).not.toHaveBeenCalled();

    h.advance(1);
    expect(failure).toHaveBeenCalledTimes(1);
    expect(failure).toHaveBeenCalledWith(
      "PLACEMENT_RENDER_RESULTS",
      "timeout",
      expect.objectContaining({ timeout_ms: 10_000, elapsed_ms: 10_000 }),
    );
  });

  it("does not emit a timeout after succeeding", () => {
    const h = harness();
    const cell = openSignal("PLACEMENT_SUBMIT_ANSWER", { ...h.deps, timeoutMs: 5_000 });
    cell.succeeded();
    h.advance(60_000);
    expect(failure).not.toHaveBeenCalled();
  });

  it("emits at most one terminal signal (timeout wins over a later failure)", () => {
    const h = harness();
    const cell = openSignal("PLACEMENT_COMPUTE_RESULTS", { ...h.deps, timeoutMs: 1_000 });
    h.advance(1_000);
    cell.failed("exception");
    cell.succeeded();

    expect(failure).toHaveBeenCalledTimes(1);
    expect(failure.mock.calls[0][1]).toBe("timeout");
  });

  it("cancel() suppresses the timeout entirely", () => {
    const h = harness();
    openSignal("PLACEMENT_RENDER_RESULTS", { ...h.deps, timeoutMs: 1_000 }).cancel();
    h.advance(60_000);
    expect(failure).not.toHaveBeenCalled();
  });
});

describe("track", () => {
  it("returns the value and reports succeeded", async () => {
    const h = harness();
    await expect(track("PLACEMENT_FETCH_RESULTS", () => Promise.resolve("ok"), h.deps)).resolves.toBe("ok");
    expect(failure).not.toHaveBeenCalled();
    expect(breadcrumb.mock.calls.at(-1)?.[0].data).toMatchObject({ outcome: "succeeded" });
  });

  it("rethrows the original error unchanged and reports failed{exception}", async () => {
    const h = harness();
    const boom = new Error("upstream exploded");
    await expect(track("PLACEMENT_FETCH_RESULTS", () => Promise.reject(boom), h.deps)).rejects.toBe(boom);
    expect(failure).toHaveBeenCalledWith(
      "PLACEMENT_FETCH_RESULTS",
      "exception",
      expect.objectContaining({ error_message: "upstream exploded" }),
    );
  });

  it("a timed-out action still resolves — telemetry never aborts the work", async () => {
    const h = harness();
    let resolve!: (v: string) => void;
    const pending = new Promise<string>((r) => { resolve = r; });

    const tracked = track("PLACEMENT_SUBMIT_ANSWER", () => pending, { ...h.deps, timeoutMs: 1_000 });
    h.advance(1_000);
    expect(failure).toHaveBeenCalledWith("PLACEMENT_SUBMIT_ANSWER", "timeout", expect.anything());

    resolve("late but correct");
    await expect(tracked).resolves.toBe("late but correct");
  });
});
