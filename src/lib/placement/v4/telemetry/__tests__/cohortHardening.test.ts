import { describe, expect, it } from "vitest";

import {
  applyOrchestrationEvents,
  buildOrchestrationSnapshotFull,
  burnoutByCefrBand,
  canonicalJSON,
  comparePlanVersions,
  initOrchestratorState,
  redactForRelease,
} from "../index";
import type {
  CefrBandAssignment,
  PlanVersionAssignment,
} from "../index";
import {
  ORCH_USER,
  buildCanonicalEventSequence,
} from "./orchestrationFixtures";
import { noSignals } from "./adapterFixtures";

describe("cohortHardening — k-anonymity is enforced", () => {
  it("comparePlanVersions drops cohorts below threshold", () => {
    const state = applyOrchestrationEvents(
      initOrchestratorState(ORCH_USER),
      buildCanonicalEventSequence(),
    );
    const snap = buildOrchestrationSnapshotFull({ state });
    const assignments: PlanVersionAssignment[] = [
      { userIdHash: ORCH_USER, planVersion: "v.test" },
    ];
    const report = comparePlanVersions(snap.aggregation, assignments, {
      kAnonThreshold: 5,
    });
    expect(report.rows).toHaveLength(0);
  });

  it("burnoutByCefrBand drops cohorts below threshold", () => {
    const assignments: CefrBandAssignment[] = [
      { userIdHash: "u1", cefrBand: "A2", signals: noSignals() },
    ];
    const rows = burnoutByCefrBand(assignments, { kAnonThreshold: 5 });
    expect(rows).toHaveLength(0);
  });
});

describe("cohortHardening — PII-free outputs", () => {
  it("redactForRelease removes userIdHashes from lesson aggregates", () => {
    const state = applyOrchestrationEvents(
      initOrchestratorState(ORCH_USER),
      buildCanonicalEventSequence(),
    );
    const snap = buildOrchestrationSnapshotFull({ state });
    const released = redactForRelease(snap.aggregation, { kAnonThreshold: 1 });
    for (const l of released.lessons) {
      expect(l.userIdHashes).toEqual([]);
    }
  });

  it("released aggregate carries no raw userIdHashes when user rows are dropped", () => {
    const state = applyOrchestrationEvents(
      initOrchestratorState(ORCH_USER),
      buildCanonicalEventSequence(),
    );
    const snap = buildOrchestrationSnapshotFull({ state });
    const released = redactForRelease(snap.aggregation);
    const serialized = canonicalJSON(released);
    expect(serialized).not.toContain(ORCH_USER);
  });

  it("released user-row variant strips activeDays + cefrTransitions fingerprints", () => {
    const state = applyOrchestrationEvents(
      initOrchestratorState(ORCH_USER),
      buildCanonicalEventSequence(),
    );
    const snap = buildOrchestrationSnapshotFull({ state });
    const released = redactForRelease(snap.aggregation, {
      kAnonThreshold: 1,
      includeUserRows: true,
    });
    for (const u of released.users) {
      expect(u.activeDays).toEqual([]);
      expect(u.cefrTransitions).toEqual([]);
    }
  });
});

describe("cohortHardening — replay-safe cohort hashes", () => {
  it("comparePlanVersions output is identical regardless of assignment order", () => {
    const state = applyOrchestrationEvents(
      initOrchestratorState(ORCH_USER),
      buildCanonicalEventSequence(),
    );
    const snap = buildOrchestrationSnapshotFull({ state });
    const assignments: PlanVersionAssignment[] = [
      { userIdHash: ORCH_USER, planVersion: "v.test" },
    ];
    const a = comparePlanVersions(snap.aggregation, assignments, {
      kAnonThreshold: 1,
    });
    const b = comparePlanVersions(snap.aggregation, [...assignments].reverse(), {
      kAnonThreshold: 1,
    });
    expect(canonicalJSON(a)).toBe(canonicalJSON(b));
  });
});
