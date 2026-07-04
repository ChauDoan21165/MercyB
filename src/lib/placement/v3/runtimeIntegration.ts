import { createObservationPacket } from "@/lib/tm-int/obs/evidencePacket";
import { detectAudioObservations } from "@/lib/tm-int/obs/detectors/audio";
import { detectLearningObservation } from "@/lib/tm-int/obs/detectors/learning";
import { detectSpeechObservations } from "@/lib/tm-int/obs/detectors/speech";
import type { ObservationFact, ObservationPacket } from "@/lib/tm-int/obs/types";
import { buildTeacherContext, replayTeacherContext } from "@/lib/tm-int/runtime";
import type { RuntimeVerifiedSource, TeacherContext } from "@/lib/tm-int/runtime";
import type { RuntimeEvidenceBundle } from "@/lib/tm-int/runtimeReadiness";
import type {
  PlacementV3ObservationTimelineItem,
  PlacementV3ResponsePayload,
  PlacementV3Results,
  PlacementV3RuntimeDecision,
  PlacementV3Task,
} from "./types";

const PLACEMENT_ROUTE = "/placement/v3";

function hasRuntimePipelineTrace(context: TeacherContext, source: RuntimeVerifiedSource): boolean {
  const stages = new Set(context.replayTrace.filter((step) => step.source === source).map((step) => step.stage));
  return stages.has("DP") && stages.has("PED") && stages.has("LM");
}

export function placementTimelineItemFromSubmit(
  payload: PlacementV3ResponsePayload,
  task: PlacementV3Task | null | undefined,
  observedAt = new Date().toISOString(),
): PlacementV3ObservationTimelineItem[] {
  const items: PlacementV3ObservationTimelineItem[] = [];

  if (payload.modality === "listening") {
    items.push({
      kind: "listening_media",
      taskId: payload.taskId,
      modality: payload.modality,
      observedAt,
      mediaStatus: payload.mediaStatus,
      requestedAudioUrl: payload.requestedAudioUrl ?? task?.audioUrl,
      audioDurationSeconds: payload.audioDurationSeconds,
      audioPlaybackError: payload.audioPlaybackError,
    });
  }

  if (payload.modality === "speaking") {
    items.push({
      kind: "speaking_capture",
      taskId: payload.taskId,
      modality: payload.modality,
      observedAt,
      speechPermission: payload.speechPermission,
      speechTimedOut: payload.speechTimedOut,
      speechTimeoutMs: payload.speechTimeoutMs,
    });
  }

  if (typeof payload.elapsedMs === "number" && typeof payload.observedCorrect === "boolean") {
    items.push({
      kind: "answer",
      taskId: payload.taskId,
      modality: payload.modality,
      observedAt,
      elapsedMs: payload.elapsedMs,
      observedCorrect: payload.observedCorrect,
      productLatencyMs: payload.productLatencyMs,
      accidentalTap: payload.accidentalTap,
      questionTooEasy: payload.questionTooEasy,
      priorKnowledge: payload.priorKnowledge,
    });
  }

  return items;
}

export function buildPlacementObservationPacket(
  timeline: readonly PlacementV3ObservationTimelineItem[],
  createdAt = new Date().toISOString(),
): ObservationPacket {
  const facts: ObservationFact[] = [];

  for (const item of timeline) {
    if (item.kind === "listening_media") {
      const requestedUrl = item.requestedAudioUrl ?? null;
      const playbackError =
        item.audioPlaybackError ??
        (item.mediaStatus === "unplayable" ? "placement listening audio was unplayable" : null);
      const durationSeconds = item.mediaStatus === "missing" ? null : item.audioDurationSeconds;
      facts.push(
        ...detectAudioObservations(
          {
            requestedUrl: item.mediaStatus === "missing" ? null : requestedUrl,
            durationSeconds,
            playbackError,
            route: PLACEMENT_ROUTE,
            taskId: item.taskId,
          },
          item.observedAt,
        ),
      );
    }

    if (item.kind === "speaking_capture") {
      facts.push(
        ...detectSpeechObservations(
          {
            permissionState: item.speechPermission ?? null,
            timedOut: item.speechTimedOut,
            timeoutMs: item.speechTimeoutMs,
            route: PLACEMENT_ROUTE,
            taskId: item.taskId,
          },
          item.observedAt,
        ),
      );
    }

    if (item.kind === "answer" && typeof item.elapsedMs === "number" && typeof item.observedCorrect === "boolean") {
      facts.push(
        detectLearningObservation(
          {
            action: "answer",
            responseTimeMs: item.elapsedMs,
            correct: item.observedCorrect,
            productLatencyMs: item.productLatencyMs,
            accidentalTap: item.accidentalTap,
            questionTooEasy: item.questionTooEasy,
            priorKnowledge: item.priorKnowledge,
            route: PLACEMENT_ROUTE,
            taskId: item.taskId,
          },
          item.observedAt,
        ),
      );
    }
  }

  return createObservationPacket(facts, createdAt);
}

