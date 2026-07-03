import type { RuntimeEvidenceBundle } from "./evidenceBundle";

export type ReplayDeterminismStage =
  | "runtimeEvent"
  | "obsPacket"
  | "learningSignals"
  | "teacherContext"
  | "dpDecision"
  | "pedDecision"
  | "runtimeDecision"
  | "replay";

export type ReplayDeterminismResult = {
  pass: boolean;
  deterministic: boolean;
  mismatchStages: ReplayDeterminismStage[];
  reasons: string[];
};

const STAGES: readonly ReplayDeterminismStage[] = [
  "runtimeEvent",
  "obsPacket",
  "learningSignals",
  "teacherContext",
  "dpDecision",
  "pedDecision",
  "runtimeDecision",
  "replay",
];

function stableJson(value: unknown): string {
  return JSON.stringify(value);
}

export function checkReplayDeterminism(
  first: RuntimeEvidenceBundle,
  second: RuntimeEvidenceBundle,
): ReplayDeterminismResult {
  const mismatchStages = STAGES.filter((stage) => stableJson(first[stage]) !== stableJson(second[stage]));
  const reasons = mismatchStages.map((stage) => `${stage} mismatch between replay bundles.`);
  const deterministic = mismatchStages.length === 0 && first.replay.deterministic === true && second.replay.deterministic === true;

  if (first.replay.deterministic !== true) reasons.push("first replay evidence is not deterministic.");
  if (second.replay.deterministic !== true) reasons.push("second replay evidence is not deterministic.");

  return {
    pass: deterministic && reasons.length === 0,
    deterministic,
    mismatchStages,
    reasons,
  };
}
