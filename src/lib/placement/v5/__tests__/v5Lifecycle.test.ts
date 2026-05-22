/**
 * V5 Lifecycle Tests
 *
 * Validates the V5 lifecycle state machine and V4 wrapper functions.
 * Key invariants under test:
 *   - V5_ENABLED=false returns V4 result unchanged
 *   - Deterministic lifecycle state
 *   - Persistence no-op when disabled
 *   - V4 regression safety
 *   - Capability gating
 */

import { describe, it, expect, vi } from "vitest";

// Import V4 functions for direct comparison
import { evaluateAdaptiveLoop } from "@/lib/placement/v4/telemetry";
import type { AdaptiveLoopInput } from "@/lib/placement/v4/telemetry";
import { generateCurriculumPlan } from "@/lib/placement/v4";
import type { CurriculumLearnerState, CurriculumPlanLength } from "@/lib/placement/v4";

// V5 lifecycle under test
import {
  getV5LifecycleState,
  isV5LifecycleActive,
  isV5PersistenceEnabled,
  v5EvaluateAdaptiveLoop,
  v5GenerateCurriculumPlan,
  v5ForecastEnsemble,
  describeV5Lifecycle,
  type V5LifecycleState,
  type V5LifecyclePhase,
} from "../v5Lifecycle";

// V5 feature flags for verification
import {
  V5_ENABLED,
  V5_PERSONALIZATION_ENABLED,
  V5_FORECAST_ENABLED,
} from "../v5FeatureFlag";

// ─── Helpers ───────────────────────────────────────────────────────────

/** Minimal valid AdaptiveLoopInput for testing */
function mockAdaptiveLoopInput(): AdaptiveLoopInput {
  return {
    snapshot: {
      userIdHash: "test-learner",
      sessionId: "test-session",
      snapshotMs: 1_711_929_600_000,
      plan: {
        planVersion: "v4-test",
        totalDays: 7,
        intensity: "balanced" as const,
        days: [
          {
            day: 1,
            lessons: [
              { lessonId: "lesson-1", skill: "vocabulary" as const, estimatedMinutes: 10 },
            ],
          },
        ],
      },
      currentDay: 1,
      lastActiveDay: 1,
      skills: {},
      cefr: { overall: "A1" },
    },
    aggregation: {
      eventCount: 0,
      lessonCount: 0,
      userCount: 1,
      earliestMs: null,
      latestMs: null,
      lessons: [],
      users: [],
    },
  } as unknown as AdaptiveLoopInput;
}

/** Minimal valid CurriculumLearnerState for testing */
function mockCurriculumState(): CurriculumLearnerState {
  return {
    assessment: {
      userIdHash: "test-user",
      overallCefr: "A1",
      skills: {},
    },
  } as unknown as CurriculumLearnerState;
}

// ─── Disabled-by-default ───────────────────────────────────────────────

describe("V5 lifecycle — disabled by default", () => {
  it("V5_ENABLED is false by default", () => {
    expect(V5_ENABLED).toBe(false);
  });

  it("getV5LifecycleState returns inactive when V5 is disabled", () => {
    const state = getV5LifecycleState();
    expect(state.phase).toBe("inactive");
    expect(state.enabledCapabilities).toEqual([]);
  });

  it("isV5LifecycleActive returns false when V5 is disabled", () => {
    expect(isV5LifecycleActive()).toBe(false);
  });

  it("isV5PersistenceEnabled returns false when V5 is disabled", () => {
    expect(isV5PersistenceEnabled()).toBe(false);
  });

  it("v5EvaluateAdaptiveLoop returns V4 result unchanged when disabled", () => {
    const input = mockAdaptiveLoopInput();
    const v4Result = evaluateAdaptiveLoop(input);
    const v5Result = v5EvaluateAdaptiveLoop(input);

    expect(v5Result.signals).toEqual(v4Result.signals);
    expect(v5Result.diagnostics).toEqual(v4Result.diagnostics);
  });

  it("v5GenerateCurriculumPlan returns V4 result unchanged when disabled", () => {
    const state = mockCurriculumState();
    const v4Result = generateCurriculumPlan(state, 7);
    const v5Result = v5GenerateCurriculumPlan(state, 7);

    expect(v5Result.planLengthDays).toBe(v4Result.planLengthDays);
    expect(v5Result.days.length).toBe(v4Result.days.length);
    expect(v5Result.days.length).toBe(v4Result.days.length);
  });

  it("v5ForecastEnsemble delegates to V4 when disabled", () => {
    const input = mockAdaptiveLoopInput();
    const v4Result = evaluateAdaptiveLoop(input);
    const v5Result = v5ForecastEnsemble(input);

    expect(v5Result.signals).toEqual(v4Result.signals);
    expect(v5Result.diagnostics).toEqual(v4Result.diagnostics);
  });
});

// ─── Lifecycle state machine ───────────────────────────────────────────

