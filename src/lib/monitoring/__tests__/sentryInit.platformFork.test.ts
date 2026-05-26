/**
 * Native Sentry CI probe — platform fork structural insurance.
 *
 * Asserts the four invariants from the recon that a CI gate should hold:
 *   (a) `@sentry/capacitor.init` runs on native; `@sentry/react.init`
 *        runs on web. Never both as the primary init path.
 *   (b) The `platform` tag matches `Capacitor.getPlatform()` (or `"web"`).
 *   (c) The module loads in a non-Capacitor environment without throwing.
 *   (d) `@sentry/capacitor` resolves — verified at import time (test
 *        compilation fails if the package is missing).
 *
 * This is structural CI insurance, not a STRATEGY §15 Bar #6 tick —
 * Bar #6 still requires real-device verification (events landing in the
 * Sentry dashboard from a fresh iOS/Android install). That gate stays
 * owner-pending.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// `vi.mock` factories are hoisted above all imports, so the spy bindings
// they reference must live inside `vi.hoisted` to be initialised in time.
const { reactInit, reactSetTag, capacitorInit, capacitorSetTag } = vi.hoisted(() => ({
  reactInit: vi.fn(),
  reactSetTag: vi.fn(),
  capacitorInit: vi.fn(),
  capacitorSetTag: vi.fn(),
}));

vi.mock("@sentry/react", () => ({
  init: reactInit,
  setTag: reactSetTag,
  setUser: vi.fn(),
  captureException: vi.fn(),
  replayIntegration: vi.fn(() => ({ name: "replay" })),
}));

vi.mock("@sentry/capacitor", () => ({
  init: capacitorInit,
  setTag: capacitorSetTag,
  setUser: vi.fn(),
  captureException: vi.fn(),
}));

// Assertion (d): if `@sentry/capacitor` does not resolve, this import
// fails to compile and the whole test file errors. Explicit import keeps
// the package dependency in CI's visibility.
import * as SentryCapacitor from "@sentry/capacitor";

import {
  __resetForTest,
  buildSentryOptions,
  initSentry,
  whenSentryReady,
} from "../sentryInit";

type CapacitorStub = {
  isNativePlatform: () => boolean;
  getPlatform: () => string;
};

function stubCapacitor(stub: CapacitorStub | undefined) {
  const w = window as unknown as { Capacitor?: CapacitorStub };
  if (stub) w.Capacitor = stub;
  else delete w.Capacitor;
}

beforeEach(() => {
  vi.clearAllMocks();
  __resetForTest();
  // Bypass the MODE='test' early-return so initSentry actually runs the
  // platform fork. Provide a DSN so the dynamic-import branch is taken.
  vi.stubEnv("MODE", "development");
  vi.stubEnv("VITE_SENTRY_DSN", "https://test@sentry.io/0");
  stubCapacitor(undefined);
});

afterEach(() => {
  vi.unstubAllEnvs();
  stubCapacitor(undefined);
});

describe("sentryInit platform fork — CI probe", () => {
  it("(a-web) routes to @sentry/react.init in a non-Capacitor environment, not @sentry/capacitor.init", async () => {
    initSentry();
    await whenSentryReady();
    expect(reactInit).toHaveBeenCalledTimes(1);
    expect(capacitorInit).not.toHaveBeenCalled();
  });

  it("(a-native) routes to @sentry/capacitor.init when Capacitor.isNativePlatform() is true; @sentry/react.init is the wrapped callback, not a primary init", async () => {
    stubCapacitor({ isNativePlatform: () => true, getPlatform: () => "ios" });
    initSentry();
    await whenSentryReady();
    expect(capacitorInit).toHaveBeenCalledTimes(1);
    // Second arg is the wrapped SentryReact.init reference.
    const [, wrappedInit] = capacitorInit.mock.calls[0];
    expect(wrappedInit).toBe(reactInit);
  });

  it("(b-ios) sets the platform tag to whatever Capacitor.getPlatform() returns", async () => {
    stubCapacitor({ isNativePlatform: () => true, getPlatform: () => "ios" });
    initSentry();
    await whenSentryReady();
    expect(capacitorSetTag).toHaveBeenCalledWith("platform", "ios");
  });

  it("(b-android) the same fork carries the android tag through", async () => {
    stubCapacitor({ isNativePlatform: () => true, getPlatform: () => "android" });
    initSentry();
    await whenSentryReady();
    expect(capacitorSetTag).toHaveBeenCalledWith("platform", "android");
  });

  it("(b-web) sets platform tag to 'web' on @sentry/react when not in Capacitor", async () => {
    initSentry();
    await whenSentryReady();
    expect(reactSetTag).toHaveBeenCalledWith("platform", "web");
  });

  it("(c) buildSentryOptions does not throw in a non-Capacitor environment", () => {
    expect(() => {
      buildSentryOptions({
        shared: { dsn: "x", environment: "test", tracesSampleRate: 0 },
        isNativeCapacitor: false,
        replayIntegrationFactory: undefined,
      });
    }).not.toThrow();
  });

  it("(d) @sentry/capacitor exposes the expected init function shape", () => {
    expect(typeof SentryCapacitor.init).toBe("function");
  });
});
