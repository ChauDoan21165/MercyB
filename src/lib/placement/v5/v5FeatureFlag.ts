/**
 * V5 Feature Flag — disabled-by-default capability gate.
 *
 * V5 is additive to V4. Until C1/C2 approve V5 activation, every V5
 * code path must check this flag and return the V4 equivalent or a
 * no-op when V5 is disabled.
 *
 * Design invariants:
 *   1. V5_ENABLED defaults to false. No env read, no network, no storage.
 *   2. The flag is a plain module-level constant, not a runtime toggle.
 *      Tree-shaking removes disabled paths in production builds.
 *   3. V5 capabilities are individually gated so partial rollouts are
 *      possible without enabling the full V5 surface.
 *   4. No import of this module may mutate V4 state or global test setup.
 */

// ─── Master flag ──────────────────────────────────────────────────────

/** Master kill-switch for all V5 behavior. Disabled by default. */
export const V5_ENABLED: boolean = false;

// ─── Capability flags ─────────────────────────────────────────────────

/** V5 personalization engine (curriculum adaptation, pacing, fatigue). */
export const V5_PERSONALIZATION_ENABLED: boolean = false;

/** V5 forecast engine (CEFR trajectory prediction, confidence intervals). */
export const V5_FORECAST_ENABLED: boolean = false;

/** V5 provider runtime (dynamic provider selection, health monitoring). */
export const V5_PROVIDER_RUNTIME_ENABLED: boolean = false;

/** V5 evaluation harness (benchmarks, quality metrics, journey simulations). */
export const V5_EVALUATION_HARNESS_ENABLED: boolean = false;

/** V5 admin observability (read-only dashboards, no provider I/O). */
export const V5_ADMIN_OBSERVABILITY_ENABLED: boolean = false;

// ─── Capability check helpers ─────────────────────────────────────────

export type V5Capability =
  | "personalization"
  | "forecast"
  | "provider_runtime"
  | "evaluation_harness"
  | "admin_observability";

const CAPABILITY_MAP: Record<V5Capability, boolean> = {
  personalization: V5_PERSONALIZATION_ENABLED,
  forecast: V5_FORECAST_ENABLED,
  provider_runtime: V5_PROVIDER_RUNTIME_ENABLED,
  evaluation_harness: V5_EVALUATION_HARNESS_ENABLED,
  admin_observability: V5_ADMIN_OBSERVABILITY_ENABLED,
};

/**
 * Returns true if the given V5 capability is enabled.
 * All capabilities are gated behind the master V5_ENABLED flag.
 */
export function isV5CapabilityEnabled(capability: V5Capability): boolean {
  if (!V5_ENABLED) return false;
  return CAPABILITY_MAP[capability] ?? false;
}

/**
 * Returns the list of all currently enabled V5 capabilities.
 * When V5_ENABLED is false, returns an empty array.
 */
export function enabledV5Capabilities(): V5Capability[] {
  if (!V5_ENABLED) return [];
  return (Object.keys(CAPABILITY_MAP) as V5Capability[]).filter(
    (cap) => CAPABILITY_MAP[cap],
  );
}

/**
 * Guard: throws if V5 is disabled when a V5 code path is reached.
 * Useful for development-time assertions that V5 paths aren't called
 * before the flag is flipped.
 */
export function requireV5Enabled(caller: string): void {
  if (!V5_ENABLED) {
    throw new Error(
      `V5: ${caller} requires V5_ENABLED=true. ` +
      `Set V5_ENABLED in the feature-flag module before calling V5 code paths.`,
    );
  }
}
