// src/lib/monitoring/__tests__/sentryActivation.test.ts
//
// Locks the ROUTE-GATE contract: the ~156 KB @sentry/react chunk loads
// ONLY when one of three triggers fires. The headline test is the task's
// required proof — rendering a static legal page (<Privacy />) in
// isolation pulls NO Sentry activation (hence no SDK network request),
// while each of the three real triggers DOES.

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { createElement } from "react";
import {
  armSentryActivation,
  activateSentry,
  queueExplicitCapture,
  isSentryActivated,
  __resetSentryActivationForTest,
} from "../sentryActivation";
import { installBootErrorBuffer } from "../bootErrorBuffer";
import { captureError } from "../captureException";
import { isSentryEnabled } from "../sentryInit";
import Privacy from "@/pages/Privacy";

// jsdom escalates an unhandled `error` event to a console "uncaught"
// unless something handles it — model the real "Sentry/overlay handled
// it" world without disturbing the capture-phase buffer under test.
let swallow: (e: ErrorEvent) => void;
beforeEach(() => {
  __resetSentryActivationForTest();
  swallow = (e) => e.preventDefault();
  window.addEventListener("error", swallow);
});
afterEach(() => {
  window.removeEventListener("error", swallow);
  cleanup();
  vi.restoreAllMocks();
});

describe("sentryActivation — the route-gate", () => {
  it("REQUIRED PROOF: rendering <Privacy /> in isolation does NOT activate Sentry", () => {
    // `activate` is, in production, the ONLY caller of initSentry() — the
    // only thing that ever `import("@sentry/react")`s. If it is never
    // invoked, the SDK chunk is never fetched. Arm it, render the static
    // legal page, and assert the gate stays shut.
    const activate = vi.fn();
    armSentryActivation({ activate, enqueue: vi.fn() });

    render(createElement(Privacy));

    expect(activate).not.toHaveBeenCalled();
    expect(isSentryActivated()).toBe(false);
  });

  it("trigger (1): a window error via the boot buffer pulls init exactly once", () => {
    const activate = vi.fn();
    armSentryActivation({ activate, enqueue: vi.fn() });
    // Wire the buffer exactly as main.tsx does.
    const buf = installBootErrorBuffer({
      isEnabled: () => false,
      getCapture: () => null,
      onFirstCapture: () => activateSentry("boot-error"),
    });

    window.dispatchEvent(
      new ErrorEvent("error", { error: new Error("boom"), message: "boom" }),
    );
    window.dispatchEvent(
      new ErrorEvent("error", { error: new Error("again"), message: "again" }),
    );

    expect(activate).toHaveBeenCalledTimes(1); // one-time, not per-error
    expect(isSentryActivated()).toBe(true);
    expect(buf.size()).toBe(2); // both still buffered for replay
  });

  it("trigger (2): the auth funnel (activateSentry('auth')) pulls init", () => {
    const activate = vi.fn();
    armSentryActivation({ activate, enqueue: vi.fn() });

    // AuthProvider.applySession calls exactly this on a verified session.
    activateSentry("auth");

    expect(activate).toHaveBeenCalledTimes(1);
    expect(isSentryActivated()).toBe(true);
  });

  it("trigger (3): explicit captureError() enqueues into the buffer AND activates", () => {
    const activate = vi.fn();
    const captured: unknown[] = [];
    const buf = installBootErrorBuffer({
      isEnabled: () => true,
      getCapture: () => (e) => captured.push(e),
    });
    armSentryActivation({ activate, enqueue: buf.capture });

    // In test mode Sentry is disabled, so the real wrapper takes the
    // pre-init path → queueExplicitCapture.
    expect(isSentryEnabled()).toBe(false);
    captureError(new Error("explicit boom"));

    expect(activate).toHaveBeenCalledTimes(1);
    expect(buf.size()).toBe(1);

    buf.flush(); // Sentry "ready" → replay
    expect(captured).toHaveLength(1);
    expect((captured[0] as Error).message).toBe("explicit boom");
  });

  it("is one-time across DIFFERENT triggers — activator runs once total", () => {
    const activate = vi.fn();
    armSentryActivation({ activate, enqueue: vi.fn() });

    activateSentry("boot-error");
    activateSentry("auth");
    queueExplicitCapture(new Error("x"));

    expect(activate).toHaveBeenCalledTimes(1);
  });

  it("latches a trigger that races AHEAD of arming (defensive)", () => {
    const activate = vi.fn();
    // Trigger fires before main.tsx arms (theoretical; arm is synchronous
    // at boot). Must not be lost — runs the moment arm registers.
    activateSentry("boot-error");
    expect(activate).not.toHaveBeenCalled();

    armSentryActivation({ activate, enqueue: vi.fn() });
    expect(activate).toHaveBeenCalledTimes(1);
  });

  it("activator throwing never propagates to the trigger's caller", () => {
    armSentryActivation({
      activate: () => {
        throw new Error("init blew up");
      },
      enqueue: vi.fn(),
    });
    expect(() => activateSentry("auth")).not.toThrow();
    expect(isSentryActivated()).toBe(true); // still latched terminal
  });
});