export function buildPlacementRuntimeDecision(context: TeacherContext): PlacementV3RuntimeDecision {
  const trustedRecommendations = context.recommendations.filter((recommendation) =>
    hasRuntimePipelineTrace(context, recommendation.source),
  );

  const excludeListeningScore = trustedRecommendations.some(
    (recommendation) => recommendation.source === "TC-000001" &&
      recommendation.action === "exclude_listening_score_and_offer_retest",
  );
  const excludeSpeakingScore = trustedRecommendations.some(
    (recommendation) => recommendation.source === "TC-000002" &&
      recommendation.action === "exclude_speaking_score_offer_text_fallback_and_mic_retry",
  );
  const rapidGuessingQuestionable = trustedRecommendations.some(
    (recommendation) => recommendation.source === "TC-000003" &&
      recommendation.action === "pause_assessment_ask_confidence_check_and_do_not_lower_placement",
  );

  return {
    excludeListeningScore,
    excludeSpeakingScore,
    placementValidity: rapidGuessingQuestionable ? "questionable" : "valid",
    offers: {
      listeningRetest: excludeListeningScore,
      speakingTextFallback: excludeSpeakingScore,
      micRetry: excludeSpeakingScore,
      confidenceFollowUp: rapidGuessingQuestionable,
    },
    recommendationActions: trustedRecommendations.map((recommendation) => recommendation.action),
  };
}

export function applyPlacementRuntimeDecision(
  results: PlacementV3Results,
  context: TeacherContext,
  decision = buildPlacementRuntimeDecision(context),
  timeline: readonly PlacementV3ObservationTimelineItem[] = [],
): PlacementV3Results {
  return {
    ...results,
    placementValidity: decision.placementValidity,
    teacherContext: context,
    runtimeDecision: decision,
    observationTimeline: timeline.map((item) => ({ ...item })),
    skills: results.skills.map((skill) => {
      if (skill.modality === "listening" && decision.excludeListeningScore) {
        return { ...skill, scoreEligible: false, runtimeExclusionReason: "product_failure_audio" };
      }
      if (skill.modality === "speaking" && decision.excludeSpeakingScore) {
        return { ...skill, scoreEligible: false, runtimeExclusionReason: "mic_permission_or_device_block" };
      }
      return { ...skill, scoreEligible: skill.scoreEligible ?? true };
    }),
  };
}

export function buildPlacementTeacherContext(
  timeline: readonly PlacementV3ObservationTimelineItem[],
  createdAt = new Date().toISOString(),
) {
  const observationPacket = buildPlacementObservationPacket(timeline, createdAt);
  const teacherContext = buildTeacherContext(observationPacket);
  const decision = buildPlacementRuntimeDecision(teacherContext);
  const replay = replayTeacherContext(observationPacket);
  return { observationPacket, teacherContext, decision, replay };
}

export function buildPlacementRuntimeEvidenceBundle(
  timeline: readonly PlacementV3ObservationTimelineItem[],
  createdAt = new Date().toISOString(),
): RuntimeEvidenceBundle {
  const runtime = buildPlacementTeacherContext(timeline, createdAt);
  const packetId = runtime.observationPacket.packetId;
  const source = runtime.teacherContext.productIssues[0]?.source ?? "TC-000001";
  const firstRecommendation = runtime.teacherContext.recommendations[0];
  const productFailure = runtime.teacherContext.productIssues.length > 0;
  const signalKeys = runtime.teacherContext.learningSignals.map((signal) => signal.signal_key);

  return {
    schemaVersion: "tm-int-runtime-evidence-bundle-v1",
    contractId: "RR-001",
    runtimeEvent: {
      eventId: `placement-runtime-${packetId}`,
      route: PLACEMENT_ROUTE,
      eventType: "placement_runtime_decision",
      observedAt: createdAt,
      observationIds: [packetId],
    },
    obsPacket: runtime.observationPacket,
    learningSignals: runtime.teacherContext.learningSignals,
    teacherContext: runtime.teacherContext,
    dpDecision: {
      stage: "DP",
      source,
      reason: firstRecommendation?.reason ?? "placement_runtime_teacher_context",
      evidenceCount: runtime.observationPacket.facts.length,
      productFailure,
      learnerWeakness: false,
      observationIds: [packetId],
      signalKeys,
    },
    pedDecision: {
      stage: "PED",
      source,
      action: firstRecommendation?.action ?? "continue_without_dp_action",
      evidenceCount: runtime.observationPacket.facts.length,
      productFailure,
      learnerWeakness: false,
      observationIds: [packetId],
      signalKeys,
    },
    runtimeDecision: {
      changed: runtime.decision.recommendationActions.length > 0,
      changedBecauseOfTeacherContext: runtime.decision.recommendationActions.length > 0,
      teacherContextUsed: true,
      learningSignalsUsed: true,
      summary: "placement runtime decision used Teacher Context",
      observationIds: [packetId],
      signalKeys,
    },
    replay: runtime.replay,
    judgeReproduction: runtime.replay,
  };
}
