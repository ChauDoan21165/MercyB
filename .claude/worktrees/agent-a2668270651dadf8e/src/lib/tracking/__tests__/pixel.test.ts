// src/lib/tracking/__tests__/pixel.test.ts

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  __pixelInitializedForTests,
  __resetPixelForTests,
  initPixel,
  pixelTrackPageView,
  pixelTrackPurchase,
  pixelTrackSignUp,
  pixelTrackTrialStart,
} from "../pixel";

beforeEach(() => {
  __resetPixelForTests();
  vi.unstubAllEnvs();
});

afterEach(() => {
  __resetPixelForTests();
  vi.unstubAllEnvs();
});

describe("Facebook Pixel — env-gated load", () => {
  it("does NOT initialize when VITE_FB_PIXEL_ID is empty", () => {
    vi.stubEnv("VITE_FB_PIXEL_ID", "");
    expect(initPixel()).toBe(false);
    expect(__pixelInitializedForTests()).toBe(false);
    expect(window.fbq).toBeUndefined();
    expect(document.querySelector('script[data-mb-pixel="1"]')).toBeNull();
  });

  it("does NOT initialize when env var is missing entirely", () => {
    expect(initPixel()).toBe(false);
    expect(window.fbq).toBeUndefined();
  });

  it("initializes and injects the Meta script when ID is present", () => {
    vi.stubEnv("VITE_FB_PIXEL_ID", "1234567890");
    expect(initPixel()).toBe(true);
    expect(__pixelInitializedForTests()).toBe(true);
    expect(typeof window.fbq).toBe("function");
    const script = document.querySelector(
      'script[data-mb-pixel="1"]',
    ) as HTMLScriptElement | null;
    expect(script?.src).toContain("connect.facebook.net");
  });

  it("is idempotent — calling twice does not duplicate the script tag", () => {
    vi.stubEnv("VITE_FB_PIXEL_ID", "1234567890");
    initPixel();
    initPixel();
    expect(
      document.querySelectorAll('script[data-mb-pixel="1"]').length,
    ).toBe(1);
  });
});

describe("Facebook Pixel — track helpers no-op until initialized", () => {
  it("trackPageView is a no-op when not initialized", () => {
    expect(() => pixelTrackPageView()).not.toThrow();
  });

  it("trackSignUp is a no-op when not initialized", () => {
    expect(() => pixelTrackSignUp({ plan: "free" })).not.toThrow();
  });

  it("trackTrialStart is a no-op when not initialized", () => {
    expect(() => pixelTrackTrialStart()).not.toThrow();
  });

  it("trackPurchase is a no-op when not initialized", () => {
    expect(() => pixelTrackPurchase(99)).not.toThrow();
  });

  it("after init, calls forward to window.fbq", () => {
    vi.stubEnv("VITE_FB_PIXEL_ID", "1234567890");
    initPixel();
    const spy = vi.fn();
    window.fbq = spy as unknown as typeof window.fbq;
    pixelTrackPurchase(123, "VND");
    expect(spy).toHaveBeenCalledWith("track", "Purchase", {
      value: 123,
      currency: "VND",
    });
  });
});
