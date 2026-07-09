// src/lib/telemetry/actionCodes.ts
//
// Stable action codes for the placement "signal cell" telemetry.
//
// These strings are a CONTRACT with Sentry: they are written as the indexed
// `action_code` tag, so alert rules and saved searches key on them. Renaming a
// code silently breaks every dashboard that referenced it — add a new code and
// retire the old one instead.
//
// Scope: user-facing placement actions only. An action earns a code when a
// user can perceive it failing or hanging; internal pure functions do not.

export const PLACEMENT_ACTION_CODES = [
  "PLACEMENT_START_SESSION",
  "PLACEMENT_RESUME_SESSION",
  "PLACEMENT_LOAD_AUDIO",
  "PLACEMENT_SUBMIT_ANSWER",
  "PLACEMENT_COMPUTE_RESULTS",
  "PLACEMENT_FETCH_RESULTS",
  "PLACEMENT_RENDER_RESULTS",
  "PLACEMENT_ABANDON_SESSION",
] as const;

export type PlacementActionCode = (typeof PLACEMENT_ACTION_CODES)[number];

/**
 * Why a signal cell closed as `failed`.
 *
 * `timeout` is the load-bearing one: it is the only reason that fires for an
 * action which never settles at all. A hang emits nothing without it.
 */
export type ActionFailureReason = "timeout" | "exception" | "invariant";

/**
 * Per-action timeout budget, in milliseconds. Deliberately generous — this is a
 * "the user has given up" threshold, not a performance SLO. Undershooting it
 * would emit `failed{timeout}` for actions that merely ran slow on a bad
 * network, which would poison the signal.
 */
export const ACTION_TIMEOUT_MS: Record<PlacementActionCode, number> = {
  PLACEMENT_START_SESSION: 15_000,
  PLACEMENT_RESUME_SESSION: 15_000,
  PLACEMENT_LOAD_AUDIO: 15_000,
  PLACEMENT_SUBMIT_ANSWER: 20_000,
  PLACEMENT_COMPUTE_RESULTS: 20_000,
  PLACEMENT_FETCH_RESULTS: 20_000,
  PLACEMENT_RENDER_RESULTS: 10_000,
  PLACEMENT_ABANDON_SESSION: 10_000,
};
