/**
 * V5 Harness — deterministic evaluation fixture entrypoint.
 *
 * This module provides the skeleton for V5's evaluation harness. In the
 * disabled state (V5_ENABLED=false), all functions return inert defaults.
 * When V5 is enabled, the harness provides deterministic scenario builders
 * for personalization, forecast, and provider-runtime benchmarks.
 *
 * Design invariants:
 *   1. All fixtures are deterministic — no Date.now, no Math.random.
 *   2. All fixtures are pure — same inputs produce same outputs.
 *   3. No network, storage, env, or vendor I/O.
 *   4. No PII — all identities are opaque hash strings.
 *   5. V4 fixtures are imported and composed, never mutated.
 *   6. The harness is V5-local; no global test setup dependency.
 */

import {
  V5_ENABLED,
  isV5CapabilityEnabled,
  type V5Capability,
} from "./v5FeatureFlag";

// ─── Harness version ──────────────────────────────────────────────────

export const V5_HARNESS_VERSION = "v5-harness-v1";

// ─── Identity constants (no PII) ──────────────────────────────────────

export const V5_LEARNER_A = "v5_learner_hash_aaaaaaaaaaaaaa";
export const V5_LEARNER_B = "v5_learner_hash_bbbbbbbbbbbbbb";
export const V5_LEARNER_C = "v5_learner_hash_cccccccccccccc";

export const V5_LEARNERS = [V5_LEARNER_A, V5_LEARNER_B, V5_LEARNER_C] as const;

// ─── Harness state ────────────────────────────────────────────────────

export interface V5HarnessState {
  /** Whether the harness is active (gated by V5_ENABLED). */
  active: boolean;
  /** Which V5 capabilities are currently enabled. */
  enabledCapabilities: V5Capability[];
  /** Harness schema version. */
  version: string;
}

/**
 * Returns the current harness state based on the V5 feature flag.
 * When V5 is disabled, active=false and capabilities=[].
 */
export function getV5HarnessState(): V5HarnessState {
  return {
    active: V5_ENABLED,
    enabledCapabilities: V5_ENABLED
      ? (["personalization", "forecast", "provider_runtime", "evaluation_harness"] as V5Capability[]).filter(
          (cap) => isV5CapabilityEnabled(cap),
        )
      : [],
    version: V5_HARNESS_VERSION,
  };
}

// ─── Deterministic helpers ────────────────────────────────────────────

/** Fixed epoch for all V5 fixtures (2024-04-01T00:00:00.000Z). */
export const V5_FIXED_EPOCH_MS = 1_711_929_600_000;
export const V5_FIXED_EPOCH = "2024-04-01T00:00:00.000Z";

let _v5IdCounter = 0;

export function resetV5IdCounter(): void {
  _v5IdCounter = 0;
}

export function v5NextId(prefix = "v5"): string {
  _v5IdCounter += 1;
  return `${prefix}-${_v5IdCounter.toString(16).padStart(6, "0")}`;
}

export function v5IsoDaysAfter(base: string, days: number): string {
  const ts = new Date(base).getTime();
  return new Date(ts + days * 24 * 60 * 60 * 1000).toISOString();
}

export function v5IsoDaysAgo(base: string, days: number): string {
  return v5IsoDaysAfter(base, -days);
}

// ─── No-op fixture factories (active when V5 is disabled) ─────────────

/**
 * Inert progress report. Returned when V5 evaluation harness is disabled.
 */
export interface V5ProgressReport {
  harnessVersion: string;
  active: boolean;
  generatedAt: string;
  message: string;
}

export function generateProgressReport(): V5ProgressReport {
  return {
    harnessVersion: V5_HARNESS_VERSION,
    active: V5_ENABLED,
    generatedAt: new Date(V5_FIXED_EPOCH_MS).toISOString(),
    message: V5_ENABLED
      ? "V5 evaluation harness active — progress report available."
      : "V5 evaluation harness disabled. Enable V5_ENABLED to generate reports.",
  };
}

// ─── Deep freeze helper ───────────────────────────────────────────────

export function deepFreeze<T extends object>(value: T): T {
  for (const key of Object.keys(value) as Array<keyof T>) {
    const child = value[key];
    if (child && typeof child === "object" && !Object.isFrozen(child)) {
      deepFreeze(child as object);
    }
  }
  return Object.freeze(value);
}
