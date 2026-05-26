/**
 * Coverage for src/lib/monitoring/captureException.ts.
 *
 * The privacy + route-gating invariants this file locks:
 *
 *   ROUTE-GATE (PR #720 / #740 — Sentry not auto-initialized at boot):
 *     - captureError(): pre-init → queueExplicitCapture(error) into the
 *       boot buffer + pull Sentry init for replay. Never lost.
 *     - captureMessage(): pre-init → activateSentry('explicit-message').
 *       This first call is NOT replayed (non-exception); ops trades.
 *     - captureRlsDenied(): pre-init → activateSentry('explicit-rls').
 *       First denial's rls_* tags don't survive a bare-exception replay;
 *       deliberate trade-off for the #578/#562 security alert.
 *     - tagWithUser / setTag / addBreadcrumb / clearUser: pure no-ops
 *       pre-init. Scope state without an event is meaningless.
 *
 *   PRIVACY (sentryInit.ts header docs):
 *     - tagWithUser ONLY accepts a userId, ONLY emits { id: … }.
 *       NEVER email, username, IP — first line of defence.
 *     - String values in captureError's `context` map get stripPII'd
 *       before reaching the SDK. Same for captureMessage's `context`.
 *
 *   RLS TAG ISOLATION (#578 / #562 alert reliability):
 *     - captureRlsDenied uses withScope so `rls_denied` + `rls_table`
 *       are tagged on THIS event only and don't leak globally.
 *     - For admin tables (classifyRlsTable returns 'admin'),
 *       featureArea is pinned to 'admin' so the low-volume
 *       featureArea:admin alert stays reliable.
 *
 * Mock pattern follows sentryInit.test.ts — vi.hoisted() for spies that
 * the hoisted vi.mock() factories close over.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const {
  isSentryEnabledMock,
  getSentryModuleMock,
  classifyRlsTableMock,
  queueExplicitCaptureMock,
  activateSentryMock,
  stripPIIMock,
} = vi.hoisted(() => ({
  isSentryEnabledMock: vi.fn(),
  getSentryModuleMock: vi.fn(),
  classifyRlsTableMock: vi.fn(),
  queueExplicitCaptureMock: vi.fn(),
  activateSentryMock: vi.fn(),
  stripPIIMock: vi.fn(),
}));

vi.mock("../sentryInit", () => ({
  isSentryEnabled: isSentryEnabledMock,
  getSentryModule: getSentryModuleMock,
  classifyRlsTable: classifyRlsTableMock,
}));

vi.mock("../sentryActivation", () => ({
  queueExplicitCapture: queueExplicitCaptureMock,
  activateSentry: activateSentryMock,
}));

vi.mock("@/lib/security/piiProtection", () => ({
  stripPII: stripPIIMock,
}));

import {
  addBreadcrumb,
  captureError,
  captureMessage,
  captureRlsDenied,
  clearUser,
  setTag,
  tagWithUser,
} from "../captureException";

type SentrySdkSpy = {
  captureException: ReturnType<typeof vi.fn>;
  captureMessage: ReturnType<typeof vi.fn>;
  setUser: ReturnType<typeof vi.fn>;
  setTag: ReturnType<typeof vi.fn>;
  withScope: ReturnType<typeof vi.fn>;
  addBreadcrumb: ReturnType<typeof vi.fn>;
};

function makeSdk(): SentrySdkSpy {
  return {
    captureException: vi.fn(),
    captureMessage: vi.fn(),
    setUser: vi.fn(),
    setTag: vi.fn(),
    // withScope receives a callback with a scope object whose setTag we
    // can spy on per-call by examining the scope handed in.
    withScope: vi.fn((cb: (scope: { setTag: ReturnType<typeof vi.fn> }) => void) => {
      const scope = { setTag: vi.fn() };
      cb(scope);
      // expose the last invoked scope on the spy itself so assertions can
      // reach the per-scope setTag calls.
      (withScopeLastScope.current = scope);
    }),
    addBreadcrumb: vi.fn(),
  };
}

// Side-channel so tests can inspect the per-call scope passed to withScope.
const withScopeLastScope: {
  current: { setTag: ReturnType<typeof vi.fn> } | null;
} = { current: null };

beforeEach(() => {
  vi.clearAllMocks();
  withScopeLastScope.current = null;
  // Default: PII strip returns input untouched so we can assert it was
  // called without contaminating the value comparison.
  stripPIIMock.mockImplementation((s: string) => s);
  // Default: enabled + a fresh SDK spy.
  isSentryEnabledMock.mockReturnValue(true);
  classifyRlsTableMock.mockReturnValue(null);
  getSentryModuleMock.mockReturnValue(makeSdk());
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ────────────────────────────────────────────────────────────────────────
// captureError
// ────────────────────────────────────────────────────────────────────────

describe("captureError", () => {
  it("forwards the error to the SDK when Sentry is enabled", () => {
    const sdk = makeSdk();
    getSentryModuleMock.mockReturnValue(sdk);
    const err = new Error("boom");
    captureError(err);
    expect(sdk.captureException).toHaveBeenCalledTimes(1);
    expect(sdk.captureException).toHaveBeenCalledWith(err, { extra: {} });
    // Route-gate side-effects do NOT fire when Sentry is already up.
    expect(queueExplicitCaptureMock).not.toHaveBeenCalled();
  });

  it("PII-strips string values in the optional context map before forwarding", () => {
    const sdk = makeSdk();
    getSentryModuleMock.mockReturnValue(sdk);
    stripPIIMock.mockImplementation((s: string) => `[scrubbed:${s}]`);
    captureError(new Error("x"), {
      stringValue: "user@example.com",
      numberValue: 42,
      objectValue: { nested: "raw" },
    });
    expect(stripPIIMock).toHaveBeenCalledWith("user@example.com");
    // Only string values get the strip; numbers/objects pass through.
    const call = sdk.captureException.mock.calls[0];
    expect(call[1]).toEqual({
      extra: {
        stringValue: "[scrubbed:user@example.com]",
        numberValue: 42,
        objectValue: { nested: "raw" },
      },
    });
  });

  it("is a no-op (SDK-side) and queues into the boot buffer when Sentry is disabled", () => {
    isSentryEnabledMock.mockReturnValue(false);
    const sdk = makeSdk();
    getSentryModuleMock.mockReturnValue(sdk);
    const err = new Error("pre-init");
    captureError(err, { willBeDropped: "context" });
    expect(sdk.captureException).not.toHaveBeenCalled();
    expect(queueExplicitCaptureMock).toHaveBeenCalledTimes(1);
    expect(queueExplicitCaptureMock).toHaveBeenCalledWith(err);
  });

  it("bails safely if the SDK module is not loaded (race window)", () => {
    getSentryModuleMock.mockReturnValue(null);
    expect(() => captureError(new Error("no sdk"))).not.toThrow();
  });
});

// ────────────────────────────────────────────────────────────────────────
// captureMessage
// ────────────────────────────────────────────────────────────────────────

describe("captureMessage", () => {
  it("forwards the message + level + context to the SDK when enabled (default level=warning)", () => {
    const sdk = makeSdk();
    getSentryModuleMock.mockReturnValue(sdk);
    captureMessage("degraded path");
    expect(sdk.captureMessage).toHaveBeenCalledWith("degraded path", {
      level: "warning",
      extra: {},
    });
  });

  it("honours an explicit level + PII-strips string context", () => {
    const sdk = makeSdk();
    getSentryModuleMock.mockReturnValue(sdk);
    stripPIIMock.mockImplementation((s: string) => `[scrubbed:${s}]`);
    captureMessage("ops beacon", "info", { who: "u@x.com", count: 3 });
    expect(stripPIIMock).toHaveBeenCalledWith("u@x.com");
    expect(sdk.captureMessage).toHaveBeenCalledWith("ops beacon", {
      level: "info",
      extra: { who: "[scrubbed:u@x.com]", count: 3 },
    });
  });

  it("pre-init: pulls activateSentry('explicit-message') and does NOT call the SDK", () => {
    isSentryEnabledMock.mockReturnValue(false);
    const sdk = makeSdk();
    getSentryModuleMock.mockReturnValue(sdk);
    captureMessage("first ops signal");
    expect(sdk.captureMessage).not.toHaveBeenCalled();
    expect(activateSentryMock).toHaveBeenCalledTimes(1);
    expect(activateSentryMock).toHaveBeenCalledWith("explicit-message");
    // Not enqueued — non-exception, first call is the acceptable trade-off.
    expect(queueExplicitCaptureMock).not.toHaveBeenCalled();
  });

  it("bails safely if the SDK lacks captureMessage", () => {
    const sdk = makeSdk();
    (sdk as unknown as { captureMessage: undefined }).captureMessage = undefined;
    getSentryModuleMock.mockReturnValue(sdk);
    expect(() => captureMessage("ops")).not.toThrow();
  });
});

// ────────────────────────────────────────────────────────────────────────
// captureRlsDenied — #578/#562 alert path
// ────────────────────────────────────────────────────────────────────────

describe("captureRlsDenied", () => {
  it("tags rls_denied=true + rls_table on the scope and captures an Error in scope isolation", () => {
    const sdk = makeSdk();
    getSentryModuleMock.mockReturnValue(sdk);
    captureRlsDenied("admin_allowlist", "GET");
    expect(sdk.withScope).toHaveBeenCalledTimes(1);
    const scopeSpy = withScopeLastScope.current!;
    expect(scopeSpy.setTag).toHaveBeenCalledWith("rls_denied", "true");
    expect(scopeSpy.setTag).toHaveBeenCalledWith("rls_table", "admin_allowlist");
    expect(sdk.captureException).toHaveBeenCalledTimes(1);
    const err = sdk.captureException.mock.calls[0][0] as Error;
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toContain("admin_allowlist");
    expect(err.message).toContain("GET");
  });

  it("pins featureArea=admin only when classifyRlsTable returns 'admin'", () => {
    classifyRlsTableMock.mockReturnValue("admin");
    const sdk = makeSdk();
    getSentryModuleMock.mockReturnValue(sdk);
    captureRlsDenied("admin_allowlist", "DELETE");
    const scopeSpy = withScopeLastScope.current!;
    expect(scopeSpy.setTag).toHaveBeenCalledWith("featureArea", "admin");
  });

  it("does NOT pin featureArea when classifyRlsTable returns null (non-admin table)", () => {
    classifyRlsTableMock.mockReturnValue(null);
    const sdk = makeSdk();
    getSentryModuleMock.mockReturnValue(sdk);
    captureRlsDenied("profiles", "POST");
    const scopeSpy = withScopeLastScope.current!;
    const featureAreaCalls = scopeSpy.setTag.mock.calls.filter(
      (c: unknown[]) => c[0] === "featureArea",
    );
    expect(featureAreaCalls).toHaveLength(0);
  });

  it("uses 'unknown' for rls_table when the table arg is empty", () => {
    const sdk = makeSdk();
    getSentryModuleMock.mockReturnValue(sdk);
    captureRlsDenied("", "GET");
    const scopeSpy = withScopeLastScope.current!;
    expect(scopeSpy.setTag).toHaveBeenCalledWith("rls_table", "unknown");
  });

  it("pre-init: pulls activateSentry('explicit-rls'), does NOT enqueue (first denial's rls_* tags can't survive replay)", () => {
    isSentryEnabledMock.mockReturnValue(false);
    captureRlsDenied("profiles", "PATCH");
    expect(activateSentryMock).toHaveBeenCalledWith("explicit-rls");
    expect(queueExplicitCaptureMock).not.toHaveBeenCalled();
  });
});

// ────────────────────────────────────────────────────────────────────────
// tagWithUser — privacy first line of defence
// ────────────────────────────────────────────────────────────────────────

describe("tagWithUser (privacy invariant)", () => {
  it("calls setUser with ONLY { id } — never email, username, or IP", () => {
    const sdk = makeSdk();
    getSentryModuleMock.mockReturnValue(sdk);
    tagWithUser("u-abc-123");
    expect(sdk.setUser).toHaveBeenCalledTimes(1);
    const arg = sdk.setUser.mock.calls[0][0] as Record<string, unknown>;
    expect(arg).toEqual({ id: "u-abc-123" });
    expect(Object.keys(arg)).toEqual(["id"]);
    // Explicit negative assertions — the privacy posture is the load-bearing
    // contract, lock every shape.
    expect(arg).not.toHaveProperty("email");
    expect(arg).not.toHaveProperty("username");
    expect(arg).not.toHaveProperty("ip_address");
    expect(arg).not.toHaveProperty("ip");
  });

  it("is a no-op when userId is null or undefined", () => {
    const sdk = makeSdk();
    getSentryModuleMock.mockReturnValue(sdk);
    tagWithUser(null);
    tagWithUser(undefined);
    expect(sdk.setUser).not.toHaveBeenCalled();
  });

  it("is a no-op when Sentry is disabled (pure scope wrapper, not queued)", () => {
    isSentryEnabledMock.mockReturnValue(false);
    tagWithUser("u-pre-init");
    expect(queueExplicitCaptureMock).not.toHaveBeenCalled();
    expect(activateSentryMock).not.toHaveBeenCalled();
  });
});

// ────────────────────────────────────────────────────────────────────────
// clearUser
// ────────────────────────────────────────────────────────────────────────

describe("clearUser", () => {
  it("calls setUser(null) — actually clears, no residual id", () => {
    const sdk = makeSdk();
    getSentryModuleMock.mockReturnValue(sdk);
    clearUser();
    expect(sdk.setUser).toHaveBeenCalledWith(null);
  });

  it("is a no-op when Sentry is disabled (pure scope wrapper, not queued)", () => {
    isSentryEnabledMock.mockReturnValue(false);
    clearUser();
    expect(queueExplicitCaptureMock).not.toHaveBeenCalled();
    expect(activateSentryMock).not.toHaveBeenCalled();
  });
});

// ────────────────────────────────────────────────────────────────────────
// setTag
// ────────────────────────────────────────────────────────────────────────

describe("setTag", () => {
  it("coerces non-string values to strings and forwards key + value", () => {
    const sdk = makeSdk();
    getSentryModuleMock.mockReturnValue(sdk);
    setTag("tier", "premium");
    expect(sdk.setTag).toHaveBeenCalledWith("tier", "premium");
  });

  it("is a no-op when key is empty OR value is null/undefined", () => {
    const sdk = makeSdk();
    getSentryModuleMock.mockReturnValue(sdk);
    setTag("", "x");
    setTag("k", null);
    setTag("k", undefined);
    expect(sdk.setTag).not.toHaveBeenCalled();
  });

  it("is a no-op when Sentry is disabled (pure scope wrapper, not queued)", () => {
    isSentryEnabledMock.mockReturnValue(false);
    setTag("tier", "premium");
    expect(queueExplicitCaptureMock).not.toHaveBeenCalled();
    expect(activateSentryMock).not.toHaveBeenCalled();
  });
});

// ────────────────────────────────────────────────────────────────────────
// addBreadcrumb
// ────────────────────────────────────────────────────────────────────────

describe("addBreadcrumb", () => {
  it("forwards the breadcrumb verbatim to the SDK", () => {
    const sdk = makeSdk();
    getSentryModuleMock.mockReturnValue(sdk);
    const crumb = {
      category: "ui.click",
      message: "tap mercy-speak-tab",
      level: "info" as const,
      data: { roomId: "abc" },
    };
    addBreadcrumb(crumb);
    expect(sdk.addBreadcrumb).toHaveBeenCalledWith(crumb);
  });

  it("is a no-op when Sentry is disabled (pure scope wrapper, not queued)", () => {
    isSentryEnabledMock.mockReturnValue(false);
    addBreadcrumb({ category: "ui.click" });
    expect(queueExplicitCaptureMock).not.toHaveBeenCalled();
    expect(activateSentryMock).not.toHaveBeenCalled();
  });
});
