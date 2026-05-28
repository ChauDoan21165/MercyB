/**
 * Stage 4 (L4) — pure evaluator tests.
 *
 * Drives `evaluateStage4(signals, gate)` with the gate passed in
 * explicitly so these tests never touch localStorage. Covers the gate
 * short-circuits (disabled, dismissed Q4=A), the single-pick contract
 * (Q7=A), and the deterministic id / TTL stamping.
 */

import { describe, expect, it } from "vitest";

import { evaluateStage4 } from "../evaluate";
import {
  PAST_TENSE_INTERVENTION_MIN_COUNT,
  PAST_TENSE_L1_TAG,
  PAST_TENSE_PLACEMENT_TAG,
  PAST_TENSE_SUGGESTION_TTL_MS,
} from "../rules";
import type { Stage4Gate, Stage4Signals } from "../types";

const NOW = 1_700_000_000_000;
const SUGGESTION_ID = `stage4:${PAST_TENSE_L1_TAG}`;

function firingSignals(): Stage4Signals {
  return {
    placementWeaknesses: [PAST_TENSE_PLACEMENT_TAG],
    l1Recent: Array.from(
      { length: PAST_TENSE_INTERVENTION_MIN_COUNT },
      (_, i) => ({ tag: PAST_TENSE_L1_TAG, ts: NOW - i * 60_000 }),
    ),
    now: NOW,
  };
}

const OPEN_GATE: Stage4Gate = { disabled: false, dismissedIds: new Set() };

describe("evaluateStage4", () => {
  it("emits a deterministic suggestion when a rule fires", () => {
    const out = evaluateStage4(firingSignals(), OPEN_GATE);
    expect(out).not.toBeNull();
    expect(out!.id).toBe(SUGGESTION_ID);
    expect(out!.ruleId).toBe("vn-past-tense-marker");
    expect(out!.ttlMs).toBe(PAST_TENSE_SUGGESTION_TTL_MS);
    expect(out!.generatedAt).toBe(NOW);
  });

  it("is deterministic — identical inputs produce identical output", () => {
    const a = evaluateStage4(firingSignals(), OPEN_GATE);
    const b = evaluateStage4(firingSignals(), OPEN_GATE);
    expect(a).toEqual(b);
  });

  it("returns null when suggestions are globally disabled", () => {
    const out = evaluateStage4(firingSignals(), {
      disabled: true,
      dismissedIds: new Set(),
    });
    expect(out).toBeNull();
  });

  it("never re-emits a dismissed id — dismiss is permanent (Q4=A)", () => {
    const out = evaluateStage4(firingSignals(), {
      disabled: false,
      dismissedIds: new Set([SUGGESTION_ID]),
    });
    expect(out).toBeNull();
  });

  it("returns null when no rule matches", () => {
    const out = evaluateStage4(
      { placementWeaknesses: [], l1Recent: [], now: NOW },
      OPEN_GATE,
    );
    expect(out).toBeNull();
  });

  it("returns at most one suggestion (single-pick, Q7=A)", () => {
    // The evaluator returns a single object, never an array — the type
    // enforces ≤1, and a fired result is exactly one suggestion.
    const out = evaluateStage4(firingSignals(), OPEN_GATE);
    expect(Array.isArray(out)).toBe(false);
    expect(out).not.toBeNull();
  });
});
