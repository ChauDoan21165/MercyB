/**
 * Stage 4 (L4) — rule table tests.
 *
 * Covers the single past-tense-marker rule (Q8=A): its signal-pair
 * condition, the live-vs-stale precedence (Q6=A), the windowing helper,
 * and the structured-output contract (Q5=B — emits TriggerReason, never
 * a user-facing string).
 */

import { describe, expect, it } from "vitest";

import {
  countInWindow,
  PAST_TENSE_INTERVENTION_MIN_COUNT,
  PAST_TENSE_L1_TAG,
  PAST_TENSE_PLACEMENT_TAG,
  PAST_TENSE_WINDOW_MS,
  STAGE_4_RULES,
} from "../rules";
import type { Stage4Signals } from "../types";

const NOW = 1_700_000_000_000;

function l1Hits(count: number, tag = PAST_TENSE_L1_TAG, now = NOW) {
  // Spread the hits across the last day so they all fall in-window.
  return Array.from({ length: count }, (_, i) => ({
    tag,
    ts: now - i * 60_000,
  }));
}

function signals(overrides: Partial<Stage4Signals> = {}): Stage4Signals {
  return {
    l1Recent: [],
    placementWeaknesses: [],
    now: NOW,
    ...overrides,
  };
}

const pastTenseRule = STAGE_4_RULES.find((r) => r.id === "vn-past-tense-marker");

describe("countInWindow", () => {
  it("counts only matching tags inside the window", () => {
    const entries = [
      { tag: PAST_TENSE_L1_TAG, ts: NOW - 1000 },
      { tag: PAST_TENSE_L1_TAG, ts: NOW - PAST_TENSE_WINDOW_MS - 1 }, // too old
      { tag: "vi_l1_3rd_person_s", ts: NOW }, // wrong tag
      { tag: PAST_TENSE_L1_TAG, ts: NOW },
    ];
    expect(
      countInWindow(entries, PAST_TENSE_L1_TAG, NOW, PAST_TENSE_WINDOW_MS),
    ).toBe(2);
  });

  it("excludes entries dated after `now` only when far in the future is impossible", () => {
    // Inclusive of `now`; an exactly-now entry counts.
    const entries = [{ tag: PAST_TENSE_L1_TAG, ts: NOW }];
    expect(
      countInWindow(entries, PAST_TENSE_L1_TAG, NOW, PAST_TENSE_WINDOW_MS),
    ).toBe(1);
  });
});

describe("vn-past-tense-marker rule (Q8=A)", () => {
  it("is the only rule in the table (scope = one rule)", () => {
    expect(STAGE_4_RULES).toHaveLength(1);
    expect(pastTenseRule).toBeDefined();
  });

  it("fires when placement flags past tense AND live L1 clears the threshold", () => {
    const match = pastTenseRule!.evaluate(
      signals({
        placementWeaknesses: [PAST_TENSE_PLACEMENT_TAG],
        l1Recent: l1Hits(PAST_TENSE_INTERVENTION_MIN_COUNT),
      }),
    );
    expect(match).not.toBeNull();
    // Q5=B — emits a STRUCTURED reason, not a string.
    expect(match!.triggerReason).toEqual({
      kind: "repeated_l1_pattern",
      tag: PAST_TENSE_L1_TAG,
      count: PAST_TENSE_INTERVENTION_MIN_COUNT,
    });
    expect(match!.targetAction).toEqual({
      kind: "review_l1_pattern",
      tag: PAST_TENSE_L1_TAG,
    });
  });

  it("does NOT fire on stale placement alone — live signal wins (Q6=A)", () => {
    // Placement still flags the weakness, but the live stream shows the
    // learner is producing past tense reliably now (no recent hits).
    const match = pastTenseRule!.evaluate(
      signals({ placementWeaknesses: [PAST_TENSE_PLACEMENT_TAG], l1Recent: [] }),
    );
    expect(match).toBeNull();
  });

  it("does NOT fire on live L1 alone without placement corroboration", () => {
    const match = pastTenseRule!.evaluate(
      signals({ l1Recent: l1Hits(PAST_TENSE_INTERVENTION_MIN_COUNT + 2) }),
    );
    expect(match).toBeNull();
  });

  it("does NOT fire when live count is below the intervention threshold", () => {
    const match = pastTenseRule!.evaluate(
      signals({
        placementWeaknesses: [PAST_TENSE_PLACEMENT_TAG],
        l1Recent: l1Hits(PAST_TENSE_INTERVENTION_MIN_COUNT - 1),
      }),
    );
    expect(match).toBeNull();
  });

  it("ignores out-of-window hits when counting live evidence", () => {
    const inWindow = l1Hits(PAST_TENSE_INTERVENTION_MIN_COUNT - 1);
    const tooOld = [
      { tag: PAST_TENSE_L1_TAG, ts: NOW - PAST_TENSE_WINDOW_MS - 5_000 },
    ];
    const match = pastTenseRule!.evaluate(
      signals({
        placementWeaknesses: [PAST_TENSE_PLACEMENT_TAG],
        l1Recent: [...inWindow, ...tooOld],
      }),
    );
    // Only the in-window hits count → below threshold → no fire.
    expect(match).toBeNull();
  });

  it("carries the LIVE count in the structured reason, not the placement flag", () => {
    const liveCount = PAST_TENSE_INTERVENTION_MIN_COUNT + 4;
    const match = pastTenseRule!.evaluate(
      signals({
        placementWeaknesses: [PAST_TENSE_PLACEMENT_TAG, "th_stopping_and_fronting"],
        l1Recent: l1Hits(liveCount),
      }),
    );
    expect(match!.triggerReason).toMatchObject({ count: liveCount });
  });
});
