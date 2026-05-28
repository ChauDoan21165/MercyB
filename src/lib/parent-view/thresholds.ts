// src/lib/parent-view/thresholds.ts
//
// L6 — Parent / Family layer. Threshold knobs.
//
// Decision X3=B (STAGE-4-5-decision-queue § Cross-layer X3,
// docs/architecture/L6-parent-teacher-family-layer.md):
//   Two *separate* threshold structures, not one shared number:
//
//     • L4_INTERVENTION_THRESHOLD  — how many times a pattern must fire
//       before the L4 diagnostic planner would *steer practice* toward
//       it. This is the engine-facing sensitivity.
//     • L6_REPORT_TO_PARENT_THRESHOLD — how many times a pattern must
//       fire before it is worth *surfacing to a parent*. This is the
//       human-facing, deliberately-quieter bar: a parent should not be
//       alarmed by a pattern the kid hit twice. L6 > L4 by design — we
//       only tell the parent about something once the planner has been
//       working on it for a while.
//
// Both knobs are STUBS today. The real values are owned by L5 pedagogy
// (the L4 planner + L5 significance test don't exist yet), so they are
// tagged `// L5-PENDING` and carry conservative placeholder values that
// the parent view uses for descriptive filtering only — never for any
// "Mercy helped" attribution claim (that claim is itself L5-PENDING; see
// buildParentSummary.ts). When L4/L5 land, these constants are the single
// place to rewire.
//
// The invariant L6 >= L4 is asserted at module load so a future edit that
// accidentally inverts them fails loudly in dev/test rather than silently
// over-reporting to parents.

/**
 * L5-PENDING — owned by the L4 intervention engine once it lands.
 * Placeholder: the planner would begin steering practice toward a
 * pattern after it fires this many times in the recent window.
 */
export const L4_INTERVENTION_THRESHOLD = 3;

/**
 * L5-PENDING — owned by the L5 pedagogy significance test once it lands.
 * Placeholder: a pattern is only surfaced in the parent view after it
 * fires this many times. Deliberately HIGHER than the L4 knob so parents
 * see steered-on patterns, not raw noise.
 */
export const L6_REPORT_TO_PARENT_THRESHOLD = 5;

// Fail loudly if a future edit inverts the relationship. A parent must
// never be told about a pattern below the engine's own intervention bar.
if (L6_REPORT_TO_PARENT_THRESHOLD < L4_INTERVENTION_THRESHOLD) {
  throw new Error(
    "[parent-view/thresholds] L6_REPORT_TO_PARENT_THRESHOLD must be >= " +
      "L4_INTERVENTION_THRESHOLD (X3=B: the report-to-parent bar is the " +
      "quieter one).",
  );
}
