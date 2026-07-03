import { buildLearningBehaviorDpPacket } from "../dp/learningBehaviorFamily";
import { runLearningSignalEngine, type LearningSignalEngineOutput } from "../learning-signals";
import { buildLearningBehaviorLmPacket } from "../lm/learningBehaviorFamily";
import type { ObservationPacket } from "../obs/types";
import { buildLearningBehaviorPedPacket } from "../ped/learningBehaviorFamily";

const REPLAY_TIME = "2026-07-03T00:00:00.000Z";

export type LearningBehaviorFamilyReplayOutput = {
  observation: ObservationPacket;
  signals: LearningSignalEngineOutput;
  dp: ReturnType<typeof buildLearningBehaviorDpPacket>;
  ped: ReturnType<typeof buildLearningBehaviorPedPacket>;
  lm: ReturnType<typeof buildLearningBehaviorLmPacket>;
};

export type LearningBehaviorFamilyJudgeResult = {
  familyId: "LEARNING-BEHAVIOR-FAMILY-v1";
  judgeHookId: "JUDGE-LBF-V1-REPLAY";
  deterministic: boolean;
  pass: boolean;
  failures: string[];
  first: LearningBehaviorFamilyReplayOutput;
  second: LearningBehaviorFamilyReplayOutput;
};

function stableJson(value: unknown): string {
  return JSON.stringify(value);
}

export function runLearningBehaviorFamilyPipeline(observation: ObservationPacket): LearningBehaviorFamilyReplayOutput {
  const signals = runLearningSignalEngine(observation);
  const dp = buildLearningBehaviorDpPacket(signals, REPLAY_TIME);
  const ped = buildLearningBehaviorPedPacket(dp, REPLAY_TIME);
  const lm = buildLearningBehaviorLmPacket(ped, REPLAY_TIME);
  return { observation, signals, dp, ped, lm };
}

export function judgeReplayLearningBehaviorFamily(observation: ObservationPacket): LearningBehaviorFamilyJudgeResult {
  const first = runLearningBehaviorFamilyPipeline(observation);
  const second = runLearningBehaviorFamilyPipeline(observation);
  const deterministic = stableJson(first) === stableJson(second);
  const failures: string[] = [];

  if (!deterministic) failures.push("Learning Behavior Family replay output changed between runs.");

  for (const signal of first.signals.signals) {
    if (signal.evidence.length === 0) failures.push(`${signal.signal_key} emitted without evidence.`);
    if (signal.alternatives.length === 0) failures.push(`${signal.signal_key} emitted without alternatives.`);
    if (!signal.no_psychology || !signal.no_learner_ability_conclusion) {
      failures.push(`${signal.signal_key} omitted safety flags.`);
    }
  }

  for (const interpretation of first.dp.interpretations) {
    if (interpretation.interpretation !== "learning_behavior_signal_observed") {
      failures.push(`${interpretation.signal_key} DP used an unsupported interpretation.`);
    }
    if (!interpretation.no_learner_weakness_inference || !interpretation.no_mastery_reduction_from_single_event) {
      failures.push(`${interpretation.signal_key} DP omitted inference safeguards.`);
    }
  }

  for (const action of first.ped.actions) {
    if (!action.preserve_alternatives || !action.explainable || !action.do_not_lower_placement_from_single_event) {
      failures.push(`${action.signal_key} PED omitted safe teacher action constraints.`);
    }
  }

  for (const memory of first.lm.memories) {
    if (memory.mastery_reduced !== false) failures.push(`${memory.signal_key} LM reduced mastery.`);
  }

  const serialized = stableJson(first);
  if (/lazy|careless|low ability|bad learner|poor learner|weakness inferred|mastery_reduced\":true/i.test(serialized)) {
    failures.push("Learning Behavior Family inferred unsafe learner weakness.");
  }
  if (/\"verified\":true/i.test(serialized)) {
    failures.push("Learning Behavior Family claimed verified=true.");
  }

  return {
    familyId: "LEARNING-BEHAVIOR-FAMILY-v1",
    judgeHookId: "JUDGE-LBF-V1-REPLAY",
    deterministic,
    pass: deterministic && failures.length === 0,
    failures,
    first,
    second,
  };
}
