// monotonic-backoff.ts — A91 fix A.
//
// Full-jitter exponential backoff for the optimistic CAS retry loop in
// `upsertSharedSubscriptionMonotonic` (billing.ts). A91's diagnosis:
// before this, all MAX_MONOTONIC_RETRIES attempts burned within a few ms
// with ZERO delay and ZERO jitter, so under a Stripe multi-event burst for
// one subscription (e.g. `customer.subscription.updated` + `invoice.paid`
// for the same sub) the loser never got a clean read→write gap and threw
// `Failed to apply monotonic Stripe subscription update after concurrent
// modifications`. Spacing retries lets the contending writer's transaction
// commit before the next read.
//
// Deliberately ZERO imports (no Deno globals, no esm.sh) so the math is
// vitest-testable in isolation without dragging billing.ts's Deno/esm.sh
// module graph — the same "pure logic, DI" pattern the placement-session
// engine uses (see tsconfig.functions.json header).

/** Base for the exponential envelope: the ceiling of the first backoff. */
export const MONOTONIC_BACKOFF_BASE_MS = 25;

/** Per-attempt ceiling cap. The envelope stops doubling once it hits this. */
export const MONOTONIC_BACKOFF_CAP_MS = 800;

/**
 * Full-jitter exponential backoff delay, in integer milliseconds.
 *
 * Ceiling for the k-th backoff (0-based) is `min(CAP, BASE * 2**k)`:
 *
 * ```
 *   retry k :  0    1    2    3    4    5    6
 *   ceiling :  25   50   100  200  400  800  800   (ms, capped at 800)
 * ```
 *
 * The actual sleep is *full jitter*: a uniform random draw in
 * `[0, ceiling)`. Full jitter (vs. equal/decorrelated) is chosen because
 * the goal is purely to de-synchronise racing webhook handlers — spreading
 * uniformly across the whole window maximises the chance the contending
 * writer commits inside some retry's gap.
 *
 * Pure given an injectable RNG, so the shape is unit-testable without
 * driving the live CAS loop or mocking the DB (A91 fix A, step 6 of brief).
 *
 * @param retry  0-based backoff index. retry 0 is the first delay, taken
 *               *before* the 2nd CAS attempt (the 1st attempt never sleeps).
 * @param random `() => [0, 1)`. Defaults to `Math.random`; injected by tests.
 * @returns      integer ms in `[0, min(CAP, BASE * 2**retry))`.
 */
export function monotonicBackoffDelayMs(
  retry: number,
  random: () => number = Math.random,
): number {
  const safeRetry = Math.max(0, Math.floor(retry));
  const exponential = MONOTONIC_BACKOFF_BASE_MS * 2 ** safeRetry;
  const ceiling = Math.min(MONOTONIC_BACKOFF_CAP_MS, exponential);
  return Math.floor(random() * ceiling);
}

/** Promise-based sleep. `setTimeout` is a global in both Deno and Node. */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, Math.max(0, ms)));
}
