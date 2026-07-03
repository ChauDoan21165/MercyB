import { buildAudioDecisionEvidence } from "../dp/audio";
import { buildSpeechDecisionEvidence } from "../dp/speech";
import { buildListeningAttemptMemory } from "../lm/audio";
import { buildSpeakingAttemptMemory } from "../lm/speech";
import { buildAudioPedDecision } from "../ped/audio";
import { buildSpeechPedDecision } from "../ped/speech";
import type { ObservationPacket } from "../obs/types";
import type {
  JudgeReplayResult,
  SpeechJudgeReplayResult,
  SpeechTeachingCasePipelineOutput,
  TeachingCasePipelineOutput,
} from "./types";

const REPLAY_TIME = "2026-07-03T00:00:00.000Z";

export function runTeachingCaseAudioPipeline(observation: ObservationPacket): TeachingCasePipelineOutput {
  const dp = buildAudioDecisionEvidence(observation, REPLAY_TIME);
  const ped = buildAudioPedDecision(dp, REPLAY_TIME);
  const lm = buildListeningAttemptMemory(ped, REPLAY_TIME);
  return { observation, dp, ped, lm };
}

function stableJson(value: unknown): string {
  return JSON.stringify(value);
}

export function judgeReplayTeachingCase000001(observation: ObservationPacket): JudgeReplayResult {
  const first = runTeachingCaseAudioPipeline(observation);
  const second = runTeachingCaseAudioPipeline(observation);
  const deterministic = stableJson(first) === stableJson(second);
  const failures: string[] = [];

  if (!deterministic) failures.push("Replay output changed between runs.");

  const hasProductFailure = observation.facts.some((fact) =>
    fact.factType === "AudioUnavailable" ||
    fact.factType === "AudioDurationZero" ||
    fact.factType === "AudioPlaybackFailed"
  );

  if (hasProductFailure) {
    if (first.dp.evidence[0]?.reason !== "product_failure_audio") failures.push("DP did not record product_failure_audio.");
    if (first.dp.evidence[0]?.confidence !== 0.99) failures.push("DP confidence is not 0.99.");
    if (first.dp.evidence[0]?.placement_validity !== "invalid_listening") failures.push("DP did not mark invalid_listening.");
    if (first.dp.evidence[0]?.teacher_action !== "retest_required") failures.push("DP did not require retest.");
    if (!first.ped.decisions[0]?.exclude_listening_score) failures.push("PED did not exclude listening score.");
    if (!first.ped.decisions[0]?.offer_retest) failures.push("PED did not offer retest.");
    if (!first.ped.decisions[0]?.continue_remaining_sections) failures.push("PED did not continue remaining sections.");
    if (!first.ped.decisions[0]?.show_support_message) failures.push("PED did not show support message.");
    if (first.lm.listeningAttempts[0]?.status !== "invalid") failures.push("LM did not store invalid listening attempt.");
    if (first.lm.listeningAttempts[0]?.reason !== "product_failure") failures.push("LM reason was not product_failure.");
    if (!first.lm.listeningAttempts[0]?.retest_pending) failures.push("LM did not keep retest pending.");
  } else {
    if (first.dp.evidence.length !== 0) failures.push("DP emitted evidence for normal audio.");
    if (first.ped.decisions.length !== 0) failures.push("PED emitted decision for normal audio.");
    if (first.lm.listeningAttempts.length !== 0) failures.push("LM emitted attempt for normal audio.");
  }

  const serialized = stableJson(first);
  if (/weak listening|poor learner|bad comprehension|poor comprehension|weakness/i.test(serialized)) {
    failures.push("Pipeline inferred learner weakness.");
  }
  if (/\"verified\":true/i.test(serialized)) {
    failures.push("Pipeline claimed verified=true.");
  }

  return {
    teachingCaseId: "TC-000001",
    judgeHookId: "JUDGE-TC-000001-REPLAY",
    deterministic,
    pass: deterministic && failures.length === 0,
    failures,
    first,
    second,
  };
}

export function runTeachingCaseSpeechPipeline(observation: ObservationPacket): SpeechTeachingCasePipelineOutput {
  const dp = buildSpeechDecisionEvidence(observation, REPLAY_TIME);
  const ped = buildSpeechPedDecision(dp, REPLAY_TIME);
  const lm = buildSpeakingAttemptMemory(ped, REPLAY_TIME);
  return { observation, dp, ped, lm };
}

export function judgeReplayTeachingCase000002(observation: ObservationPacket): SpeechJudgeReplayResult {
  const first = runTeachingCaseSpeechPipeline(observation);
  const second = runTeachingCaseSpeechPipeline(observation);
  const deterministic = stableJson(first) === stableJson(second);
  const failures: string[] = [];

  if (!deterministic) failures.push("Speech replay output changed between runs.");

  const hasSpeechBlock = observation.facts.some((fact) =>
    fact.factType === "MicPermissionDenied" ||
    fact.factType === "SpeechTimeout"
  );

  if (hasSpeechBlock) {
    if (first.dp.evidence[0]?.reason !== "product_or_permission_block") failures.push("DP did not record product_or_permission_block.");
    if (first.dp.evidence[0]?.confidence !== "high") failures.push("DP confidence is not high.");
    if (first.dp.evidence[0]?.speaking_result_validity !== "invalid_speaking") failures.push("DP did not mark invalid_speaking.");
    if (!first.ped.decisions[0]?.exclude_speaking_score) failures.push("PED did not exclude speaking score.");
    if (!first.ped.decisions[0]?.offer_text_fallback) failures.push("PED did not offer text fallback.");
    if (!first.ped.decisions[0]?.offer_mic_retry) failures.push("PED did not offer mic retry.");
    if (!first.ped.decisions[0]?.continue_remaining_sections) failures.push("PED did not continue remaining sections.");
    if (!first.ped.decisions[0]?.show_supportive_message) failures.push("PED did not show supportive message.");
    if (first.lm.speakingAttempts[0]?.status !== "invalid") failures.push("LM did not store invalid speaking attempt.");
    if (first.lm.speakingAttempts[0]?.reason !== "mic_permission_or_device_block") failures.push("LM reason was not mic_permission_or_device_block.");
    if (!first.lm.speakingAttempts[0]?.retest_pending) failures.push("LM did not keep retest pending.");
  } else {
    if (first.dp.evidence.length !== 0) failures.push("DP emitted evidence for normal speaking.");
    if (first.ped.decisions.length !== 0) failures.push("PED emitted decision for normal speaking.");
    if (first.lm.speakingAttempts.length !== 0) failures.push("LM emitted attempt for normal speaking.");
  }

  const serialized = stableJson(first);
  if (/poor pronunciation|weak speaking|poor learner|bad comprehension|weakness|ability.*reduced/i.test(serialized)) {
    failures.push("Speech pipeline inferred learner weakness.");
  }
  if (/\"verified\":true/i.test(serialized)) {
    failures.push("Speech pipeline claimed verified=true.");
  }

  return {
    teachingCaseId: "TC-000002",
    judgeHookId: "JUDGE-TC-000002-REPLAY",
    deterministic,
    pass: deterministic && failures.length === 0,
    failures,
    first,
    second,
  };
}
