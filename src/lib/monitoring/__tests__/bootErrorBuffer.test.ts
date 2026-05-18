// src/lib/monitoring/__tests__/bootErrorBuffer.test.ts
//
// Locks the contracts the deferred-Sentry boot path depends on. The
// headline test is the task's required proof: an error thrown DURING the
// defer window (before Sentry settles) must arrive in Sentry after init.

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { installBootErrorBuffer } from "../bootErrorBuffer";

// In the real app a global `error` event always has a consumer (Sentry's
// handler and/or attachFatalErrorOverlay). In this isolated unit there is
// none, so an ErrorEvent our buffer deliberately does NOT catch (post-flush,
// over-cap, disabled path) would escalate as a jsdom "uncaught error".
// This bubble-phase swallower models the real "someone handled it" world
// WITHOUT affecting the buffer (its capture-phase listener still runs first;
// preventDefault only suppresses the console/uncaught escalation, never
// other listeners).
let swallow: (e: ErrorEvent) => void;
beforeEach(() => {
  swallow = (e) => e.preventDefault();
  window.addEventListener("error", swallow);
});
afterEach(() => {
  window.removeEventListener("error", swallow);
});

function throwDuringDeferWindow(message: string): void {
  // Simulates a real boot-time throw: a global `error` event before
  // Sentry's own handlers exist (Sentry is still deferred).
  window.dispatchEvent(
    new ErrorEvent("error", { error: new Error(message), message }),
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("bootErrorBuffer — deferred-Sentry observability", () => {
  it("REPLAYS errors thrown during the defer window to Sentry once it settles", () => {
    const captured: unknown[] = [];
    let sentryUp = false;
    const handle = installBootErrorBuffer({
      isEnabled: () => sentryUp,
      getCapture: () => (e) => captured.push(e),
    });

    // ── defer window: Sentry not up yet ──
    throwDuringDeferWindow("boot test");
    window.dispatchEvent(
      Object.assign(new Event("unhandledrejection"), { reason: new Error("boot reject") }),
    );
    expect(captured).toHaveLength(0); // nothing replayed yet
    expect(handle.size()).toBe(2);

    // ── Sentry finishes initializing → whenSentryReady resolves → flush ──
    sentryUp = true;
    handle.flush();

    expect(captured).toHaveLength(2);
    expect((captured[0] as Error).message).toBe("boot test");
    expect((captured[1] as Error).message).toBe("boot reject");
  });

  it("does NOT silently drop when Sentry is disabled — logs to console", () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    const handle = installBootErrorBuffer({
      isEnabled: () => false, // Sentry never came up (no DSN / import failed)
      getCapture: () => null,
    });
    throwDuringDeferWindow("disabled-path error");
    handle.flush();
    expect(err).toHaveBeenCalledWith(
      "[boot-error: Sentry unavailable]",
      expect.objectContaining({ message: "disabled-path error" }),
    );
  });

  it("is bounded — caps the buffer so a throw loop can't grow memory", () => {
    const captured: unknown[] = [];
    const handle = installBootErrorBuffer({
      maxEntries: 3,
      isEnabled: () => true,
      getCapture: () => (e) => captured.push(e),
    });
    for (let i = 0; i < 50; i++) throwDuringDeferWindow(`e${i}`);
    expect(handle.size()).toBe(3);
    handle.flush();
    expect(captured).toHaveLength(3);
  });

  it("removes its listeners on flush → no double-capture afterward", () => {
    const captured: unknown[] = [];
    const handle = installBootErrorBuffer({
      isEnabled: () => true,
      getCapture: () => (e) => captured.push(e),
    });
    handle.flush(); // Sentry handoff: our listeners must detach
    throwDuringDeferWindow("post-handoff"); // Sentry's own handler owns this
    expect(captured).toHaveLength(0); // we did NOT re-capture it
  });

  it("flush is idempotent (whenSentryReady vs 10s-timeout race)", () => {
    const captured: unknown[] = [];
    const handle = installBootErrorBuffer({
      isEnabled: () => true,
      getCapture: () => (e) => captured.push(e),
    });
    throwDuringDeferWindow("once");
    handle.flush();
    handle.flush(); // timeout fires after whenSentryReady already flushed
    handle.flush();
    expect(captured).toHaveLength(1); // replayed exactly once
  });

  it("survives a script that overrides the window.onerror PROPERTY", () => {
    // Some monitoring tools do `window.onerror = ...`. We use
    // addEventListener(capture), which is independent of that property,
    // so our buffer still receives the event.
    (window as unknown as { onerror: unknown }).onerror = () => true;
    const captured: unknown[] = [];
    const handle = installBootErrorBuffer({
      isEnabled: () => true,
      getCapture: () => (e) => captured.push(e),
    });
    throwDuringDeferWindow("onerror-overridden");
    handle.flush();
    expect(captured).toHaveLength(1);
  });

  it("flush never throws even if Sentry's captureException throws", () => {
    const handle = installBootErrorBuffer({
      isEnabled: () => true,
      getCapture: () => () => {
        throw new Error("sentry transport down");
      },
    });
    throwDuringDeferWindow("x");
    expect(() => handle.flush()).not.toThrow();
  });
});
