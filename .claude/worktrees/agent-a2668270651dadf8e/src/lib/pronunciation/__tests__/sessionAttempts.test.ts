// Pure-function tests for session attempt history.
//
// The blob field is `Blob | null` — we pass null in tests so we don't
// need a polyfill. Audio playback is the component's job; this layer
// is only about derivations.

import { describe, expect, it } from "vitest";

import {
  ATTEMPT_HISTORY_CAP,
  appendAttempt,
  computePhonemeDeltas,
  computeTrend,
  getBestAttempt,
  hasPhonemeData,
  type AttemptRecord,
} from "../sessionAttempts";
import type { PhonemeScore } from "../scorer";

function attempt(
  partial: Partial<Omit<AttemptRecord, "attemptNumber">> = {},
): Omit<AttemptRecord, "attemptNumber"> {
  return {
    timestamp: partial.timestamp ?? Date.now(),
    overallScore: partial.overallScore ?? 70,
    phonemes: partial.phonemes ?? [],
    audioBlob: partial.audioBlob ?? null,
    transcript: partial.transcript ?? "",
  };
}

function ph(phoneme: string, score: number): PhonemeScore {
  return { phoneme, score };
}

describe("appendAttempt", () => {
  it("assigns sequential attempt numbers starting at 1", () => {
    let h: AttemptRecord[] = [];
    h = appendAttempt(h, attempt());
    h = appendAttempt(h, attempt());
    h = appendAttempt(h, attempt());
    expect(h.map((a) => a.attemptNumber)).toEqual([1, 2, 3]);
  });

  it("returns a new array (immutable update — React state needs this)", () => {
    const h: AttemptRecord[] = [];
    const next = appendAttempt(h, attempt());
    expect(next).not.toBe(h);
    expect(h).toHaveLength(0);
  });

  it("evicts oldest when over cap, but preserves monotonic attemptNumber", () => {
    let h: AttemptRecord[] = [];
    for (let i = 0; i < ATTEMPT_HISTORY_CAP + 2; i++) {
      h = appendAttempt(h, attempt());
    }
    expect(h).toHaveLength(ATTEMPT_HISTORY_CAP);
    // Numbers continue counting up — attempt 1 + 2 evicted, 3..7 remain.
    expect(h.map((a) => a.attemptNumber)).toEqual([3, 4, 5, 6, 7]);
  });

  it("respects the explicit cap argument", () => {
    let h: AttemptRecord[] = [];
    for (let i = 0; i < 4; i++) {
      h = appendAttempt(h, attempt(), 2);
    }
    expect(h).toHaveLength(2);
    expect(h.map((a) => a.attemptNumber)).toEqual([3, 4]);
  });
});

describe("getBestAttempt", () => {
  it("returns null on empty", () => {
    expect(getBestAttempt([])).toBeNull();
  });

  it("returns the highest-scoring attempt", () => {
    let h: AttemptRecord[] = [];
    h = appendAttempt(h, attempt({ overallScore: 50, timestamp: 1 }));
    h = appendAttempt(h, attempt({ overallScore: 90, timestamp: 2 }));
    h = appendAttempt(h, attempt({ overallScore: 70, timestamp: 3 }));
    expect(getBestAttempt(h)?.attemptNumber).toBe(2);
  });

  it("breaks ties by most-recent timestamp (later wins)", () => {
    let h: AttemptRecord[] = [];
    h = appendAttempt(h, attempt({ overallScore: 80, timestamp: 1 }));
    h = appendAttempt(h, attempt({ overallScore: 80, timestamp: 5 }));
    h = appendAttempt(h, attempt({ overallScore: 80, timestamp: 3 }));
    expect(getBestAttempt(h)?.timestamp).toBe(5);
  });
});

describe("computeTrend", () => {
  it("returns 'flat' on < 2 attempts", () => {
    expect(computeTrend([])).toBe("flat");
    let h: AttemptRecord[] = [];
    h = appendAttempt(h, attempt());
    expect(computeTrend(h)).toBe("flat");
  });

  it("returns 'up' when latest > prev by more than threshold", () => {
    let h: AttemptRecord[] = [];
    h = appendAttempt(h, attempt({ overallScore: 60 }));
    h = appendAttempt(h, attempt({ overallScore: 75 }));
    expect(computeTrend(h)).toBe("up");
  });

  it("returns 'down' when latest < prev by more than threshold", () => {
    let h: AttemptRecord[] = [];
    h = appendAttempt(h, attempt({ overallScore: 80 }));
    h = appendAttempt(h, attempt({ overallScore: 65 }));
    expect(computeTrend(h)).toBe("down");
  });

  it("returns 'flat' when within ±3 (suppresses sub-threshold drift)", () => {
    let h: AttemptRecord[] = [];
    h = appendAttempt(h, attempt({ overallScore: 80 }));
    h = appendAttempt(h, attempt({ overallScore: 82 }));
    expect(computeTrend(h)).toBe("flat");
    h = [];
    h = appendAttempt(h, attempt({ overallScore: 80 }));
    h = appendAttempt(h, attempt({ overallScore: 78 }));
    expect(computeTrend(h)).toBe("flat");
  });
});

