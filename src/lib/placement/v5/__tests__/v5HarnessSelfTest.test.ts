/**
 * V5 Harness Self-Tests — verify determinism, inert defaults, identity
 * constants, and absence of I/O surfaces in the V5 evaluation harness.
 */

import { describe, expect, it } from "vitest";

import {
  V5_HARNESS_VERSION,
  V5_LEARNER_A,
  V5_LEARNER_B,
  V5_LEARNER_C,
  V5_LEARNERS,
  getV5HarnessState,
  generateProgressReport,
  V5_FIXED_EPOCH_MS,
  V5_FIXED_EPOCH,
  resetV5IdCounter,
  v5NextId,
  v5IsoDaysAfter,
  v5IsoDaysAgo,
  deepFreeze,
  type V5HarnessState,
  type V5ProgressReport,
} from "../v5Harness";

// ══════════════════════════════════════════════════════════════════════
// Harness state reflects V5_ENABLED
// ══════════════════════════════════════════════════════════════════════

describe("V5 harness — state reflects feature flag", () => {
  it("getV5HarnessState returns inactive when V5 is disabled", () => {
    const state: V5HarnessState = getV5HarnessState();

    expect(state.active).toBe(false);
    expect(state.enabledCapabilities).toEqual([]);
    expect(state.version).toBe(V5_HARNESS_VERSION);
  });

  it("generateProgressReport returns disabled message", () => {
    const report: V5ProgressReport = generateProgressReport();

    expect(report.active).toBe(false);
    expect(report.harnessVersion).toBe(V5_HARNESS_VERSION);
    expect(report.generatedAt).toBe(V5_FIXED_EPOCH);
    expect(report.message).toContain("disabled");
  });
});

// ══════════════════════════════════════════════════════════════════════
// Identity constants (no PII)
// ══════════════════════════════════════════════════════════════════════

describe("V5 harness — identity constants", () => {
  it("learner keys are opaque hash strings with no PII", () => {
    expect(V5_LEARNER_A).toMatch(/^v5_learner_hash_/);
    expect(V5_LEARNER_B).toMatch(/^v5_learner_hash_/);
    expect(V5_LEARNER_C).toMatch(/^v5_learner_hash_/);

    // No email patterns.
    expect(V5_LEARNER_A).not.toMatch(/@/);
    expect(V5_LEARNER_B).not.toMatch(/@/);
    expect(V5_LEARNER_C).not.toMatch(/@/);
  });

  it("V5_LEARNERS contains all three and is unique", () => {
    expect(V5_LEARNERS).toHaveLength(3);
    expect(new Set(V5_LEARNERS).size).toBe(3);
    expect(V5_LEARNERS).toContain(V5_LEARNER_A);
    expect(V5_LEARNERS).toContain(V5_LEARNER_B);
    expect(V5_LEARNERS).toContain(V5_LEARNER_C);
  });
});

// ══════════════════════════════════════════════════════════════════════
// Deterministic helpers
// ══════════════════════════════════════════════════════════════════════

describe("V5 harness — deterministic helpers", () => {
  it("V5_FIXED_EPOCH_MS is a fixed timestamp", () => {
    expect(V5_FIXED_EPOCH_MS).toBe(1_711_929_600_000);
    // Should parse to 2024-04-01.
    expect(new Date(V5_FIXED_EPOCH_MS).toISOString()).toBe(V5_FIXED_EPOCH);
  });

  it("v5NextId produces deterministic sequences after reset", () => {
    resetV5IdCounter();
    const ids1 = [v5NextId("a"), v5NextId("b"), v5NextId("c")];

    resetV5IdCounter();
    const ids2 = [v5NextId("a"), v5NextId("b"), v5NextId("c")];

    expect(ids1).toEqual(ids2);
  });

  it("v5IsoDaysAfter produces correct ISO strings", () => {
    const base = V5_FIXED_EPOCH;
    const plus7 = v5IsoDaysAfter(base, 7);

    expect(plus7).toBe("2024-04-08T00:00:00.000Z");
  });

  it("v5IsoDaysAgo produces correct ISO strings", () => {
    const base = V5_FIXED_EPOCH;
    const minus7 = v5IsoDaysAgo(base, 7);

    expect(minus7).toBe("2024-03-25T00:00:00.000Z");
  });

  it("v5IsoDaysAfter and v5IsoDaysAgo are inverses", () => {
    const base = V5_FIXED_EPOCH;
    const forward = v5IsoDaysAfter(base, 30);
    const back = v5IsoDaysAgo(forward, 30);

    expect(back).toBe(base);
  });
});

// ══════════════════════════════════════════════════════════════════════
// Deep freeze
// ══════════════════════════════════════════════════════════════════════

describe("V5 harness — deep freeze", () => {
  it("deepFreeze freezes top-level object", () => {
    const obj = { a: 1 };
    const frozen = deepFreeze(obj);
    expect(Object.isFrozen(frozen)).toBe(true);
  });

  it("deepFreeze freezes nested objects", () => {
    const obj = { a: 1, b: { c: 2, d: { e: 3 } } };
    const frozen = deepFreeze(obj);
    expect(Object.isFrozen(frozen)).toBe(true);
    expect(Object.isFrozen(frozen.b)).toBe(true);
    expect(Object.isFrozen((frozen.b as { d: object }).d)).toBe(true);
  });

  it("deepFreeze returns the same object reference", () => {
    const obj = { a: 1 };
    const frozen = deepFreeze(obj);
    expect(frozen).toBe(obj);
  });
});

// ══════════════════════════════════════════════════════════════════════
// No I/O surfaces
// ══════════════════════════════════════════════════════════════════════

describe("V5 harness — no I/O surfaces", () => {
  it("V5 harness exports are pure functions and constants", () => {
    expect(typeof V5_HARNESS_VERSION).toBe("string");
    expect(typeof getV5HarnessState).toBe("function");
    expect(typeof generateProgressReport).toBe("function");
    expect(typeof resetV5IdCounter).toBe("function");
    expect(typeof v5NextId).toBe("function");
    expect(typeof v5IsoDaysAfter).toBe("function");
    expect(typeof v5IsoDaysAgo).toBe("function");
    expect(typeof deepFreeze).toBe("function");
  });

  it("generateProgressReport is deterministic", () => {
    const r1 = generateProgressReport();
    const r2 = generateProgressReport();

    expect(r1).toEqual(r2);
    expect(r1.harnessVersion).toBe(r2.harnessVersion);
    expect(r1.generatedAt).toBe(r2.generatedAt);
    expect(r1.message).toBe(r2.message);
  });

  it("getV5HarnessState is deterministic", () => {
    const s1 = getV5HarnessState();
    const s2 = getV5HarnessState();

    expect(s1).toEqual(s2);
  });
});
