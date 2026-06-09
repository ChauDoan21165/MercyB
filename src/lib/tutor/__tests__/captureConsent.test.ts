// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import {
  hasCaptureConsent,
  setCaptureConsent,
  hasCaptureConsentDecision,
  getCaptureConsentKey,
} from "@/lib/tutor/captureConsent";

const KEY = getCaptureConsentKey();

beforeEach(() => {
  window.localStorage.clear();
});

describe("captureConsent", () => {
  it("defaults to no consent and no decision when nothing is stored", () => {
    expect(hasCaptureConsent()).toBe(false);
    expect(hasCaptureConsentDecision()).toBe(false);
  });

  it("setCaptureConsent(true) grants consent and records a decision", () => {
    setCaptureConsent(true);
    expect(window.localStorage.getItem(KEY)).toBe("true");
    expect(hasCaptureConsent()).toBe(true);
    expect(hasCaptureConsentDecision()).toBe(true);
  });

  it("setCaptureConsent(false) declines but still records a decision (so it won't re-prompt)", () => {
    setCaptureConsent(false);
    expect(window.localStorage.getItem(KEY)).toBe("false");
    expect(hasCaptureConsent()).toBe(false);
    expect(hasCaptureConsentDecision()).toBe(true);
  });

  it("treats any non-'true' stored value as no consent (fail closed)", () => {
    window.localStorage.setItem(KEY, "yes");
    expect(hasCaptureConsent()).toBe(false);
  });

  it("uses the mb-capture-consent storage key", () => {
    expect(KEY).toBe("mb-capture-consent");
  });
});
