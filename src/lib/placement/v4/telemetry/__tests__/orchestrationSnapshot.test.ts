import { describe, expect, it } from "vitest";

import {
  applyOrchestrationEvents,
  buildOrchestrationSnapshotFull,
  canonicalJSON,
  compactOrchestrationSnapshot,
  initOrchestratorState,
  isSnapshotHashValid,
  rebuildFullFromCompact,
  reflowSnapshotForReplay,
  runAdaptiveCycle,
  snapshotContentHash,
} from "../index";
import {
  ORCH_USER,
  buildCanonicalEventSequence,
  buildOrchestrationSnapshotForUser,
  shuffleDeterministic,
} from "./orchestrationFixtures";

function buildLiveSnapshot() {
  let state = applyOrchestrationEvents(
    initOrchestratorState(ORCH_USER),
    buildCanonicalEventSequence(),
  );
  const cycleSnap = buildOrchestrationSnapshotForUser({ reviewDebtCount: 8 });
  const { state: next, loopResult } = runAdaptiveCycle({ state, snapshot: cycleSnap });
  state = next;
  return { state, loopResult };
}

describe("orchestrationSnapshot — build + hash", () => {
  it("produces a valid hash that matches snapshotContentHash", () => {
    const { state, loopResult } = buildLiveSnapshot();
    const snap = buildOrchestrationSnapshotFull({ state, loopResult });
    expect(snap.contentHash).toBe(snapshotContentHash(snap));
    expect(isSnapshotHashValid(snap)).toBe(true);
  });

  it("two builds from the same inputs yield identical hash + JSON", () => {
    const { state, loopResult } = buildLiveSnapshot();
    const a = buildOrchestrationSnapshotFull({ state, loopResult });
    const b = buildOrchestrationSnapshotFull({ state, loopResult });
    expect(a.contentHash).toBe(b.contentHash);
    expect(canonicalJSON(a)).toBe(canonicalJSON(b));
  });

  it("is order-insensitive after reflow", () => {
    const events = buildCanonicalEventSequence();
    const live = applyOrchestrationEvents(initOrchestratorState(ORCH_USER), events);
    const shuffled = applyOrchestrationEvents(
      initOrchestratorState(ORCH_USER),
      shuffleDeterministic(events, 7),
    );
    const snapLive = reflowSnapshotForReplay(
      buildOrchestrationSnapshotFull({ state: live }),
    );
    const snapShuffled = reflowSnapshotForReplay(
      buildOrchestrationSnapshotFull({ state: shuffled }),
    );
    expect(snapLive.contentHash).toBe(snapShuffled.contentHash);
  });
});

describe("orchestrationSnapshot — compact + rebuild equivalence", () => {
  it("compact + rebuild yields a snapshot with the same content hash", () => {
    const { state, loopResult } = buildLiveSnapshot();
    const full = buildOrchestrationSnapshotFull({ state, loopResult });
    const compact = compactOrchestrationSnapshot(full);
    const rebuilt = rebuildFullFromCompact({
      compact,
      telemetryEvents: state.telemetryEvents,
      memoryEvents: state.memoryEvents,
    });
    expect(rebuilt.contentHash).toBe(full.contentHash);
  });

  it("rebuild rejects mismatched telemetry event count", () => {
    const { state, loopResult } = buildLiveSnapshot();
    const full = buildOrchestrationSnapshotFull({ state, loopResult });
    const compact = compactOrchestrationSnapshot(full);
    expect(() =>
      rebuildFullFromCompact({
        compact,
        telemetryEvents: state.telemetryEvents.slice(0, -1),
        memoryEvents: state.memoryEvents,
      }),
    ).toThrow();
  });

  it("rebuild rejects mismatched memory event count", () => {
    const { state, loopResult } = buildLiveSnapshot();
    const full = buildOrchestrationSnapshotFull({ state, loopResult });
    const compact = compactOrchestrationSnapshot(full);
    expect(() =>
      rebuildFullFromCompact({
        compact,
        telemetryEvents: state.telemetryEvents,
        memoryEvents: state.memoryEvents.slice(0, -1),
      }),
    ).toThrow();
  });
});

describe("orchestrationSnapshot — corruption detection", () => {
  it("isSnapshotHashValid returns false when content is tampered with", () => {
    const { state, loopResult } = buildLiveSnapshot();
    const snap = buildOrchestrationSnapshotFull({ state, loopResult });
    const tampered = {
      ...snap,
      state: { ...snap.state, userIdHash: "tampered-id" },
    } as typeof snap;
    expect(isSnapshotHashValid(tampered)).toBe(false);
  });
});
