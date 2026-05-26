// src/lib/auth/__tests__/conversionTriggers.test.ts
//
// Locks the trigger ladder + loss-aversion copy generator.

import { describe, it, expect } from "vitest";

import {
  PRACTICE_SESSION_THRESHOLD,
  SESSION_AGE_THRESHOLD_MS,
  buildLossAversionMessage,
  shouldShowConversionPrompt,
} from "../conversionTriggers";

const baseInput = {
  isAnonymous: true,
  practiceSessionsThisSession: 0,
  anonSessionAgeMs: 0,
  alreadyShownThisSession: false,
  paidFeatureAttempted: false,
  shareAttempted: false,
};

describe("shouldShowConversionPrompt — guards", () => {
  it("never prompts a non-anonymous user", () => {
    const r = shouldShowConversionPrompt({
      ...baseInput,
      isAnonymous: false,
      practiceSessionsThisSession: 100,
      shareAttempted: true,
    });
    expect(r.shouldPrompt).toBe(false);
  });

  it("never prompts when already shown this session", () => {
    const r = shouldShowConversionPrompt({
      ...baseInput,
      alreadyShownThisSession: true,
      shareAttempted: true,
    });
    expect(r.shouldPrompt).toBe(false);
  });
});

describe("shouldShowConversionPrompt — trigger ladder", () => {
  it("does NOT prompt below all thresholds", () => {
    expect(
      shouldShowConversionPrompt({
        ...baseInput,
        practiceSessionsThisSession: PRACTICE_SESSION_THRESHOLD - 1,
        anonSessionAgeMs: SESSION_AGE_THRESHOLD_MS - 1,
      }).shouldPrompt,
    ).toBe(false);
  });

  it("prompts on practice threshold (≥ 3)", () => {
    const r = shouldShowConversionPrompt({
      ...baseInput,
      practiceSessionsThisSession: PRACTICE_SESSION_THRESHOLD,
    });
    expect(r.shouldPrompt).toBe(true);
    expect(r.reason).toBe("practice_threshold");
  });

  it("prompts on 24h session age", () => {
    const r = shouldShowConversionPrompt({
      ...baseInput,
      anonSessionAgeMs: SESSION_AGE_THRESHOLD_MS,
    });
    expect(r.shouldPrompt).toBe(true);
    expect(r.reason).toBe("session_age_24h");
  });

  it("prompts on paid-feature attempt", () => {
    const r = shouldShowConversionPrompt({
      ...baseInput,
      paidFeatureAttempted: true,
    });
    expect(r.reason).toBe("paid_feature");
  });

  it("prompts on share intent", () => {
    const r = shouldShowConversionPrompt({
      ...baseInput,
      shareAttempted: true,
    });
    expect(r.reason).toBe("share_intent");
  });

  it("share_intent wins priority over paid_feature + practice_threshold", () => {
    const r = shouldShowConversionPrompt({
      ...baseInput,
      shareAttempted: true,
      paidFeatureAttempted: true,
      practiceSessionsThisSession: 99,
      anonSessionAgeMs: SESSION_AGE_THRESHOLD_MS,
    });
    expect(r.reason).toBe("share_intent");
  });

  it("paid_feature wins over practice_threshold + session_age_24h", () => {
    const r = shouldShowConversionPrompt({
      ...baseInput,
      paidFeatureAttempted: true,
      practiceSessionsThisSession: 99,
      anonSessionAgeMs: SESSION_AGE_THRESHOLD_MS,
    });
    expect(r.reason).toBe("paid_feature");
  });

  it("practice_threshold wins over session_age_24h", () => {
    const r = shouldShowConversionPrompt({
      ...baseInput,
      practiceSessionsThisSession: PRACTICE_SESSION_THRESHOLD,
      anonSessionAgeMs: SESSION_AGE_THRESHOLD_MS,
    });
    expect(r.reason).toBe("practice_threshold");
  });
});

describe("buildLossAversionMessage", () => {
  it("returns generic copy when there's nothing to lose", () => {
    const m = buildLossAversionMessage({
      practiceCount: 0,
      streakCurrent: 0,
      weeklyRank: null,
    });
    expect(m.vi).toContain("Đăng ký");
    expect(m.en).toContain("Sign up");
  });

  it("renders a fully-populated VI/EN line", () => {
    const m = buildLossAversionMessage({
      practiceCount: 47,
      streakCurrent: 12,
      weeklyRank: 34,
    });
    expect(m.vi).toContain("47 lượt luyện");
    expect(m.vi).toContain("streak 12 ngày");
    expect(m.vi).toContain("hạng #34 tuần này");
    expect(m.en).toContain("47 practice attempts");
    expect(m.en).toContain("12-day streak");
    expect(m.en).toContain("rank #34 this week");
  });

  it("omits null weeklyRank cleanly", () => {
    const m = buildLossAversionMessage({
      practiceCount: 3,
      streakCurrent: 2,
      weeklyRank: null,
    });
    expect(m.vi).not.toContain("hạng");
    expect(m.en).not.toContain("rank");
  });
});
