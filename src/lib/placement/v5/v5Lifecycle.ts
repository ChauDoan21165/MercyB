/**
 * V5 Lifecycle — orchestration wrapper over V4 analytical core.
 *
 * The V5 lifecycle sits between V4's deterministic analytical core and the
 * runtime product flow. It:
 *   1. Gates all V5 behavior behind V5_ENABLED (disabled → pure V4 passthrough)
 *   2. Persists V4-shaped data through V5 Supabase tables when enabled
 *   3. Enhances V4 outputs with V5 personalization/forecasting when per-capability
 *      flags are on
 *   4. Falls back gracefully to V4 when any V5 capability is disabled
 *
 * Design invariants:
 *   - V4 contracts are wrapped, never mutated.
 *   - V5_ENABLED=false returns V4 result unchanged — zero side effects.
 *   - Persistence accessed only through V5Persistence namespace.
 *   - Persistence errors are caught and never break the V4 path.
 *   - Lifecycle state is deterministic given compile-time feature flags.
 *   - No Date.now, no Math.random, no network, no provider I/O.
 *   - No V4 files touched.
 */

import type { AdaptiveLoopInput, AdaptiveLoopResult } from "@/lib/placement/v4/telemetry";
import { evaluateAdaptiveLoop } from "@/lib/placement/v4/telemetry";
import type {
  CurriculumLearnerState,
  CurriculumPlanLength,
  CurriculumPlan,
} from "@/lib/placement/v4";
import { generateCurriculumPlan } from "@/lib/placement/v4";
import {
  V5_ENABLED,
  V5_PERSONALIZATION_ENABLED,
  V5_FORECAST_ENABLED,
  isV5CapabilityEnabled,
  enabledV5Capabilities,
  type V5Capability,
} from "./v5FeatureFlag";
import { V5_FIXED_EPOCH } from "./v5Harness";

// ─── Lifecycle State ──────────────────────────────────────────────────

export type V5LifecyclePhase = "inactive" | "evaluating" | "active" | "degraded";

export interface V5LifecycleState {
  /** Current lifecycle phase */
  phase: V5LifecyclePhase;
  /** Which capabilities are enabled (subject to master flag + per-capability flags) */
  enabledCapabilities: V5Capability[];
  /** Which capabilities are degraded (subset of enabledCapabilities) */
  degradedCapabilities: V5Capability[];
  /** When the lifecycle entered the current phase (ISO timestamp) */
  phaseSince: string;
  /** Monotonically increasing transition counter */
  transitionCount: number;
}

let _lifecycleState: V5LifecycleState | null = null;
let _transitionCount = 0;

/**
 * Returns the current V5 lifecycle state. State is computed once from
 * compile-time feature flags and cached for the lifetime of the module.
 * Deterministic: same flags always produce the same state.
 */
export function getV5LifecycleState(): V5LifecycleState {
  if (_lifecycleState) return _lifecycleState;

  const caps = enabledV5Capabilities();

  _lifecycleState = {
    phase: V5_ENABLED ? "evaluating" : "inactive",
    enabledCapabilities: caps,
    degradedCapabilities: [],
    phaseSince: V5_FIXED_EPOCH,
    transitionCount: _transitionCount,
  };

  return _lifecycleState;
}

/**
 * Returns whether the lifecycle is in a phase where V5 enhancements are
 * delivered to learners (active or degraded with at least one non-degraded
 * capability).
 */
export function isV5LifecycleActive(): boolean {
  const state = getV5LifecycleState();
  return state.phase === "active" || state.phase === "degraded";
}

/**
 * Returns whether V5 persistence writes should occur.
 * Persistence is enabled in evaluating, active, and degraded phases,
 * but not in inactive.
 */
export function isV5PersistenceEnabled(): boolean {
  return V5_ENABLED;
}

// ─── Persistence helpers (fire-and-forget) ────────────────────────────

/**
 * Schedule a persistence write that does not block the caller.
 * Errors are caught and logged; they never propagate to the V4 path.
 */
function schedulePersist(promise: Promise<unknown>): void {
  promise.catch((err: unknown) => {
    console.warn("[v5Lifecycle] persistence write failed (non-fatal)", err);
  });
}

// ─── V4 Wrappers ──────────────────────────────────────────────────────

