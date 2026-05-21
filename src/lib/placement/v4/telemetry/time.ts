// Placement v4 telemetry — time helpers.
//
// Self-contained, deterministic, timezone-independent. Day ordinals are
// computed in UTC so that "active days" are reproducible regardless of where
// the analysis runs.

export const UTC_MS_PER_DAY = 86_400_000 as const;

/**
 * Return the UTC day ordinal (days since Unix epoch) for a given timestamp.
 *
 * Stable under permutation: same input always returns the same integer.
 */
export function utcDayOrdinal(timestampMs: number): number {
  return Math.floor(timestampMs / UTC_MS_PER_DAY);
}

/**
 * Inclusive day-span between two UTC day ordinals (a, b).
 * If b === a, returns 1 (a single active day).
 */
export function inclusiveDaySpan(a: number, b: number): number {
  if (b < a) return inclusiveDaySpan(b, a);
  return b - a + 1;
}

/**
 * Longest run of contiguous day ordinals in a sorted, deduplicated set.
 */
export function longestContiguousRun(sortedDays: readonly number[]): number {
  if (sortedDays.length === 0) return 0;
  let best = 1;
  let current = 1;
  for (let i = 1; i < sortedDays.length; i++) {
    if (sortedDays[i] === sortedDays[i - 1] + 1) {
      current += 1;
      if (current > best) best = current;
    } else {
      current = 1;
    }
  }
  return best;
}
