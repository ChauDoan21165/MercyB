import { runTeachingCaseAudioPipeline, runTeachingCaseLearningPipeline, runTeachingCaseSpeechPipeline } from "../judge/replay";
import { runLearningBehaviorFamilyPipeline } from "../judge/learningBehaviorFamily";
import {
  VERIFIED_EDU_FRAMEWORKS,
  VERIFIED_LEARNING_BEHAVIOR_FAMILIES,
  VERIFIED_TEACHING_CASES,
} from "../judge/verifiedRegistry";
import type { ObservationPacket } from "../obs/types";
import type {
  RuntimeRecommendation,
  TeacherContextPendingRetest,
  TeacherContextProductIssue,
  TeacherContextReplayStep,
} from "./types";

function hasVerifiedTeachingCase(tcId: "TC-000001" | "TC-000002" | "TC-000003"): boolean {
  return VERIFIED_TEACHING_CASES.some((teachingCase) => teachingCase.tc_id === tcId);
}

function hasVerifiedEduFramework(): boolean {
  return VERIFIED_EDU_FRAMEWORKS.some((framework) => framework.framework_id === "EDU-LS-SPRINT1");
}

function hasVerifiedLearningBehaviorFamily(): boolean {
  return VERIFIED_LEARNING_BEHAVIOR_FAMILIES.some((family) => family.family_id === "LEARNING-BEHAVIOR-FAMILY-v1");
}

export type RuntimeDecisionPipelineOutput = {
  productIssues: TeacherContextProductIssue[];
  pendingRetests: TeacherContextPendingRetest[];
  recommendations: RuntimeRecommendation[];
  replayTrace: TeacherContextReplayStep[];
};

export function runRuntimeDecisionPipeline(observationPacket: ObservationPacket): RuntimeDecisionPipelineOutput {
  const productIssues: TeacherContextProductIssue[] = [];
  const pendingRetests: TeacherContextPendingRetest[] = [];
  const recommendations: RuntimeRecommendation[] = [];
  const replayTrace: TeacherContextReplayStep[] = [{ stage: "OBS", source: "runtime", summary: `${observationPacket.facts.length} facts` }];

  if (hasVerifiedTeachingCase("TC-000001")) {
    const audio = runTeachingCaseAudioPipeline(observationPacket);
    replayTrace.push({ stage: "DP", source: "TC-000001", summary: `${audio.dp.evidence.length} audio evidence records` });
    replayTrace.push({ stage: "PED", source: "TC-000001", summary: `${audio.ped.decisions.length} listening decisions` });
    replayTrace.push({ stage: "LM", source: "TC-000001", summary: `${audio.lm.listeningAttempts.length} listening memory records` });
    for (const evidence of audio.dp.evidence) {
      productIssues.push({
        source: "TC-000001",
        issue: "product_failure_audio",
        affectedSkill: "listening",
        evidenceCount: evidence.sourceFacts.length,
      });
    }
    for (const attempt of audio.lm.listeningAttempts) {
      pendingRetests.push({ source: "TC-000001", skill: "listening", reason: attempt.reason });
    }
    for (const decision of audio.ped.decisions) {
      recommendations.push({
        source: "TC-000001",
        reason: decision.reason,
        action: "exclude_listening_score_and_offer_retest",
        confidence: "high",
        evidenceCount: audio.dp.evidence[0]?.sourceFacts.length ?? 0,
      });
    }
  }

  if (hasVerifiedTeachingCase("TC-000002")) {
    const speech = runTeachingCaseSpeechPipeline(observationPacket);
    replayTrace.push({ stage: "DP", source: "TC-000002", summary: `${speech.dp.evidence.length} speech evidence records` });
    replayTrace.push({ stage: "PED", source: "TC-000002", summary: `${speech.ped.decisions.length} speaking decisions` });
    replayTrace.push({ stage: "LM", source: "TC-000002", summary: `${speech.lm.speakingAttempts.length} speaking memory records` });
    for (const evidence of speech.dp.evidence) {
      productIssues.push({
        source: "TC-000002",
        issue: "product_or_permission_block",
        affectedSkill: "speaking",
        evidenceCount: evidence.sourceFacts.length,
      });
    }
    for (const attempt of speech.lm.speakingAttempts) {
      pendingRetests.push({ source: "TC-000002", skill: "speaking", reason: attempt.reason });
    }
    for (const decision of speech.ped.decisions) {
      recommendations.push({
        source: "TC-000002",
        reason: decision.reason,
        action: "exclude_speaking_score_offer_text_fallback_and_mic_retry",
        confidence: "high",
        evidenceCount: speech.dp.evidence[0]?.sourceFacts.length ?? 0,
      });
    }
  }

  if (hasVerifiedTeachingCase("TC-000003")) {
    const rapidGuessing = runTeachingCaseLearningPipeline(observationPacket);
    replayTrace.push({ stage: "DP", source: "TC-000003", summary: `${rapidGuessing.dp.evidence.length} rapid guessing evidence records` });
    replayTrace.push({ stage: "PED", source: "TC-000003", summary: `${rapidGuessing.ped.decisions.length} assessment decisions` });
    replayTrace.push({ stage: "LM", source: "TC-000003", summary: `${rapidGuessing.lm.assessmentBehaviorObservations.length} behavior memory records` });
    for (const decision of rapidGuessing.ped.decisions) {
      recommendations.push({
        source: "TC-000003",
        reason: decision.reason,
        action: "pause_assessment_ask_confidence_check_and_do_not_lower_placement",
        confidence: "medium",
        evidenceCount: rapidGuessing.dp.evidence[0]?.sourceFacts.length ?? 0,
      });
    }
  }

  if (hasVerifiedEduFramework() && hasVerifiedLearningBehaviorFamily()) {
    const family = runLearningBehaviorFamilyPipeline(observationPacket);
    replayTrace.push({ stage: "SIGNALS", source: "EDU-LS-SPRINT1", summary: `${family.signals.signals.length} learning signals` });
    replayTrace.push({ stage: "DP", source: "LEARNING-BEHAVIOR-FAMILY-v1", summary: `${family.dp.interpretations.length} family interpretations` });
    replayTrace.push({ stage: "PED", source: "LEARNING-BEHAVIOR-FAMILY-v1", summary: `${family.ped.actions.length} family teacher actions` });
    replayTrace.push({ stage: "LM", source: "LEARNING-BEHAVIOR-FAMILY-v1", summary: `${family.lm.memories.length} family memory records` });
    for (const action of family.ped.actions) {
      const interpretation = family.dp.interpretations.find((item) => item.signal_key === action.signal_key);
      recommendations.push({
        source: "LEARNING-BEHAVIOR-FAMILY-v1",
        reason: action.signal_key,
        action: action.teacher_action,
        confidence: interpretation?.confidence === "high" ? "high" : "medium",
        evidenceCount: interpretation?.evidence.length ?? 0,
      });
    }
  }

  replayTrace.push({ stage: "RUNTIME", source: "runtime", summary: `${recommendations.length} recommendations` });
  return { productIssues, pendingRetests, recommendations, replayTrace };
}