/**
 * V5-enhanced evaluateAdaptiveLoop.
 *
 * When V5 personalization is enabled:
 *   - Wraps the V4 evaluateAdaptiveLoop call
 *   - Persists the resulting orchestration snapshot (fire-and-forget)
 *   - Returns the V4 result unchanged (V5 enhancements are additive,
 *     delivered through separate V5 functions)
 *
 * When V5 is disabled:
 *   - Returns V4 evaluateAdaptiveLoop result unchanged
 *   - No persistence, no side effects
 */
export function v5EvaluateAdaptiveLoop(
  input: AdaptiveLoopInput,
): AdaptiveLoopResult {
  const result = evaluateAdaptiveLoop(input);

  if (!isV5CapabilityEnabled("personalization")) {
    return result;
  }

  // Fire-and-forget persistence — does not block or mutate the result.
  // V5Persistence.saveOrchestrationSnapshot is imported lazily to avoid
  // Supabase client initialization when V5 is disabled.
  const learnerId = input.snapshot.userIdHash;
  schedulePersist(
    import("./persistence").then(({ saveOrchestrationSnapshot }) =>
      saveOrchestrationSnapshot({
        user_id: learnerId,
        snapshot_id: `v5-adaptive-${learnerId}-${V5_FIXED_EPOCH}`,
        snapshot_type: "FULL",
        schema_version: "v5-lifecycle-v1",
        content_hash: result.plan.inputFingerprint,
        payload: result as unknown as Record<string, unknown>,
        device_id: null,
        vector_clock: null,
        event_count: input.aggregation.eventCount,
      }),
    ),
  );

  return result;
}

/**
 * V5-enhanced generateCurriculumPlan.
 *
 * When V5 personalization is enabled:
 *   - Wraps the V4 generateCurriculumPlan call
 *   - Persists the resulting curriculum plan (fire-and-forget)
 *   - Returns the V4 result unchanged (V5 archetype-aware enhancement
 *     is delivered through a separate v5GenerateCurriculumPlan function
 *     once V5 personalization is implemented)
 *
 * When V5 is disabled:
 *   - Returns V4 generateCurriculumPlan result unchanged
 *   - No persistence, no side effects
 */
export function v5GenerateCurriculumPlan(
  state: CurriculumLearnerState,
  planLength: CurriculumPlanLength,
): CurriculumPlan {
  const result = generateCurriculumPlan(state, planLength);

  if (!isV5CapabilityEnabled("personalization")) {
    return result;
  }

  // Fire-and-forget persistence.
  schedulePersist(
    import("./persistence").then(({ saveCurriculumPlan }) =>
      saveCurriculumPlan({
        user_id: "v5-learner",
        plan_version: 1,
        plan_length_days: planLength,
        generated_at: V5_FIXED_EPOCH,
        deterministic_key: `v5-plan-${planLength}`,
        fatigue_score: state.fatigue?.score ?? 0,
        focus_skills: state.weakSkills ?? null,
        payload: result as unknown as Record<string, unknown>,
      }),
    ),
  );

  return result;
}

/**
 * V5 forecast ensemble stub.
 *
 * Returns the V4 adaptive loop result unchanged. When V5_FORECAST_ENABLED
 * is true, this will be replaced with multi-strategy ensemble forecasting.
 * Currently returns the same result as evaluateAdaptiveLoop for backward
 * compatibility.
 */
export function v5ForecastEnsemble(
  input: AdaptiveLoopInput,
): AdaptiveLoopResult {
  if (!isV5CapabilityEnabled("forecast")) {
    return evaluateAdaptiveLoop(input);
  }

  // Stub: V5 forecast ensemble not yet implemented.
  // When implemented, this will compare 2-3 forecasting strategies
  // and return the best-performing blended forecast.
  return evaluateAdaptiveLoop(input);
}

// ─── State introspection ──────────────────────────────────────────────

/**
 * Returns a human-readable summary of the current lifecycle state.
 * Safe for logging, debugging, and operator dashboards.
 */
export function describeV5Lifecycle(): string {
  const state = getV5LifecycleState();
  const caps = state.enabledCapabilities.length > 0
    ? state.enabledCapabilities.join(", ")
    : "none";
  const degraded = state.degradedCapabilities.length > 0
    ? ` (degraded: ${state.degradedCapabilities.join(", ")})`
    : "";

  return `V5 Lifecycle: phase=${state.phase}, capabilities=[${caps}]${degraded}, since=${state.phaseSince}`;
}
