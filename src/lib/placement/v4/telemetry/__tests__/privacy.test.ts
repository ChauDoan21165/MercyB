import { describe, expect, it } from "vitest";

import {
  aggregateEvents,
  aggregateForRelease,
  fnv1a64Hex,
  redactForRelease,
} from "../index";
import { scenarioCommon } from "./fixtures";

describe("privacy — redactForRelease", () => {
  it("drops lessons below the k-anonymity threshold", () => {
    const summary = aggregateEvents(scenarioCommon());
    const released = redactForRelease(summary, { kAnonThreshold: 2 });
    for (const l of released.lessons) {
      expect(l.uniqueUsers).toBeGreaterThanOrEqual(2);
    }
  });

  it("strips userIdHashes from lesson aggregates", () => {
    const summary = aggregateEvents(scenarioCommon());
    const released = redactForRelease(summary, { kAnonThreshold: 1 });
    for (const l of released.lessons) {
      expect(l.userIdHashes).toEqual([]);
    }
  });

  it("excludes user rows by default", () => {
    const summary = aggregateEvents(scenarioCommon());
    const released = redactForRelease(summary);
    expect(released.users).toEqual([]);
    expect(released.userCount).toBe(0);
  });

  it("can opt into user rows but still strips fingerprinting fields", () => {
    const summary = aggregateEvents(scenarioCommon());
    const released = redactForRelease(summary, {
      kAnonThreshold: 1,
      includeUserRows: true,
    });
    expect(released.users.length).toBeGreaterThan(0);
    for (const u of released.users) {
      expect(u.activeDays).toEqual([]);
      expect(u.cefrTransitions).toEqual([]);
    }
  });

  it("rejects invalid k", () => {
    const summary = aggregateEvents(scenarioCommon());
    expect(() =>
      redactForRelease(summary, { kAnonThreshold: 0 }),
    ).toThrow();
    expect(() =>
      redactForRelease(summary, { kAnonThreshold: 1.5 }),
    ).toThrow();
  });

  it("aggregateForRelease is a one-call equivalent", () => {
    const events = scenarioCommon();
    const released = aggregateForRelease(events, { kAnonThreshold: 1 });
    const referenced = redactForRelease(aggregateEvents(events), {
      kAnonThreshold: 1,
    });
    expect(released).toEqual(referenced);
  });
});

describe("privacy — fnv1a64Hex", () => {
  it("is deterministic for the same (input, salt)", () => {
    const a = fnv1a64Hex("user-1", "salt-abc");
    const b = fnv1a64Hex("user-1", "salt-abc");
    expect(a).toBe(b);
  });

  it("varies with input", () => {
    const a = fnv1a64Hex("user-1", "salt");
    const b = fnv1a64Hex("user-2", "salt");
    expect(a).not.toBe(b);
  });

  it("varies with salt", () => {
    const a = fnv1a64Hex("user-1", "salt-a");
    const b = fnv1a64Hex("user-1", "salt-b");
    expect(a).not.toBe(b);
  });

  it("returns 16-char lowercase hex", () => {
    const a = fnv1a64Hex("user-1", "salt");
    expect(a).toMatch(/^[0-9a-f]{16}$/);
  });

  it("never reveals input as substring", () => {
    const a = fnv1a64Hex("admin@mercyblade.com", "salt-xyz");
    expect(a).not.toContain("admin");
    expect(a).not.toContain("mercyblade");
  });
});
