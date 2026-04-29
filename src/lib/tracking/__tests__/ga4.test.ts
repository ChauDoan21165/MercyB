// src/lib/tracking/__tests__/ga4.test.ts

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  __ga4InitializedForTests,
  __resetGa4ForTests,
  gaPageView,
  gaPurchase,
  gaSignUp,
  gaTrialStart,
  initGa4,
} from "../ga4";

beforeEach(() => {
  __resetGa4ForTests();
  vi.unstubAllEnvs();
});

afterEach(() => {
  __resetGa4ForTests();
  vi.unstubAllEnvs();
});

describe("GA4 — env-gated load", () => {
  it("does NOT initialize when VITE_GA4_MEASUREMENT_ID is empty", () => {
    vi.stubEnv("VITE_GA4_MEASUREMENT_ID", "");
    expect(initGa4()).toBe(false);
    expect(__ga4InitializedForTests()).toBe(false);
    expect(window.gtag).toBeUndefined();
    expect(document.querySelector('script[data-mb-ga4="1"]')).toBeNull();
  });

  it("initializes and injects gtag.js when ID is present", () => {
    vi.stubEnv("VITE_GA4_MEASUREMENT_ID", "G-ABC123");
    expect(initGa4()).toBe(true);
    expect(__ga4InitializedForTests()).toBe(true);
    expect(typeof window.gtag).toBe("function");
    const script = document.querySelector(
      'script[data-mb-ga4="1"]',
    ) as HTMLScriptElement | null;
    expect(script?.src).toContain("googletagmanager.com/gtag/js?id=G-ABC123");
  });

  it("is idempotent — second init does not double-inject", () => {
    vi.stubEnv("VITE_GA4_MEASUREMENT_ID", "G-ABC123");
    initGa4();
    initGa4();
    expect(
      document.querySelectorAll('script[data-mb-ga4="1"]').length,
    ).toBe(1);
  });
});

describe("GA4 — track helpers no-op until initialized", () => {
  it("gaPageView is a no-op when not initialized", () => {
    expect(() => gaPageView("/pricing")).not.toThrow();
  });

  it("gaSignUp / gaTrialStart / gaPurchase are no-ops when not initialized", () => {
    expect(() => gaSignUp("email")).not.toThrow();
    expect(() => gaTrialStart()).not.toThrow();
    expect(() => gaPurchase(99)).not.toThrow();
  });

  it("after init, calls push events into the dataLayer", () => {
    vi.stubEnv("VITE_GA4_MEASUREMENT_ID", "G-ABC123");
    initGa4();
    gaPurchase(50, "USD");
    const dataLayer = window.dataLayer ?? [];
    const purchase = dataLayer.find(
      (entry): entry is unknown[] =>
        Array.isArray(entry) && entry[0] === "event" && entry[1] === "purchase",
    );
    expect(purchase).toBeTruthy();
    expect(purchase?.[2]).toEqual({ value: 50, currency: "USD" });
  });
});
