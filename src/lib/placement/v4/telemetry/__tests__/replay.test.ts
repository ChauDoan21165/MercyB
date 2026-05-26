import { describe, expect, it } from "vitest";

import {
  buildReplaySnapshot,
  canonicalJSON,
  cohortKey,
  replayFingerprint,
} from "../index";
import type { CohortAssignment } from "../index";
import { scenarioCommon, tDay } from "./fixtures";

function shuffle<T>(arr: readonly T[], seed: number): T[] {
  const out = [...arr];
  let s = seed >>> 0;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1_664_525 + 1_013_904_223) >>> 0;
    const j = s % (i + 1);
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}

const HORIZON = tDay(10);

const ASSIGNMENTS: CohortAssignment[] = [
  {
    userIdHash: "uhash_user_one_aaaaaaaaaaaaaaaa",
    cohort: {
      key: cohortKey({
        cefrBand: "A2",
        nativeLang: "vi",
        targetLang: "en",
        ageBucket: "adult",
      }),
      cefrBand: "A2",
      nativeLang: "vi",
      targetLang: "en",
      ageBucket: "adult",
    },
  },
  {
    userIdHash: "uhash_user_two_bbbbbbbbbbbbbbbb",
    cohort: {
      key: cohortKey({
        cefrBand: "A2",
        nativeLang: "vi",
        targetLang: "en",
        ageBucket: "adult",
      }),
      cefrBand: "A2",
      nativeLang: "vi",
      targetLang: "en",
      ageBucket: "adult",
    },
  },
  {
    userIdHash: "uhash_user_three_ccccccccccccccc",
    cohort: {
      key: cohortKey({
        cefrBand: "B1",
        nativeLang: "vi",
        targetLang: "en",
        ageBucket: "adult",
      }),
      cefrBand: "B1",
      nativeLang: "vi",
      targetLang: "en",
      ageBucket: "adult",
    },
  },
];

describe("replay — snapshot reconstruction", () => {
  it("produces identical canonical JSON for any input permutation", () => {
    const events = scenarioCommon();
    const baseline = buildReplaySnapshot(events, {
      horizonMs: HORIZON,
      cohortAssignments: ASSIGNMENTS,
      kAnonThreshold: 1,
    });
    const baselineJson = canonicalJSON(baseline);

    for (let seed = 1; seed <= 12; seed++) {
      const permuted = shuffle(events, seed * 2_654_435_761);
      const snap = buildReplaySnapshot(permuted, {
        horizonMs: HORIZON,
        cohortAssignments: ASSIGNMENTS,
        kAnonThreshold: 1,
      });
      expect(canonicalJSON(snap)).toBe(baselineJson);
    }
  });

  it("fingerprint is identical across reordered inputs", () => {
    const events = scenarioCommon();
    const a = buildReplaySnapshot(events, { horizonMs: HORIZON });
    const b = buildReplaySnapshot([...events].reverse(), {
      horizonMs: HORIZON,
    });
    expect(replayFingerprint(a)).toBe(replayFingerprint(b));
  });

  it("snapshot includes effectiveness, retention, clusters, and cohort drift", () => {
    const events = scenarioCommon();
    const snap = buildReplaySnapshot(events, {
      horizonMs: HORIZON,
      cohortAssignments: ASSIGNMENTS,
      kAnonThreshold: 1,
    });
    expect(snap.schemaVersion).toBe(1);
    expect(snap.effectiveness.length).toBe(snap.aggregation.lessonCount);
    expect(snap.retention.length).toBe(snap.aggregation.userCount);
    expect(snap.cohortDrift).toBeDefined();
    expect(Array.isArray(snap.clusters)).toBe(true);
  });

  it("snapshot drops cohortDrift when no assignments are provided", () => {
    const snap = buildReplaySnapshot(scenarioCommon(), {
      horizonMs: HORIZON,
    });
    expect(snap.cohortDrift).toBeUndefined();
  });

  it("canonicalJSON sorts object keys at every depth", () => {
    const value = { b: { d: 1, c: 2 }, a: [3, 1, 2] };
    expect(canonicalJSON(value)).toBe('{"a":[3,1,2],"b":{"c":2,"d":1}}');
  });

  it("canonicalJSON preserves array order (sorting belongs to aggregation)", () => {
    const value = { items: ["b", "a", "c"] };
    expect(canonicalJSON(value)).toBe('{"items":["b","a","c"]}');
  });

  it("fingerprint embeds horizon (so different horizons produce different fingerprints)", () => {
    const events = scenarioCommon();
    const a = buildReplaySnapshot(events, { horizonMs: HORIZON });
    const b = buildReplaySnapshot(events, {
      horizonMs: HORIZON + 1_000 * 60 * 60 * 24 * 30,
    });
    expect(replayFingerprint(a)).not.toBe(replayFingerprint(b));
  });
});
