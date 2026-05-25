// @vitest-environment jsdom

import { describe, expect, it, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import React from "react";

// ── Plugin mocks ─────────────────────────────────────────────────────
// NativeBootstrap dynamic-imports these; vi.mock is hoisted and applies
// to dynamic imports just the same.

const splashHide = vi.fn(() => Promise.resolve());
vi.mock("@capacitor/splash-screen", () => ({
  SplashScreen: { hide: () => splashHide() },
}));

const setStyle = vi.fn((_o?: unknown) => Promise.resolve());
vi.mock("@capacitor/status-bar", () => ({
  StatusBar: { setStyle: (o: unknown) => setStyle(o) },
  Style: { Light: "LIGHT", Dark: "DARK", Default: "DEFAULT" },
}));

const setResizeMode = vi.fn((_o?: unknown) => Promise.resolve());
vi.mock("@capacitor/keyboard", () => ({
  Keyboard: { setResizeMode: (o: unknown) => setResizeMode(o) },
  KeyboardResize: { Native: "native", Body: "body", None: "none", Ionic: "ionic" },
}));

// ── Platform mock ────────────────────────────────────────────────────
const isNative = vi.fn();
const platform = vi.fn();
vi.mock("@/lib/platform", () => ({
  isNativePlatform: () => isNative(),
  getPlatform: () => platform(),
}));

// ── Sentry-activation mock ──────────────────────────────────────────
// NativeBootstrap calls activateSentry("native-cold-start") on every
// native session so anon mobile users get Sentry before the first
// error. The mock lets us assert call shape without booting the SDK.
const activateSentryMock = vi.fn();
vi.mock("@/lib/monitoring/sentryActivation", () => ({
  activateSentry: (reason: string) => activateSentryMock(reason),
}));

// Imported after the mocks above are registered.
import NativeBootstrap from "@/components/native/NativeBootstrap";

beforeEach(() => {
  splashHide.mockClear();
  setStyle.mockClear();
  setResizeMode.mockClear();
  isNative.mockReset();
  platform.mockReset();
  activateSentryMock.mockClear();
});

describe("NativeBootstrap — N4 native UX bootstrap", () => {
  it("is a hard no-op on web (no plugin calls, no Sentry activation)", async () => {
    isNative.mockReturnValue(false);
    platform.mockReturnValue("web");

    render(<NativeBootstrap />);
    // Give any (incorrectly scheduled) async work a chance to run.
    await new Promise((r) => setTimeout(r, 0));

    expect(splashHide).not.toHaveBeenCalled();
    expect(setStyle).not.toHaveBeenCalled();
    expect(setResizeMode).not.toHaveBeenCalled();
    // Web's route-gating in main.tsx + sentryActivation owns Sentry init
    // on web — NativeBootstrap must never preempt it.
    expect(activateSentryMock).not.toHaveBeenCalled();
  });

  it("activates Sentry on native cold-start with the native reason", async () => {
    isNative.mockReturnValue(true);
    platform.mockReturnValue("ios");

    render(<NativeBootstrap />);
    // Activation is synchronous on mount inside the native branch —
    // assert without waiting for the async plugin chain.
    expect(activateSentryMock).toHaveBeenCalledTimes(1);
    expect(activateSentryMock).toHaveBeenCalledWith("native-cold-start");
  });

  it("on iOS: sets the status-bar style and hides the splash; no Android keyboard call", async () => {
    isNative.mockReturnValue(true);
    platform.mockReturnValue("ios");

    render(<NativeBootstrap />);

    await vi.waitFor(() => expect(splashHide).toHaveBeenCalledTimes(1));
    expect(setStyle).toHaveBeenCalledWith({ style: "LIGHT" });
    expect(setResizeMode).not.toHaveBeenCalled();
  });

  it("on Android: locks the keyboard resize mode and hides the splash; no iOS status-bar call", async () => {
    isNative.mockReturnValue(true);
    platform.mockReturnValue("android");

    render(<NativeBootstrap />);

    await vi.waitFor(() => expect(splashHide).toHaveBeenCalledTimes(1));
    expect(setResizeMode).toHaveBeenCalledWith({ mode: "native" });
    expect(setStyle).not.toHaveBeenCalled();
  });

  it("still hides the splash when an optional native call rejects (core path survives)", async () => {
    isNative.mockReturnValue(true);
    platform.mockReturnValue("ios");
    setStyle.mockImplementationOnce(() => Promise.reject(new Error("boom")));

    render(<NativeBootstrap />);

    await vi.waitFor(() => expect(splashHide).toHaveBeenCalledTimes(1));
  });
});