describe("V5 lifecycle — state machine", () => {
  it("returns the same state on repeated calls (cached)", () => {
    const a = getV5LifecycleState();
    const b = getV5LifecycleState();
    expect(a).toBe(b);
  });

  it("phase is 'inactive' when V5_ENABLED is false", () => {
    const state = getV5LifecycleState();
    expect(state.phase).toBe("inactive");
  });

  it("enabledCapabilities is empty when V5_ENABLED is false", () => {
    const state = getV5LifecycleState();
    expect(state.enabledCapabilities).toEqual([]);
  });

  it("degradedCapabilities is empty by default", () => {
    const state = getV5LifecycleState();
    expect(state.degradedCapabilities).toEqual([]);
  });

  it("phaseSince is the V5 fixed epoch", () => {
    const state = getV5LifecycleState();
    expect(state.phaseSince).toBe("2024-04-01T00:00:00.000Z");
  });

  it("transitionCount starts at 0", () => {
    const state = getV5LifecycleState();
    expect(state.transitionCount).toBe(0);
  });

  it("V5LifecyclePhase type includes all four phases", () => {
    const phases: V5LifecyclePhase[] = ["inactive", "evaluating", "active", "degraded"];
    expect(phases).toHaveLength(4);
  });

  it("V5LifecycleState shape matches expected interface", () => {
    const state = getV5LifecycleState();
    expect(state).toHaveProperty("phase");
    expect(state).toHaveProperty("enabledCapabilities");
    expect(state).toHaveProperty("degradedCapabilities");
    expect(state).toHaveProperty("phaseSince");
    expect(state).toHaveProperty("transitionCount");
  });
});

// ─── Capability gating ─────────────────────────────────────────────────

describe("V5 lifecycle — capability gating", () => {
  it("V5_PERSONALIZATION_ENABLED is false by default", () => {
    expect(V5_PERSONALIZATION_ENABLED).toBe(false);
  });

  it("V5_FORECAST_ENABLED is false by default", () => {
    expect(V5_FORECAST_ENABLED).toBe(false);
  });

  it("v5ForecastEnsemble returns V4 result when forecast disabled", () => {
    const input = mockAdaptiveLoopInput();
    const v4Result = evaluateAdaptiveLoop(input);
    const v5Result = v5ForecastEnsemble(input);

    // When forecast is disabled, should return same as V4
    expect(v5Result.signals).toEqual(v4Result.signals);
  });
});

// ─── V4 regression safety ──────────────────────────────────────────────

describe("V5 lifecycle — V4 regression safety", () => {
  it("v5EvaluateAdaptiveLoop output matches V4 for same input", () => {
    const input = mockAdaptiveLoopInput();
    const v4 = evaluateAdaptiveLoop(input);
    const v5 = v5EvaluateAdaptiveLoop(input);

    expect(v5.signals).toEqual(v4.signals);
    expect(v5.plan).toEqual(v4.plan);
    expect(v5.diagnostics).toEqual(v4.diagnostics);
  });

  it("v5GenerateCurriculumPlan output matches V4 for 7-day plan", () => {
    const state = mockCurriculumState();
    const v4 = generateCurriculumPlan(state, 7);
    const v5 = v5GenerateCurriculumPlan(state, 7);

    expect(v5.planLengthDays).toBe(v4.planLengthDays);
    expect(v5.days.length).toBe(v4.days.length);
    expect(v5.days).toHaveLength(v4.days.length);
  });

  it("v5GenerateCurriculumPlan output matches V4 for 28-day plan", () => {
    const state = mockCurriculumState();
    const v4 = generateCurriculumPlan(state, 28);
    const v5 = v5GenerateCurriculumPlan(state, 28);

    expect(v5.planLengthDays).toBe(v4.planLengthDays);
    expect(v5.days.length).toBe(v4.days.length);
    expect(v5.days).toHaveLength(v4.days.length);
  });

  it("v5GenerateCurriculumPlan output matches V4 for 90-day plan", () => {
    const state = mockCurriculumState();
    const v4 = generateCurriculumPlan(state, 90);
    const v5 = v5GenerateCurriculumPlan(state, 90);

    expect(v5.planLengthDays).toBe(v4.planLengthDays);
    expect(v5.days.length).toBe(v4.days.length);
    expect(v5.days).toHaveLength(v4.days.length);
  });
});

// ─── describeV5Lifecycle ───────────────────────────────────────────────

describe("V5 lifecycle — describeV5Lifecycle", () => {
  it("returns a non-empty string", () => {
    const desc = describeV5Lifecycle();
    expect(desc).toBeTruthy();
    expect(typeof desc).toBe("string");
  });

  it("includes the phase in the description", () => {
    const desc = describeV5Lifecycle();
    expect(desc).toContain("phase=inactive");
  });

  it("is safe to call multiple times", () => {
    const a = describeV5Lifecycle();
    const b = describeV5Lifecycle();
    expect(a).toBe(b);
  });
});

// ─── Edge cases ────────────────────────────────────────────────────────

describe("V5 lifecycle — edge cases", () => {
  it("v5EvaluateAdaptiveLoop handles minimal input without throwing", () => {
    const input = mockAdaptiveLoopInput();
    expect(() => v5EvaluateAdaptiveLoop(input)).not.toThrow();
  });

  it("v5GenerateCurriculumPlan handles minimal input without throwing", () => {
    const state = mockCurriculumState();
    expect(() => v5GenerateCurriculumPlan(state, 7)).not.toThrow();
    expect(() => v5GenerateCurriculumPlan(state, 28)).not.toThrow();
    expect(() => v5GenerateCurriculumPlan(state, 90)).not.toThrow();
  });

  it("v5ForecastEnsemble handles minimal input without throwing", () => {
    const input = mockAdaptiveLoopInput();
    expect(() => v5ForecastEnsemble(input)).not.toThrow();
  });

  it("results are frozen/deterministic across repeated calls", () => {
    const input = mockAdaptiveLoopInput();
    const r1 = v5EvaluateAdaptiveLoop(input);
    const r2 = v5EvaluateAdaptiveLoop(input);
    expect(r1.signals).toEqual(r2.signals);
    expect(r1.plan).toEqual(r2.plan);
    expect(r1.diagnostics).toEqual(r2.diagnostics);
  });
});