describe("computePhonemeDeltas", () => {
  it("returns empty when history < 2", () => {
    let h: AttemptRecord[] = [];
    h = appendAttempt(h, attempt({ phonemes: [ph("th", 80)] }));
    expect(computePhonemeDeltas(h)).toEqual({ improved: [], regressed: [] });
  });

  it("returns empty when either attempt has no phonemes (local fallback)", () => {
    let h: AttemptRecord[] = [];
    h = appendAttempt(h, attempt({ phonemes: [ph("th", 80)] }));
    h = appendAttempt(h, attempt({ phonemes: [] }));
    expect(computePhonemeDeltas(h)).toEqual({ improved: [], regressed: [] });
  });

  it("computes improved phonemes (>= +5 delta), sorted desc, top 3", () => {
    let h: AttemptRecord[] = [];
    h = appendAttempt(h, attempt({
      phonemes: [ph("th", 60), ph("r", 50), ph("l", 70), ph("s", 90), ph("ng", 30)],
    }));
    h = appendAttempt(h, attempt({
      phonemes: [ph("th", 90), ph("r", 80), ph("l", 78), ph("s", 92), ph("ng", 60)],
    }));
    const { improved } = computePhonemeDeltas(h);
    // Improvements: th +30, r +30, ng +30, l +8, s +2
    // Top 3 by delta — three tied at +30, take any three (sort is stable
    // on equal keys but we don't assert which three). Just check shape.
    expect(improved).toHaveLength(3);
    for (const d of improved) {
      expect(d.delta).toBeGreaterThanOrEqual(5);
    }
    // s only changed by +2 — must NOT appear (below the +5 floor).
    expect(improved.find((d) => d.phoneme === "s")).toBeUndefined();
    // l only changed by +8 — appears under our threshold but might be
    // squeezed out by three tied +30s; OK either way.
  });

  it("computes regressed phonemes (<= -10 delta), sorted asc, top 3", () => {
    let h: AttemptRecord[] = [];
    h = appendAttempt(h, attempt({
      phonemes: [ph("th", 90), ph("r", 80), ph("l", 70), ph("s", 60)],
    }));
    h = appendAttempt(h, attempt({
      phonemes: [ph("th", 70), ph("r", 50), ph("l", 65), ph("s", 30)],
    }));
    const { regressed } = computePhonemeDeltas(h);
    // Regressions: th -20, r -30, l -5 (above floor), s -30
    // Below -10: th, r, s — top 3 most negative
    expect(regressed.map((d) => d.phoneme).sort()).toEqual(["r", "s", "th"]);
    // Sorted ascending = most-negative first.
    expect(regressed[0].delta).toBeLessThanOrEqual(regressed[1].delta);
  });

  it("aggregates by phoneme symbol — multi-instance averaged", () => {
    // /θ/ appears twice in each attempt with different scores.
    let h: AttemptRecord[] = [];
    h = appendAttempt(h, attempt({
      phonemes: [ph("th", 60), ph("th", 80)], // mean 70
    }));
    h = appendAttempt(h, attempt({
      phonemes: [ph("th", 90), ph("th", 100)], // mean 95
    }));
    const { improved } = computePhonemeDeltas(h);
    expect(improved).toHaveLength(1);
    expect(improved[0]).toMatchObject({
      phoneme: "th",
      previousScore: 70,
      latestScore: 95,
      delta: 25,
    });
  });

  it("ignores phonemes that exist in only one attempt", () => {
    let h: AttemptRecord[] = [];
    h = appendAttempt(h, attempt({ phonemes: [ph("th", 60)] }));
    h = appendAttempt(h, attempt({ phonemes: [ph("th", 90), ph("dh", 80)] }));
    const { improved } = computePhonemeDeltas(h);
    expect(improved.find((d) => d.phoneme === "dh")).toBeUndefined();
    expect(improved[0].phoneme).toBe("th");
  });

  it("normalizes phoneme symbols case-insensitively", () => {
    let h: AttemptRecord[] = [];
    h = appendAttempt(h, attempt({ phonemes: [ph("TH", 60)] }));
    h = appendAttempt(h, attempt({ phonemes: [ph("th", 90)] }));
    const { improved } = computePhonemeDeltas(h);
    expect(improved).toHaveLength(1);
    expect(improved[0].phoneme).toBe("th");
  });
});

describe("hasPhonemeData", () => {
  it("returns false when no attempt has phonemes", () => {
    let h: AttemptRecord[] = [];
    h = appendAttempt(h, attempt({ phonemes: [] }));
    h = appendAttempt(h, attempt({ phonemes: [] }));
    expect(hasPhonemeData(h)).toBe(false);
  });

  it("returns true when any attempt has phonemes", () => {
    let h: AttemptRecord[] = [];
    h = appendAttempt(h, attempt({ phonemes: [] }));
    h = appendAttempt(h, attempt({ phonemes: [ph("th", 80)] }));
    expect(hasPhonemeData(h)).toBe(true);
  });
});
