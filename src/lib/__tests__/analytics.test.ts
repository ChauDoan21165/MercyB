// src/lib/__tests__/analytics.test.ts
//
// Guards the onboarding-funnel fix: trackEvent() must fan out to BOTH
// GA4 (window.gtag) and Microsoft Clarity (window.clarity). Before this
// wiring the onboarding funnel was console.log-only ("telemetry dark").

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { trackEvent } from "../analytics";

type GtagFn = (...args: unknown[]) => void;
type ClarityFn = (...args: unknown[]) => void;

const w = window as unknown as {
  gtag?: GtagFn;
  clarity?: ClarityFn;
  dataLayer?: unknown[];
  plausible?: unknown;
  analytics?: unknown;
};

beforeEach(() => {
  delete w.gtag;
  delete w.clarity;
  delete w.dataLayer;
  delete w.plausible;
  delete w.analytics;
});

afterEach(() => {
  delete w.gtag;
  delete w.clarity;
  vi.restoreAllMocks();
});

describe("trackEvent — GA4 + Microsoft Clarity dispatch", () => {
  it("dispatches the event + payload to GA4 (window.gtag)", () => {
    const gtag = vi.fn();
    w.gtag = gtag as GtagFn;

    trackEvent("onboarding_complete", { native_language: "vi", level: 3 });

    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenCalledWith("event", "onboarding_complete", {
      native_language: "vi",
      level: 3,
    });
  });

  it("dispatches the event name to Microsoft Clarity (window.clarity)", () => {
    const clarity = vi.fn();
    w.clarity = clarity as ClarityFn;

    trackEvent("onboarding_step_complete", { step: "native", next: "target" });

    // Clarity's custom-event API takes only the event name.
    expect(clarity).toHaveBeenCalledTimes(1);
    expect(clarity).toHaveBeenCalledWith("event", "onboarding_step_complete");
  });

  it("fans out to GA4 AND Clarity in a single call", () => {
    const gtag = vi.fn();
    const clarity = vi.fn();
    w.gtag = gtag as GtagFn;
    w.clarity = clarity as ClarityFn;

    trackEvent("onboarding_skipped", { from_step: "target" });

    expect(gtag).toHaveBeenCalledWith("event", "onboarding_skipped", {
      from_step: "target",
    });
    expect(clarity).toHaveBeenCalledWith("event", "onboarding_skipped");
  });

  it("strips non-serializable payload values before dispatch", () => {
    const gtag = vi.fn();
    w.gtag = gtag as GtagFn;

    trackEvent("onboarding_complete", {
      keep: "ok",
      drop_fn: () => void 0,
      drop_undef: undefined,
    });

    expect(gtag).toHaveBeenCalledWith("event", "onboarding_complete", {
      keep: "ok",
    });
  });

  it("never throws when no provider globals are present (dev / pre-consent)", () => {
    expect(() =>
      trackEvent("onboarding_complete", { native_language: "vi" }),
    ).not.toThrow();
  });

  it("a throwing Clarity global does not break GA4 dispatch", () => {
    const gtag = vi.fn();
    w.gtag = gtag as GtagFn;
    w.clarity = (() => {
      throw new Error("clarity boom");
    }) as ClarityFn;

    expect(() => trackEvent("onboarding_complete", {})).not.toThrow();
    expect(gtag).toHaveBeenCalledWith("event", "onboarding_complete", {});
  });
});
