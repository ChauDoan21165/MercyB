// src/lib/tracking/__tests__/initMarketingTracking.test.ts

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  __resetMarketingConsentForTests,
  initMarketingTracking,
  isMarketingTrackingEnabled,
  setMarketingConsent,
} from "@/services/behaviorTrackingFlag";
import { __resetPixelForTests } from "../pixel";
import { __resetGa4ForTests } from "../ga4";
import { __resetClarityForTests } from "../clarity";
import { __resetUtmStorageForTests } from "../utm";

beforeEach(() => {
  __resetMarketingConsentForTests();
  __resetPixelForTests();
  __resetGa4ForTests();
  __resetClarityForTests();
  __resetUtmStorageForTests();
  vi.unstubAllEnvs();
});

afterEach(() => {
  __resetMarketingConsentForTests();
  __resetPixelForTests();
  __resetGa4ForTests();
  __resetClarityForTests();
  __resetUtmStorageForTests();
  vi.unstubAllEnvs();
});

describe("isMarketingTrackingEnabled — default ON, opt-out wins", () => {
  it("defaults to true with no opt-out flag", () => {
    expect(isMarketingTrackingEnabled()).toBe(true);
  });

  it("returns false after setMarketingConsent(false)", () => {
    setMarketingConsent(false);
    expect(isMarketingTrackingEnabled()).toBe(false);
  });

  it("opt-out can be reversed", () => {
    setMarketingConsent(false);
    setMarketingConsent(true);
    expect(isMarketingTrackingEnabled()).toBe(true);
  });
});

describe("initMarketingTracking — consent gate", () => {
  it("does NOT load Pixel, GA4 or Clarity when user opted out", async () => {
    vi.stubEnv("VITE_FB_PIXEL_ID", "1234567890");
    vi.stubEnv("VITE_GA4_MEASUREMENT_ID", "G-ABC123");
    vi.stubEnv("VITE_CLARITY_PROJECT_ID", "abcd1234");
    setMarketingConsent(false);
    const status = await initMarketingTracking();
    expect(status).toEqual({
      consent: false,
      utmCaptured: false,
      pixelLoaded: false,
      ga4Loaded: false,
      clarityLoaded: false,
    });
    expect(window.fbq).toBeUndefined();
    expect(window.gtag).toBeUndefined();
    expect(window.clarity).toBeUndefined();
  });

  it("does NOT load scripts when env vars are empty even with consent", async () => {
    vi.stubEnv("VITE_FB_PIXEL_ID", "");
    vi.stubEnv("VITE_GA4_MEASUREMENT_ID", "");
    vi.stubEnv("VITE_CLARITY_PROJECT_ID", "");
    const status = await initMarketingTracking();
    expect(status.consent).toBe(true);
    expect(status.pixelLoaded).toBe(false);
    expect(status.ga4Loaded).toBe(false);
    expect(status.clarityLoaded).toBe(false);
    expect(document.querySelector('script[data-mb-pixel="1"]')).toBeNull();
    expect(document.querySelector('script[data-mb-ga4="1"]')).toBeNull();
    expect(document.querySelector('script[data-mb-clarity="1"]')).toBeNull();
  });

  it("loads all trackers when consent + env vars are present", async () => {
    vi.stubEnv("VITE_FB_PIXEL_ID", "1234567890");
    vi.stubEnv("VITE_GA4_MEASUREMENT_ID", "G-ABC123");
    vi.stubEnv("VITE_CLARITY_PROJECT_ID", "abcd1234");
    const status = await initMarketingTracking();
    expect(status.consent).toBe(true);
    expect(status.pixelLoaded).toBe(true);
    expect(status.ga4Loaded).toBe(true);
    expect(status.clarityLoaded).toBe(true);
    expect(typeof window.fbq).toBe("function");
    expect(typeof window.gtag).toBe("function");
    expect(typeof window.clarity).toBe("function");
    expect(document.querySelector('script[data-mb-clarity="1"]')).not.toBeNull();
  });

  it("captures UTM from window.location when present and consent ON", async () => {
    const originalHref = window.location.href;
    window.history.replaceState(null, "", "/?utm_source=facebook&utm_campaign=spring2026");
    try {
      const status = await initMarketingTracking();
      expect(status.utmCaptured).toBe(true);
    } finally {
      window.history.replaceState(null, "", originalHref);
    }
  });
});
