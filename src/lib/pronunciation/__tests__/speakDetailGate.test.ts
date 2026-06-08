import { describe, expect, it } from "vitest";
import {
  resolveSpeakDetailGate,
  SPEAK_DETAIL_CAP_MESSAGE_VI,
  SPEAK_DETAIL_SESSION_CAP,
} from "../speakDetailGate";

describe("resolveSpeakDetailGate", () => {
  it("gate OFF → legacy: always allows, never blocks or caps (premium irrelevant)", () => {
    for (const isPremiumOrTrial of [true, false]) {
      const r = resolveSpeakDetailGate({
        premiumGateEnabled: false,
        isPremiumOrTrial,
        detailUsed: SPEAK_DETAIL_SESSION_CAP + 99,
      });
      expect(r).toEqual({ gateAllows: true, capReached: false, premiumBlocked: false });
    }
  });

  it("gate ON + free user → premium-blocked, no scoring, not 'capped'", () => {
    const r = resolveSpeakDetailGate({
      premiumGateEnabled: true,
      isPremiumOrTrial: false,
      detailUsed: 0,
    });
    expect(r.premiumBlocked).toBe(true);
    expect(r.gateAllows).toBe(false);
    // A free user is blocked, NOT "out of detailed scoring" — keeps the two
    // states honest so the UI never tells a free user they used up a quota.
    expect(r.capReached).toBe(false);
  });

  it("gate ON + premium under the cap → allowed", () => {
    const r = resolveSpeakDetailGate({
      premiumGateEnabled: true,
      isPremiumOrTrial: true,
      detailUsed: SPEAK_DETAIL_SESSION_CAP - 1,
    });
    expect(r).toEqual({ gateAllows: true, capReached: false, premiumBlocked: false });
  });

  it("gate ON + premium AT the cap → cap reached, no further scoring", () => {
    const r = resolveSpeakDetailGate({
      premiumGateEnabled: true,
      isPremiumOrTrial: true,
      detailUsed: SPEAK_DETAIL_SESSION_CAP,
    });
    expect(r.capReached).toBe(true);
    expect(r.gateAllows).toBe(false);
    expect(r.premiumBlocked).toBe(false);
  });

  it("gate ON + premium OVER the cap → still capped", () => {
    const r = resolveSpeakDetailGate({
      premiumGateEnabled: true,
      isPremiumOrTrial: true,
      detailUsed: SPEAK_DETAIL_SESSION_CAP + 5,
    });
    expect(r.capReached).toBe(true);
    expect(r.gateAllows).toBe(false);
  });

  it("respects a custom cap override", () => {
    const under = resolveSpeakDetailGate({
      premiumGateEnabled: true,
      isPremiumOrTrial: true,
      detailUsed: 2,
      cap: 3,
    });
    expect(under.gateAllows).toBe(true);
    const at = resolveSpeakDetailGate({
      premiumGateEnabled: true,
      isPremiumOrTrial: true,
      detailUsed: 3,
      cap: 3,
    });
    expect(at.capReached).toBe(true);
    expect(at.gateAllows).toBe(false);
  });

  it("the cap message is warm, mentions self-compare, and carries no number/percent", () => {
    expect(SPEAK_DETAIL_CAP_MESSAGE_VI).toMatch(/nghe lại giọng của mình/);
    expect(SPEAK_DETAIL_CAP_MESSAGE_VI).not.toMatch(/\d/);
  });
});
