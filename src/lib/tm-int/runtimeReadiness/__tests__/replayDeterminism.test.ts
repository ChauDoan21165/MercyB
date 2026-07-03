import { describe, expect, it } from "vitest";

import { createReplayPair, createValidRuntimeEvidenceBundle } from "../fixtureBuilder";
import { checkReplayDeterminism, type ReplayDeterminismStage } from "../replayDeterminism";

describe("checkReplayDeterminism", () => {
  it("passes identical replay bundles", () => {
    const result = checkReplayDeterminism(createValidRuntimeEvidenceBundle(), createValidRuntimeEvidenceBundle());

    expect(result).toEqual({ pass: true, deterministic: true, mismatchStages: [], reasons: [] });
  });

  it.each([
    "teacherContext",
    "dpDecision",
    "pedDecision",
    "runtimeDecision",
  ] satisfies ReplayDeterminismStage[])("fails mismatch at %s", (mismatchStage) => {
    const pair = createReplayPair({ mismatchStage });
    const result = checkReplayDeterminism(pair.first, pair.second);

    expect(result.pass).toBe(false);
    expect(result.mismatchStages).toEqual([mismatchStage]);
    expect(result.reasons).toContain(`${mismatchStage} mismatch between replay bundles.`);
  });
});
